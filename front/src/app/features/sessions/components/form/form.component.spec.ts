import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import {  AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { Router, Routes } from '@angular/router';
import { of } from 'rxjs';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { TeacherService } from 'src/app/services/teacher.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { By } from '@angular/platform-browser';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let router: Router;
  let mockSessionService: any;
  let mockSessionApiService: any;
  let sessionApiService: SessionApiService;
  let sessionMock: any;
  let matSnackBar: MatSnackBar;

  let name: AbstractControl;
  let description: AbstractControl;
  let date: AbstractControl;
  let teacher_id: AbstractControl;

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: {
        admin: true
      }
    } 
    mockSessionApiService = {
      create: jest.fn(),
      update: jest.fn(),
    }
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule, 
        MatSnackBarModule,
        MatSelectModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { prodive: SessionApiService, useValue: mockSessionApiService },
        MatSnackBar
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    matSnackBar = TestBed.inject(MatSnackBar);
    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(()=>{
    sessionMock = {
      name: "test",
      description: "test session",
      date: new Date(),
      teacher_id: 1
    };

    name = component.sessionForm!.controls['name'];
    description = component.sessionForm!.controls['description'];
    date = component.sessionForm!.controls['date'];
    teacher_id = component.sessionForm!.controls['teacher_id'];
    component.onUpdate = false;
  })

  it('should navigate to sessions path when not admin session', () => {
    jest.spyOn(router, "navigate");
    mockSessionService.sessionInformation.admin = false;
    component.ngOnInit();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should display the update session form', () => {
    const formTitle = fixture.debugElement.nativeElement.querySelector("h1");
    const formName = fixture.debugElement.nativeElement.querySelector('input[formControlName="name"]');
    component.ngOnInit();
    fixture.detectChanges();
    expect(formTitle.textContent).toBe("Create session");
    expect(formName.get).toBe(undefined);
  });

  it('should display the create session form', () => {
    const formTitle = fixture.debugElement.nativeElement.querySelector("h1");
    const formName = fixture.debugElement.nativeElement.querySelector('input[formControlName="name"]');
    component.ngOnInit();
    fixture.detectChanges();
    expect(formTitle.textContent).toBe("Create session");
    expect(formName.get).toBe(undefined);
  });

  describe('Session form submission', ()=>{

    beforeEach(()=>{
      name.setValue(sessionMock.name);
      description.setValue(sessionMock.description);
      date.setValue(sessionMock.date);
      teacher_id.setValue(sessionMock.teacher_id);
    });

    it('should navigate to sessions after submit a created session', () => {
      jest.spyOn(router, "navigate");
      jest.spyOn(sessionApiService, "create").mockReturnValue(of(sessionMock));
  
      component.submit();
      expect(sessionApiService.create).toBeCalledWith(sessionMock);
      expect(router.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should call a MatSnackBar after creating session', ()=>{
      jest.spyOn(sessionApiService, "create").mockReturnValue(of(sessionMock));
      jest.spyOn(matSnackBar, "open");

      component.submit();
      expect(matSnackBar.open).toBeCalledWith('Session created !', 'Close', { duration: 3000 });
    });

    it('should call a MatSnackBar when submit if onUpdate is true', () => {
      component.onUpdate = true;
      jest.spyOn(sessionApiService, "update").mockReturnValue(of(sessionMock));
      jest.spyOn(matSnackBar, "open");

      component.submit();
      expect(matSnackBar.open).toBeCalledWith('Session updated !', 'Close', { duration: 3000 });
    });

    it('should have the save button disabled while the session form is not valid', ()=>{
      const saveButton = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
      name.setValue("");
      fixture.detectChanges();
      expect(saveButton.disabled).toBe(true);
    });

    it('should have the save button enabled if the session form is valid', ()=>{
      const saveButton = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
      fixture.detectChanges();
      expect(saveButton.disabled).toBe(false);
    });
  });
});

