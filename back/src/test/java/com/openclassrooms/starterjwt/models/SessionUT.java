package com.openclassrooms.starterjwt.models;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class SessionUT {

	Session session;
	
	User user1, user2;
	
	List<User> users;
	
	Teacher teacher;
	
	@BeforeEach
	public void init() { 
		session = new Session(); 
		
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
		
		teacher = new Teacher();
		teacher.setId((long) 1);
		teacher.setFirstName("Hamm");
		teacher.setLastName("Abra");
		teacher.setCreatedAt(LocalDateTime.now());
		teacher.setUpdatedAt(LocalDateTime.now());
		}
	
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

		session.setTeacher(teacher);
		assertThat(session.getTeacher()).isEqualTo(teacher);
	}
	
	@Test
	public void userGetterSet_shouldGetAndSet_users() {		
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
	
	@Test
	public void constructor_shouldBuild_newSession() {
		LocalDateTime date = LocalDateTime.now();
		Date date1 = new Date();
		Session test = new Session((long) 1, "Test", date1, "test", teacher, users, date, date);
		
		assertThat(test.getId()).isEqualTo((long) 1);
		assertThat(test.getName()).isEqualTo("Test");
		assertThat(test.getDate()).isEqualTo(date1);
		assertThat(test.getDescription()).isEqualTo("test");
		assertThat(test.getTeacher()).isEqualTo(teacher);
		assertThat(test.getUsers()).isEqualTo(users);
		assertThat(test.getCreatedAt()).isEqualTo(date);
		assertThat(test.getUpdatedAt()).isEqualTo(date);
	}
	
	@Test
	public void builder_shouldBuild_newSession() {
		LocalDateTime date = LocalDateTime.now();
		Date date1 = new Date();
		Session test = Session
							.builder()
							.id((long) 1)
							.name("Test")
							.date(date1)
							.description("test")
							.teacher(teacher)
							.users(users)
							.createdAt(date)
							.updatedAt(date)
							.build();
		
		assertThat(test.getId()).isEqualTo((long) 1);
		assertThat(test.getName()).isEqualTo("Test");
		assertThat(test.getDate()).isEqualTo(date1);
		assertThat(test.getDescription()).isEqualTo("test");
		assertThat(test.getTeacher()).isEqualTo(teacher);
		assertThat(test.getUsers()).isEqualTo(users);
		assertThat(test.getCreatedAt()).isEqualTo(date);
		assertThat(test.getUpdatedAt()).isEqualTo(date);
	}
	
	@Test
	public void equals_shouldReturnTrue_forEquality() {
		LocalDateTime date = LocalDateTime.now();
		Date date1 = new Date();
		Session test1 = new Session((long) 1, "Test", date1, "test", teacher, users, date, date);
		Session test2 = new Session((long) 1, "Test", date1, "test", teacher, users, date, date);
		
		assertTrue(test1.equals(test2));		
	}
	
	@Test
	public void equals_shouldReturnFalse_forDifferencies() {
		LocalDateTime date = LocalDateTime.now();
		Date date1 = new Date();
		Session test1 = new Session((long) 1, "Test", date1, "test", teacher, users, date, date);
		Session test2 = new Session((long) 2, "Test", date1, "test", teacher, users, date, date);
		
		assertFalse(test1.equals(test2));		
	}
	
	@Test
	public void canequals_shouldReturnTrue_forSimilar() {
		LocalDateTime date = LocalDateTime.now();
		Date date1 = new Date();
		Session test1 = new Session((long) 1, "Test", date1, "test", teacher, users, date, date);
		Session test2 = new Session((long) 2, "Test", date1, "test", teacher, users, date, date);
		
		assertTrue(test1.canEqual(test2));		
	}
	
	@Test
	public void canequals_shouldReturnFalse_forDifferentTypes() {
		LocalDateTime date = LocalDateTime.now();
		Date date1 = new Date();
		Teacher test2 = new Teacher((long) 1, "Test", "test", date, date);
		Session test1 = new Session((long) 1, "Test", date1, "test", teacher, users, date, date);
		
		assertFalse(test1.canEqual(test2));		
	}
}
