import homePage from '../../pages/homePage'
import loginPage from '../../pages/loginPage'
import signupPage from '../../pages/signupPage'
import cartPage from '../../pages/cartPage'
import productPage from '../../pages/productPage'

function getRandomName() {
  return `User_${Math.floor(1000 + Math.random() * 9000)}_Name`
}

describe('Demoblaze App Tests', () => {

  const randomName = getRandomName()
  const randomPassword = `Test@${Math.floor(Math.random() * 10000)}`

  it('Create an Account', () => {
    cy.visit('/index.html')
    homePage.clickSignUp()
    cy.wait(2000)
    signupPage.fillSignupForm(randomName, randomPassword)
    signupPage.submitSignup()

    cy.writeFile('cypress/fixtures/signupData.json', {
      name: randomName,
      password: randomPassword,
      country: "Germany",
      city: "Hamburg",
      creditcard: "12345678",
      month: "12",
      year: "2030"
    })
  })

  it('Login with signup credentials', () => {
    cy.visit('/index.html')
    homePage.clickLogin()
    cy.wait(2000)
    cy.fixture('signupData').then(userData => {
      loginPage.fillLoginForm(userData.name, userData.password)
      loginPage.submitLogin()
      loginPage.verifyWelcomeText(userData.name)
    })
  })

  it('Add 3 products to cart', () => {
    cy.login()
    for (let i = 0; i < 3; i++) {
      productPage.addProductByIndex(i)
    }
  })

  it('Validate the amount in cart', () => {
    cy.login()
    homePage.clickCart()
    cy.wait(2000)
    cartPage.validatePrice()
  })

  it('Delete a product from cart', () => {
    cy.login()
    homePage.clickCart()
    cy.wait(2000)
    cartPage.deleteFirstProduct()
  })

  it('Validate amount after deleting', () => {
    cy.login()
    homePage.clickCart()
    cy.wait(2000)
    cartPage.validatePrice()
  })

  it('Place the order', () => {
    cy.login()
    homePage.clickCart()
    cy.wait(2000)
    cy.fixture('signupData').then(userData => {
      cartPage.placeOrder(userData)
    })
    homePage.clickHomeNav()
  })

})
