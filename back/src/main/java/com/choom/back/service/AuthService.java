package com.choom.back.service;

import com.choom.back.config.JwtUtil;
import com.choom.back.dto.LoginResponse;
import com.choom.back.dto.RegisterRequest;
import com.choom.back.entity.Admin;
import com.choom.back.exception.AuthenticationException;
import com.choom.back.exception.BadRequestException;
import com.choom.back.repository.AdminRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse register(RegisterRequest request) {
        Admin existing = adminRepository.getAdmin(request.getEmail());
        if(existing != null) {
            throw new BadRequestException("Email is already registered");
        }

        Admin admin = new Admin();
        admin.setFirstName(request.getFirstName());
        admin.setLastName(request.getLastName());
        admin.setEmail(request.getEmail());
        admin.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        admin = adminRepository.saveAdmin(admin);

        String token = jwtUtil.generateToken(admin.getId(), admin.getEmail());
        return new LoginResponse(token, admin.getId(), admin.getFirstName(), admin.getLastName(), admin.getEmail());
    }

    public LoginResponse authenticate(String email, String rawPassword) {
        Admin admin = adminRepository.getAdmin(email);
        if(admin == null) {
            throw new AuthenticationException("Invalid email or password");
        }

        String passwordHash = admin.getPasswordHash();
        if(!passwordEncoder.matches(rawPassword,  passwordHash)) {
            throw new AuthenticationException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(admin.getId(), admin.getEmail());
        return new LoginResponse(token, admin.getId(), admin.getFirstName(), admin.getLastName(), admin.getEmail());
    }
}