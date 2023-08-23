package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

	@Mock
	SessionRepository sessionRepo;
	
	@Mock
	UserRepository userRepo;
	
	Teacher teacher1;
	
	User user1, user2;
	List<User> users;
	
	Session session1, session2;
	List<Session> sessions;
	SessionService sessionService;
	
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
		user1.setPassword("123456");
		user1.setAdmin(true);
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
		
		sessionService = new SessionService(sessionRepo, userRepo);
	}
	
	@AfterEach
	public void destroy() {
		users = null;
		user1 = null;
		user2 = null;
		
		teacher1 = null;
		
		session1 = null;
		session2 = null;
		sessions = null;
		
		sessionService = null;
	}
	
	@Test
	public void create_shouldUseSessionRepository_forCreateASession() {
		//Given
		when(sessionRepo.save(session1)).thenReturn(session1);
		
		//When
		final Session result = sessionService.create(session1);
		
		//Then
		verify(sessionRepo).save(session1);
		assertThat(result).isEqualTo(session1);
	}
	
	@Test
	public void delete_shouldUseSessionRepository_forDeleteASessionById() {
		
		//When
		sessionService.delete((long) 1);
		
		//Then
		verify(sessionRepo).deleteById((long) 1);
	}
	
	@Test
	public void findAll_shouldUseSessionRepository_forFindAllSessions() {
		//Given
		when(sessionRepo.findAll()).thenReturn(sessions);
		
		//When
		final List<Session> result = sessionService.findAll();
		
		//Then
		verify(sessionRepo).findAll();
		assertThat(result).isEqualTo(sessions);
	}
	
	@Test
	public void getById_shouldUseSessionRepository_forGetASessionById() {
		//Given
		when(sessionRepo.findById((long) 1)).thenReturn(Optional.ofNullable(session1));
		
		//When
		final Session result = sessionService.getById((long) 1);
		
		//Then
		verify(sessionRepo).getById((long) 1);
		assertThat(result).isEqualTo(session1);
	}
	
	@Test
	public void update_shouldUseSessionRepository_forUpdateASessionByIdWithNewSessionParam() {
		//Given
		when(sessionRepo.save(session1)).thenReturn(session1);
		
		//When
		final Session result = sessionService.update((long) 1, session1);
		
		//Then
		verify(sessionRepo).save(session1);
		assertThat(result).isEqualTo(session1);
	}
	
	@Test
	public void particiate_shouldUseSessionRepository_forUpdateASessionByIdWithNewSessionParam() {
		//Given
		when(sessionRepo.save(session1)).thenReturn(session1);
		
		//When
		final Session result = sessionService.update((long) 1, session1);
		
		//Then
		verify(sessionRepo).save(session1);
		assertThat(result).isEqualTo(session1);
	}
}
