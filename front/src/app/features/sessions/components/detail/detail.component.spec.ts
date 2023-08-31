import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals'; 
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';
import { of } from 'rxjs';
import { TeacherService } from 'src/app/services/teacher.service';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/interfaces/user.interface';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('DetailComponent with admin session', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>; 
  let service: SessionService;
  let matSnackBar: MatSnackBar;
  let router: Router;
  let sessionApiService: SessionApiService;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  };

  const mockSessionApiService = {
    detail: jest.fn(),
    delete: jest.fn(),
    participate: jest.fn(),
    unParticipate: jest.fn()
  };

  const mockTeacherService = {
    detail: jest.fn()
  };

  const mockMatSnackBar = {
    open: jest.fn()
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
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [DetailComponent], 
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
      ],
    })
      .compileComponents();
      sessionApiService = TestBed.inject(SessionApiService);
      router = TestBed.inject(Router);
      matSnackBar = TestBed.inject(MatSnackBar);
      service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    let teacherServiceSpy = jest.spyOn(mockTeacherService, "detail").mockReturnValue(of(teacherMock));
    let sessionApiServiceSpy = jest.spyOn(mockSessionApiService, "detail").mockReturnValue(of(sessionMock));
    fixture.detectChanges();
  });

  it('should have the delete button when admin session', () => {
    component.sessionId = "1";
    fixture.detectChanges();
    const deleteBtn = fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[0];
    expect(deleteBtn.textContent).toBe("Delete");
  });

  it('should display the correct session name', () => {
    const sessionName = fixture.debugElement.nativeElement.querySelector("h1");
    expect(sessionName.textContent).toContain(sessionMock.name);
  });

  it('should display the correct teacher name', () => {
    const teacherName = fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[1];
    expect(teacherName.textContent).toContain(teacherMock.firstName + ' ' + teacherMock.lastName.toUpperCase());
  });

  it('should display the session.users.length', () => {
    const usersNumber = fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[2];
    expect(usersNumber.textContent).toContain(sessionMock.users.length.toString());
  });

  it('should display the session date', () => {
    const datePipe: DatePipe = new DatePipe('en-US');
    const sessionDate = fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[3];
    expect(sessionDate.textContent).toContain(datePipe.transform(sessionMock.date, 'MMMM dd, YYYY'));
  });

  it('should display the session description', () => {
    const sessionDescription = fixture.debugElement.nativeElement.querySelector('div[class="description"]');
    expect(sessionDescription.textContent).toContain(sessionMock.description);
  });

  it('should display the session created date', () => {
    const datePipe: DatePipe = new DatePipe('en-US');
    const sessionCreatedDate = fixture.debugElement.nativeElement.querySelector('div[class="created"]');
    expect(sessionCreatedDate.textContent).toContain(datePipe.transform(sessionMock.createdAt, 'MMMM dd, YYYY'));
  });

  it('should delete() call matSnackBar.open after delete session', () => {
    const httpResponse = new HttpResponse({ status: 200, statusText: "OK"})
    const spy = jest.spyOn(matSnackBar, "open");
    jest.spyOn(mockSessionApiService, "delete").mockReturnValue(of(httpResponse));
    component.delete();
    expect(spy).toBeCalledWith('Session deleted !', 'Close', { duration: 3000 });
  });
});

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

  it('should not have the delete button', () => {
    const deleteBtn = fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[0];
    expect(deleteBtn).not.toBe("Delete");
  });

  it('should display the participate button since user do not participate to the session', () => {
    const participateBtn = fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[0];
    expect(participateBtn.textContent).toBe("Participate");
  });

  it('should display the unparticipate button since user participate to the session', () => {
    sessionMock.users.push(1);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const participateBtn = fixture.debugElement.nativeElement.querySelectorAll('span[class="ml1"]')[0];
    expect(participateBtn.textContent).toBe("Do not participate");
  });
});
