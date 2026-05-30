package com.sgpa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.sgpa", "com.universidad"})
public class SgpaApplication {

	public static void main(String[] args) {
		SpringApplication.run(SgpaApplication.class, args);
	}

}
