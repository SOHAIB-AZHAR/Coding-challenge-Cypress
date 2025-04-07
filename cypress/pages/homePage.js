class HomePage {
   
    clickSignUp() {
        cy.get('#signin2').click()
    }

    clickLogin() {
        cy.get('#login2').click()
    }

    clickCart() {
        cy.get('#cartur').click()
    }

    clickHomeNav() {
        cy.get('.active > .nav-link').click()
    }
}

export default new HomePage();
