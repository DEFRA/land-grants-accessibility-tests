export async function confirmAndSend() {
    await $(`//button[contains(text(),'I agree - submit my application')]`).click()
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
    for (let option of options) {
        await $(`aria/${option}`).click()
    }
}

export async function selectRequiredAction(actionName, quantity) {
  const checkbox = await $(`input[type='checkbox'][value='${actionName}']`)
  await checkbox.click()
  const quantityInput = await $(`input[name='qty-${actionName}']`)
  await quantityInput.setValue(quantity)
}

export async function startJourney() {
    await $(`aria/Start now`).click()
}

export async function selectTask(taskName) {
    await $(`//h2[@class='govuk-heading-m']/following-sibling::ul/li/div/a[contains(text(),'${taskName}')]`).click()
}

export async function submitApplication() {
    await $(`aria/Send`).click()
}

export async function unselectOption(option) {
    if (await $(`aria/${option}`).isSelected()) {
        await $(`aria/${option}`).click()
    }
}
