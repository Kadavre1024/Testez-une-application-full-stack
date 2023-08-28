import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from '@jest/globals';

import { MeComponent } from './me.component';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

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
  const mockUserService = {
    getById: jest.fn(),
    delete: jest.fn(),
  }

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
        { provide: UserService, useValue: mockUserService },
        MatSnackBar,
      ],
    })
      .compileComponents();

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

  it('should UserService set user', () => {
    jest.spyOn(mockUserService, "getById").mockReturnValue(of(user));
    fixture.detectChanges();
    expect(component.user?.id).toBe(user.id);
  });

  it('should UserService call delete method when delete()', () => {
    jest.spyOn(mockUserService, "delete").mockReturnValue(of(user));
    component.delete();
    expect(mockUserService.delete).toBeCalled();
  });

  it('should delete() call matSnackBar.open after delete user', () => {
    const httpResponse = new HttpResponse({ status: 200, statusText: "OK"})
    const spy = jest.spyOn(matSnackBar, "open");
    jest.spyOn(mockUserService, "delete").mockReturnValue(of(httpResponse));
    component.delete();
    expect(spy).toBeCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
  });

  it('should delete() call sessionService.logOut after delete user', fakeAsync(() => {
    const httpResponse = new HttpResponse({ status: 200, statusText: "OK"})
    const spy = jest.spyOn(sessionService, "logOut");
    jest.spyOn(mockUserService, "delete").mockReturnValue(of(httpResponse));
    component.delete();
    tick(3000);
    expect(spy).toBeCalled();
  }));

  it("should delete() call router.navigate with ['/'] after delete user", fakeAsync(() => {
    const httpResponse = new HttpResponse({ status: 200, statusText: "OK"})
    const spy = jest.spyOn(router, "navigate");
    jest.spyOn(mockUserService, "delete").mockReturnValue(of(httpResponse));
    component.delete();
    tick(3000);
    expect(spy).toBeCalledWith(['/']);
  }));

  it("should back() call window.history.back()", () => {
    const spy = jest.spyOn(window.history, "back");
    component.back();
    expect(spy).toBeCalled();
  });
});
