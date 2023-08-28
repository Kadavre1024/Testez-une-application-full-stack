import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { ListComponent } from './list.component';
import { Session } from '../../interfaces/session.interface';
import { of } from 'rxjs';
import { SessionApiService } from '../../services/session-api.service';
import { DatePipe } from '@angular/common';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionListMock: Session[];
  let router: Router;
  let location: Location;
  
  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }
  

  beforeEach(async () => {
    sessionListMock = [
      {
        id: 1,
        name: "Ali Baba",
        description: "best babouch customer",
        date: new Date(),
        teacher_id: 1,
        users: [1, 2, 3],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Ali Bibi",
        description: "best babouch customer",
        date: new Date(),
        teacher_id: 1,
        users: [1, 2],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: "Ali Bobo",
        description: "for emergency",
        date: new Date(),
        teacher_id: 1,
        users: [1, 3],
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];
    const mockSessionApiService = {
      all: jest.fn(()=>{
        return of(sessionListMock)
      })
    }
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [RouterTestingModule, HttpClientModule, MatCardModule, MatIconModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display create button when session admin', () => {
    const createBtn = fixture.debugElement.nativeElement.querySelector('span[class="ml1"]');
    expect(createBtn.textContent).toBe("Create");
  });

  it('should display 3 sessions', fakeAsync(() => {
    const sessionList = fixture.debugElement.nativeElement.querySelectorAll('mat-card.item');
    expect(sessionList.length).toBe(3);
  }));

  it('should display the correct session name on the first mat-card.item', () => {
    const matCardTitle = fixture.debugElement.nativeElement.querySelectorAll('mat-card-title')[1];
    expect(matCardTitle.textContent).toBe(sessionListMock[0].name);
  });

  it('should display the correct session date on the first mat-card.item', () => {
    const datePipe: DatePipe = new DatePipe('en-US');
    const matCardSubtitle = fixture.debugElement.nativeElement.querySelectorAll('mat-card-subtitle')[0];
    expect(matCardSubtitle.textContent).toBe(" Session on "+datePipe.transform(sessionListMock[0].date, "MMMM dd, YYYY")+" ");
  });

  it('should display the session description on the first mat-card.item', () => {
    const matCardContent = fixture.debugElement.nativeElement.querySelector('p');
    expect(matCardContent.textContent).toBe(" "+sessionListMock[0].description+" ");
  });

  it('should display the Detail button on the first mat-card.item', () => {
    const spanDetailBtn = fixture.debugElement.nativeElement.querySelectorAll('span.ml1')[1];
    expect(spanDetailBtn.textContent).toBe("Detail");
  });

});
