import { HttpClientModule, HttpResponse } from "@angular/common/http";
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { expect } from '@jest/globals';
import { User } from "src/app/interfaces/user.interface";
import { SessionService } from "src/app/services/session.service";
import { UserService } from "src/app/services/user.service";
import { MeComponent } from "./me.component";

describe('MeComponent', () => {
    let component: MeComponent;
    let fixture: ComponentFixture<MeComponent>;
    let user: User;
    let matSnackBar: MatSnackBar;
    let sessionService:SessionService;
    let router: Router;
  
    const mockSessionService = {
      sessionInformation: {
        admin: true,
        id: 1
      },
      logOut: jest.fn(),
    }
    let userService : UserService;
  
    beforeEach(async () => {
      
      await TestBed.configureTestingModule({
        declarations: [MeComponent],
        imports: [
          MatSnackBarModule,
          HttpClientModule,
          MatCardModule,
          MatFormFieldModule,
          MatIconModule,
          MatInputModule,
          NoopAnimationsModule,
          RouterTestingModule
        ],
        providers: [
          { provide: SessionService, useValue: mockSessionService },
          UserService,
          MatSnackBar,
        ],
      })
        .compileComponents();
      userService = TestBed.inject(UserService);
      router = TestBed.inject(Router);
      matSnackBar = TestBed.inject(MatSnackBar);
      sessionService = TestBed.inject(SessionService);
      
      
    });
  
    beforeEach(()=>{
      user = {
        id: 1,
        email: "test@email.com",
        lastName: "test",
        firstName: "Test",
        admin: true,
        password: "test!31",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      fixture = TestBed.createComponent(MeComponent);
      component = fixture.componentInstance;
    })
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
    it('should UserService set user', () => {
      jest.spyOn(userService, "getById").mockReturnValue(of(user));
      fixture.detectChanges();

      const userNameField = fixture.nativeElement.querySelectorAll("p")[0];
      expect(userNameField.textContent).toContain("Name: " + user.firstName + " " + user.lastName.toUpperCase());
      const emailField = fixture.nativeElement.querySelectorAll("p")[1];
      expect(emailField.textContent).toContain(user.email);
      const isAdminField = fixture.nativeElement.querySelectorAll("p")[2];
      expect(isAdminField.textContent).toContain("You are admin");
    });
  
    it('should UserService call delete method when click on delete button', fakeAsync(() => {
        user.admin = false;
        const httpResponse = new HttpResponse({ status: 200, statusText: "OK"})
        jest.spyOn(userService, "getById").mockReturnValue(of(user));
        fixture.detectChanges();
        jest.spyOn(userService, "delete").mockReturnValue(of(httpResponse));
        jest.spyOn(sessionService, "logOut");
        jest.spyOn(router, "navigate");
        jest.spyOn(matSnackBar, "open");
        const deleteBtn = fixture.nativeElement.querySelectorAll('button')[1];
        deleteBtn.click();
        fixture.detectChanges();
        tick(1000);
        expect(userService.delete).toBeCalled();
        expect(sessionService.logOut).toBeCalled();
        expect(matSnackBar.open).toBeCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
        tick(3000);
        expect(router.navigate).toBeCalledWith(['/']);
    }));
  
    it("should back() call window.history.back()", () => {
        const spy = jest.spyOn(window.history, "back");
        const backBtn = fixture.nativeElement.querySelector('button');
        backBtn.click();
        fixture.detectChanges
        expect(spy).toBeCalled();
    });
  });
  