import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { Component } from '@angular/core';

describe('SessionService', () => {
  let service: SessionService;
  let a: boolean | undefined;
  let user: SessionInformation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  afterEach(() => {
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should given a subject with a false value', () => {
    service.$isLogged().subscribe((x) => a=x)
    expect(a).toEqual(false);
  });

  it('should logged in', () => {
    service.logIn(user);
    service.$isLogged().subscribe((x) => a=x)
    expect(a).toEqual(true);
  });

  it('should logged out', () => {
    expect(a).toEqual(true);
    service.logOut();
    service.$isLogged().subscribe((x) => a=x)
    expect(a).toEqual(false);
  });
});
