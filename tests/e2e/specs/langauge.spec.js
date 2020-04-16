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
    cy.get("div.noDocs").contains("No Docs")
    cy.get("div.noDocs").contains("You don't have any documents yet. Press new on the top right of your screen to create one.")
    cy.get("footer.footer").get(".local").get("select.input").should('have.value', 'en').select("pt")
    cy.get("div.noDocs").contains("Sem Documentos")
    cy.get("div.noDocs").contains("Você ainda não possui nenhum documento. Pressione novo no canto superior direito da tela para criar um.")
    cy.reload()
    cy.get("footer.footer").get(".local").get("select.input").should('have.value', 'pt')
    cy.get("div.noDocs").contains("Sem Documentos")
    cy.get("div.noDocs").contains("Você ainda não possui nenhum documento. Pressione novo no canto superior direito da tela para criar um.")
    cy.get("footer.footer").get(".local").get("select.input").select("en")
    cy.get("div.noDocs").contains("No Docs")
    cy.get("div.noDocs").contains("You don't have any documents yet. Press new on the top right of your screen to create one.")
    cy.reload()
    cy.get("footer.footer").get(".local").get("select.input").should('have.value', 'en')
  })
})