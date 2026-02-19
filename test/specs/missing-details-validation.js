import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports
} from '../utils/accessibility-checking.js'
import {
  ensureUrl,
  login,
  clearApplicationState
} from '../utils/journey-actions.js'

describe('Missing Farmer details on Confirm your details page @dev', () => {
  it('should analyse accessibility for this pages', async () => {
    const crn = '1400000002'
    await initialiseAccessibilityChecking()

    await browser.url('/farm-payments/')

    // login
    await login(crn)

    // clear application state and confirm your details
    await clearApplicationState()
    await ensureUrl('confirm-farm-details')
    await analyseAccessibility('confirm-farm-details')

    generateAccessibilityReports('Confirm-your-details-page')
  })
})
