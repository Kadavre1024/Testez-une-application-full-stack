import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { Component } from '@angular/core';

describe('SessionService', () => {
  let service: SessionService;
  let user: SessionInformation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
    user = {
        token: "test",
        type: "test",
        admin: true,
        username: "testname",
        firstName: "testfirst",
        lastName: "testlast",
        id: 1
      }
  });

  afterEach(() => {
  });

  it('should logged in a user', () => {
    service.logIn(user);
    expect(service.sessionInformation).toEqual(user);
    expect(service.isLogged).toEqual(true);
  });

  it('should logged out', () => {
    service.isLogged = true;
    service.sessionInformation = user;
    service.logOut();
    expect(service.sessionInformation).toEqual(undefined);
    expect(service.isLogged).toEqual(false);
  });
});