import { HttpClientModule, HttpResponse } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { expect } from '@jest/globals'; 
import { Teacher } from "src/app/interfaces/teacher.interface";
import { SessionService } from "src/app/services/session.service";
import { TeacherService } from "src/app/services/teacher.service";
import { Session } from "../../interfaces/session.interface";
import { SessionApiService } from "../../services/session-api.service";
import { DetailComponent } from "./detail.component";
import { Router } from "@angular/router";

describe('DetailComponent with user session', () => {
    let component: DetailComponent;
    let fixture: ComponentFixture<DetailComponent>; 
    let httpClientSessionApiMock: any; 
    let httpClientTeacherMock: any;
    let matSnackBar: MatSnackBar;
    let router: Router;
  
    const mockSessionService = {
      sessionInformation: {
        admin: false,
        id: 1
      }
    };
  
    let sessionMock: Session = {
      id: 1,
      name: "Ali Baba",
      description: "best babouch customer",
      date: new Date(),
      teacher_id: 1,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  
    let teacherMock: Teacher = {
      id: 1,
      lastName: "Sonsec",
      firstName: "Sophie",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    beforeEach(async () => {
      httpClientSessionApiMock = {
        get: jest.fn(),
        post: jest.fn(),
        delete: jest.fn()
      }
      httpClientTeacherMock = {
        get: jest.fn(),
      }

      await TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientModule,
          MatSnackBarModule,
          ReactiveFormsModule
        ],
        declarations: [DetailComponent], 
        providers: [
          { provide: SessionService, useValue: mockSessionService },
          { provide: SessionApiService, useValue: new SessionApiService(httpClientSessionApiMock) },
          { provide: TeacherService, useValue: new TeacherService(httpClientTeacherMock) },
        ],
      })
        .compileComponents();
      matSnackBar = TestBed.inject(MatSnackBar);
      router = TestBed.inject(Router);
      fixture = TestBed.createComponent(DetailComponent);
      component = fixture.componentInstance;
      jest.spyOn(httpClientSessionApiMock, "get").mockReturnValue(of(sessionMock));
      jest.spyOn(httpClientTeacherMock, "get").mockReturnValue(of(teacherMock));
      
      fixture.detectChanges();
    });
  
    it('should subscribe user if click on the "Participate" button', async() => {
      let participateBtn = fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[0];
      sessionMock.users.push(1);
      component.sessionId = "1";
      jest.spyOn(httpClientSessionApiMock, "post").mockReturnValue(of(new HttpResponse({status: 200})));
      
      expect(participateBtn.textContent).toBe("Participate");
      participateBtn.click();
      fixture.detectChanges();

      await fixture.whenStable().then(() =>{
        expect(component.isParticipate).toStrictEqual(true);
        expect(httpClientSessionApiMock.post).toBeCalledWith("api/session/1/participate/1", null);
        expect(httpClientTeacherMock.get).toBeCalledWith("api/teacher/1");
        //participate button
        expect(fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[0].textContent).toBe("Do not participate");
        //number of attendees
        expect(fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[2].textContent).toBe("1 attendees");
      });
      
    });
  
    it('should unsubscribe user if click on the "Do not participate" button', async() => {
      sessionMock.users.push(1);
      
      fixture = TestBed.createComponent(DetailComponent);
      component = fixture.componentInstance;
      component.sessionId = "1";
      fixture.detectChanges();
      const participateBtn = fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[0];
      expect(participateBtn.textContent).toBe("Do not participate");
      sessionMock.users = [];
      jest.spyOn(httpClientSessionApiMock, "delete").mockReturnValue(of(new HttpResponse({status: 200})));
      participateBtn.click();
      fixture.detectChanges();
      await fixture.whenStable().then(() =>{
        expect(component.isParticipate).toStrictEqual(false);
        expect(httpClientSessionApiMock.delete).toBeCalledWith("api/session/1/participate/1");
        //unParticipate button
        expect(fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[0].textContent).toBe("Participate");
        //number of attendees
        expect(fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[2].textContent).toBe("0 attendees");
      });
    });

    describe('Admin session', () => {
      beforeEach(()=>{
        mockSessionService.sessionInformation.admin = true;
        fixture = TestBed.createComponent(DetailComponent);
        component = fixture.componentInstance;
        component.sessionId = "1";
        fixture.detectChanges();
      });

      it('should delete the session if admin click on the delete button', async()=>{
        let deleteBtn = fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[0];
        expect(deleteBtn.textContent).toBe("Delete");
        jest.spyOn(httpClientSessionApiMock, "delete").mockReturnValue(of(new HttpResponse({status: 200})));
        jest.spyOn(matSnackBar, "open");
        jest.spyOn(router, "navigate");

        deleteBtn.click();
        fixture.detectChanges();

        expect(httpClientSessionApiMock.delete).toBeCalledWith("api/session/1");
        expect(matSnackBar.open).toBeCalledWith('Session deleted !', 'Close', { duration: 3000 });
      });

    })
})