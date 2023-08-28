describe('Register spec', () => {
    it('Register successfull', () => {
      cy.visit('/register')
  
      cy.intercept('POST', '/api/auth/register', {
        body: {
          id: 1,
          username: 'userName',
          firstName: 'firstName',
          lastName: 'lastName',
          admin: true
        },
      })
  
      cy.get('input[formControlName=firstName]').type("yoyo")
      cy.get('input[formControlName=lastName]').type("gaga")
      cy.get('input[formControlName=email]').type("yoga@studio.com")
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
  
      cy.url().should('include', '/login')
    })

    it('Register with error', () => {
      cy.visit('/register')
  
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 401,
      })
  
      cy.get('input[formControlName=firstName]').type("yoyo")
      cy.get('input[formControlName=lastName]').type("gaga")
      cy.get('input[formControlName=email]').type("yoga@studio.com")
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
      cy.wait(1000)
      cy.get('span').contains("An error occurred")
    })

    it('Register sumbit button disabled with empty firstname', () => {
      cy.visit('/register')
  
      cy.get('input[formControlName=lastName]').type("gaga")
      cy.get('input[formControlName=email]').type("yoga@studio.com")
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
  
      cy.get('button[type=submit]').should('be.disabled')
    })

    it('Register sumbit button disabled with empty lastname', () => {
      cy.visit('/register')
  
      cy.get('input[formControlName=firstName]').type("yoyo")
      cy.get('input[formControlName=email]').type("yoga@studio.com")
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
  
      cy.get('button[type=submit]').should('be.disabled')
    })

    it('Register sumbit button disabled with empty email', () => {
      cy.visit('/register')
  
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 401,
      })
  
      cy.get('input[formControlName=firstName]').type("yoyo")
      cy.get('input[formControlName=lastName]').type("gaga")
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
  
      cy.get('button[type=submit]').should('be.disabled')
    })

    it('Register sumbit button disabled with empty password', () => {
      cy.visit('/register')
  
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 401,
      })
  
      cy.get('input[formControlName=firstName]').type("yoyo")
      cy.get('input[formControlName=lastName]').type("gaga")
      cy.get('input[formControlName=email]').type("yoga@studio.com")
  
      cy.get('button[type=submit]').should('be.disabled')
    })
  });