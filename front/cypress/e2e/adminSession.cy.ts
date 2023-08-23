describe('Admin session spec', () => {
    

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
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
  
      cy.url().should('include', '/sessions')
    })

    it('create a session', () => {
        const sessionName = "Relax";
        const sessionDate = "2023-08-20";
        const sessionTeacher_id = 1;
        const sessionTeacherName = "Hamm Abra";
        const sessionDescription = "The course you need if you want to be happy.";

        cy.intercept('GET', '/api/teacher', {
            body: 
                    [
    
                        {
                            id: 1,
                            lastName: "Abra",
                            firstName: "Hamm",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }, 
                        {
                            id: 2,
                            lastName: "Abra",
                            firstName: "Cadabra",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }
                    ]  
          })

        cy.intercept('POST', '/api/session', {
            status: 200,
            
          })
        
        cy.intercept(
        {
            method: 'GET',
            url: '/api/session',
        },
        [
            {
                id: 1,
                name: sessionName,
                date: new Date(),
                teacher_id: sessionTeacher_id,
                description: sessionDescription,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]).as('session')

        cy.get('button[routerlink="create"]').click()

        cy.url().should('include', '/sessions/create')

        cy.get('input[formControlName=name]').type(sessionName)
        cy.get('input[formControlName=date]').type(sessionDate)
        cy.get('mat-select[formControlName=teacher_id]').click().then(() => {
            cy.get(`.cdk-overlay-container .mat-select-panel .mat-option-text`).should('contain', sessionTeacherName);
            cy.get(`.cdk-overlay-container .mat-select-panel .mat-option-text:contains(${sessionTeacherName})`).first().click().then(() => {
                cy.get(`[formcontrolname=teacher_id]`).contains(sessionTeacherName);})
        })
        cy.get('textarea[formControlName=description]').type(sessionDescription)

        cy.get('button[type=submit]').click()

        cy.url().should('include', '/sessions')
    })

    it('Edit a session', () => {

      const sessionName = "Relax";
      const newSessionName = "No Stress";
      const sessionDate = "2023-08-20";
      const sessionTeacher_id = 1;
      const sessionTeacherName = "Hamm Abra";
      const sessionDescription = "The course you need if you want to be happy.";

      cy.intercept('GET', '/api/teacher', {
        body: 
                [

                    {
                        id: 1,
                        lastName: "Abra",
                        firstName: "Hamm",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }, 
                    {
                        id: 2,
                        lastName: "Abra",
                        firstName: "Cadabra",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                ]  
      })

      cy.intercept('POST', '/api/session', {
        status: 200,
        
      })
    
      cy.intercept(
      {
          method: 'GET',
          url: '/api/session',
      },
      [
          {
              id: 1,
              name: newSessionName,
              date: new Date(),
              teacher_id: sessionTeacher_id,
              description: sessionDescription,
              users:[],
              createdAt: new Date(),
              updatedAt: new Date()
          }
      ]).as('session')

      cy.intercept(
        {
            method: 'GET',
            url: '/api/session/1',
        },
        {
            id: 1,
            name: sessionName,
            date: new Date(),
            teacher_id: sessionTeacher_id,
            description: sessionDescription,
            users:[],
            createdAt: new Date(),
            updatedAt: new Date()
        }
        ).as('session')

        cy.intercept('PUT', '/api/session/1', {
          status: 200,
          
        })
      
      cy.get('button span').contains("Edit").click()

      cy.url().should('include', '/sessions/update/1')

      cy.get('input[formControlName=name]').clear()
      cy.get('input[formControlName=name]').type(sessionName)
      cy.get('button[type=submit]').click()

      cy.url().should('include', '/sessions')

    })

    it('Delete a session', () => {
      const sessionName = "No Stress";
      const sessionDate = "2023-08-20";
      const sessionTeacher_id = 1;
      const sessionTeacherName = "Hamm Abra";
      const sessionDescription = "The course you need if you want to be happy.";

      cy.intercept('GET', '/api/teacher', {
        body: 
                [

                    {
                        id: 1,
                        lastName: "Abra",
                        firstName: "Hamm",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }, 
                    {
                        id: 2,
                        lastName: "Abra",
                        firstName: "Cadabra",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                ]  
      })

      cy.intercept('DELETE', '/api/session/1', {
        status: 200,
        
      })

      cy.intercept(
        {
            method: 'GET',
            url: '/api/session',
        },
        []).as('session')
  
        cy.intercept(
          {
              method: 'GET',
              url: '/api/session/1',
          },
          {
              id: 1,
              name: sessionName,
              date: new Date(),
              teacher_id: sessionTeacher_id,
              description: sessionDescription,
              users:[],
              createdAt: new Date(),
              updatedAt: new Date()
          }
          ).as('session')

          cy.get('button span').contains("Detail").click()

          cy.url().should('include', '/sessions/detail/1')
      
          cy.get('button span').contains("Delete").click()
      
          cy.url().should('include', '/sessions')
    })

    it('Logout admin', () => {
      cy.get('span[class=link]').contains("Logout").click()

      cy.url().should('eq', 'http://localhost:4200/')
    })

    
  });