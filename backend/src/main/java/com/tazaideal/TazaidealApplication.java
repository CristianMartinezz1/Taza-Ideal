package com.tazaideal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync // los avisos (correo, SMS, WhatsApp) se envian en segundo plano
public class TazaidealApplication {

	public static void main(String[] args) {
		SpringApplication.run(TazaidealApplication.class, args);
	}

}
