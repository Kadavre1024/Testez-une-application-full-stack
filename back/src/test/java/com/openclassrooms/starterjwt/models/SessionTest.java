package com.openclassrooms.starterjwt.models;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class SessionTest {

	Session session;
	
	@BeforeEach
	public void init() { session = new Session(); }
	
	@AfterEach
	public void destroy() { session = null; }
	
	@Test
	public void nameGetterSet_shouldGetAndSet_name() {
		session.setName("Relax");
		assertThat(session.getName()).isEqualTo("Relax");
	}
	
	@Test
	public void dateGetterSet_shouldGetAndSet_date() {
		Date date = new Date();
		session.setDate(date);
		assertThat(session.getDate()).isEqualTo(date);
	}
	
	@Test
	public void descriptionGetterSet_shouldGetAndSet_description() {
		session.setDescription("The place to be");
		assertThat(session.getDescription()).isEqualTo("The place to be");
	}
	
	@Test
	public void teacherGetterSet_shouldGetAndSet_teacher() {
		Teacher teacher = new Teacher();
		teacher.setId((long) 1);
		teacher.setFirstName("Hamm");
		teacher.setLastName("Abra");
		teacher.setCreatedAt(LocalDateTime.now());
		teacher.setUpdatedAt(LocalDateTime.now());
		
		session.setTeacher(teacher);
		assertThat(session.getTeacher()).isEqualTo(teacher);
	}
	
	@Test
	public void userGetterSet_shouldGetAndSet_users() {
		List<User> users = new ArrayList<>();
		
		User user1 = new User();
		user1.setId((long) 1);
		user1.setFirstName("Hamm");
		user1.setLastName("Abra");
		user1.setEmail("email@email.com");
		user1.setPassword("123456");
		user1.setAdmin(true);
		user1.setCreatedAt(LocalDateTime.now());
		user1.setUpdatedAt(LocalDateTime.now());
		
		User user2 = new User();
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
		
		session.setUsers(users);
		assertThat(session.getUsers()).isEqualTo(users);
	}
	
	@Test
	public void createdAtGetterSet_shouldGetAndSet_createdAt() {
		LocalDateTime date = LocalDateTime.now();
		session.setCreatedAt(date);
		assertThat(session.getCreatedAt()).isEqualTo(date);
	}
	
	@Test
	public void updatedAtGetterSet_shouldGetAndSet_updatedAt() {
		LocalDateTime date = LocalDateTime.now();
		session.setUpdatedAt(date);
		assertThat(session.getUpdatedAt()).isEqualTo(date);
	}
}
