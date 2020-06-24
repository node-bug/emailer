const config = require('@nodebug/config')('emailer')
const { resolve, dirname } = require('path')

let directory
let jsonFile
if (config.f !== undefined) {
  jsonFile = resolve(config.f.replace('json:', ''))
  directory = dirname(jsonFile)
}

module.exports = {
  directory,
  jsonFile,
}
