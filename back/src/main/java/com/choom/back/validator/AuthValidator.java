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
}
