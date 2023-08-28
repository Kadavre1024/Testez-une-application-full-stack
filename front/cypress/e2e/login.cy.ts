describe('Login spec', () => {
  it('Login successfull', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}`)
    cy.wait(1000)
    cy.get('button[type=submit]').click()
    cy.url().should('include', '/sessions')
  })

  it('Login error with bad email', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401
    })

    cy.get('input[formControlName=email]').type("yogo@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}`)
    cy.get('button[type=submit]').click()
    cy.wait(1000)
    cy.get('p').contains('An error occurred')
  })

  it('Login submit button disabled with empty email', () => {
    cy.visit('/login')

    cy.get('input[formControlName=password]').type(`${"test!1234"}`)
    cy.get('button[type=submit]').should('be.disabled')
  })

  it('Login submit button disabled with empty password', () => {
    cy.visit('/login')

    cy.get('input[formControlName=email]').type("yogo@studio.com")
    cy.get('button[type=submit]').should('be.disabled')
  })
});