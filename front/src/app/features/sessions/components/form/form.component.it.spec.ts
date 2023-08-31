import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
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
import { MatOption, MatOptionModule } from "@angular/material/core";



describe('FormComponent Integration test suites', () => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;
    let router: Router;
    let mockSessionService: any;
    let httpClientSessionApiMock: any;
    let matSnackBar: MatSnackBar;
    let nameForm: HTMLInputElement;
    let dateForm: HTMLInputElement;
    let teacher_idForm: HTMLSelectElement;
    let descriptionForm: HTMLTextAreaElement;
    let sessionMock: any;
    let saveButton: any;
    
    let httpClientTeacherMock: any;
  
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

      sessionMock = {
        name: "test",
        description: "test session",
        date: "2017-06-01",
        teacher_id: 1
      };

      mockSessionService = {
        sessionInformation: {
          admin: true
        }
      } 

      httpClientTeacherMock = {
        get: jest.fn(()=>{
          return of(teachers)
        })
      }

      httpClientSessionApiMock = {
        get: jest.fn(()=>{
          return of(sessionMock)
        }),
        post: jest.fn(),
        put: jest.fn()
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
          MatOptionModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: SessionService, useValue: mockSessionService },
          { provide: TeacherService, useValue: new TeacherService(httpClientTeacherMock) },
          { provide: SessionApiService, useValue: new SessionApiService(httpClientSessionApiMock)},
        ],
        declarations: [FormComponent]
      })
        .compileComponents();
      matSnackBar = TestBed.inject(MatSnackBar);
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
  
    it('should navigate to sessions path when not admin session', () => {
        jest.spyOn(router, "navigate");
        mockSessionService.sessionInformation.admin = false;
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
      });

    it('should submit a valid form then open a MatSnackBar and call router.navigate with "sessions"', async() => {
  
      fixture.detectChanges();
      nameForm.value = sessionMock.name;
      nameForm.dispatchEvent(new Event('input'));
      dateForm.value = sessionMock.date;
      dateForm.dispatchEvent(new Event('input'));
      teacher_idForm.click();
      fixture.detectChanges();

      const options: MatOption[] = component.matSelect.options.toArray();
      expect(options.length).toBe(2);
      options[0]._selectViaInteraction();
      fixture.detectChanges();
      expect(options[0].selected).toBe(true);
      expect(teacher_idForm.textContent).toBe("Hamm Abra");

      descriptionForm.value = sessionMock.description;
      descriptionForm.dispatchEvent(new Event('input'));
      jest.spyOn(httpClientSessionApiMock, "post").mockReturnValue(of(sessionMock))
      jest.spyOn(router, "navigate");
      jest.spyOn(matSnackBar, "open");
      fixture.detectChanges();

      expect(nameForm.value).toBe(sessionMock.name);
      expect(nameForm.checkValidity()).toBe(true);
      expect(dateForm.value).toBe(sessionMock.date);
      expect(dateForm.checkValidity()).toBe(true);
      expect(descriptionForm.value).toBe(sessionMock.description);
      expect(descriptionForm.checkValidity()).toBe(true);
  
      expect(component.sessionForm!.invalid).toBe(false);
      expect(saveButton.disabled).toBe(false);
  
      saveButton.click();
      
      fixture.detectChanges();
      expect(matSnackBar.open).toBeCalledWith('Session created !', 'Close', { duration: 3000 })
      expect(router.navigate).toBeCalledWith(['sessions']);      
    });
  });