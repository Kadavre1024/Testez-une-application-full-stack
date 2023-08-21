import { HttpClientModule, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest } from '../../interfaces/loginRequest.interface';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create login form', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector("form")).toBeTruthy();
    expect(compiled.querySelector("mat-card-title").textContent).toEqual("Login");
  });

  it('should form be invalid', () => {
    expect(component.form.valid).toBeFalsy();
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
    /**expect(password.hasError('min')).toBeTruthy();

    password.setValue("test@test.com");
    fixture.detectChanges();**/
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
  
  it('should throw error when submit', () => {
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

describe('LoginComponent Integration Test Suites', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let password: FormControl;
  let email: FormControl;
  let submitBtn: any;
  let router: Router;
  let authService: AuthService;
  let sessionInformation: SessionInformation;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        SessionService,
        UserService,
        AuthService,
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
    router= TestBed.inject(Router);
    authService= TestBed.inject(AuthService);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    password = component.form.controls['password'];
    email = component.form.controls['email'];
    submitBtn = fixture.debugElement.nativeElement.querySelector('button[type]');
    sessionInformation = {
      token: "test",
      type: "test",
      id: 1,
      username: "testTest",
      firstName: "test",
      lastName: "Test",
      admin: true,
    }
  });

  afterEach(() => {
    password.setValue("");
    email.setValue("");
  });

  it('should display an error message when submit with bad email and password', () => {
    const loginRequest : LoginRequest = {
      email: "test@test.com",
      password: "test"
    };
    const errorResponse = new HttpErrorResponse({
      error: "test 404 error",
      status: 404,
      statusText: "Not Found"
    });
    jest.spyOn(authService, "login").mockReturnValue(throwError(() => errorResponse));
    email.setValue(loginRequest.email);
    password.setValue(loginRequest.password);
    fixture.detectChanges();

    submitBtn.click();
    fixture.detectChanges();
    console.log(router);
    expect(authService.login).toBeCalledWith(loginRequest);
    expect(component.onError).toBe(true);
    expect(fixture.debugElement.nativeElement.querySelector('p.error').textContent).toBe("An error occurred");

  });

  it('should not display an error when submit with good email and password and redirect to "/sessions"', () => {
    const loginRequest : LoginRequest = {
      email: "yoga@studio.com",
      password: "test!1234"
    };
    jest.spyOn(authService, "login").mockReturnValue(of(sessionInformation));
    jest.spyOn(router, "navigate")
    email.setValue(loginRequest.email);
    password.setValue(loginRequest.password);
    fixture.detectChanges();

    submitBtn.click();
    fixture.detectChanges();
    expect(authService.login).toBeCalledWith(loginRequest);
    expect(component.onError).toBe(false);
    expect(jest.spyOn(router, "navigate")).toBeCalledWith(["/sessions"]);
  });
});