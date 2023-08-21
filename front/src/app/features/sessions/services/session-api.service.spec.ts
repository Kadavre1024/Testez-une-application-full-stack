import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';
import { now } from 'cypress/types/lodash';

describe('SessionsService', () => {
  let service: SessionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(SessionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('SessionApiService Unit tests', () => {
  let service: SessionApiService;
  let httpClientSpy: any;
  let url: string;
  let id: string;
  let res: string;
  let sessionMock: Session;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(), 
      delete: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
    }
    service = new SessionApiService(httpClientSpy);
    res = "api/session";
    id = "1";
    url = res + "/" + id;
    sessionMock = {
      id: 1,
      name: "test",
      description: "test session",
      date: new Date(),
      teacher_id: 1,
      users: [1],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should test get all funct', () => {
    jest.spyOn(httpClientSpy, "get").mockReturnValue(res);
    service.all();
    expect(httpClientSpy.get).toBeCalledWith(res);
  });
  
  it('should test get detail funct by id', () => {
    jest.spyOn(httpClientSpy, "get").mockReturnValue(res);
    service.detail(id);
    expect(httpClientSpy.get).toBeCalledWith(url);
  });

  it('should test delete funct by id', () => {
    jest.spyOn(httpClientSpy, "delete").mockReturnValue(res);
    service.delete(id);
    expect(httpClientSpy.delete).toBeCalledWith(url);
  });

  it('should test create funct', () => {
    jest.spyOn(httpClientSpy, "post").mockReturnValue(res);
    service.create(sessionMock);
    expect(httpClientSpy.post).toBeCalledWith(res, sessionMock);
  });

  it('should test update funct by id and session', () => {
    jest.spyOn(httpClientSpy, "put").mockReturnValue(res);
    service.update(id, sessionMock);
    expect(httpClientSpy.put).toBeCalledWith(url, sessionMock);
  });

  it('should test participate funct by id and userId', () => {
    jest.spyOn(httpClientSpy, "post").mockReturnValue(res);
    service.participate(id, id);
    expect(httpClientSpy.post).toBeCalledWith(url+"/participate/"+id, null);
  });

  it('should test unparticipate funct by id and userId', () => {
    jest.spyOn(httpClientSpy, "delete").mockReturnValue(res);
    service.unParticipate(id, id);
    expect(httpClientSpy.delete).toBeCalledWith(url+"/participate/"+id);
  });
});

