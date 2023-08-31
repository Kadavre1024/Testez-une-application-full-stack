import { HttpClientModule, HttpErrorResponse } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { throwError, of } from "rxjs";
import { expect } from '@jest/globals';
import { SessionInformation } from "src/app/interfaces/sessionInformation.interface";
import { SessionService } from "src/app/services/session.service";
import { UserService } from "src/app/services/user.service";
import { LoginRequest } from "../../interfaces/loginRequest.interface";
import { AuthService } from "../../services/auth.service";
import { LoginComponent } from "./login.component";

describe('LoginComponent Integration Test Suites', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let password: FormControl;
    let email: FormControl;
    let submitBtn: any;
    let router: Router;
    let authService: AuthService;
    let sessionInformation: SessionInformation;
    let httpClientMock: any;
  
    beforeEach(async () => {
      httpClientMock = {
        post: jest.fn()
      }
  
      await TestBed.configureTestingModule({
        declarations: [LoginComponent],
        providers: [
          SessionService,
          UserService,
          { provide: AuthService, useValue: new AuthService(httpClientMock)},
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
  
    it('should display an error message when submit with bad email', () => {
      const loginRequest : LoginRequest = {
        email: "test@test.com",
        password: "test!1234"
      };
      const errorResponse = new HttpErrorResponse({
        error: "test 404 error",
        status: 404,
        statusText: "Not Found"
      });
      jest.spyOn(httpClientMock, "post").mockReturnValue(throwError(() => errorResponse));
      jest.spyOn(authService, "login");

      email.setValue(loginRequest.email);
      password.setValue(loginRequest.password);
      fixture.detectChanges();
  
      submitBtn.click();
      fixture.detectChanges();
      expect(authService.login).toBeCalledWith(loginRequest);
      expect(httpClientMock.post).toBeCalledWith("api/auth/login",loginRequest);
      expect(component.onError).toBe(true);
      expect(fixture.debugElement.nativeElement.querySelector('p.error').textContent).toBe("An error occurred");
  
    });
  
    it('should display an error when submit with good email and bad password and redirect to "/sessions"', () => {
      const loginRequest : LoginRequest = {
        email: "yoga@studio.com",
        password: "test"
      };
      const errorResponse = new HttpErrorResponse({
        error: "test 404 error",
        status: 404,
        statusText: "Not Found"
      });

      jest.spyOn(httpClientMock, "post").mockReturnValue(throwError(() => errorResponse));
      jest.spyOn(authService, "login");

      email.setValue(loginRequest.email);
      password.setValue(loginRequest.password);
      fixture.detectChanges();
  
      submitBtn.click();
      fixture.detectChanges();
      expect(authService.login).toBeCalledWith(loginRequest);
      expect(httpClientMock.post).toBeCalledWith("api/auth/login",loginRequest);
      expect(component.onError).toBe(true);
      expect(fixture.debugElement.nativeElement.querySelector('p.error').textContent).toBe("An error occurred");
  
    });

    it('should not display any error when submit with good email and password and redirect to "/sessions"', () => {
        const loginRequest : LoginRequest = {
          email: "yoga@studio.com",
          password: "test!1234"
        };
        jest.spyOn(httpClientMock, "post").mockReturnValue(of(sessionInformation));
        jest.spyOn(authService, "login");
        jest.spyOn(router, "navigate")
        
        email.setValue(loginRequest.email);
        password.setValue(loginRequest.password);
        fixture.detectChanges();
    
        submitBtn.click();
        fixture.detectChanges();
        expect(authService.login).toBeCalledWith(loginRequest);
        expect(httpClientMock.post).toBeCalledWith("api/auth/login",loginRequest);
        expect(component.onError).toBe(false);
        expect(router.navigate).toBeCalledWith(["/sessions"]);
      });
  });