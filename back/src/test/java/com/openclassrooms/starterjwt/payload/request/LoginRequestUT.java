package com.openclassrooms.starterjwt.payload.request;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class LoginRequestUT {

	LoginRequest login;
	
	@BeforeEach
	public void init() { login = new LoginRequest(); }
	
	@AfterEach
	public void destroy() { login = null; }
	
	@Test
	public void emailGetterSet_shouldGetAndSet_email() {
		login.setEmail("email@email.com");
		assertThat(login.getEmail()).isEqualTo("email@email.com");
	}
	
	@Test
	public void passwordGetterSet_shouldGetAndSet_password() {
		login.setPassword("PotIonM@giK");
		assertThat(login.getPassword()).isEqualTo("PotIonM@giK");
	}
	
	
}
