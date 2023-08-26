package com.openclassrooms.starterjwt.controllers;

import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.services.SessionService;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerSIT {

	@Mock
	Authentication auth;
	
	@Autowired
	MockMvc mockMvc;
	
	@Autowired
	WebApplicationContext context;
	
	@Autowired
	SessionMapper mapper;
	
	@Autowired
	SessionService sessionService;
	
	@Autowired
	JwtUtils jwtUtils;
	
	UserDetailsImpl userDetails;
	ObjectWriter ow;
	
	@BeforeEach
    public void setup() throws JsonProcessingException {
        ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        userDetails = UserDetailsImpl
		        .builder()
		        .id((long)1)
		        .username("yoga@studio.com")
		        .lastName("Admin")
		        .firstName("Admin")
		        .password("$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq")
		        .build();
    }
	
	@Test
	public void getFindAll_shouldReturnUnauthorized_withUnauthenticateRequest() throws Exception {
		
		mockMvc.perform(
				MockMvcRequestBuilders.post("/api/session"))
					.andExpect(MockMvcResultMatchers.status().isUnauthorized());
	}
	
	@Test
	public void getFindAll_shouldReturnSessionList_withAuthenticateJwt() throws Exception {
		when(auth.getPrincipal()).thenReturn(userDetails);
		
		String jwt = jwtUtils.generateJwtToken(auth);
		
		mockMvc.perform(
				MockMvcRequestBuilders.get("/api/session")
					.header("Authorization", "Bearer "+jwt))
					.andExpect(MockMvcResultMatchers.status().isOk())
					.andReturn();
	}
}
