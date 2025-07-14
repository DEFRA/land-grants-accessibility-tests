import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports
} from '../utils/accessibility-checking.js'
import {
  continueJourney,
  ensureUrl,
  enterValueFor,
  selectOption,
  startJourney
} from '../utils/journey-actions.js'

describe('Land grants end to end journey', () => {
  it('should analyse accessibility for all pages', async () => {
    await initialiseAccessibilityChecking()

    await browser.url('/find-funding-for-land-or-farms/start')

    // start
    await ensureUrl('start')
    await analyseAccessibility()
    await startJourney()

    // confirm your details
    await ensureUrl('confirm-farm-details')
    await analyseAccessibility()
    await continueJourney()

    // land details
    await ensureUrl('land-details')
    await analyseAccessibility()
    await selectOption('Yes')
    await continueJourney()

    // agreement name
    await ensureUrl('agreement-name')
    await analyseAccessibility()
    await enterValueFor('Test Agreement', 'Enter your agreement name')
    await continueJourney()

    // select land parcel
    await ensureUrl('select-land-parcel')
    await analyseAccessibility()
    await selectOption('SD6743 8083')
    await continueJourney()

    // select action
    // await ensureUrl('choose-which-actions-to-do')
    // await analyseAccessibility()
    // await selectRequiredAction('CMOR1', '4.53411065')
    // await continueJourney()

    // // check selected land actions
    // await ensureUrl('check-selected-land-actions')
    // await analyseAccessibility()
    // await selectOption('No')
    // await continueJourney()

    // // check summary
    // await ensureUrl('summary')
    // await analyseAccessibility()
    // await continueJourney()

    // // submit application
    // await ensureUrl('submit-your-application')
    // await analyseAccessibility()
    // await confirmAndSend()

    // // confirmation
    // await ensureUrl('confirmation')
    // await analyseAccessibility()

    generateAccessibilityReports('land-grants-e2e-journey')
  })
})
