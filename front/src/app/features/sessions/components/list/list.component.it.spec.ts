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
  let httpClientMock: any;

  
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

    httpClientMock= {
      get: jest.fn()
    }
    
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [RouterTestingModule, HttpClientModule, MatCardModule, MatIconModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: new SessionApiService(httpClientMock) },
      ]
    })
      .compileComponents();
    jest.spyOn(httpClientMock, "get").mockReturnValue(of(sessionListMock));
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display 3 sessions after http.getAll call', () => {
    const sessionList = fixture.debugElement.nativeElement.querySelectorAll('mat-card.item');
    expect(sessionList.length).toBe(3);
  });

});
