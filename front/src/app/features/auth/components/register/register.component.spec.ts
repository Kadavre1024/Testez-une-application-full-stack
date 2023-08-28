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
});

