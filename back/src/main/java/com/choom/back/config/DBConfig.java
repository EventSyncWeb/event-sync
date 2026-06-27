package com.choom.back.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DBConfig {

    public Connection getConnection() {
        try {
            Dotenv dotenv = Dotenv.load();
            String url = dotenv.get("SPRING_DATASOURCE_URL");
            String username = dotenv.get("SPRING_DATASOURCE_USERNAME");
            String password = dotenv.get("SPRING_DATASOURCE_PASSWORD");
            return DriverManager.getConnection(url, username, password);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
