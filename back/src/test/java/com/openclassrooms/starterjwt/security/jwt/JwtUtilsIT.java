package com.openclassrooms.starterjwt.security.jwt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;

@Transactional
@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class JwtUtilsIT {

	@Mock
	Authentication auth;
	
	@Autowired
	UserRepository userRepo;
	
	User user;
	UserDetailsImpl userDetails;
	String jwt;
	String expiredJwt;
	
	@Autowired
	JwtUtils jwtUtils;
	
	@BeforeEach
	public void init() {
		user = userRepo.getById((long)1);
		
		userDetails = UserDetailsImpl
		        .builder()
		        .id(user.getId())
		        .username(user.getEmail())
		        .lastName(user.getLastName())
		        .firstName(user.getFirstName())
		        .password(user.getPassword())
		        .build();
		
		
	}
	
	@AfterEach
	public void destroy() {
		user = null;
		userDetails = null;
	}
	
	@Test
	public void generateToken_shouldReturnToken_forAuthenticateUser() {
		when(auth.getPrincipal()).thenReturn(userDetails);
		
		String result = jwtUtils.generateJwtToken(auth);
		
		verify(auth).getPrincipal();
		assertThat(result).contains("eyJhbGciOiJIUzUxMiJ9");
	}
	
	@Test
	public void getUserNameFromJwtToken_shouldReturnEmail_forAuthenticateUser() {
		when(auth.getPrincipal()).thenReturn(userDetails);
		jwt = jwtUtils.generateJwtToken(auth);
		String result = jwtUtils.getUserNameFromJwtToken(jwt);
		
		assertThat(result).isEqualTo(user.getEmail());
	}
	
	@Test
	public void validateJwtToken_shouldReturnTrue_forValidToken() {
		when(auth.getPrincipal()).thenReturn(userDetails);
		jwt = jwtUtils.generateJwtToken(auth);
		
		boolean result = jwtUtils.validateJwtToken(jwt);
		
		assertTrue(result);
	}
	
	@Test
	public void validateJwtToken_shouldThrowsMalFormedJwtException_forInvalidToken() {
		String jwtTest = "This is not a Jwt";
	
		boolean result = jwtUtils.validateJwtToken(jwtTest);
		
		assertFalse(result);
	}
	
	@Test
	public void validateJwtToken_shouldThrowsSignatureException_forInvalidToken() {
		String jwtTest = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5b2dhQHN0dWRpby5jb20iLCJpYXQiOjE2OTI5MTE4MDAsImV4cCI6MTY5MjkxMTkwMH0.IFxMy5-JQ4O7nRLl0pSk28lNQBacll5n1YcQZvhUAUg";
	
		boolean result = jwtUtils.validateJwtToken(jwtTest);
		
		assertFalse(result);
	}
	
	@Test
	public void validateJwtToken_shouldThrowsExpiredJwtException_forInvalidToken() {
		String jwtTest = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5b2dhQHN0dWRpby5jb20iLCJpYXQiOjE2OTI2MTAyNjcsImV4cCI6MTY5MjY5NjY2N30.UMgN1cg5yoChXQZEEyI-f_w_oP4GpMT-bjo5CfFe3uD1WFQfS2cFnqDfwtdxZ_YYcAJemhpxDG5NZJkW1MoeSQ";
	
		boolean result = jwtUtils.validateJwtToken(jwtTest);
		
		assertFalse(result);
	}
	
}
