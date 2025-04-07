class LoginPage {
    fillLoginForm(username, password) {
        cy.get('#loginusername').type(username, { delay: 100 })
        cy.get('#loginpassword').type(password)
    }

    submitLogin() {
        cy.intercept("https://api.demoblaze.com/login").as("login")
        cy.get('#logInModal .btn-primary').click()
        cy.wait("@login").its('response.statusCode').should('eq', 200)
    }

    verifyWelcomeText(name) {
        cy.get('#nameofuser').should('have.text', `Welcome ${name}`)
    }
}

export default new LoginPage()
