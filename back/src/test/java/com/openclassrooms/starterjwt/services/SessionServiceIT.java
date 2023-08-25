package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

@SpringBootTest
public class SessionServiceIT {

	@Autowired
	UserRepository userRepo;
	
	@Autowired
	SessionRepository sessionRepo;
	
	@Autowired
	TeacherRepository teacherRepo;
	
	SessionService sessionService;
	
	Session session;
	User user;
	Teacher teacher;
	List<Session> sessions;
	List<User> users;
	
	Date date;
	Long id = (long) 0;
	
	@BeforeEach
	public void init() {
		users = new ArrayList<>();
		teacher = teacherRepo.findAll().stream().filter(x -> (x.getFirstName().equals("test888") && x.getLastName().equals("Test999"))).findFirst().orElse(null);
		if(teacher == null) {
			teacher = new Teacher(null, "Test999", "test888", null, null);
			teacherRepo.save(teacher);
			teacher = teacherRepo.findAll().stream().filter(x -> (x.getFirstName().equals("test888") && x.getLastName().equals("Test999"))).findFirst().orElse(null);
		}
		
		user = userRepo.findByEmail("email1234@email.com").orElse(null);
		if(user == null) {
			user = new User(null, "email1234@email.com", "Test", "test", "test!1234", true, null, null);
			userRepo.save(user);
			user = userRepo.findByEmail("email1234@email.com").orElse(null);
		}
		
		if(sessionRepo.findAll().stream().filter(x -> (x.getDescription().equals("test") && x.getName().equals("Test"))).findFirst().orElse(null) == null) {
			date = new Date();
			session = new Session(null, "Test", date, "test", teacher, users, null, null);
			sessionRepo.save(session);
		}
		
		sessionService = new SessionService(sessionRepo, userRepo);
		users.clear();
		session = sessionRepo.findAll().stream().filter(x -> (x.getDescription().equals("test") && x.getName().equals("Test"))).findFirst().orElse(null);
		assertThat(session).isNotNull();
		id = session.getId();
	}
	
	@AfterEach
	public void destroy() {
		date = null;
		sessions = null;
		sessions = sessionRepo.findAll().stream().filter(x -> (x.getDescription().equals("test") && x.getName().equals("Test"))).collect(Collectors.toList());
		sessionRepo.deleteAll(sessions);
		sessionService = null;
		id = null;
		
		if(teacherRepo.existsById(teacher.getId())) {
			teacherRepo.delete(teacher);
		}
		if(userRepo.existsById(user.getId())) {
			userRepo.delete(user);
		}
		session = null;
		users.clear();
	}
	
	@Test
	public void create_shouldReturnSession_whenCreated() {
		Session sessionTest = new Session(null, "123", date, "456", teacher, users, null, null);
		assertThat(sessionTest).isNotNull();
		Session result = sessionService.create(sessionTest);
		assertThat(result.getDate()).isEqualTo(sessionTest.getDate());
		assertThat(result.getName()).isEqualTo(sessionTest.getName());
		sessionRepo.delete(result);
	}
	
	@Test
	public void delete_shouldDelete_sessionById() {
		assertTrue(sessionRepo.existsById(id));
		sessionService.delete(id);
		assertFalse(sessionRepo.existsById(id));
	}
	
	@Test
	public void findAll_shouldReturnSessionList() {
		sessions = sessionService.findAll();
		assertThat(sessions).isNotEmpty();
	}
	
	@Test
	public void getById_shouldReturnSession_whenIdExist() {
		Session result = sessionService.getById(id);
		assertThat(result).isEqualTo(session);
	}
	
	@Test
	public void getById_shouldReturnNull_whenIdDoesNotExist() {
		Session result = sessionService.getById(id+(long)1);
		assertThat(result).isEqualTo(null);
	}
	
	@Test
	public void update_shouldReturnSession_whenUpdated() {
		Session result = sessionService.update(id, new Session(null, "123", date, "456", teacher, users, null, null));
		assertThat(result.getName()).isEqualTo("123");
		assertThat(result.getDescription()).isEqualTo("456");
		assertThat(result.getId()).isEqualTo(id);
		sessionRepo.delete(result);
	}
	
	@Test
	public void participate_shouldAddUserToUsersSession_whenIdIsNotInList() {
		users.clear();
		session.setUsers(users);
		sessionRepo.save(session);
		sessionService.participate(id, user.getId());
		users.add(user);
		assertThrows(BadRequestException.class,
				() ->{sessionService.participate(id, user.getId());});
		assertThat(session.getUsers()).isEqualTo(users);
	}
	
	@Test
	public void participate_shouldThrowsNotFound_whenIdDoesNotExist() {
		assertThrows(NotFoundException.class,
				() ->{sessionService.participate(id, user.getId()+(long)1);});
	}
	
	@Test
	public void participate_shouldThrowsBadRequest_whenUserAlreadyParticipate() {
		users.add(user);
		session.setUsers(users);
		sessionRepo.save(session);
		assertThrows(BadRequestException.class,
				() ->{sessionService.participate(id, user.getId());});
	}
	
	@Test
	public void noLongerParticipate_shouldSubUserToUsers_whenIdIsNotInList() {
		users.add(user);
		session.setUsers(users);
		sessionRepo.save(session);
		sessionService.noLongerParticipate(id, user.getId());
		
		assertThat(session.getUsers()).isEqualTo(users);
	}
	
	@Test
	public void noLongerParticipate_shouldThrowsNotFound_whenSessionDoesNotExist() {
		users.add(user);
		session.setUsers(users);
		sessionRepo.save(session);
		assertThrows(NotFoundException.class,
				() ->{sessionService.noLongerParticipate(id+(long)1, user.getId());});
	}
	
	@Test
	public void noLongerParticipate_shouldThrowsBadRequest_whenUserAlreadyNotParticipate() {
		
		assertThrows(BadRequestException.class,
				() ->{sessionService.noLongerParticipate(id, user.getId());});
	}
}
