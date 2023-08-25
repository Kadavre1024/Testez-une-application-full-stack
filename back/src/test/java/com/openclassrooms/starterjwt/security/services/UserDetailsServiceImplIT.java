package com.openclassrooms.starterjwt.security.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@Transactional
@SpringBootTest
public class UserDetailsServiceImplIT {

	@Autowired
	UserRepository userRepo;
	
	UserDetailsServiceImpl service;
	
	UserDetailsImpl userDetails;
	User user;
	
	@BeforeEach
	public void init() {
		user = userRepo.getById((long)1);
		service = new UserDetailsServiceImpl(userRepo);
	}
	
	@Test
	public void loadUserByUsername_shouldReturnUserDetails_whenUserEmailSet() {
		
		userDetails =(UserDetailsImpl) service.loadUserByUsername(user.getEmail());
		assertThat(userDetails.getId()).isEqualTo(user.getId());
		assertThat(userDetails.getUsername()).isEqualTo(user.getEmail());
		assertThat(userDetails.getFirstName()).isEqualTo(user.getFirstName());
		assertThat(userDetails.getLastName()).isEqualTo(user.getLastName());
		assertThat(userDetails.getPassword()).isEqualTo(user.getPassword());
	}
	
	@Test
	public void loadUserByUsername_shouldThrowsUsernameNotFound_whenUserEmailIsUnknown() {
		
		assertThrows(UsernameNotFoundException.class, () -> {
			userDetails =(UserDetailsImpl) service.loadUserByUsername("titi@22.com");
		});
	}
}
