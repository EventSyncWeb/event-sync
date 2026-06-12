package com.choom.back.controller;

import com.choom.back.dto.LoginRequest;
import com.choom.back.entity.Admin;
import com.choom.back.exception.AuthenticationException;
import com.choom.back.exception.BadRequestException;
import com.choom.back.service.AuthService;
import com.choom.back.validator.AuthValidator;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthValidator authValidator;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            authValidator.validateCredentials(loginRequest.getEmail(),  loginRequest.getPassword());
            Admin admin = authService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.status(HttpStatus.OK).body(admin);
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}


