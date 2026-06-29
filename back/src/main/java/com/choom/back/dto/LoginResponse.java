package com.choom.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
}
