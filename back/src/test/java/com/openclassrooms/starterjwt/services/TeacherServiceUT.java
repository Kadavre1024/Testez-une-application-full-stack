package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceUT {

	@Mock
	TeacherRepository teacherRepo;
	
	Teacher teacher1;
	Teacher teacher2;
	List<Teacher> teachers;
	TeacherService teacherService;
	
	@BeforeEach
	public void init() {
		teachers = new ArrayList<>();
		
		teacher1 = new Teacher();
		teacher1.setId((long) 1);
		teacher1.setFirstName("Hamm");
		teacher1.setLastName("Abra");
		teacher1.setCreatedAt(LocalDateTime.now());
		teacher1.setUpdatedAt(LocalDateTime.now());
		
		teacher2 = new Teacher();
		teacher2.setId((long) 2);
		teacher2.setFirstName("Cadabra");
		teacher2.setLastName("Abra");
		teacher2.setCreatedAt(LocalDateTime.now());
		teacher2.setUpdatedAt(LocalDateTime.now());
		
		teachers.add(teacher1);
		teachers.add(teacher2);
		
		teacherService = new TeacherService(teacherRepo);
	}
	
	@AfterEach
	public void destroy() {
		teacher1 = null;
		teacher2 = null;
		teachers = null;
		teacherService = null;
	}
	
	@Test
	public void findAll_shouldUseTeacherRepo_forFindAllTeachers() {
		//Given
		when(teacherRepo.findAll()).thenReturn(teachers);
		
		//When
		final List<Teacher> result = teacherService.findAll();
		
		//Then
		verify(teacherRepo).findAll();
		assertThat(result).isEqualTo(teachers);
	}
	
	@Test
	public void findById_shouldUseUserRepo_forFindUserById() {
		//Given
		when(teacherRepo.findById((long) 1)).thenReturn(Optional.ofNullable(teacher1));
		
		//When
		final Teacher result = teacherService.findById((long)1);
		
		//Then
		verify(teacherRepo).findById((long) 1);
		assertThat(result).isEqualTo(teacher1);
	}
	
}
