import { generateAccessibilityReportIndex } from './test/utils/accessibility-checking.js'

const debug = process.env.DEBUG
const oneHour = 60 * 60 * 1000

const execArgv = ['--loader', 'esm-module-alias/loader']

if (debug) {
  execArgv.push('--inspect')
}

export const config = {
  runner: 'local',
  specs: ['./test/specs/**/*.e2e.js'],
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  maxInstances: 1,
  capabilities: debug
    ? [{ browserName: 'chrome' }]
    : [
        {
          maxInstances: 1,
          browserName: 'chrome',
          'goog:chromeOptions': {
            args: [
              '--no-sandbox',
              '--disable-infobars',
              '--disable-gpu',
              '--window-size=1920,1080'
            ]
          }
        }
      ],

  execArgv,

  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: debug ? 'debug' : 'info',

  logLevels: {
    webdriver: debug ? 'debug' : 'error'
  },

  bail: 1,
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: process.env.GRANTS_UI_BASE_URL || 'http://localhost:3000',

  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,
  waitforInterval: 200,

  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 120000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: ['spec'],

  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    timeout: debug ? oneHour : 60000
  },
  onComplete: function (exitCode, config, capabilities, results) {
    generateAccessibilityReportIndex()
  }
}
