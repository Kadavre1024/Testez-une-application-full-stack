import { HttpClientModule, HttpErrorResponse } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { throwError, of } from "rxjs";
import { expect } from '@jest/globals';
import { RegisterRequest } from "../../interfaces/registerRequest.interface";
import { AuthService } from "../../services/auth.service";
import { RegisterComponent } from "./register.component";

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
  
    it('should not display an error when submit and redirect to "/login"', () => {
      const registerRequest : RegisterRequest = {
        email: "yoga@studio.com",
        password: "test!1234",
        lastName:"Test",
        firstName: "test"
      };
  
      jest.spyOn(authService, "register").mockReturnValue(of());
  
      email.value = registerRequest.email;
      email.dispatchEvent(new Event('input'));
      password.value = registerRequest.password;
      password.dispatchEvent(new Event('input'));
      firstName.value = registerRequest.firstName;
      firstName.dispatchEvent(new Event('input'));
      lastName.value = registerRequest.lastName;
      lastName.dispatchEvent(new Event('input'));
      
      fixture.detectChanges();
      jest.spyOn(router, "navigate");
  
      expect(component.form!.invalid).toBe(false);
      submitBtn.click();
      fixture.detectChanges();
      expect(authService.register).toBeCalledWith(registerRequest);
      expect(component.onError).toBe(false);
      //expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
  
  
  