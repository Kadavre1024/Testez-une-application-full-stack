import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { expect } from '@jest/globals'; 
import { Teacher } from "src/app/interfaces/teacher.interface";
import { User } from "src/app/interfaces/user.interface";
import { SessionService } from "src/app/services/session.service";
import { TeacherService } from "src/app/services/teacher.service";
import { Session } from "../../interfaces/session.interface";
import { SessionApiService } from "../../services/session-api.service";
import { DetailComponent } from "./detail.component";

describe('DetailComponent with user session', () => {
    let component: DetailComponent;
    let fixture: ComponentFixture<DetailComponent>; 
    let service: SessionService;
  
    const mockSessionService = {
      sessionInformation: {
        admin: false,
        id: 1
      }
    };
  
    const mockSessionApiService = {
      detail: jest.fn(),
      participate: jest.fn(),
      unParticipate: jest.fn()
    };
  
    const mockTeacherService = {
      detail: jest.fn()
    };
  
    const userMock: User = {
      id: 1,
      email: "toto@email.com",
      lastName: "Test",
      firstName: "Toto",
      admin: false,
      password: "toto",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  
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
          { provide: SessionApiService, useValue: mockSessionApiService },
          { provide: TeacherService, useValue: mockTeacherService },
        ],
      })
        .compileComponents();
        service = TestBed.inject(SessionService);
      fixture = TestBed.createComponent(DetailComponent);
      component = fixture.componentInstance;
      let teacherServiceSpy = jest.spyOn(mockTeacherService, "detail").mockReturnValue(of(teacherMock));
      let sessionApiServiceSpy = jest.spyOn(mockSessionApiService, "detail").mockReturnValue(of(sessionMock));
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
    it('should participate when unparticipate user click to the participate button', async() => {
      const participateBtn = fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[0];
      expect(component.isParticipate).toStrictEqual(false);
      sessionMock.users.push(1);
      const participateSpy = jest.spyOn(mockSessionApiService, "participate").mockReturnValue(of(sessionMock));
      jest.spyOn(mockSessionApiService, "detail").mockReturnValue(of(sessionMock));
      expect(participateBtn.textContent).toBe("Participate");
      component.sessionId = "1";
      participateBtn.click();
      fixture.detectChanges();
      await fixture.whenStable().then(() =>{
        expect(component.isParticipate).toStrictEqual(true);
        expect(participateSpy).toBeCalledWith("1","1");
      });
        
    });
  
    it('should display the unparticipate button since user participate to the session', async() => {
      sessionMock.users.push(1);
      fixture = TestBed.createComponent(DetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const participateBtn = fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[0];
      expect(participateBtn.textContent).toBe("Do not participate");
      sessionMock.users = [];
      const participateSpy = jest.spyOn(mockSessionApiService, "unParticipate").mockReturnValue(of(sessionMock));
      component.sessionId = "1";
      participateBtn.click();
      fixture.detectChanges();
      await fixture.whenStable().then(() =>{
        expect(component.isParticipate).toStrictEqual(false);
        expect(participateSpy).toBeCalledWith("1","1");
      });
    });
})