const { generate } = require('@nodebug/cucumber-html-reporter')
const { log } = require('@nodebug/logger')
const config = require('@nodebug/config')('emailer')
const { existsSync } = require('fs')
const { readFileSync } = require('jsonfile')
const { resolve } = require('path')
const sanitize = require('sanitize-filename')
const { directory, jsonFile } = require('./files')

module.exports = () => {
  if (!existsSync(jsonFile)) {
    log.info(
      `Cucumber report path should be passed using the -f command line argument`,
    )
    log.info(`Cucumber report not found at path ${jsonFile}`)
    return false
  }

  const reportName = (() => {
    const name = (() => {
      if (config.subject !== 'Cucumber Test Report') {
        return `${config.subject} Cucumber Report`
      }
      return `${config.subject}`
    })()
    const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    return sanitize(`${name} ${date}`)
  })()

  const metadata = (() => {
    try {
      return readFileSync(jsonFile)[0].metadata
    } catch (error) {
      log.error('Error while reading meta data')
    }
    return undefined
  })()

  return generate({
    theme: 'bootstrap',
    jsonFile,
    output: resolve(`${directory}/${reportName}.html`),
    reportSuiteAsScenarios: true,
    launchReport: true,
    metadata,
  })
}
