package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.services.TeacherService;

@SpringBootTest
public class TeacherControllerIT {

	@Autowired
	TeacherMapper teacherMapper;
	
	@Autowired
	TeacherService teacherService;
	
	@Autowired
	TeacherController controller;
	
	@Test
	public void getFindAll_shouldReturnOkWithTeacherDtoList() {
		ResponseEntity<?> result = controller.findAll();
		
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		assertThat((List<?>) result.getBody()).isNotNull();
	}
	
	@Test
	public void getFindById_shouldReturnOkWithTeacherDto_forExixtingTeacherId() {
		ResponseEntity<?> result = controller.findById("1");
		
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		assertThat(((TeacherDto) result.getBody()).getFirstName()).isEqualTo("Margot");
	}
	
	@Test
	public void getFindById_shouldReturnBadRequest_forNotNumberTeacherId() {
		ResponseEntity<?> result = controller.findById("abc");
		
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
	}
}
