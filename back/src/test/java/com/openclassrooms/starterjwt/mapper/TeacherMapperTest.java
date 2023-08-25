package com.openclassrooms.starterjwt.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;

@SpringBootTest
public class TeacherMapperTest {
	
	@Autowired
	TeacherMapper mapper;
	
	Teacher teacher1, teacher2;
	TeacherDto teacherDto1, teacherDto2;
	
	List<Teacher> teachers;
	List<TeacherDto> teachersDto;
	
	@BeforeEach
	public void init() {
		teacher1 = new Teacher((long)1, "Abra", "Hamm", LocalDateTime.now(), LocalDateTime.now());
		teacher2 = new Teacher((long)2, "Abra", "Cadabra", LocalDateTime.now(), LocalDateTime.now());
		
		teachers = new ArrayList<>();
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
	}
	
	@Test
	public void toDto_shouldMapTeacher_toTeacherDto() {
		TeacherDto result = mapper.toDto(teacher1);
		assertThat(result.getFirstName()).isEqualTo(teacher1.getFirstName());
	}
	
	@Test
	public void toEntity_shouldMapTeacherDto_toTeacher() {
		Teacher result = mapper.toEntity(teacherDto1);
		assertThat(result.getFirstName()).isEqualTo(teacherDto1.getFirstName());
	}
	
	@Test
	public void listToDto_shouldMapTeacherList_toTeacherDtoList() {
		List<TeacherDto> result = mapper.toDto(teachers);
		assertThat(result.stream().findFirst().orElse(null).getFirstName()).isEqualTo(teacher1.getFirstName());
	}
	
	@Test
	public void listToEntity_shouldMapTeacherDtoList_toTeacherList() {
		List<Teacher> result = mapper.toEntity(teachersDto);
		assertThat(result.stream().findFirst().orElse(null).getFirstName()).isEqualTo(teacherDto1.getFirstName());
	}
	
	@Test
	public void toDto_shouldNull_toTeacherDtoNull() {
		Teacher teacherNull = null;
		TeacherDto result = mapper.toDto(teacherNull);
		assertThat(result).isNull();
	}
	
	@Test
	public void toEntity_shouldNull_toTeacherNull() {
		TeacherDto teacherDtoNull = null;
		Teacher result = mapper.toEntity(teacherDtoNull);
		assertThat(result).isNull();
	}
	
	@Test
	public void listToDto_shouldNull_toTeacherDtoListNull() {
		List<Teacher> listNull = null;
		List<TeacherDto> result = mapper.toDto(listNull);
		assertThat(result).isNullOrEmpty();
	}
	
	@Test
	public void listToEntity_shouldNull_toTeacherListNull() {
		List<TeacherDto> listNull = null;
		List<Teacher> result = mapper.toEntity(listNull);
		assertThat(result).isNullOrEmpty();
	}

}
