import { generateAccessibilityReportIndex } from './test/utils/accessibility-checking.js'

export const config = {
  baseUrl: process.env.GRANTS_UI_BASE_URL || 'http://localhost:3000',
  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome'
    }
  ],
  runner: 'local',
  specs: ['./test/specs/*.spec.js'],
  exclude: [],
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 300000
  },
  onComplete: function (exitCode, config, capabilities, results) {
    // eslint-disable-next-line no-console
    console.log('Tests finished. Exit code:', exitCode)
    // eslint-disable-next-line no-console
    console.log(results)

    if (results.failed > 0) {
      // eslint-disable-next-line no-console
      console.error(
        'Some tests failed. Generating accessibility report index...'
      )
      generateAccessibilityReportIndex(results)
      process.exit(exitCode)
    }

    generateAccessibilityReportIndex(results)
  }
}
