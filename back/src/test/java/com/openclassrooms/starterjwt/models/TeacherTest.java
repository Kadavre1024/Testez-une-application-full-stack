package com.openclassrooms.starterjwt.models;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TeacherTest {

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
}
