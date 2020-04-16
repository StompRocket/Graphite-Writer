// https://docs.cypress.io/api/introduction/api.html


describe('Tests what happens if GW server is down', () => {
  it('Visits homepage and simulates down server', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '/',
      status: 500,
      delay: 500,
      response: []
    })
    cy.login()
    cy.visit('/')
    //cy.get("input.title").should('have.value', 'UNIT TEST SHARED DOC')

  })
})
