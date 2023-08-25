package com.openclassrooms.starterjwt.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;

@SpringBootTest
public class UserMapperUT {

	@Autowired
	UserMapper mapper;
	
	User user1, user2;
	
	UserDto userDto1, userDto2;
	
	List<User> users;
	List<UserDto> usersDto;
	
	@BeforeEach
	public void init() {
		users = new ArrayList<>();
		
		user1 = new User((long) 1, "email1234@email.com", "Test", "test", "test!1234", true, LocalDateTime.now(), LocalDateTime.now());
		user2 = new User((long) 2, "email2@email.com", "Abra", "Cadabra", "123456", true,LocalDateTime.now(), LocalDateTime.now());
				
		users.add(user1);
		users.add(user2);
		
		usersDto = new ArrayList<>();
		
		userDto1 = new UserDto();
		userDto1.setId((long) 1);
		userDto1.setFirstName("test");
		userDto1.setLastName("Test");
		userDto1.setEmail("email1234@email.com");
		userDto1.setPassword("test!1234");
		userDto1.setAdmin(true);
		userDto1.setCreatedAt(LocalDateTime.now());
		userDto1.setUpdatedAt(LocalDateTime.now());
		
		userDto2 = new UserDto();
		userDto2.setId((long) 2);
		userDto2.setFirstName("Cadabra");
		userDto2.setLastName("Abra");
		userDto2.setEmail("email2@email.com");
		userDto2.setPassword("123456");
		userDto2.setAdmin(true);
		userDto2.setCreatedAt(LocalDateTime.now());
		userDto2.setUpdatedAt(LocalDateTime.now());
		
		usersDto.add(userDto1);
		usersDto.add(userDto2);
	}
	
	@Test
	public void toDto_shouldMapUser_toUserDto() {
		UserDto result = mapper.toDto(user1);
		assertThat(result.getEmail()).isEqualTo(user1.getEmail());
	}
	
	@Test
	public void toEntity_shouldMapUserDto_toUser() {
		User result = mapper.toEntity(userDto1);
		assertThat(result.getEmail()).isEqualTo(userDto1.getEmail());
	}
	
	@Test
	public void listToDto_shouldMapUserList_toUserDtoList() {
		List<UserDto> result = mapper.toDto(users);
		assertThat(result.stream().findFirst().orElse(null).getEmail()).isEqualTo(user1.getEmail());
	}
	
	@Test
	public void listToEntity_shouldMapUserDtoList_toUserList() {
		List<User> result = mapper.toEntity(usersDto);
		assertThat(result.stream().findFirst().orElse(null).getEmail()).isEqualTo(userDto1.getEmail());
	}
	
	@Test
	public void toDto_shouldNull_toUserDtoNull() {
		User userNull = null;
		UserDto result = mapper.toDto(userNull);
		assertThat(result).isNull();
	}
	
	@Test
	public void toEntity_shouldNull_toUserNull() {
		UserDto userDtoNull = null;
		User result = mapper.toEntity(userDtoNull);
		assertThat(result).isNull();
	}
	
	@Test
	public void listToDto_shouldNull_toUserDtoListNull() {
		List<User> listNull = null;
		List<UserDto> result = mapper.toDto(listNull);
		assertThat(result).isNullOrEmpty();
	}
	
	@Test
	public void listToEntity_shouldNull_toUserListNull() {
		List<UserDto> listNull = null;
		List<User> result = mapper.toEntity(listNull);
		assertThat(result).isNullOrEmpty();
	}
}
