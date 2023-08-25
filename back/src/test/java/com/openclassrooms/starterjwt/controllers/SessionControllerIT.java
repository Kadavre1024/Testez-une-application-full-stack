package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.services.UserService;

@SpringBootTest
public class SessionControllerIT {

	@Autowired
	SessionMapper sessionMapper;
	
	@Autowired
	SessionService sessionService;
	
	@Autowired
	SessionController controller;
	
	@Autowired
	TeacherRepository teacherRepo;
	
	@Autowired
	UserService userService;
	
	Session session;
	SessionDto sessionDto1, sessionDtoTested;
	Teacher teacher;
	User user;
	Long sessionId;
	List<User> users;
	
	@BeforeEach
	public void init() {
		teacher = new Teacher();
		teacher = teacherRepo.getById((long)1);
		
		user = new User();
		user = userService.findById((long)1);
		users = new ArrayList<>();
		users.add(user);
		
		session = new Session();
		sessionDtoTested = new SessionDto();
		sessionDto1 = new SessionDto();
		sessionDto1.setId(null);
		sessionDto1.setName("Relax");
		sessionDto1.setDate(new Date());
		sessionDto1.setTeacher_id(teacher.getId());
		sessionDto1.setDescription("To be or not to be");
		sessionDto1.setUsers(new ArrayList<>());
		sessionDto1.setCreatedAt(null);
		sessionDto1.setUpdatedAt(null);
		
		session = sessionService.create(sessionMapper.toEntity(sessionDto1));
		sessionId = session.getId();
	}
	
	@AfterEach
	public void destroy() {
		teacher = null;
		sessionDto1 = null;
		if(sessionService.getById(sessionId) != null) {
			sessionService.delete(session.getId());
		}
		sessionId = null;
		user = null;
		users = null;
		
	}
	
	@Test
	public void postCreate_shouldReturnOkWithSessionCreated_forGoodSessionDtoRequest() {
		
		ResponseEntity<?>  result = controller.create(sessionDto1);
		
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		sessionDtoTested = (SessionDto) result.getBody();
		assertThat(sessionDtoTested.getId()).isNotNull();
		sessionService.delete(sessionDtoTested.getId());
	}
	
	@Test
	public void putUpdate_shouldReturnOkWithSessionUpdated_forExistingSessionId() {
		sessionDto1.setName("No Stress");
		
		ResponseEntity<?>  result = controller.update(sessionId.toString(), sessionDto1);
		
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		assertThat(((SessionDto) result.getBody()).getName()).isNotEqualTo("Relax");
		assertThat(((SessionDto) result.getBody()).getName()).isEqualTo("No Stress");
	}
	
	@Test
	public void putUpdate_shouldReturnBadRequest_forNotNumberSessionId() {
		sessionDto1.setName("No Stress");
		
		ResponseEntity<?>  result = controller.update("abcd", sessionDto1);
		
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
	
	@Test
	public void postParticipate_shouldReturnOk_forExistingSessionIdAndUserId() {
		
		ResponseEntity<?>  result = controller.participate(sessionId.toString(), "1");
		
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
	}
	
	@Test
	public void postParticipate_shouldReturnBadRequest_forNotNumberUserIdOrSessionId() {
		
		ResponseEntity<?>  result = controller.participate("abcd", "1");
		
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
	
	@Test
	public void postNoLongerParticipate_shouldReturnOk_forExistingSessionIdAndUserId() {
		Session test = sessionService.getById(sessionId);
		test.setUsers(users);
		sessionService.update(sessionId, test);
		ResponseEntity<?>  result = controller.noLongerParticipate(sessionId.toString(), "1");
		
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
	}
	
	@Test
	public void postNoLongerParticipate_shouldReturnBadRequest_forNotNumberUserIdOrSessionId() {
		
		ResponseEntity<?>  result = controller.noLongerParticipate("def", "abcd");
		
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
	
	@Test
	public void deleteSave_shouldReturnOk_forExistingSessionId() {
		Session test = sessionService.getById(sessionId);
		assertThat(test).isNotNull();
		ResponseEntity<?>  result = controller.save(sessionId.toString());
		
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
	}
	
	@Test
	public void deleteSave_shouldReturnBadRequest_forNotNumberSessionId() {
		
		ResponseEntity<?>  result = controller.save("def");
		
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
}
