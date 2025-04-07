const baseUrl = 'https://simple-books-api.glitch.me'

describe('Check the API status', () => {
    it('will check the status of API', () => {
        cy.request(`${baseUrl}/status`)
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('status', 'OK')
            })
    })
})

describe('Get all Books', () => {
    const apiUrl = 'https://simple-books-api.glitch.me/books'


    it('will return a list of books', () => {
        cy.request(apiUrl).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
        })
    })


    it('will return a list of fiction books', () => {
        cy.request({
            method: 'GET',
            url: apiUrl,
            qs: { type: 'fiction' }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            response.body.forEach(book => {
                expect(book.type).to.eq('fiction')
            })
        })
    })


    it('will return a list of non-fiction books', () => {
        cy.request({
            method: 'GET',
            url: apiUrl,
            qs: { type: 'non-fiction' }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            response.body.forEach(book => {
                expect(book.type).to.eq('non-fiction')
            })
        })
    })


    it('will return a limited number of books by sending GET call with limit parameter', () => {
        const limit = 3
        cy.request({
            method: 'GET',
            url: apiUrl,
            qs: { limit: limit }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            expect(response.body.length).to.eq(limit)
        })
    })


    it('will return non-fiction books by sending GET call with limit parameter', () => {
        const limit = 2
        cy.request({
            method: 'GET',
            url: apiUrl,
            qs: { type: 'non-fiction', limit: limit }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            expect(response.body.length).to.eq(limit)
            response.body.forEach(book => {
                expect(book.type).to.eq('non-fiction')
            })
        })
    })


    it('will return an error for invalid limit greater than 20', () => {
        const invalidLimit = 25
        cy.request({
            method: 'GET',
            url: apiUrl,
            qs: { limit: invalidLimit },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400)
        })
    })


    it('will return an error for invalid type', () => {
        cy.request({
            method: 'GET',
            url: apiUrl,
            qs: { type: 'story' },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400)
        })
    })
})
describe('GET Book by id', () => {


    it('will Get the book with ID and check data', function () {
        cy.fixture('API/bookData').then((data) => {
            const storedBookData = data.bookInfo1;

            cy.request(`${baseUrl}/books/${storedBookData.id}`).then((response) => {
                expect(response.status).to.eq(200)
                const apiBookData = response.body;

                expect(apiBookData.name).to.eq(storedBookData.name)
                expect(apiBookData.type).to.eq(storedBookData.type)
                expect(apiBookData.available).to.eq(storedBookData.available)
            })
        })
    })
    it('will return 404 for invalid book ID', () => {
        const invalidBookId = 999

        cy.request({
            method: 'GET',
            url: `${baseUrl}/books/${invalidBookId}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404)
        })
    })
})

describe('Generate access token', () => {

    const clientName = Math.random().toString(5).substring(2)
    const clientEmail = Math.random().toString(5).substring(2) + "@gmail.com"

    it('will send request with valid data', () => {


        cy.request({
            method: 'POST',
            url: `${baseUrl}/api-clients`,
            body: {
                clientName,
                clientEmail
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body).to.have.property('accessToken')
            const accessToken = response.body.accessToken;
            cy.writeFile('cypress/fixtures/API/accessToken.json', {
                clientName,
                clientEmail,
                accessToken
            })
        })
    })

    it('will send request with name parameter', () => {

        cy.fixture('API/accessToken').then((data) => {
            const existingEmail = data.clientEmail
            cy.request({
                method: 'POST',
                url: `${baseUrl}/api-clients`,
                body: {

                    existingEmail
                },
                failOnStatusCode: false
            }).then((response) => {
                cy.log(existingEmail)
                expect(response.status).to.eq(400)

            })
        })
    })
})

describe('Place an Order', () => {
    let token;

    before(() => {

        cy.fixture('API/accessToken').then((data) => {
            token = data.accessToken;
        })
    })

    it('will place an order', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/orders`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                bookId: 1,
                customerName: 'Sam Kurn'
            }
        }).then((response) => {
            expect(response.status).to.eq(201) // Created
            expect(response.body).to.have.property('orderId')
            cy.log('Order ID:', response.body.orderId)

            cy.writeFile('cypress/fixtures/API/orderDetails.json', response.body)
        })
    })
    it('will not place an order because of invalid token', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/orders`,
            headers: {
                Authorization: `Bearer ${token}123`
            },
            body: {
                bookId: 1,
                customerName: 'Sam Kurn'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    })
})

describe('Get all orders', () => {
    let token;

    before(() => {

        cy.fixture('API/accessToken').then((data) => {
            token = data.accessToken;
        })
    })

    it('will fetch all orders of the specific token', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/orders`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')

        })
    })

    it('will get no orders because of invalid token', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/orders`,
            headers: {
                Authorization: `Bearer ${token}123`
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)

        })
    })
})

describe('GET a specific order with order id', () => {
    let token;
    let orderId;

    before(() => {
        cy.fixture('API/accessToken').then((data) => {
            token = data.accessToken;
        })

        cy.fixture('API/orderDetails').then((order) => {
            orderId = order.orderId;
        })
    })

    it('will retrieve the order details using orderId', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/orders/${orderId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('id', orderId)
        })
    })
    it('will not get order with invalid order id', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/orders/${orderId}123`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404)
        })
    })
})

describe('Update customer name for an order', () => {
    let token
    let orderId
    const updatedName = 'John'

    before(() => {
        cy.fixture('API/accessToken').then((data) => {
            token = data.accessToken;
        })

        cy.fixture('API/orderDetails').then((order) => {
            orderId = order.orderId;
        })
    })

    it('will update the customer name successfully', () => {

        cy.request({
            method: 'PATCH',
            url: `${baseUrl}/orders/${orderId}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                customerName: updatedName
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(204)
        })
    })

    it('will confirm the updated customerName', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/orders/${orderId}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.customerName).to.eq(updatedName)
        })
    })

    it('will not update the customer name successfully with invalid id', () => {
        const updatedName = 'John';

        cy.request({
            method: 'PATCH',
            url: `${baseUrl}/orders/${orderId}123`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                customerName: updatedName
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404)
        })
    })
})

describe('Delete an existing order', () => {
    let token;
    let orderId;

    before(() => {
        cy.fixture('API/accessToken').then((data) => {
            token = data.accessToken;
        })

        cy.fixture('API/orderDetails').then((data) => {
            orderId = data.orderId;
        })
    })

    it('will delete the order', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/orders/${orderId}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(204)
        })
    })

    it('will confirm if the order is deleted', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/orders/${orderId}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404)
        })
    })
})

