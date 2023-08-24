package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {
	
	@Mock
	AuthenticationManager authManager;
	
	@Mock
	JwtUtils jwtUtils;
	
	@Mock
	PasswordEncoder passwordEncoder;
	
	@Mock
	UserRepository userRepo;
	
	SignupRequest signupRequest;
	User user;
	
	AuthController controller;
	
	@BeforeEach
	public void init() {
		
		signupRequest = new SignupRequest();
		signupRequest.setEmail("email@email.com");
		signupRequest.setFirstName("toto");
		signupRequest.setLastName("tata");
		signupRequest.setPassword("123456");
		
		user = new User(signupRequest.getEmail(),
                signupRequest.getLastName(),
                signupRequest.getFirstName(),
                "987654",
                false);
		
		controller = new AuthController(authManager, passwordEncoder, jwtUtils, userRepo); 
	}
	
	@AfterEach
	public void destroy() {
		user = null;
		signupRequest = null;
	}
	
	@Test
	public void postRegisterUser_shouldReturnHttpResponse200() {
		when(userRepo.existsByEmail(signupRequest.getEmail())).thenReturn(false);
		when(passwordEncoder.encode(signupRequest.getPassword())).thenReturn("987654");
		
		ResponseEntity<?> result = controller.registerUser(signupRequest);
		
		verify(userRepo).existsByEmail(signupRequest.getEmail());
		verify(passwordEncoder).encode(signupRequest.getPassword());
		verify(userRepo).save(user);
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		assertThat(((MessageResponse) result.getBody()).getMessage()).isEqualTo("User registered successfully!");
	}
	
	@Test
	public void postRegisterUser_shouldReturnBadRequestError_whenEmailAlreadyExist() {
		when(userRepo.existsByEmail(signupRequest.getEmail())).thenReturn(true);
		
		ResponseEntity<?> result = controller.registerUser(signupRequest);
		
		verify(userRepo).existsByEmail(signupRequest.getEmail());
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
		assertThat(((MessageResponse) result.getBody()).getMessage()).isEqualTo("Error: Email is already taken!");
	}

}
