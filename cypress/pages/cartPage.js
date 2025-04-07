class CartPage {
    deleteFirstProduct() {
        cy.intercept("https://api.demoblaze.com/deleteitem").as("deleteitem")
        cy.get('#tbodyid > :nth-child(1) > :nth-child(4) > a').click()
        cy.wait("@deleteitem").its('response.statusCode').should('eq', 200)
    }

    validatePrice() {
        let pricesArray = []
        cy.get('#tbodyid tr').its('length').then(rowCount => {
            for (let i = 1; i <= rowCount; i++) {
                cy.get(`#tbodyid > :nth-child(${i}) > :nth-child(3)`)
                    .invoke('text')
                    .then(text => {
                        const num = parseFloat(text.replace(/[^0-9.]/g, ''))
                        pricesArray.push(num)
                    })
            }
        }).then(() => {
            const total = pricesArray.reduce((acc, val) => acc + val, 0)
            cy.get("#totalp").should("have.text", total)
        })
    }

    placeOrder(userData) {
        cy.contains('button', 'Place Order').click()
        cy.get('#name').type(userData.name)
        cy.get('#country').type(userData.country)
        cy.get('#city').type(userData.city)
        cy.get('#card').type(userData.creditcard)
        cy.get('#month').type(userData.month)
        cy.get('#year').type(userData.year)
        cy.get('#orderModal .btn-primary').click()
        cy.get('.sweet-alert').should('contain', "Thank you for your purchase!")
        cy.get('.confirm').click()
        cy.get('#orderModal .btn-secondary').click()
    }
}

export default new CartPage()
