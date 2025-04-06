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


Cypress.Commands.add('login', () => {

    cy.visit('https://www.demoblaze.com/index.html')
        cy.get('#login2').click()
        cy.wait(2000)
        cy.fixture('signupData').then((userData) => {
            cy.get('#loginusername').click().type(userData.name, { delay: 100 })
            cy.get('#loginpassword').type(userData.password)

            cy.intercept("https://api.demoblaze.com/login").as("login")
            cy.get('#logInModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click()
            cy.wait("@login", { timeout: 30000 }).then((call) => {
                expect(call.response.statusCode).to.eq(200)
            })
            cy.wait(2000)
            cy.get('#nameofuser').should('have.text', `Welcome ${userData.name}`)
        })

})


Cypress.Commands.add('pricevalidation', () => {

    let pricesArray = []; // Array to store extracted prices

    cy.get('#tbodyid tr', { timeout: 5000 }).should('have.length.at.least', 2) // Get all table rows
        .its('length') // Get number of rows
        .then((rowCount) => {
            cy.log('Total Rows:', rowCount) // Log total rows

            // Loop through all rows dynamically
            for (let i = 1; i <= rowCount; i++) {
                cy.get(`#tbodyid > :nth-child(${i}) > :nth-child(3)`) // Select the 3rd column of each row
                    .invoke('text') // Get the text value
                    .then((text) => {
                        let numericValue = parseFloat(text.replace(/[^0-9.]/g, '')) // Extract numbers
                        pricesArray.push(numericValue) // Store in array
                    })
            }
        })
        .then(() => {
            cy.wrap(pricesArray).should('not.be.empty') // Ensure values are stored
            cy.log('Extracted Prices:', pricesArray) // Log extracted prices

            let totalSum = pricesArray.reduce((sum, num) => sum + num, 0) // Sum all values
            cy.log('Total Sum:', totalSum) // Log total sum
            cy.get("#totalp").should("have.text", totalSum)
        })

})  