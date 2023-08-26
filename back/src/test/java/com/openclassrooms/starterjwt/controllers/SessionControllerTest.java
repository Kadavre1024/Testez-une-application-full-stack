package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.SessionService;

@ExtendWith(MockitoExtension.class)
public class SessionControllerTest {
	
	@Mock
	SessionMapper sessionMapper;
	
	@Mock
	SessionService sessionService;
	
	Teacher teacher1;
	
	User user1, user2;
	List<User> users;
	List<Long> users_id;
	
	Session session1, session2;
	List<Session> sessions;
	SessionDto sessionDto1, sessionDto2;
	List<SessionDto> sessionsDto;
	
	SessionController controller;
	
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
		
		users_id = new ArrayList<>();
		
		users_id.add(user1.getId());
		users_id.add(user2.getId());
		
		sessionsDto = new ArrayList<>();
		
		sessionDto1 = new SessionDto();
		sessionDto1.setId((long) 1);
		sessionDto1.setName("Relax");
		sessionDto1.setDate(new Date());
		sessionDto1.setTeacher_id(teacher1.getId());
		sessionDto1.setDescription("To be or not to be");
		sessionDto1.setUsers(users_id);
		sessionDto1.setCreatedAt(LocalDateTime.now());
		sessionDto1.setUpdatedAt(LocalDateTime.now());
		
		sessionDto2 = new SessionDto();
		sessionDto2.setId((long) 1);
		sessionDto2.setName("Relax");
		sessionDto2.setDate(new Date());
		sessionDto2.setTeacher_id(teacher1.getId());
		sessionDto2.setDescription("To be or not to be");
		sessionDto2.setUsers(users_id);
		sessionDto2.setCreatedAt(LocalDateTime.now());
		sessionDto2.setUpdatedAt(LocalDateTime.now());
		
		sessionsDto.add(sessionDto1);
		sessionsDto.add(sessionDto2);
		
		controller = new SessionController(sessionService, sessionMapper);
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
		
		controller = null;
	}
	
	@Test
	public void getFindById_shouldReturnSessionDto() {
		when(sessionService.getById((long) 1)).thenReturn(session1);
		when(sessionMapper.toDto(session1)).thenReturn(sessionDto1);
		
		ResponseEntity<?> result = controller.findById("1");
		
		verify(sessionService).getById((long) 1);
		verify(sessionMapper).toDto(session1);
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		assertThat(result.getBody()).isEqualTo(sessionDto1);
	}
	
	@Test
	public void getFindById_shouldReturnNotFoundError_whenSessionNotFound() {

		ResponseEntity<?> result = controller.findById("1");
		
		assertThat(result.getStatusCodeValue()).isEqualTo(404);
	}
	
	@Test
	public void getFindById_shouldReturnBadRequestError_whenNumberFormatException() {
		when(sessionService.getById((long) 1)).thenThrow(new NumberFormatException());
	
		ResponseEntity<?> result = controller.findById("1");
		
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
	
	@Test
	public void getFindAll_shouldReturnSessionDtoList() {
		when(sessionService.findAll()).thenReturn(sessions);
		when(sessionMapper.toDto(sessions)).thenReturn(sessionsDto);
		
		ResponseEntity<?> result = controller.findAll();
		
		verify(sessionService).findAll();
		verify(sessionMapper).toDto(sessions);
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		assertThat(result.getBody()).isEqualTo(sessionsDto);
	}
	
	@Test
	public void postCreate_shouldReturnSessionDto() {
		when(sessionMapper.toEntity(sessionDto1)).thenReturn(session1);
		when(sessionService.create(session1)).thenReturn(session1);
		when(sessionMapper.toDto(session1)).thenReturn(sessionDto1);
		
		ResponseEntity<?> result = controller.create(sessionDto1);
		
		verify(sessionMapper).toEntity(sessionDto1);
		verify(sessionService).create(session1);
		verify(sessionMapper).toDto(session1);
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		assertThat(result.getBody()).isEqualTo(sessionDto1);
	}
	
	@Test
	public void putUpdate_shouldReturnSessionDto() {
		when(sessionMapper.toEntity(sessionDto1)).thenReturn(session1);
		when(sessionService.update((long) 1, session1)).thenReturn(session1);
		when(sessionMapper.toDto(session1)).thenReturn(sessionDto1);
		
		ResponseEntity<?> result = controller.update("1", sessionDto1);
		
		verify(sessionMapper).toEntity(sessionDto1);
		verify(sessionService).update((long) 1,session1);
		verify(sessionMapper).toDto(session1);
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		assertThat(result.getBody()).isEqualTo(sessionDto1);
	}
	
	@Test
	public void putUpdate_shouldReturnBadRequestError_whenNumberFormatException() {
		when(sessionMapper.toEntity(sessionDto1)).thenReturn(session1);
		when(sessionService.update((long) 1, session1)).thenThrow(new NumberFormatException());
		
		ResponseEntity<?> result = controller.update("1", sessionDto1);
		
		verify(sessionMapper).toEntity(sessionDto1);
		verify(sessionService).update((long) 1,session1);
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
	
	@Test
	public void deleteSave_shouldReturnRequest200() {
		when(sessionService.getById((long) 1)).thenReturn(session1);
		
		ResponseEntity<?> result = controller.save("1");
		
		verify(sessionService).getById((long) 1);
		verify(sessionService).delete((long) 1);
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
	}
	
	@Test
	public void deleteSave_shouldReturnNotFoundErro_whenSessionIsUnkwnown() {
		
		ResponseEntity<?> result = controller.save("1");
		
		assertThat(result.getStatusCodeValue()).isEqualTo(404);
	}
	
	@Test
	public void deleteSave_shouldReturnBadRequestError_whenNumberFormatException() {
		when(sessionService.getById((long) 1)).thenThrow(new NumberFormatException());
		
		ResponseEntity<?> result = controller.save("1");
		
		verify(sessionService).getById((long) 1);
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
	
	@Test
	public void postParticipate_shouldReturnRequest200() {
		
		ResponseEntity<?> result = controller.participate("1", "1");
		
		verify(sessionService).participate((long) 1, (long) 1);
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
	}
	
	@Test
	public void postParticipate_shouldReturnBadRequestError_whenNumberFormatException() {
		doThrow(new NumberFormatException()).when(sessionService).participate((long) 1, (long) 1);
		
		ResponseEntity<?> result = controller.participate("1", "1");
		
		verify(sessionService).participate((long) 1, (long) 1);
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
	
	@Test
	public void deleteNoLongerParticipate_shouldReturnRequest200() {
		
		ResponseEntity<?> result = controller.noLongerParticipate("1", "1");
		
		verify(sessionService).noLongerParticipate((long) 1, (long) 1);
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
	}
	
	@Test
	public void deleteNoLongerParticipate_shouldReturnBadRequestError_whenNumberFormatException() {
		doThrow(new NumberFormatException()).when(sessionService).noLongerParticipate((long) 1, (long) 1);
		
		ResponseEntity<?> result = controller.noLongerParticipate("1", "1");
		
		verify(sessionService).noLongerParticipate((long) 1, (long) 1);
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}

}
