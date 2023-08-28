import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { expect } from '@jest/globals';
import { Teacher } from "src/app/interfaces/teacher.interface";
import { SessionService } from "src/app/services/session.service";
import { TeacherService } from "src/app/services/teacher.service";
import { SessionApiService } from "../../services/session-api.service";
import { FormComponent } from "./form.component";

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
  
    /**it('should submit a valid form then open a MatSnackBar and call router.navigate with "sessions"', fakeAsync(() => {
  
      component.teachers$ = of(teachers);
      fixture.detectChanges();
      nameForm.focus();
      nameForm.value = sessionMock.name;
      nameForm.dispatchEvent(new Event('input'));
      dateForm.value = sessionMock.date;
      dateForm.dispatchEvent(new Event('input'));
      teacher_idForm.click();
      tick(1000);
      fixture.detectChanges();
         
      const matOption = fixture.debugElement.query(By.css('.cdk-overlay-container .mat-select-panel .mat-option-text')).nativeElement;
      expect(matOption.textContent).toBe(" Hamm Abra ");
      matOption.click();
      tick(1000);
      fixture.detectChanges();
      expect(teacher_idForm.textContent).toBe("Hamm Abra");
      teacher_idForm.dispatchEvent(new Event('select'));
      fixture.detectChanges();

      descriptionForm.value = sessionMock.description;
      descriptionForm.dispatchEvent(new Event('input'));
  
      jest.spyOn(router, "navigate");
      jest.spyOn(matSnackBar, "open");
      fixture.detectChanges();
      expect(nameForm.value).toBe(sessionMock.name);
      expect(nameForm.checkValidity()).toBe(true);
      expect(dateForm.value).toBe(sessionMock.date);
      expect(dateForm.checkValidity()).toBe(true);
      expect(teacher_idForm.value).toBe(sessionMock.teacher_id);
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
    }));**/
  });
  
  
  