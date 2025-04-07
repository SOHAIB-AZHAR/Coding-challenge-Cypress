// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('pricevalidation', () => {

    let pricesArray = []

    cy.get('#tbodyid tr', { timeout: 5000 }).should('have.length.at.least', 2)
        .its('length')
        .then((rowCount) => {
            cy.log('Total Rows:', rowCount)
            for (let i = 1; i <= rowCount; i++) {
                cy.get(`#tbodyid > :nth-child(${i}) > :nth-child(3)`)
                    .invoke('text')
                    .then((text) => {
                        let numericValue = parseFloat(text.replace(/[^0-9.]/g, ''))
                        pricesArray.push(numericValue)
                    })
            }
        })
        .then(() => {
            cy.wrap(pricesArray).should('not.be.empty')
            cy.log('Extracted Prices:', pricesArray)
            let totalSum = pricesArray.reduce((sum, num) => sum + num, 0)
            cy.log('Total Sum:', totalSum)
            cy.get("#totalp").should("have.text", totalSum)
        })
})  



Cypress.Commands.add("login", () => {
    cy.visit('https://www.demoblaze.com/index.html')
    cy.get('#login2').click()
    cy.wait(2000)
    cy.fixture('signupData').then(userData => {
      cy.get('#loginusername').type(userData.name)
      cy.get('#loginpassword').type(userData.password)
      cy.get('#logInModal .btn-primary').click()
      cy.get('#nameofuser').should('contain', userData.name)
    })
  })
  