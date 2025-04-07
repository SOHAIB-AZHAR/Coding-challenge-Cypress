class SignupPage {
    fillSignupForm(username, password) {
        cy.get('#sign-username').type(username)
        cy.get('#sign-password').type(password)
    }

    submitSignup() {
        cy.intercept("https://api.demoblaze.com/signup").as("signup")
        cy.get('#signInModal .btn-primary').click()
        cy.wait("@signup").its('response.statusCode').should('eq', 200)
    }
}

export default new SignupPage()
