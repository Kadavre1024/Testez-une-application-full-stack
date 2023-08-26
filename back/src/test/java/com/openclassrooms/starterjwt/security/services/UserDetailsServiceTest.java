package com.openclassrooms.starterjwt.security.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceTest {

	@Mock
	UserRepository userRepo;
	
	UserDetailsImpl userDetailsImpl;
	User user;
	UsernameNotFoundException exeption;
	
	UserDetailsService userDetailsService;
	
	@BeforeEach
	public void init() {
		userDetailsService = new UserDetailsServiceImpl(userRepo);
		
		user = new User();
		user.setId((long) 1);
		user.setEmail("email@email.com");
		user.setLastName("Test");
		user.setFirstName("test");
		user.setPassword("123456");
		user.setAdmin(true);
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());
		
		userDetailsImpl = UserDetailsImpl
						        .builder()
						        .id(user.getId())
						        .username(user.getEmail())
						        .lastName(user.getLastName())
						        .firstName(user.getFirstName())
						        .password(user.getPassword())
						        .build();
		
		exeption = new UsernameNotFoundException("User Not Found with email: " + user.getEmail());
	}
	
	@AfterEach
	public void destroy() {
		userDetailsService = null;
		user = null;
		userDetailsImpl = null;
		exeption = null;
	}
	
	@Test
	public void loadUserByUsername_shouldUseUserRepository_forLoadUserDetailsByEmail() {
		//Given
		when(userRepo.findByEmail(user.getEmail())).thenReturn(Optional.ofNullable(user));
		
		//When
		UserDetails result = userDetailsService.loadUserByUsername(user.getEmail());
		
		//Then
		verify(userRepo).findByEmail(user.getEmail());
		assertThat(result).isEqualTo(userDetailsImpl);
	}
	
	@Test
	public void loadUserByUsername_shouldThrowAnError_whenEmailUnknown() {
		
		//When
		Exception exept = assertThrows(UsernameNotFoundException.class, ()->{userDetailsService.loadUserByUsername(user.getEmail());});
		
		//Then
		verify(userRepo).findByEmail(user.getEmail());
		assertThat(exept.getMessage()).contains(exeption.getMessage());
	}
	
}
