describe('Launch Application', () => {
    it('Launch the test application', () => {
        cy.visit('https://www.demoblaze.com/index.html')
        cy.get('#signin2').click()
      
    })

  })