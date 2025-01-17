import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../services/auth.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent Unit Test Suites', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceMock: any;
  let sessionInformation: SessionInformation;
  let router: Router;

  const mockAuthService = {
    login: jest.fn(),
  }

  beforeEach(async () => {
    jest.setTimeout(20000);

    userServiceMock = {
      getById: jest.fn(),
      delete: jest.fn()
    }

    sessionInformation = {
      token: "test",
      type: "test",
      id: 1,
      username: "testTest",
      firstName: "test",
      lastName: "Test",
      admin: true,
    }

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        SessionService,
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: mockAuthService },
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('email field validity', () => {
    let submit = fixture.nativeElement.querySelector('button[type]');
    let email = component.form.controls['email'];
    expect(email.valid).toBeFalsy();

    email.setValue("test");
    expect(email.hasError('email')).toBeTruthy();

    email.setValue("test@test.com");
    fixture.detectChanges();
    expect(email.valid).toBeTruthy();
    expect(submit.disabled).toEqual(true);
  });

  it('password field validity', () => {
    let password = component.form.controls['password'];
    let submit = fixture.nativeElement.querySelector('button[type]');
    expect(password.valid).toBeFalsy();
    expect(submit.disabled).toEqual(true);

    password.setValue("faKePassW0rd");
    fixture.detectChanges();
    
    expect(password.valid).toBeTruthy();
    expect(submit.disabled).toEqual(true);
  });

  it('should enable submit button while email and password are verified', () => {
    let password = component.form.controls['password'];
    let email = component.form.controls['email'];
    let submit = fixture.nativeElement.querySelector('button[type]');

    password.setValue("test");
    email.setValue("test@test.com");
    fixture.detectChanges();
    expect(component.form.valid).toBeTruthy();
    expect(submit.disabled).toEqual(false);
  });
  
  it('should throw error when submit with bad http request', () => {
    const errorResponse = new HttpErrorResponse({
      error: "test 404 error",
      status: 404,
      statusText: "Not Found"
    });
    jest.spyOn(mockAuthService, "login").mockReturnValue(throwError(() => errorResponse));
    component.submit();
    expect(component.onError).toBe(true);
  });
});

