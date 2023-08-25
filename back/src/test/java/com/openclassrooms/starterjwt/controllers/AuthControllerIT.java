package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;

@Transactional
@SpringBootTest
@ExtendWith(SpringExtension.class)
public class AuthControllerIT {

	@Autowired
	AuthenticationManager authenticationManager;
    
	@Autowired
	JwtUtils jwtUtils;
    
	@Autowired
	PasswordEncoder passwordEncoder;
    
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	AuthController controller;
	LoginRequest loginRequest;
	SignupRequest signupRequest;
	
	@BeforeEach
	public void init() {
		loginRequest = new LoginRequest();
		loginRequest.setEmail("yoga@studio.com");
		loginRequest.setPassword("test!1234");
		
		signupRequest = new SignupRequest();
		signupRequest.setEmail("titi@email.com");
		signupRequest.setFirstName("titi");
		signupRequest.setLastName("Grosminet");
		signupRequest.setPassword("Maaaanngeeeer");
	}
	
	@AfterEach
	public void destroy() {
		loginRequest = null;
		if(userRepository.existsByEmail("titi@email.com")) {
			User user = userRepository.findByEmail("titi@email.com").orElse(null);
			userRepository.delete(user);
		}
	}
	
	@Test
	public void postAuthenticateUser_shouldLoginUser_withHisCredentials() {
		ResponseEntity<?> result = controller.authenticateUser(loginRequest);
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
	}
	
	@Test
	public void postAuthenticateUser_shouldLoginUser_withBadCredentials() {
		LoginRequest loginRequestTest = new LoginRequest();
		loginRequestTest.setEmail("yoga@studio.com");
		loginRequestTest.setPassword("102435");
		assertThrows(BadCredentialsException.class, () -> {
			controller.authenticateUser(loginRequestTest);
		});
	}
	
	@Test
	public void postRegisterUser_shouldReturn200_whenCredentialsAreUnknown() {
		ResponseEntity<?> result = controller.registerUser(signupRequest);
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		assertThat(((MessageResponse) result.getBody()).getMessage()).isEqualTo("User registered successfully!");
		User user = userRepository.findByEmail("titi@email.com").orElse(null);
		assertThat(user.getPassword()).isNotEqualTo("Maaaanngeeeer");
	}
	
	@Test
	public void postRegisterUser_shouldReturn400_whenCredentialsAreAlreadyUsed() {
		User user = userRepository.getById((long)1);
		signupRequest.setEmail(user.getEmail());
		ResponseEntity<?> result = controller.registerUser(signupRequest);
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
		assertThat(((MessageResponse) result.getBody()).getMessage()).isEqualTo("Error: Email is already taken!");
	}
}
