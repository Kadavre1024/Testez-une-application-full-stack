package com.openclassrooms.starterjwt.payload.response;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class JwtResponseUT {

	JwtResponse jwt;
	
	@BeforeEach
	public void init() {
		jwt = new JwtResponse("Hello", (long) 1, "email@email.com", "Hamm", "Abra", true);
	}
	
	@AfterEach
	public void destroy() {
		jwt = null;
	}
	
	@Test
	public void getToken_shouldReturnToken() {
		//When
		String m = jwt.getToken();
		
		//Then
		assertThat(m).isEqualTo("Hello");
	}
	
	@Test
	public void getId_shouldReturnId() {
		//When
		long m = jwt.getId();
		
		//Then
		assertThat(m).isEqualTo(((long)1));
	}
	
	@Test
	public void getUsername_shouldReturnEmail() {
		//When
		String m = jwt.getUsername();
		
		//Then
		assertThat(m).isEqualTo("email@email.com");
	}
	
	@Test
	public void getFirstName_shouldReturnFirstName() {
		//When
		String m = jwt.getFirstName();
		
		//Then
		assertThat(m).isEqualTo("Hamm");
	}
	
	@Test
	public void getLastName_shouldReturnLastName() {
		//When
		String m = jwt.getLastName();
		
		//Then
		assertThat(m).isEqualTo("Abra");
	}
	
	@Test
	public void getAdmin_shouldReturnAdminBoolean() {
		//When
		boolean m = jwt.getAdmin();
		
		//Then
		assertTrue(m);
	}
	
	@Test
	public void setToken_shouldSetTheGivenString_toToken() {
		//Given
		String m = "Hola!";
		assertThat(jwt.getToken()).isEqualTo("Hello");
		
		//When
		jwt.setToken(m);
		
		//Then
		assertThat(jwt.getToken()).isEqualTo(m);
	}
	
	@Test
	public void setId_shouldSetTheGivenLong_toId() {
		//Given
		long m = 2;
		assertThat(jwt.getId()).isEqualTo(((long)1));
		
		//When
		jwt.setId(m);
		
		//Then
		assertThat(jwt.getId()).isEqualTo(((long)2));
	}
	
	@Test
	public void setUsername_shouldSetTheGivenString_toUsername() {
		//Given
		String m = "test@email.com";
		assertThat(jwt.getUsername()).isEqualTo("email@email.com");
		
		//When
		jwt.setUsername(m);
		
		//Then
		assertThat(jwt.getUsername()).isEqualTo(m);
	}
	
	@Test
	public void setFirstName_shouldSetTheGivenString_toFirstName() {
		//Given
		String m = "Abra";
		assertThat(jwt.getFirstName()).isEqualTo("Hamm");
		
		//When
		jwt.setFirstName(m);
		
		//Then
		assertThat(jwt.getFirstName()).isEqualTo(m);
	}
	
	@Test
	public void setLastName_shouldSetTheGivenString_toLastName() {
		//Given
		String m = "Cadabra";
		assertThat(jwt.getLastName()).isEqualTo("Abra");
		
		//When
		jwt.setLastName(m);
		
		//Then
		assertThat(jwt.getLastName()).isEqualTo(m);
	}
	
	@Test
	public void setAdmin_shouldSetTheGivenBool_toAdmin() {
		//Given
		boolean m = false;
		assertTrue(jwt.getAdmin());
		
		//When
		jwt.setAdmin(m);
		
		//Then
		assertFalse(jwt.getAdmin());
	}
}
