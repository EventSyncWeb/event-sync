package com.choom.back.validator;

import com.choom.back.exception.BadRequestException;
import org.springframework.stereotype.Component;

@Component
public class AuthValidator {
    public void validateCredentials(String email, String rawPassword) {
        String message = "";
        if(email == null || email.isBlank()) {
            message += "Email is required";
        }
        if(rawPassword == null || rawPassword.isBlank()) {
            message += "Password is required";
        }
        if(!message.isEmpty()) {
            throw new BadRequestException(message);
        }
    }

    public void validateRegister(String firstName, String lastName, String email, String password) {
        String message = "";
        if(firstName == null || firstName.isBlank()) {
            message += "First name is required";
        }
        if(lastName == null || lastName.isBlank()) {
            message += "Last name is required";
        }
        if(email == null || email.isBlank() || !email.contains("@")) {
            message += "Valid email is required";
        }
        if(password == null || password.length() < 6) {
            message += "Password must be at least 6 characters";
        }
        if(!message.isEmpty()) {
            throw new BadRequestException(message);
        }
    }
}
