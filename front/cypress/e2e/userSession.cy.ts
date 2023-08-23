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
        cy.get('button span').contains("Participate").click()
        cy.get('span[class=ml1]').contains("1 attendees")
        
        
      })

      //cy.get('button span').contains("Participate").click().then(()=>{
        
        //cy.get('button span').should('eq', 'Do not participate')

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