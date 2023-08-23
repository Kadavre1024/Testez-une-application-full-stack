package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;

@SpringBootTest
public class UserControllerTest {
	@Autowired
	UserMapper userMapper;
	
	@Autowired
	UserService userService;
	
	User user;
	UserDto userDto;
	
	UserController controller;
	
	@BeforeEach
	public void init() {
		
		
		
		user = new User();
		user.setId((long) 1);
		user.setEmail("email@email.com");
		user.setLastName("Test");
		user.setFirstName("test");
		user.setPassword("123456");
		user.setAdmin(true);
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());
		
		userDto = new UserDto();
		userDto.setId((long) 1);
		userDto.setEmail("email@email.com");
		userDto.setLastName("Test");
		userDto.setFirstName("test");
		userDto.setPassword("123456");
		userDto.setAdmin(true);
		userDto.setCreatedAt(LocalDateTime.now());
		userDto.setUpdatedAt(LocalDateTime.now());
		
		
	}
	
	@AfterEach
	public void destroy() {
		
	}
	
	@Test
	public void findById_shouldReturnUserDto() {
		//when(userService.findById((long)1)).thenReturn(user);
		controller = new UserController(userService, userMapper);
		
		ResponseEntity<?> result = controller.findById("1");
		
		verify(result.getStatusCode()).compareTo(HttpStatus.OK);
		assertThat(result.getBody()).isEqualTo(userDto);
	}

}
