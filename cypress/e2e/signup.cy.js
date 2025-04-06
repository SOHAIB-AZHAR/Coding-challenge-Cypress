// Function to generate a random name
function getRandomName() {
    const prefix = "User"  // Optional prefix
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}_${randomNum}`
}

// Cypress test for signup and saving credentials
describe('Signup Test with Random Data', () => {
    it('should sign up with a random name and save credentials', () => {
        const randomName = getRandomName()
        const randomPassword = `Test@${Math.floor(Math.random() * 10000)}`

        cy.visit('https://www.demoblaze.com/index.html')
        cy.get('#signin2').click()
        cy.wait(2000)
        cy.get('#sign-username').type(randomName)
        cy.get('#sign-password').type(randomPassword)
        cy.intercept("https://api.demoblaze.com/signup").as("signup")
        cy.get('#signInModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click()
        cy.wait("@signup", { timeout: 30000 }).then((call) => {
            expect(call.response.statusCode).to.eq(200)
        })
        cy.wait(3000)



        // Log the credentials to Cypress console
        cy.log(`Signup Credentials: \nName: ${randomName}\nPassword: ${randomPassword}`)

        // Save the credentials to a file for later login
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
})

// Cypress test for login using saved credentials
describe('Login with sign up credentials', () => {
    it('It will log using the signup cretials', () => {

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
})

// Cypress test for adding 3 products
describe('Add 3 products to the cart', () => {
    it('It will add the products to the cart', () => {

        cy.login()
        cy.writeFile('cypress/fixtures/price.json', [])
        for (let i = 0; i < 3; i++) {
            cy.get('.card .card-block .card-title .hrefch')
                .eq(i)
                .click()
            cy.wait(3000)
            cy.intercept("https://api.demoblaze.com/addtocart").as("addtocart")
            cy.get('.col-sm-12 > .btn').click()
            cy.wait("@addtocart", { timeout: 30000 }).then((call) => {
                expect(call.response.statusCode).to.eq(200)
            })

            cy.get('.active > .nav-link').click()
        }




    })
})

describe('validate the Price', () => {
    it('It will validate the Price of the added products', () => {

        cy.login()
        cy.get('#cartur').click()
        cy.wait(3000)

        let pricesArray = []; // Array to store extracted prices
        cy.get('#tbodyid tr', { timeout: 5000 }).should('have.length.at.least', 2) // Get all table rows
            .its('length') // Get number of rows
            .then((rowCount) => {
                cy.log('Total Rows:', rowCount); // Log total rows

                // Loop through all rows dynamically
                for (let i = 1; i <= rowCount; i++) {
                    cy.get(`#tbodyid > :nth-child(${i}) > :nth-child(3)`) // Select the 3rd column of each row
                        .invoke('text') // Get the text value
                        .then((text) => {
                            let numericValue = parseFloat(text.replace(/[^0-9.]/g, '')); // Extract numbers
                            pricesArray.push(numericValue); // Store in array
                        });
                }
            })
            .then(() => {
                cy.wrap(pricesArray).should('not.be.empty'); // Ensure values are stored
                cy.log('Extracted Prices:', pricesArray); // Log extracted prices

                let totalSum = pricesArray.reduce((sum, num) => sum + num, 0); // Sum all values
                cy.log('Total Sum:', totalSum); // Log total sum

                cy.get("#totalp").should("have.text", totalSum)
            });

    })
})


describe('Delete a Product from a Cart', () => {
    it('It will Delete a product from the cart', () => {
        cy.login()
        cy.get('#cartur').click()
        cy.wait(2000)
        cy.intercept("https://api.demoblaze.com/deleteitem").as("deleteitem")
        cy.get('#tbodyid > :nth-child(1) > :nth-child(4) > a').click()
        cy.wait("@deleteitem", { timeout: 30000 }).then((call) => {
            expect(call.response.statusCode).to.eq(200)
        })

    })
})

describe('Validate price after Deleting a product', () => {
    it('It will validate the total price after deleting a product', () => {
        cy.login()
        cy.get('#cartur').click()
        cy.wait(2000)
        cy.pricevalidation()

    })
})


describe('Place the order', () => {
    it('It will place the order', () => {
        cy.login()
        cy.get('#cartur').click()
        cy.wait(2000)
        cy.contains('button', 'Place Order').click()

        cy.fixture('signupData').then((userData) => {
            cy.get('#name').type(userData.name)
            cy.get('#country').type(userData.country)
            cy.get('#city').type(userData.city)
            cy.get('#card').type(userData.creditcard)
            cy.get('#month').type(userData.month)
            cy.get('#year').type(userData.year)
        })
        cy.get('#orderModal .btn-primary').click()
        cy.get('.sweet-alert').should('contain', "Thank you for your purchase!")
        cy.get('.confirm').click()
    })
})