package com.openclassrooms.starterjwt.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class SessionMapperTest{
	
	Session session;
	SessionDto sessionDto1, sessionDto2;
	
	@Mock
	TeacherService teacherService;
	
	@Mock
	UserService userService;
	
	private ArrayList<User> users;
	private User user1, user2;
	private Teacher teacher1;
	private ArrayList<Session> sessions;
	private Session session1,session2;
	
	ArrayList<SessionDto> sessionsDto;
	
	@Autowired
	SessionMapper sessionMapper;
	
	@BeforeEach
	public void init() { 
		
		users = new ArrayList<>();
		
		user1 = new User();
		user1.setId((long) 1);
		user1.setFirstName("Hamm");
		user1.setLastName("Abra");
		user1.setEmail("email@email.com");
		user1.setPassword("123456");
		user1.setAdmin(true);
		user1.setCreatedAt(LocalDateTime.now());
		user1.setUpdatedAt(LocalDateTime.now());
		
		user2 = new User();
		user2.setId((long) 2);
		user2.setFirstName("Cadabra");
		user2.setLastName("Abra");
		user2.setEmail("email2@email.com");
		user2.setPassword("123456");
		user2.setAdmin(true);
		user2.setCreatedAt(LocalDateTime.now());
		user2.setUpdatedAt(LocalDateTime.now());
		
		users.add(user1);
		users.add(user2);
		
		teacher1 = new Teacher();
		teacher1.setId((long) 1);
		teacher1.setFirstName("Hamm");
		teacher1.setLastName("Abra");
		teacher1.setCreatedAt(LocalDateTime.now());
		teacher1.setUpdatedAt(LocalDateTime.now());
		
		sessions = new ArrayList<>();
		
		session1 = new Session();
		session1.setId((long) 1);
		session1.setName("Relax");
		session1.setDate(new Date());
		session1.setTeacher(teacher1);
		session1.setDescription("To be or not to be");
		session1.setUsers(users);
		session1.setCreatedAt(LocalDateTime.now());
		session1.setUpdatedAt(LocalDateTime.now());
		
		session2 = new Session();
		session2.setId((long) 1);
		session2.setName("Relax");
		session2.setDate(new Date());
		session2.setTeacher(teacher1);
		session2.setDescription("To be or not to be");
		session2.setUsers(users);
		session2.setCreatedAt(LocalDateTime.now());
		session2.setUpdatedAt(LocalDateTime.now());
		
		sessions.add(session1);
		sessions.add(session2);
		
		sessionsDto = new ArrayList<>();
		
		sessionDto1 = new SessionDto();
		sessionDto1.setId((long) 1);
		sessionDto1.setName("Relax");
		sessionDto1.setDate(new Date());
		sessionDto1.setTeacher_id(teacher1.getId());
		sessionDto1.setDescription("To be or not to be");
		//sessionDto1.setUsers(users);
		sessionDto1.setCreatedAt(LocalDateTime.now());
		sessionDto1.setUpdatedAt(LocalDateTime.now());
		
		sessionDto2 = new SessionDto();
		sessionDto2.setId((long) 1);
		sessionDto2.setName("Relax");
		sessionDto2.setDate(new Date());
		sessionDto2.setTeacher_id(teacher1.getId());
		sessionDto2.setDescription("To be or not to be");
		//sessionDto2.setUsers(users);
		sessionDto2.setCreatedAt(LocalDateTime.now());
		sessionDto2.setUpdatedAt(LocalDateTime.now());
		
		sessionsDto.add(sessionDto1);
		sessionsDto.add(sessionDto2);
	}
	
	@AfterEach
	public void destroy() { session = null; }
	
	@Test
	public void toDto_shouldMapSession_toSessionDto() {
		SessionDto result = sessionMapper.toDto(session1);
		assertThat(result.getName()).isEqualTo(session1.getName());
	}
	
	@Test
	public void toEntity_shouldMapSessionDto_toSession() {
		Session result = sessionMapper.toEntity(sessionDto1);
		assertThat(result.getName()).isEqualTo(sessionDto1.getName());
	}
	
	@Test
	public void listToDto_shouldMapSessionList_toSessionDtoList() {
		List<SessionDto> result = sessionMapper.toDto(sessions);
		assertThat(result.stream().findFirst().orElse(null).getName()).isEqualTo(session1.getName());
	}
	
	@Test
	public void listToEntity_shouldMapSessionDtoList_toSessionList() {
		List<Session> result = sessionMapper.toEntity(sessionsDto);
		assertThat(result.stream().findFirst().orElse(null).getName()).isEqualTo(sessionDto1.getName());
	}
	
	@Test
	public void toDto_shouldNull_toSessionDtoNull() {
		Session sessionNull = null;
		SessionDto result = sessionMapper.toDto(sessionNull);
		assertThat(result).isNull();
	}
	
	@Test
	public void toEntity_shouldNull_toSessionNull() {
		SessionDto sessionDtoNull = null;
		Session result = sessionMapper.toEntity(sessionDtoNull);
		assertThat(result).isNull();
	}
	
	@Test
	public void listToDto_shouldNull_toSessionDtoListNull() {
		List<Session> listNull = null;
		List<SessionDto> result = sessionMapper.toDto(listNull);
		assertThat(result).isNullOrEmpty();
	}
	
	@Test
	public void listToEntity_shouldNull_toSessionListNull() {
		List<SessionDto> listNull = null;
		List<Session> result = sessionMapper.toEntity(listNull);
		assertThat(result).isNullOrEmpty();
	}
}
