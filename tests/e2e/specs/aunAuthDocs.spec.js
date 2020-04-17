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
const text = require("./largeText").text
describe('Large doc', () => {
  beforeEach(() => {
    // reset and seed the database prior to every test
    cy.exec('npm run seedOne')
  })

  it('Opens owned doc and tries to upload large file', () => {
    cy.login()
    cy.visit('/d/5YKXaTqGh0evHNNmjJGRytkwYQt1/testingDoc')
    cy.get("#doc").get(".ql-editor").type("test", {
      delay: 0
    }).then($el => {
      $el.text(text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text + text)
    })
    cy.wait(2000)
    cy.get(".swal-modal").contains('ERROR SAVING')
    cy.get(".swal-modal").contains('Because Graphite Writer is a free service, we limit our document sizes to 3mb')
    //  cy.get("#doc").get(".ql-editor").type(text, {delay: 0})

  })
})