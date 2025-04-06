describe('GET /status API Test', () => {
    it('should return status ok', () => {
      cy.request('https://simple-books-api.glitch.me/status')
        .then((response) => {
          // Assert status code
          expect(response.status).to.eq(200);
  
          // Assert response body
          expect(response.body).to.have.property('status', 'OK');
        });
    });
  });