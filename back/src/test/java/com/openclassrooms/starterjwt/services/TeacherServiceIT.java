package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;


@SpringBootTest
public class TeacherServiceIT {

	@Autowired
	TeacherRepository teacherRepo;
	
	Teacher teacher;
	List<Teacher> teachers;
	LocalDateTime date;
	TeacherService teacherService;
	Long id;
	
	@BeforeEach
	public void init() {
		teachers = new ArrayList<>();
		teacherService = new TeacherService(teacherRepo);
		
		teacher = new Teacher(null, "Test999", "test888", null, null);
		teacherRepo.save(teacher);
		teachers = teacherRepo.findAll();
		teacher = teachers.stream().filter(x -> (x.getFirstName().equals("test888") && x.getLastName().equals("Test999"))).findFirst().orElse(null);
		id = teacher.getId();
		teachers = null;
	}
	
	@AfterEach
	public void destroy() {
		
		if(teacherRepo.existsById(id)) {
			teacherRepo.deleteById(id);
		}
		
		teacher = null;
		id = null;
		teachers = null;
		
		teacherService = null;
	}
	
	@Test
	public void findAll_shouldReturnTeacherList() {
		
		teachers = teacherService.findAll();
		assertTrue(teachers.contains(teacher));
	}
	
	@Test
	public void findById_shouldReturnTeacherObject() {
		Teacher result = teacherService.findById(id);
		assertThat(result).isEqualTo(teacher);
	}
}
