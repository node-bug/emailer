const { sendEmail } = require('./app/emailer')
const generateHtmlReport = require('./app/htmler')

// process.once('beforeExit', async () => {
//   sendEmail()
// })

module.exports = {
  generateHtmlReport,
  sendEmail,
}
