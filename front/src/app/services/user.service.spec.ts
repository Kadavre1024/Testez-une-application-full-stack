import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpClientSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
});

describe('UserService Unit tests', () => {
  let service: UserService;
  let httpClientSpy: any;
  let url: string;
  let id: string;
  let res: string;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      delete: jest.fn() 
    }
    service = new UserService(httpClientSpy);
    res = "api/user";
    id = "1";
    url = res + "/" + id;
  });

  it('should test get funct', () => {
    jest.spyOn(httpClientSpy, "get").mockReturnValue(res);
    service.getById(id);
    expect(httpClientSpy.get).toBeCalledWith(url);
  });
  
  it('should test delete funct', () => {
    jest.spyOn(httpClientSpy, "delete").mockReturnValue(res);
    service.delete(id);
    expect(httpClientSpy.delete).toBeCalledWith(url);
  });
});
