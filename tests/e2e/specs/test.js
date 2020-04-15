// https://docs.cypress.io/api/introduction/api.html

describe('Home Page Test', () => {
  beforeEach(() => {
    // reset and seed the database prior to every test
    cy.exec('npm run seed')
  })

  it('Visits the app root url', () => {
    cy.login()
    cy.visit('/')
    cy.get('nav.nav')
    cy.get('input.search')
    cy.get('button.btn.new').contains("NEW")
    cy.get('img.user')
    cy.get('footer.footer').get(".local")
    cy.get("div.noDocs")
  })
})

describe('New Doc Creation', () => {
  beforeEach(() => {
    // reset and seed the database prior to every test
    cy.exec('npm run seed')
  })

  it('Visits the app root url creates a doc and it appears on home screen', () => {
    cy.login()
    cy.visit('/')
    cy.get('button.btn.new').contains("NEW").click()
    cy.get('.swal-modal').get('.swal-text').contains("New Doc Name:")
    cy.get('.swal-content').get('.swal-content__input').type("Testing Doc Name").get('.swal-footer').get('.swal-button').click()
    cy.url().should('include', '/d/')
    cy.get("#doc").get(".ql-editor").should('have.value', 'Testing Doc Name')
    cy.get("nav.editor")
    cy.get('img.brand--icon').click()
    cy.url().should('equal', 'http://localhost:8080/')
    cy.get("a.document").get(".title").contains("Testing Doc Name")
  })
})
describe('Document Editing', () => {
  it('Visits home and opens new doc edits it saves it checks save edits title chekcs title on home page', () => {
    cy.login()
    cy.visit('/')
    cy.get("a.document").click()
    cy.url().should('include', '/d/')
    cy.get("#doc").get(".ql-editor").type("testing document")
    cy.get(".saved").contains("waiting")
    cy.wait(2000)
    cy.get(".saved").contains("saved")
    cy.reload()
    cy.get("#doc").get(".ql-editor").contains("testing document")
    cy.get("input.title").type("TestSave")
    cy.get(".saved").contains("waiting")
    cy.wait(2000)
    cy.get(".saved").contains("saved")
    cy.visit('/')
    cy.get("a.document").get(".title").contains("Testing Doc NameTestSave")
  })
})
describe('Document Deletion', () => {
  it('Visits document and deletes it', () => {
    cy.login()
    cy.visit('/')
    cy.get("a.document").click()
    cy.url().should('include', '/d/')
    cy.get("button.delete").click()
    cy.get(".swal-button--danger").click()
    cy.url().should('equal', 'http://localhost:8080/')
    cy.get("div.noDocs")
  })
})