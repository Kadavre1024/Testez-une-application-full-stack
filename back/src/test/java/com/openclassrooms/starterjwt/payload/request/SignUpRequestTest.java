package com.openclassrooms.starterjwt.payload.request;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class SignUpRequestTest {

	SignupRequest signup;
	
	@BeforeEach
	public void init() { signup = new SignupRequest(); }
	
	@AfterEach
	public void destroy() { signup = null; }
	
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
}
