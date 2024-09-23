package com.example.lanchonet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class LanchoNetApplication {

    public static void main(String[] args) {
        SpringApplication.run(LanchoNetApplication.class, args);
    }

}
