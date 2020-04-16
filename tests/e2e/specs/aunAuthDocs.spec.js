// https://docs.cypress.io/api/introduction/api.html


describe('Logged View editor for unshared Doc', () => {
  it('Visits editor for unshared doc', () => {
    cy.login()
    cy.visit('/d/dphPDWHJfDakVZVIO75w0Bc1e9m1/369a061d-0dbf-4341-9334-cb7654ae08b0')
    //cy.get("input.title").should('have.value', 'UNIT TEST SHARED DOC')
    cy.get(".modal").contains('Error')
    cy.get(".modal").contains('You are not authorized to view this document.')
    cy.get(".modal").get("button").contains("OK").click()
    cy.url().should('equal', 'http://localhost:8080/')
  })
})
describe('Logged View shared for unshared Doc', () => {
  it('Visits share screen for unshared doc', () => {
    cy.login()
    cy.visit('/shared/dphPDWHJfDakVZVIO75w0Bc1e9m1/369a061d-0dbf-4341-9334-cb7654ae08b0')
    //cy.get("input.title").should('have.value', 'UNIT TEST SHARED DOC')
    cy.get(".modal").contains('Error')
    cy.get(".modal").contains('You are not authorized to view this document.')
    cy.get(".modal").get("button").contains("OK").click()
    cy.url().should('equal', 'http://localhost:8080/')
  })
})