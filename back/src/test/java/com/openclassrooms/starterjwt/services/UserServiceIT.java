package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@SpringBootTest
public class UserServiceIT {

	@Autowired
	UserRepository userRepo;
	
	User user;
	LocalDateTime date;
	UserService userService;
	Long id;
	
	@BeforeEach
	public void init() {
		
		userService = new UserService(userRepo);
		
		user = new User(null, "email1234@email.com", "Test", "test", "test!1234", true, null, null);
		userRepo.save(user);
		user = userRepo.findByEmail("email1234@email.com").orElse(null);
		id = user.getId();
	}
	
	@AfterEach
	public void destroy() {
		
		if(userRepo.existsById(id)) {
			userRepo.deleteById(id);
		}
		
		user = null;
		id = null;
		
		userService = null;
	}
	
	@Test
	public void findById_shouldReturnUserTest() {
		User userTest = userService.findById(id);
		assertTrue(userTest.equals(user));
	}
	
	@Test
	public void delete_shouldDeleteUserTest() {
		userService.delete(id);
		assertFalse(userRepo.existsById(id));
	}
	
}
