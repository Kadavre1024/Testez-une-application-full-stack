import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(TeacherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('TeacherService Unit tests', () => {
  let service: TeacherService;
  let httpClientSpy: any;
  let url: string;
  let id: string;
  let res: string;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn() 
    }
    service = new TeacherService(httpClientSpy);
    res = "api/teacher";
    id = "1";
    url = res + "/" + id;
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
});
