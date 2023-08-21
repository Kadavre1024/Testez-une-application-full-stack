import { HttpClientModule, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent Unit Test Suites', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let fb: FormBuilder;
  let router: Router;

  const mockAuthService = {
    register: jest.fn(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [ 
        { provide: AuthService, useValue: mockAuthService },
        /**{ provide: FormBuilder, useValue: fb },
        { provide: Router, useValue: router },**/
       ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have Register title', () => {
    expect(fixture.nativeElement.querySelector("mat-card-title").textContent).toContain("Register");
  });

  it('should create register form', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector("form")).toBeTruthy();
    expect(compiled.querySelector("mat-card-title").textContent).toEqual("Register");
  });

  it('should form be invalid', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('email field validity', () => {
    let submit = fixture.nativeElement.querySelector('button[type="submit"]');
    let email = component.form.controls['email'];
    expect(email.valid).toBeFalsy();

    email.setValue("test");
    expect(email.hasError('email')).toBeTruthy();

    email.setValue("test@test.com");
    fixture.detectChanges();
    expect(email.valid).toBeTruthy();
    expect(submit.disabled).toEqual(true);
  });

  /**it('firstName field validity', () => {
    let submit = fixture.nativeElement.querySelector('button[type="submit"]');
    let firstName = component.form.controls['firstName'];
    expect(firstName.valid).toBeFalsy();
    
    //Validator min(3)
    firstName.setValue("te");
    fixture.detectChanges();
    expect(firstName.hasError('min')).toBeTruthy();

    //Validator max(20)
    firstName.setValue("abcdefghijklmnopqrstuv");
    fixture.detectChanges();
    expect(firstName.hasError('max')).toBeTruthy();

    firstName.setValue("test");
    fixture.detectChanges();
    expect(firstName.valid).toBeTruthy();
    expect(submit.disabled).toEqual(true);
  });**/

  it('should enable submit button while email and password are verified', () => {
    let password = component.form.controls['password'];
    let email = component.form.controls['email'];
    let firstName = component.form.controls['firstName'];
    let lastName = component.form.controls['lastName'];
    let submit = fixture.nativeElement.querySelector('button[type]');

    password.setValue("test");
    email.setValue("test@test.com");
    firstName.setValue("test");
    lastName.setValue("Test");

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
    jest.spyOn(mockAuthService, "register").mockReturnValue(throwError(() => errorResponse));
    component.submit();
    expect(component.onError).toBe(true);
  })

  it('should redirect to login page when submit', () => {
    let submit = fixture.debugElement.nativeElement.querySelector('button[type]');
    const httpResponse = new HttpResponse({
      status: 200,
      statusText: "OK"
    });

    jest.spyOn(component, "submit");
    jest.spyOn(mockAuthService, "register").mockReturnValue(of(httpResponse));
    jest.spyOn(router, "navigate");

    component.submit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  //it('should navigate ')
});

describe('LoginComponent Integration Test Suites', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let password: any;//FormControl;
  let email: any;//FormControl;
  let firstName: any;//FormControl;
  let lastName: any;//FormControl;
  let submitBtn: any;
  let router: Router;
  let authService: AuthService;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
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
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    password = fixture.debugElement.nativeElement.querySelector('input[formControlName="password"]');
    email = fixture.debugElement.nativeElement.querySelector('input[formControlName="email"]');
    firstName = fixture.debugElement.nativeElement.querySelector('input[formControlName="firstName"]');
    lastName = fixture.debugElement.nativeElement.querySelector('input[formControlName="lastName"]');
    submitBtn = fixture.debugElement.nativeElement.querySelector('button[type]');
  });

  afterEach(() => {
    email.value = "";
    email.dispatchEvent(new Event('input'));
    password.value = "";
    password.dispatchEvent(new Event('input'));
    firstName.value = "";
    firstName.dispatchEvent(new Event('input'));
    lastName.value = "";
    lastName.dispatchEvent(new Event('input'));
  });

  it('should display an error message when submit with http error response', () => {
    const registerRequest : RegisterRequest = {
      email: "test@test.com",
      firstName: "test",
      lastName:"Test",
      password: "test"
    };
    const errorResponse = new HttpErrorResponse({
      error: "test 404 error",
      status: 404,
      statusText: "Not Found"
    });
    jest.spyOn(authService, "register").mockReturnValue(throwError(() => errorResponse));
    email.value = registerRequest.email;
    email.dispatchEvent(new Event('input'));
    password.value = registerRequest.password;
    password.dispatchEvent(new Event('input'));
    firstName.value = registerRequest.firstName;
    firstName.dispatchEvent(new Event('input'));
    lastName.value = registerRequest.lastName;
    lastName.dispatchEvent(new Event('input'));
    
    fixture.detectChanges();

    submitBtn.click();
    fixture.detectChanges();

    expect(authService.register).toBeCalledWith(registerRequest);
    expect(component.onError).toBe(true);
    expect(fixture.debugElement.nativeElement.querySelector('span.error').textContent).toBe("An error occurred");

  });

  it('should not display an error when submit and redirect to "/login"', async() => {
    const registerRequest : RegisterRequest = {
      email: "yoga@studio.com",
      password: "test!1234",
      lastName:"Test",
      firstName: "test"
    };

    jest.spyOn(authService, "register");
    

    email.value = registerRequest.email;
    email.dispatchEvent(new Event('input'));
    password.value = registerRequest.password;
    password.dispatchEvent(new Event('input'));
    firstName.value = registerRequest.firstName;
    firstName.dispatchEvent(new Event('input'));
    lastName.value = registerRequest.lastName;
    lastName.dispatchEvent(new Event('input'));
    
    fixture.detectChanges();
    jest.spyOn(router, "navigate")

    await submitBtn.click();
    fixture.detectChanges();
    expect(authService.register).toBeCalledWith(registerRequest);
    expect(component.onError).toBe(false);
    //expect(router.navigate).toBeCalledWith(['/login']);
  });
});


