class ProductPage {
    addProductByIndex(index) {
      cy.get('.card .card-block .card-title .hrefch').eq(index).click()
      cy.wait(3000)
      cy.intercept("https://api.demoblaze.com/addtocart").as("addtocart")
      cy.get('.col-sm-12 > .btn').click()
      cy.wait("@addtocart").its('response.statusCode').should('eq', 200)
      cy.get('.active > .nav-link').click()
    }
  }
  
  export default new ProductPage()
  