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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
    it('should have onUpdate param on false while submitting a create form', ()=>{
      component.submit();
      expect(component.onUpdate).toBeFalsy();
    });

    it('should call sessionApiService.create with sessionMock after submit creation', () => {
      jest.spyOn(sessionApiService, "create").mockReturnValue(of(sessionMock));
      
      component.submit();
      expect(sessionApiService.create).toBeCalledWith(sessionMock);
    });

    it('should navigate to sessions after submit a created session', () => {
      jest.spyOn(router, "navigate");
      jest.spyOn(sessionApiService, "create").mockReturnValue(of(sessionMock));
  
      component.submit();
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

describe('FormComponent Integration test suites', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let router: Router;
  let mockSessionService: any;
  let sessionApiService: SessionApiService;
  let matSnackBar: MatSnackBar;
  let teacherService: TeacherService;
  let overlayContainerElement: HTMLElement;
  let nameForm: HTMLInputElement;
  let dateForm: HTMLInputElement;
  let teacher_idForm: HTMLSelectElement;
  let descriptionForm: HTMLTextAreaElement;
  let sessionMock: any;
  let saveButton: any;
  
  let mockTeacherService: any;

  const teachers: Teacher[] = [
    {
      id: 1,
      lastName: "Abra",
      firstName: "Hamm",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      lastName: "Abra",
      firstName: "Cadabra",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: {
        admin: true
      }
    } 
    mockTeacherService = {
      all: jest.fn(()=>{
        return of(teachers)
      })
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
        SessionApiService,
        MatSnackBar,
        //{ provide: TeacherService, useValue: mockTeacherService },
      ],
      declarations: [FormComponent]
    })
      .compileComponents();
    //overlayContainerElement = TestBed.inject(OverlayContainer).getContainerElement();
    matSnackBar = TestBed.inject(MatSnackBar);
    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(()=>{
    nameForm = fixture.debugElement.nativeElement.querySelector('input[formControlName="name"]');
    dateForm = fixture.debugElement.nativeElement.querySelector('input[formControlName="date"]');
    teacher_idForm = fixture.debugElement.nativeElement.querySelector('mat-select[formControlName="teacher_id"]');
    descriptionForm = fixture.debugElement.nativeElement.querySelector('textarea[formControlName="description"]');

    saveButton = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');

    sessionMock = {
      name: "test",
      description: "test session",
      date: "2017-06-01",
      teacher_id: 1
    };
    
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save button be disabled without a valid form', () => {

    nameForm.value = sessionMock.name;
    nameForm.dispatchEvent(new Event('input'));
    dateForm.value = sessionMock.date;
    dateForm.dispatchEvent(new Event('input'));
    teacher_idForm.value = sessionMock.teacher_id;
    teacher_idForm.dispatchEvent(new Event('mat-select'));

    fixture.detectChanges();

    expect(component.sessionForm!.invalid).toBe(true);
    expect(saveButton.disabled).toBe(true);
  });

  it('should submit a valid form then open a MatSnackBar and call router.navigate with "sessions"', fakeAsync(() => {

    component.teachers$ = of(teachers);
    fixture.detectChanges();
    nameForm.focus();
    nameForm.value = sessionMock.name;
    nameForm.dispatchEvent(new Event('input'));
    dateForm.value = sessionMock.date;
    dateForm.dispatchEvent(new Event('input'));
    teacher_idForm.click();
    fixture.detectChanges();
    
    const matOption = fixture.debugElement.query(By.css('mat-option span[class=mat-option-text]')).nativeElement;
    expect(matOption.textContent).toBe(" Hamm Abra ");
    matOption.click();
    fixture.detectChanges();
    //const matSelect = fixture.debugElement.query(By.css('span[class="mat-select-min-line ng-tns-c160-10 ng-star-inserted"]')).nativeElement;
    //expect(matSelect.textContent).toBe("Hamm Abra");
    //expect(matOption.length).toBe(2);

    //matOption[1].click();
    //fixture.detectChanges();
    //teacher_idForm.value = sessionMock.teacher_id;
    //teacher_idForm.dispatchEvent(new Event('select'));
    descriptionForm.value = sessionMock.description;
    descriptionForm.dispatchEvent(new Event('input'));

    jest.spyOn(router, "navigate");
    jest.spyOn(matSnackBar, "open");
    fixture.detectChanges();
    expect(nameForm.value).toBe(sessionMock.name);
    expect(nameForm.checkValidity()).toBe(true);
    expect(dateForm.value).toBe(sessionMock.date);
    expect(dateForm.checkValidity()).toBe(true);
    //expect(teacher_idForm.value).toBe(sessionMock.teacher_id);
    expect(teacher_idForm.checkValidity()).toBe(true);
    expect(descriptionForm.value).toBe(sessionMock.description);
    expect(descriptionForm.checkValidity()).toBe(true);

    expect(component.sessionForm!.invalid).toBe(false);
    expect(saveButton.disabled).toBe(false);

    saveButton.click();
    
    fixture.detectChanges();
    expect(matSnackBar.open).toBeCalledWith('Session created !', 'Close', { duration: 3000 })
    tick(1000);
    fixture.detectChanges();

    const submitMessage = fixture.debugElement.nativeElement.querySelector("mat-snack-bar");

    expect(submitMessage).toBeTruthy();
    expect(submitMessage.message).toBe('Session created !');

    tick(4000);
    expect(submitMessage).not.toBeDefined();
    expect(router.navigate).toBeCalledWith(['sessions']);
  }));
});


