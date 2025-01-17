package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.services.UserService;


@ExtendWith(MockitoExtension.class)
public class UserControllerTest {
	
	@Mock
	UserMapper userMapper;
	
	@Mock
	UserService userService;
	
	@Mock
	Authentication auth;
	
	User user;
	UserDto userDto;
	
	UserController controller;
	
	UserDetails userDetailsImpl;
	
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
	public void deleteSave_shouldReturnHttpResponse200() {
		userDetailsImpl = UserDetailsImpl
		        .builder()
		        .id(user.getId())
		        .username(user.getEmail())
		        .lastName(user.getLastName())
		        .firstName(user.getFirstName())
		        .password(user.getPassword())
		        .build();
		
		when(userService.findById((long)1)).thenReturn(user);
		when(auth.getPrincipal()).thenReturn(userDetailsImpl);

	    SecurityContext securityContext = mock(SecurityContext.class);
	    when(securityContext.getAuthentication()).thenReturn(auth);
	    SecurityContextHolder.setContext(securityContext);		
		
		ResponseEntity<?> result = controller.save("1");
		
		verify(userService).findById((long)1);
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
	}
	
	@Test
	public void deleteSave_shouldReturnNotFound_ifUserUnknown() {
		ResponseEntity<?> result = controller.save("1");
		
		verify(userService).findById((long)1);
		assertThat(result.getStatusCodeValue()).isEqualTo(404);
	}
	
	
	@Test
	public void deleteSave_shouldReturnError_ifNumberFormatExeption() {
		when(userService.findById((long)1)).thenThrow(new NumberFormatException());		
		
		ResponseEntity<?> result = controller.save("1");
		
		verify(userService).findById((long)1);
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
	
	@Test
	public void deleteSave_shouldReturnError_ifUserDetailsNotEqualToUser() {
		userDetailsImpl = UserDetailsImpl
		        .builder()
		        .id(user.getId())
		        .username("test@email.com")
		        .lastName(user.getLastName())
		        .firstName(user.getFirstName())
		        .password(user.getPassword())
		        .build();
		
		when(userService.findById((long)1)).thenReturn(user);
		when(auth.getPrincipal()).thenReturn(userDetailsImpl);

	    SecurityContext securityContext = mock(SecurityContext.class);
	    when(securityContext.getAuthentication()).thenReturn(auth);
	    SecurityContextHolder.setContext(securityContext);		
		
		ResponseEntity<?> result = controller.save("1");
		
		verify(userService).findById((long)1);
		assertThat(result.getStatusCodeValue()).isEqualTo(401);
	}

}
