package com.openclassrooms.starterjwt.services;



import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
	
	@Mock
	UserRepository userRepo;
	
	User user;
	UserService userService;
	
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
		userService = new UserService(this.userRepo);
	}
	
	@AfterEach
	public void destroy() {
		user = null;
		userService = null;
	}
	
	@Test
	public void findById_shouldUseUserRepo_forFindUserById() {
		//Given
		when(userRepo.findById((long) 1)).thenReturn(Optional.ofNullable(user));
		
		//When
		final User result = userService.findById((long)1);
		
		//Then
		verify(userRepo).findById((long) 1);
		assertThat(result).isEqualTo(user);
	}
	
	@Test
	public void findByWrongId_shouldUseUserRepo_forFindUserById_AndReturnNull() {
		//Given
		
		//When
		final User result = userService.findById((long)2);
		
		//Then
		verify(userRepo).findById((long) 2);
		assertThat(result).isEqualTo(null);
	}
	
	@Test
	public void delete_shouldUseUserRepo_forDeleteUserById(){
		//Given
		
		//When
		userService.delete((long)1);
		
		//Then
		verify(userRepo).deleteById((long) 1);
	}

}
