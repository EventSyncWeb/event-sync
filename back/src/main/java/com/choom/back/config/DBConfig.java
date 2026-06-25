package com.choom.back.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DBConfig {

    public Connection getConnection() {
        try {
            String url = System.getenv("SPRING_DATASOURCE_URL");
            String username = System.getenv("SPRING_DATASOURCE_USERNAME");
            String password = System.getenv("SPRING_DATASOURCE_PASSWORD");
            return DriverManager.getConnection("jdbc:postgresql://localhost:5432/eventsync", "postgres", "postgres");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
