package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.services.UserService;

//@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class UserControllerTest {
	
	@Mock
	UserMapper userMapper;
	
	@Mock
	UserService userService;
	
	User user;
	UserDto userDto;
	
	UserController controller;
	
	UserDetails userDetailsImpl;
	
	private void mockAuthentication() {
	    Authentication auth = mock(Authentication.class);

	    when(auth.getPrincipal()).thenReturn(buildLoggedInUser());

	    SecurityContext securityContext = mock(SecurityContext.class);
	    when(securityContext.getAuthentication()).thenReturn(auth);
	    SecurityContextHolder.setContext(securityContext);
	}
	
	@BeforeEach
	public void init() {
		
		controller = new UserController(userService, userMapper);
		
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
		
		userDetailsImpl = UserDetailsImpl
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
		
	}
	
	@Test
	public void getfindById_shouldReturnUserDto() {
		when(userService.findById((long)1)).thenReturn(user);
		when(userMapper.toDto(user)).thenReturn(userDto);
		
		
		ResponseEntity<?> result = controller.findById("1");
		
		verify(userService).findById((long)1);
		verify(userMapper).toDto(user);
		assertThat(result.getBody()).isEqualTo(userDto);
	}
	
	@Test
	public void getfindById_shouldReturnError_ifUserIsNotFound() {		
		ResponseEntity<?> result = controller.findById("1");
		
		verify(userService).findById((long)1);
		assertThat(result.getStatusCodeValue()).isEqualTo(404);
	}
	
	@Test
	public void getfindById_shouldReturnError_ifNumberFormatExeption() {
		when(userService.findById((long)1)).thenThrow(new NumberFormatException());
		
		
		ResponseEntity<?> result = controller.findById("1");
		
		verify(userService).findById((long)1);
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
	
	@Test
	public void deleteSave_shouldReturnError_ifNumberFormatExeption() {
		when(userService.findById((long)1)).thenThrow(new NumberFormatException());
		//when(mock(SecurityContextHolder).getContext().getAuthentication().getPrincipal()).thenReturn(userDetailsImpl);
		
		
		ResponseEntity<?> result = controller.save("1");
		
		verify(userService).findById((long)1);
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
	
	//@Disabled
	@Test
	@WithUserDetails(value="email@email.com", setupBefore=TestExecutionEvent.TEST_EXECUTION)
	public void deleteSave_shouldReturnError_ifUserDetailsNotEqualToUser() {
		when(userService.findById((long)1)).thenReturn(user);
		//when(mock(SecurityContextHolder).getContext().getAuthentication().getPrincipal()).thenReturn(userDetailsImpl);
		
		
		ResponseEntity<?> result = controller.save("1");
		
		verify(userService).findById((long)1);
		assertThat(result.getStatusCodeValue()).isEqualTo(401);
	}

}
