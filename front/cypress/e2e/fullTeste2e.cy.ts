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

  describe('User session spec', () => {

    it('Login successfull', () => {
        const sessionName = "No Stress";
        const sessionTeacher_id = 1;
        const sessionDescription = "The course you need if you want to be happy.";
        let sessionUsers: Number[] = [];
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
        [
            {
                id: 1,
                name: sessionName,
                date: new Date(),
                teacher_id: sessionTeacher_id,
                description: sessionDescription,
                users: [],
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
                users: sessionUsers,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            ).as('session')
  
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
      const sessionName = "No Stress";
      const sessionTeacher_id = 1;
      const sessionDescription = "The course you need if you want to be happy.";
      let sessionUsers: Number[] = [];

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
        [
            {
                id: 1,
                name: sessionName,
                date: new Date(),
                teacher_id: sessionTeacher_id,
                description: sessionDescription,
                users: [],
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
              users: sessionUsers,
              createdAt: new Date(),
              updatedAt: new Date()
          }
          ).as('session')

    cy.get('span[routerLink=me]').click().then(()=>{
      cy.url().should('include', '/me').then(()=>{
          cy.get('p').contains("Name: "+userFirstName+" "+userLastName.toUpperCase())
          cy.get('p').contains("Email: "+userEmail)
      })
    })
    cy.get('button').first().click()
    cy.url().should('include', '/sessions')

    cy.get('button span').contains("Detail").click()
    cy.url().should('include', '/sessions/detail/1')
  })

    it('Participate to a session', () => {

      const sessionName = "No Stress";
      const sessionTeacher_id = 1;
      const sessionDescription = "The course you need if you want to be happy.";
      let sessionUsers: Number[] = [1];
      let push: boolean;

      cy.intercept('GET', '/api/teacher/1', {
        body: 
            {
                id: 1,
                lastName: "Abra",
                firstName: "Hamm",
                createdAt: new Date(),
                updatedAt: new Date(),
            }, 
      })

      cy.intercept('POST', '/api/session/1/participate/1', {
        status: 200,
        
      })

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
            users: sessionUsers,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        ).as('session')
      
      
      cy.get('h1').contains(sessionName).then(()=>{
        sessionUsers.push(1)
        cy.get('button span').contains("Participate").click().then(()=>{
          cy.wait(500)
          cy.get('button span').contains('Do not participate')
        cy.get('span[class=ml1]').contains("1 attendees")
        })
      })
    })

    it('Do not participate to a session', () => {
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

      cy.intercept('DELETE', '/api/session/1/participate/1', {
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
              users: [],
              createdAt: new Date(),
              updatedAt: new Date()
          }
          ).as('session')

          cy.get('button span').contains("Do not participate").click()
          cy.get('span[class=ml1]').contains("0 attendees")
    })

    it('Logout successful', () => {
      cy.get('span[class=link]').contains("Logout").click()

      cy.url().should('eq', 'http://localhost:4200/')
    })

    
  });

  describe('Delete user spec', () => {
    

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

  describe('Not found page spec', () => {

    it('Return to not found page', () => {
      cy.visit('/log')
      cy.url().should('include', '/404').then(()=>{
        cy.get('h1').contains("Page not found !")
      })
    })
})

