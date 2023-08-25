package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

@ExtendWith(MockitoExtension.class)
public class AuthControllerUT {
	
	@Mock
	AuthenticationManager authManager;
	
	@Mock
	JwtUtils jwtUtils;
	
	@Mock
	PasswordEncoder passwordEncoder;
	
	@Mock
	UserRepository userRepo;
	
	@Mock
	Authentication auth;
	
	LoginRequest loginRequest;
	SignupRequest signupRequest;
	User user;
	UserDetailsImpl userDetailsImpl;
	JwtResponse jwtResp;
	
	AuthController controller;
	
	@BeforeEach
	public void init() {
		loginRequest = new LoginRequest();
		loginRequest.setEmail("email@email.com");
		loginRequest.setPassword("123456");
		
		signupRequest = new SignupRequest();
		signupRequest.setEmail("email@email.com");
		signupRequest.setFirstName("toto");
		signupRequest.setLastName("tata");
		signupRequest.setPassword("123456");
		
		user = new User(signupRequest.getEmail(),
                signupRequest.getLastName(),
                signupRequest.getFirstName(),
                "987654",
                true);
		
		controller = new AuthController(authManager, passwordEncoder, jwtUtils, userRepo); 
	}
	
	@AfterEach
	public void destroy() {
		user = null;
		signupRequest = null;
	}
	
	@Test
	public void postAuthenticateUser_shouldReturnHttpResponse200() {
		userDetailsImpl = UserDetailsImpl
		        .builder()
		        .id(user.getId())
		        .username(user.getEmail())
		        .lastName(user.getLastName())
		        .firstName(user.getFirstName())
		        .password(user.getPassword())
		        .build();
		JwtResponse jwtResp = new JwtResponse("123456789",
				userDetailsImpl.getId(),
				userDetailsImpl.getUsername(),
				userDetailsImpl.getFirstName(),
				userDetailsImpl.getLastName(),
				true);
		
		when(jwtUtils.generateJwtToken(auth)).thenReturn("123456789");
		when(authManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()))).thenReturn(auth);
		when(auth.getPrincipal()).thenReturn(userDetailsImpl);

	    SecurityContext securityContext = mock(SecurityContext.class);
		when(userRepo.findByEmail(loginRequest.getEmail())).thenReturn(Optional.ofNullable(user));
		
		ResponseEntity<?> result = controller.authenticateUser(loginRequest);
		
		verify(userRepo).findByEmail(loginRequest.getEmail());
		verify(auth).getPrincipal();
		verify(jwtUtils).generateJwtToken(auth);
		verify(authManager).authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		assertThat(((JwtResponse) result.getBody()).getToken()).isEqualTo(jwtResp.getToken());
		assertThat(((JwtResponse) result.getBody()).getAdmin()).isEqualTo(jwtResp.getAdmin());
		assertThat(((JwtResponse) result.getBody()).getId()).isEqualTo(jwtResp.getId());
		assertThat(((JwtResponse) result.getBody()).getUsername()).isEqualTo(jwtResp.getUsername());
		assertThat(((JwtResponse) result.getBody()).getFirstName()).isEqualTo(jwtResp.getFirstName());
		assertThat(((JwtResponse) result.getBody()).getLastName()).isEqualTo(jwtResp.getLastName());
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
