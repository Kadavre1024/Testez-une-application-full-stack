describe('Not found page spec', () => {

    it('Return to not found page', () => {
      cy.visit('/log')
      cy.url().should('include', '/404').then(()=>{
        cy.get('h1').contains("Page not found !")
      })
    })
})