// https://docs.cypress.io/api/introduction/api.html


describe('Logged In Shared Doc View', () => {
  beforeEach(() => {
    // reset and seed the database prior to every test
    cy.exec('npm run seed')
  })


  it('Views a shared document while logged in', () => {
    cy.login()
    cy.visit('/shared/dphPDWHJfDakVZVIO75w0Bc1e9m1/630f88c3-b06b-43cf-97ed-a01a614943ec')
    cy.get("input.title").should('have.value', 'UNIT TEST SHARED DOC')
    cy.visit("/")
    cy.get("a.document").get(".title").contains("UNIT TEST SHARED DOC")

  })
})
describe('Logged Out Shared Doc View', () => {
  beforeEach(() => {
    // reset and seed the database prior to every test
    cy.exec('npm run seed')
  })


  it('Visits a shared doc while logged out', () => {

    cy.visit('/shared/dphPDWHJfDakVZVIO75w0Bc1e9m1/630f88c3-b06b-43cf-97ed-a01a614943ec')
    cy.logout()
    cy.reload()
    cy.get("input.title").should('have.value', 'UNIT TEST SHARED DOC')
  })
})

describe('View editor for shared doc', () => {
  beforeEach(() => {
    // reset and seed the database prior to every test
    cy.exec('npm run seed')
  })


  it('Visits the editor for a shared doc', () => {
    cy.login()
    cy.visit('/d/dphPDWHJfDakVZVIO75w0Bc1e9m1/630f88c3-b06b-43cf-97ed-a01a614943ec')
    cy.get(".modal").contains('Error')
    cy.get(".modal").contains('You are not authorized to view this document.')
    cy.get(".modal").get("button").contains("OK").click()
    cy.url().should('equal', 'http://localhost:8080/')
  })
})