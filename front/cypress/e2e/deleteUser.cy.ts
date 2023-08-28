describe('Admin session spec', () => {
    

    it('Login successfull', () => {
      cy.visit('/login')
  
      cy.intercept('POST', '/api/auth/login', {
        body: {
          id: 1,
          username: 'userName',
          firstName: 'firstName',
          lastName: 'lastName',
          admin: false
        },
      })

      cy.intercept(
        {
          method: 'GET',
          url: '/api/session',
        },
        []).as('session')
  
      cy.get('input[formControlName=email]').type("yoga@studio.com")
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
      
  
      cy.url().should('include', '/sessions')
    })

    it('Account details', () => {
        const userFirstName = 'firstName';
        const userLastName = 'lastName';
        const userEmail = 'email@test.com'
        const userAdmin = false;
        const userCreatedAt = new Date()
        const userUpdatedAt = new Date()
      cy.intercept(
        {
            method: 'GET',
            url: '/api/user/1',
        },
        {
          id: 1,
          username: 'userName',
          firstName: userFirstName,
          lastName: userLastName,
          email: userEmail,
          admin: userAdmin,
          password: "password",
          createdAt: userCreatedAt,
          updatedAt: userUpdatedAt

        },
        ).as('user')

      cy.intercept(
        {
          method: 'GET',
          url: '/api/session',
        },
        []).as('session')

      cy.get('span[routerLink=me]').click().then(()=>{
        cy.url().should('include', '/me').then(()=>{
            cy.get('p').contains("Name: "+userFirstName+" "+userLastName.toUpperCase())
            cy.get('p').contains("Email: "+userEmail)
        })
      })
    })
    it('Delete user', () => {
        cy.intercept('DELETE', '/api/user/1', {
            status: 200,
          })

        cy.get('button').contains("Detail").click().then(()=>{
            cy.url().should('eq', 'http://localhost:4200/')
          })
    })
})