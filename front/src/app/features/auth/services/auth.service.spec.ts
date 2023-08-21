import { Session } from "../../sessions/interfaces/session.interface";
import { expect } from '@jest/globals';
import { AuthService } from "./auth.service";
import { LoginRequest } from "../interfaces/loginRequest.interface";
import { RegisterRequest } from "../interfaces/registerRequest.interface";

describe('AuthService Unit tests', () => {
    let service: AuthService;
    let httpClientSpy: any;
    let url: string;
    let loginRequestMock: LoginRequest;
    let registerRequestMock: RegisterRequest;
  
    beforeEach(() => {
      httpClientSpy = {
        post: jest.fn(),
      }
      service = new AuthService(httpClientSpy);
      url = "api/auth/";
      loginRequestMock = {
        email: "test@email.com",
        password: "test!31",
      };
      registerRequestMock = {
        email: "test@email.com",
        firstName: "test",
        lastName: "Test",
        password: "test!31"
      }
    });
  
    it('should test register funct', () => {
      jest.spyOn(httpClientSpy, "post").mockReturnValue(url);
      service.register(registerRequestMock);
      expect(httpClientSpy.post).toBeCalledWith(url+"register", registerRequestMock);
    });
    
    it('should test login funct', () => {
      jest.spyOn(httpClientSpy, "post").mockReturnValue(url);
      service.login(loginRequestMock);
      expect(httpClientSpy.post).toBeCalledWith(url+"login", loginRequestMock);
    });
  });