package com.openclassrooms.starterjwt.models;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.Date;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class UserTest {

	User user;
	
	@BeforeEach
	public void init() { user = new User(); }
	
	@AfterEach
	public void destroy() { user = null; }
	
	@Test
	public void emailGetterSet_shouldGetAndSet_email() {
		user.setEmail("email@email.com");
		assertThat(user.getEmail()).isEqualTo("email@email.com");
	}
	
	@Test
	public void firstNameGetterSet_shouldGetAndSet_firstName() {
		user.setFirstName("Abra");
		assertThat(user.getFirstName()).isEqualTo("Abra");
	}
	
	@Test
	public void lastNameGetterSet_shouldGetAndSet_lastName() {
		user.setLastName("Racourcix");
		assertThat(user.getLastName()).isEqualTo("Racourcix");
	}
	
	@Test
	public void passwordGetterSet_shouldGetAndSet_password() {
		user.setPassword("PotIonM@giK");
		assertThat(user.getPassword()).isEqualTo("PotIonM@giK");
	}
	
	@Test
	public void adminGetterSet_shouldGetAndSet_admin() {
		user.setAdmin(true);
		assertTrue(user.isAdmin());
	}
	
	@Test
	public void createdAtGetterSet_shouldGetAndSet_createdAt() {
		LocalDateTime date = LocalDateTime.now();
		user.setCreatedAt(date);
		assertThat(user.getCreatedAt()).isEqualTo(date);
	}
	
	@Test
	public void updatedAtGetterSet_shouldGetAndSet_updatedAt() {
		LocalDateTime date = LocalDateTime.now();
		user.setUpdatedAt(date);
		assertThat(user.getUpdatedAt()).isEqualTo(date);
	}
	
	@Test
	public void constructor_shouldBuild_newUser() {
		LocalDateTime date = LocalDateTime.now();
		User test = new User((long) 1, "email@email.com", "Test", "test", "test!1234", true, date, date);
		
		assertThat(test.getId()).isEqualTo((long) 1);
		assertThat(test.getEmail()).isEqualTo("email@email.com");
		assertThat(test.getFirstName()).isEqualTo("test");
		assertThat(test.getLastName()).isEqualTo("Test");
		assertThat(test.getPassword()).isEqualTo("test!1234");
		assertTrue(test.isAdmin());
		assertThat(test.getCreatedAt()).isEqualTo(date);
		assertThat(test.getUpdatedAt()).isEqualTo(date);
		
	}
}
