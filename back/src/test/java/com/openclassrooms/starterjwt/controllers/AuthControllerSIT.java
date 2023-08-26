package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.CoreMatchers.is;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerSIT {

	@Autowired
	MockMvc mockMvc;
	
	@Autowired
	WebApplicationContext context;
	
	@Autowired
	AuthenticationManager authenticationManager;
    
	@Autowired
	JwtUtils jwtUtils;
    
	@Autowired
	PasswordEncoder passwordEncoder;
    
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	AuthController controller;
	
	SignupRequest signupRequest;
	LoginRequest loginRequest;
	String jsonLogin, jsonSignup;
	ObjectWriter ow;
	
	@BeforeEach
    public void setup() throws JsonProcessingException {
        ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        loginRequest = new LoginRequest();
        signupRequest = new SignupRequest();
    }
	
	@Test
	public void postLogin_shouldLogUser_byAdminLoginRequest() throws Exception {
		loginRequest.setEmail("yoga@studio.com");
		loginRequest.setPassword("test!1234");
		
		jsonLogin = ow.writeValueAsString(loginRequest);
		
		MvcResult result = mockMvc.perform(
				MockMvcRequestBuilders.post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonLogin))
					.andExpect(MockMvcResultMatchers.status().isOk())
					.andReturn();
		assertThat(result.getResponse().getContentAsString()).contains("token");
	}
	
	@Test
	public void postLogin_shouldLogUser_byUserLoginRequest() throws Exception {
		loginRequest.setEmail("user@studio.com");
		loginRequest.setPassword("test!1234");
		
		jsonLogin = ow.writeValueAsString(loginRequest);
		
		MvcResult result = mockMvc.perform(
				MockMvcRequestBuilders.post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonLogin))
					.andExpect(MockMvcResultMatchers.status().isOk())
					.andReturn();
		assertThat(result.getResponse().getContentAsString()).contains("token");
	}
	
	@Test
	public void postLogin_shouldReturnError_byBadEmailRequest() throws Exception {
		loginRequest.setEmail("yoga@test.com");
		loginRequest.setPassword("test!1234");
		
		jsonLogin = ow.writeValueAsString(loginRequest);
		
		mockMvc.perform(
				MockMvcRequestBuilders.post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonLogin))
					.andExpect(MockMvcResultMatchers.status().isUnauthorized());
	}
	
	@Test
	public void postLogin_shouldReturnError_byBadPasswordRequest() throws Exception {
		loginRequest.setEmail("yoga@studio.com");
		loginRequest.setPassword("test");
		
		jsonLogin = ow.writeValueAsString(loginRequest);
		
		mockMvc.perform(
				MockMvcRequestBuilders.post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonLogin))
					.andExpect(MockMvcResultMatchers.status().isUnauthorized());
	}
	
	@Test
	public void postLogin_shouldReturnError_byEmptyPasswordRequest() throws Exception {
		loginRequest.setEmail("yoga@studio.com");
		loginRequest.setPassword("");
		
		jsonLogin = ow.writeValueAsString(loginRequest);
		
		mockMvc.perform(
				MockMvcRequestBuilders.post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonLogin))
					.andExpect(MockMvcResultMatchers.status().isBadRequest());
	}
	
	@Test
	public void postLogin_shouldReturnError_byEmptyEmailRequest() throws Exception {
		loginRequest.setEmail("");
		loginRequest.setPassword("test");
		
		jsonLogin = ow.writeValueAsString(loginRequest);
		
		mockMvc.perform(
				MockMvcRequestBuilders.post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonLogin))
					.andExpect(MockMvcResultMatchers.status().isBadRequest());
	}
	
	@Test
	public void postSave_shouldLogUser_bySignupRequest() throws Exception {
		signupRequest.setEmail("email@test.com");
		signupRequest.setFirstName("test");
		signupRequest.setLastName("Test");
		signupRequest.setPassword("password!1234");
		
		jsonSignup = ow.writeValueAsString(signupRequest);
		
		MvcResult result = mockMvc.perform(
				MockMvcRequestBuilders.post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonSignup))
					.andExpect(MockMvcResultMatchers.status().isOk())
					.andReturn();
		assertThat(result.getResponse().getContentAsString()).contains("User registered successfully!");
		User deleteUser = userRepository.findByEmail(signupRequest.getEmail()).orElse(null);
		userRepository.delete(deleteUser);
	}
	
	@Test
	public void postSave_shouldReturnError_byEmptyEmailRequest() throws Exception {
		signupRequest.setEmail("");
		signupRequest.setFirstName("test");
		signupRequest.setLastName("Test");
		signupRequest.setPassword("password!1234");
		
		jsonSignup = ow.writeValueAsString(signupRequest);
		
		mockMvc.perform(
				MockMvcRequestBuilders.post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonSignup))
					.andExpect(MockMvcResultMatchers.status().isBadRequest())
					.andReturn();
	}
	
	@Test
	public void postSave_shouldReturnError_byEmptyFirstNameRequest() throws Exception {
		signupRequest.setEmail("email@test.com");
		signupRequest.setFirstName("");
		signupRequest.setLastName("Test");
		signupRequest.setPassword("password!1234");
		
		jsonSignup = ow.writeValueAsString(signupRequest);
		
		mockMvc.perform(
				MockMvcRequestBuilders.post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonSignup))
					.andExpect(MockMvcResultMatchers.status().isBadRequest())
					.andReturn();
	}
	
	@Test
	public void postSave_shouldReturnError_byEmptyLastNameRequest() throws Exception {
		signupRequest.setEmail("email@test.com");
		signupRequest.setFirstName("Test");
		signupRequest.setLastName("");
		signupRequest.setPassword("password!1234");
		
		jsonSignup = ow.writeValueAsString(signupRequest);
		
		mockMvc.perform(
				MockMvcRequestBuilders.post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonSignup))
					.andExpect(MockMvcResultMatchers.status().isBadRequest())
					.andReturn();
	}
	
	@Test
	public void postSave_shouldReturnError_byEmptyPasswordRequest() throws Exception {
		signupRequest.setEmail("email@test.com");
		signupRequest.setFirstName("Test");
		signupRequest.setLastName("test");
		signupRequest.setPassword("");
		
		jsonSignup = ow.writeValueAsString(signupRequest);
		
		mockMvc.perform(
				MockMvcRequestBuilders.post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonSignup))
					.andExpect(MockMvcResultMatchers.status().isBadRequest())
					.andReturn();
	}
	
	@Test
	public void postSave_shouldReturnError_byExistingEmailRequest() throws Exception {
		signupRequest.setEmail("yoga@studio.com");
		signupRequest.setFirstName("test");
		signupRequest.setLastName("Test");
		signupRequest.setPassword("password!1234");
		
		jsonSignup = ow.writeValueAsString(signupRequest);
		
		MvcResult result = mockMvc.perform(
				MockMvcRequestBuilders.post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonSignup))
					.andExpect(MockMvcResultMatchers.status().isBadRequest())
					.andReturn();
		assertThat(result.getResponse().getContentAsString()).contains("Error: Email is already taken!");
	}
}
