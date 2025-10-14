import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports
} from '../utils/accessibility-checking.js'
import {
  continueJourney,
  ensureUrl,
  // selectOption,
  selectRequiredAction,
  // confirmAndSend,
  login,
  clearApplicationState,
  // clickRemoveParcelLink,
  selectRequiredLandParcel
} from '../utils/journey-actions.js'

describe('Land grants end to end journey', () => {
  it('should analyse accessibility for all pages', async () => {
    const crn = '1100495932'
    const parcel = 'SD7946-0155'
    await initialiseAccessibilityChecking()

    await browser.url('/farm-payments/')

    // login
    await login(crn)
    await ensureUrl('confirm-farm-details')

    // clear application state and confirm your details
    await clearApplicationState()
    await ensureUrl('confirm-farm-details')
    await analyseAccessibility('confirm-farm-details')
    await continueJourney()

    // confirm you will be eligible
    await ensureUrl('confirm-you-will-be-eligible')
    await analyseAccessibility('confirm-you-will-be-eligible')
    await continueJourney()

    // confirm your land details are up to date
    await ensureUrl('confirm-your-land-details-are-up-to-date')
    await analyseAccessibility('confirm-your-land-details-are-up-to-date')
    await continueJourney()

    // select land parcel
    await ensureUrl('select-land-parcel')
    await analyseAccessibility('select-land-parcel')
    await selectRequiredLandParcel(parcel)
    await continueJourney()

    // select action
    await ensureUrl('select-actions-for-land-parcel')
    await analyseAccessibility('select-actions-for-land-parcel')
    await selectRequiredAction('CMOR1')
    await continueJourney()
    //
    // // check selected land actions
    await ensureUrl('check-selected-land-actions')
    await analyseAccessibility()
    //
    // // click Remove Parcel
    // await clickRemoveParcelLink(parcel)
    // await ensureUrl('remove-parcel')
    // await analyseAccessibility()
    // await selectOption('No')
    // await continueJourney()
    // //
    // // do not add another parcel
    // await selectOption('No')
    // await continueJourney()
    //
    // // submit application
    // await ensureUrl('submit-your-application')
    // await analyseAccessibility()
    // await confirmAndSend()
    //
    // // confirmation
    // await ensureUrl('confirmation')
    // await analyseAccessibility()

    generateAccessibilityReports('land-grants-e2e-journey')
  })
})
