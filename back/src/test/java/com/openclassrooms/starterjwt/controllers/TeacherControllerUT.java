package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;


@ExtendWith(MockitoExtension.class)
public class TeacherControllerUT {

	@Mock
	TeacherMapper teacherMapper;
	
	@Mock
	TeacherService teacherService;
	
	Teacher teacher1;
	Teacher teacher2;
	List<Teacher> teachers;
	TeacherDto teacherDto1;
	TeacherDto teacherDto2;
	List<TeacherDto> teachersDto;
	
	TeacherController controller;
	
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
		
		teachersDto = new ArrayList<>();
		
		teacherDto1 = new TeacherDto();
		teacherDto1.setId((long) 1);
		teacherDto1.setFirstName("Hamm");
		teacherDto1.setLastName("Abra");
		teacherDto1.setCreatedAt(LocalDateTime.now());
		teacherDto1.setUpdatedAt(LocalDateTime.now());
		
		teacherDto2 = new TeacherDto();
		teacherDto2.setId((long) 2);
		teacherDto2.setFirstName("Cadabra");
		teacherDto2.setLastName("Abra");
		teacherDto2.setCreatedAt(LocalDateTime.now());
		teacherDto2.setUpdatedAt(LocalDateTime.now());
		
		teachersDto.add(teacherDto1);
		teachersDto.add(teacherDto2);
		
		controller = new TeacherController(teacherService, teacherMapper);
	}
	
	@AfterEach
	public void destroy() {
		teacher1 = null;
		teacher2 = null;
		teachers = null;
	}
	
	@Test
	public void getFindById_shouldReturnTeacherDto() {
		when(teacherService.findById((long)1)).thenReturn(teacher1);
		when(teacherMapper.toDto(teacher1)).thenReturn(teacherDto1);
		
		ResponseEntity<?> result = controller.findById("1");
		
		verify(teacherService).findById((long)1);
		verify(teacherMapper).toDto(teacher1);
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		assertThat(result.getBody()).isEqualTo(teacherDto1);
	}
	
	@Test
	public void getFindById_shouldReturnNotFound_whenTeacherIsNotFound() {
		//when(teacherService.findById((long)1)).thenReturn(teacher1);
		//when(teacherMapper.toDto(teacher1)).thenReturn(teacherDto1);
		
		ResponseEntity<?> result = controller.findById("1");
		
		//verify(teacherService).findById((long)1);
		//verify(teacherMapper).toDto(teacher1);
		assertThat(result.getStatusCodeValue()).isEqualTo(404);
		//assertThat(result.getBody()).isEqualTo(teacherDto1);
	}
	
	@Test
	public void getFindById_shouldReturnBadRequest_whenNumberFormatException() {
		when(teacherService.findById((long)1)).thenThrow(new NumberFormatException());
		//when(teacherMapper.toDto(teacher1)).thenReturn(teacherDto1);
		
		ResponseEntity<?> result = controller.findById("1");
		
		verify(teacherService).findById((long)1);
		//verify(teacherMapper).toDto(teacher1);
		assertThat(result.getStatusCodeValue()).isEqualTo(400);
		//assertThat(result.getBody()).isEqualTo(teacherDto1);
	}
	
	@Test
	public void getFindAll_shouldReturnTeacherDtoList() {
		when(teacherService.findAll()).thenReturn(teachers);
		when(teacherMapper.toDto(teachers)).thenReturn(teachersDto);
		
		ResponseEntity<?> result = controller.findAll();
		
		verify(teacherService).findAll();
		verify(teacherMapper).toDto(teachers);
		assertThat(result.getStatusCodeValue()).isEqualTo(200);
		assertThat(result.getBody()).isEqualTo(teachersDto);
	}
}
