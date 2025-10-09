export async function confirmAndSend() {
  await $(`//button[contains(text(),'Submit')]`).click()
}

export async function continueJourney() {
  await $(`aria/Continue`).click()
}

export async function ensureUrl(url) {
  await expect(browser).toHaveUrl(expect.stringContaining(url))
}

export async function enterValueFor(text, label) {
  const selector = `//label[contains(text(),'${label}')]/following::*[name()='input' or name()='select'][1]`
  const tag = await $(selector).getTagName()
  if (tag === 'select') {
    await $(selector).selectByVisibleText(text)
  } else {
    await $(selector).setValue(text)
  }
}

export async function navigateBack() {
  await $(`//a[@class='govuk-back-link']`).click()
}

export async function selectOption(option) {
  await $(`aria/${option}`).click()
}

export async function selectOptions(...options) {
  for (const option of options) {
    await $(`aria/${option}`).click()
  }
}

export async function selectRequiredAction(actionName) {
  const checkbox =
    actionName === 'CMOR1'
      ? await $(`input[type='checkbox'][value='${actionName}']`)
      : await $(`input[type='radio'][value='${actionName}']`)
  const isChecked = await checkbox.isSelected()
  if (!isChecked) {
    await checkbox.click()
  }
}

export async function selectTask(taskName) {
  await $(
    `//h2[@class='govuk-heading-m']/following-sibling::ul/li/div/a[contains(text(),'${taskName}')]`
  ).click()
}

export async function submitApplication() {
  await $(`aria/Send`).click()
}

export async function unselectOption(option) {
  if (await $(`aria/${option}`).isSelected()) {
    await $(`aria/${option}`).click()
  }
}

export async function login(crn) {
  await expect(browser).toHaveTitle(
    /Sign in to your acccount|FCP Defra ID stub - GOV.UK/
  )

  const usernameInput = await $('#crn')
  const passwordInput = await $('#password')

  const submitButton = await $('button[type="submit"]')

  await usernameInput.setValue(crn)
  await passwordInput.setValue('Password456')
  await submitButton.click()
  // ensure we wait and are redirected to our service start page
  await expect(browser).toHaveTitle(`Confirm your details | Farm payments`)
}

export async function clearApplicationState() {
  const link = await $("a[href='./clear-application-state']")
  await link.click()
}

export async function clickRemoveParcelLink(parcel) {
  const link = await $("a[href$='remove-parcel?parcelId=" + parcel + "']")
  await link.click()
}

export async function selectRequiredLandParcel(value) {
  const radioButton = await $(`input[type='radio'][value='${value}']`)
  await radioButton.click()
}
