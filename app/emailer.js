const { readdirSync } = require('fs')
const nodemailer = require('nodemailer')
const { log } = require('@nodebug/logger')
const config = require('@nodebug/config')('emailer')
const { extname } = require('path')
const { directory } = require('./files')

const my = {}

function transporter(id, secret) {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      clientId: id,
      clientSecret: secret,
    },
  })
}

function subject() {
  if (config.subject !== 'Cucumber Test Report') {
    return `Cucumber Test Report - ${config.subject}`
  }
  return `${config.subject}`
}

function body() {
  const text = (() => {
    if (config.branch !== undefined) {
      return ` from ${config.branch} cucumber branch,`
    }
    return ''
  })()
  return `Please find cucumber report of Jenkins pipeline execution,${text} in ${my.environment} environment, attached.`
}

let attachmentCount = 0
function getAttachments() {
  const files = []
  if (directory !== undefined) {
    readdirSync(directory).forEach((file) => {
      if (extname(file) === '.html') {
        files.push({
          path: `${directory}/${file}`,
        })
      }
    })
    // files.push({
    //   path: `${directory}logs/combined.log`,
    // });
  }
  attachmentCount = files.length
  return files
}

function options() {
  return {
    from: config.user.username, // sender address
    to: config.recepients, // list of receivers
    subject: subject(), // Subject line
    text: body(),
    attachments: getAttachments(),
    auth: {
      user: config.user.username,
      refreshToken: config.user.refreshToken,
      accessToken: config.user.accessToken,
      expires: 1494388182480,
    },
  }
}

async function send() {
  const message = options()
  if (config.emailReport === true || config.e === true) {
    if (attachmentCount <= 0) {
      log.info(
        `No reports were found in ${directory} to email. Exiting emailer.`,
      )
      return false
    }
    const gmailer = transporter(config.user.id, config.user.secret)
    gmailer.sendMail(message, (error, info) => {
      if (error) {
        throw error
      }
      log.debug(`Message sent: ${info.response}`)
    })
    gmailer.close()
  }
  return true
}

async function sendEmail(environment) {
  my.environment = environment
  await send()
}

module.exports = {
  sendEmail,
}
