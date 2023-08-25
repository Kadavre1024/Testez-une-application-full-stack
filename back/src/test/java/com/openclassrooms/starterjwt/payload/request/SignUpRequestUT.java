package com.openclassrooms.starterjwt.payload.request;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;

public class SignUpRequestUT {

	SignupRequest signup, signupCompare;
	
	@BeforeEach
	public void init() { 
		signup = new SignupRequest(); 
		signup.setEmail("email@test.com");
		signup.setFirstName("toto");
		signup.setLastName("Tata");
		signup.setPassword("123456");
		
		signupCompare = signup;
	}
	
	@AfterEach
	public void destroy() { signup = signupCompare = null; }
	
	@Test
	public void emailGetterSet_shouldGetAndSet_email() {
		signup.setEmail("email@email.com");
		assertThat(signup.getEmail()).isEqualTo("email@email.com");
	}
	
	@Test
	public void firstNameGetterSet_shouldGetAndSet_firstName() {
		signup.setFirstName("Abra");
		assertThat(signup.getFirstName()).isEqualTo("Abra");
	}
	
	@Test
	public void lastNameGetterSet_shouldGetAndSet_lastName() {
		signup.setLastName("Racourcix");
		assertThat(signup.getLastName()).isEqualTo("Racourcix");
	}
	
	@Test
	public void passwordGetterSet_shouldGetAndSet_password() {
		signup.setPassword("PotIonM@giK");
		assertThat(signup.getPassword()).isEqualTo("PotIonM@giK");
	}
	
	@Test
	public void equals_shouldReturnTrue_forEquality() {		
		assertTrue(signup.equals(signupCompare));		
	}
	
	@Test
	public void equals_shouldReturnFalse_forDifferencies() {
		LocalDateTime date = LocalDateTime.now();
		Teacher test1 = new Teacher((long) 1, "Test", "test", date, date);
		
		assertFalse(signup.equals(test1));			
	}
	
	@Test
	public void canequals_shouldReturnTrue_forSimilar() {
		signupCompare.setEmail("go@go.com");
		
		assertTrue(signup.canEqual(signupCompare));	
	}
	
	@Test
	public void canequals_shouldReturnFalse_forDifferentTypes() {
		LocalDateTime date = LocalDateTime.now();
		Teacher test1 = new Teacher((long) 1, "Test", "test", date, date);
		
		assertFalse(signup.canEqual(test1));		
	}
}

