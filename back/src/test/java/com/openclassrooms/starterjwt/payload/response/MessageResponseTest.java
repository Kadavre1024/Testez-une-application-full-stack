package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class MessageResponseTest {

	MessageResponse message;
	
	@BeforeEach
	public void init() {
		message = new MessageResponse("Hello");
	}
	
	@AfterEach
	public void destroy() {
		message = null;
	}
	
	@Test
	public void getMessage_shouldReturnMessage() {
		//Given
		
		//When
		String m = message.getMessage();
		
		//Then
		assertThat(m).isEqualTo("Hello");
	}
	
	@Test
	public void setMessage_shouldSetTheGivenString_toMessage() {
		//Given
		String m = "Hola!";
		assertThat(message.getMessage()).isEqualTo("Hello");
		
		//When
		message.setMessage(m);
		
		//Then
		assertThat(message.getMessage()).isEqualTo(m);
	}
	
}
