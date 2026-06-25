package com.choom.back.entity;

import lombok.Data;

import java.util.UUID;

@Data
public class Speaker {

    private UUID id;
    private UUID sessionId;
    private String sessionTitle;
    private String firstName;
    private String lastName;
    private String biography;
    private String linkedIn;
    private String company;
    private String email;
}
