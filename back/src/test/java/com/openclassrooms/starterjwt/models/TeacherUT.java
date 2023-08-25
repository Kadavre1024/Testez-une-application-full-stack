package com.openclassrooms.starterjwt.models;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TeacherUT {

	Teacher teacher;
	
	@BeforeEach
	public void init() { teacher = new Teacher(); }
	
	@AfterEach
	public void destroy() { teacher = null; }
	
	@Test
	public void firstNameGetterSet_shouldGetAndSet_firstName() {
		teacher.setFirstName("Abra");
		assertThat(teacher.getFirstName()).isEqualTo("Abra");
	}
	
	@Test
	public void lastNameGetterSet_shouldGetAndSet_lastName() {
		teacher.setLastName("Racourcix");
		assertThat(teacher.getLastName()).isEqualTo("Racourcix");
	}

	@Test
	public void createdAtGetterSet_shouldGetAndSet_createdAt() {
		LocalDateTime date = LocalDateTime.now();
		teacher.setCreatedAt(date);
		assertThat(teacher.getCreatedAt()).isEqualTo(date);
	}
	
	@Test
	public void updatedAtGetterSet_shouldGetAndSet_updatedAt() {
		LocalDateTime date = LocalDateTime.now();
		teacher.setUpdatedAt(date);
		assertThat(teacher.getUpdatedAt()).isEqualTo(date);
	}
	
	@Test
	public void constructor_shouldBuild_newTeacher() {
		LocalDateTime date = LocalDateTime.now();
		Teacher test = new Teacher((long) 1, "Test", "test", date, date);
		
		assertThat(test.getId()).isEqualTo((long) 1);
		assertThat(test.getFirstName()).isEqualTo("test");
		assertThat(test.getLastName()).isEqualTo("Test");
		assertThat(test.getCreatedAt()).isEqualTo(date);
		assertThat(test.getUpdatedAt()).isEqualTo(date);
		
	}
	
	@Test
	public void builder_shouldBuild_newTeacher() {
		LocalDateTime date = LocalDateTime.now();
		Teacher test = Teacher
							.builder()
							.id((long) 1)
							.firstName("test")
							.lastName("Test")
							.createdAt(date)
							.updatedAt(date)
							.build();
		
		assertThat(test.getId()).isEqualTo((long) 1);
		assertThat(test.getFirstName()).isEqualTo("test");
		assertThat(test.getLastName()).isEqualTo("Test");
		assertThat(test.getCreatedAt()).isEqualTo(date);
		assertThat(test.getUpdatedAt()).isEqualTo(date);
		
	}
	
	@Test
	public void equals_shouldReturnTrue_forEquality() {
		LocalDateTime date = LocalDateTime.now();
		Teacher test1 = new Teacher((long) 1, "Test", "test", date, date);
		Teacher test2 = new Teacher((long) 1, "Test", "test", date, date);
		
		assertTrue(test1.equals(test2));		
	}
	
	@Test
	public void equals_shouldReturnFalse_forDifferencies() {
		LocalDateTime date = LocalDateTime.now();
		Teacher test1 = new Teacher((long) 1, "Test", "test", date, date);
		Teacher test2 = new Teacher((long) 2, "Test", "test", date, date);
		
		assertFalse(test1.equals(test2));		
	}
	
	@Test
	public void canequals_shouldReturnTrue_forSimilar() {
		LocalDateTime date = LocalDateTime.now();
		Teacher test1 = new Teacher((long) 1, "Test", "test", date, date);
		Teacher test2 = new Teacher((long) 2, "Test", "test", date, date);
		
		assertTrue(test1.canEqual(test2));		
	}
	
	@Test
	public void canequals_shouldReturnFalse_forDifferentTypes() {
		LocalDateTime date = LocalDateTime.now();
		Teacher test1 = new Teacher((long) 1, "Test", "test", date, date);
		User test2 = new User((long) 1, "email@email.com", "Test", "test", "test!1234", true, date, date);
		
		assertFalse(test1.canEqual(test2));		
	}
}
