var config = require('./jest.config')
config.testRegex = "it\\.spec\\.ts$"
console.log("RUNNING INTEGRATION TESTS")
module.exports = config
