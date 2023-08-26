package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;

@Transactional
@SpringBootTest
public class UserControllerIT {

	@Autowired
	UserMapper userMapper;
	
	@Autowired
	UserService userService;
	
	@Autowired
	UserRepository userRepo;
	
	@Autowired
	AuthenticationManager authenticationManager;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	User user;
	UserDto userDto;
	
	@Autowired
	UserController controller;
	
	@BeforeEach
	public void init() {
		user = userRepo.findByEmail("email12345@email.com").orElse(null);
		if(user == null) {
			user = new User(null, "email12345@email.com", "Test", "test", passwordEncoder.encode("test!1234"), true, null, null);
			userRepo.save(user);
			user = userRepo.findByEmail("email12345@email.com").orElse(null);
		}
		
		userDto = userMapper.toDto(user);
	}
	
	@AfterEach
	public void destroy() {
		if(userRepo.existsById(user.getId())) {
			userRepo.delete(user);
		}
		user = null;
	}
	
	@Test
	public void getFindById_shouldReturnUserDto_forExistingUserId() {
		
		ResponseEntity<?> result = controller.findById(user.getId().toString());
		
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		assertThat((UserDto)result.getBody()).isEqualTo(userDto);
	}
	
	@Test
	public void getFindById_shouldReturnNotFound_forUnknownUserId() {
		Long id = user.getId()+(long)1;
		ResponseEntity<?> result = controller.findById(id.toString());
		
		assertThat(result.getStatusCodeValue()).isEqualTo(404);
	}
	
	@Test
	public void getFindById_shouldReturnBadRequest_forNotNumberUserId() {
		ResponseEntity<?> result = controller.findById("ab_cd");
		
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
	
	@Test
	public void deleteSave_shouldReturnNotFound_whenDeletingByUnknownUserId() {
		Long id = user.getId()+(long)1;
		ResponseEntity<?> result = controller.save(id.toString());
		
		assertThat(result.getStatusCodeValue()).isEqualTo(404);
	}
	
	@Test
	public void deleteSave_shouldReturnBadRequest_forNotNumberUserId() {
		ResponseEntity<?> result = controller.save("ab_cd");
		
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
}
