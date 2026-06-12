package com.choom.back.entity;


import lombok.Data;

import java.util.UUID;


@Data
public class Speaker {

    private UUID id;
    private Session session;
    private String firstName;
    private String lastName;
    private String biography;
    private String linkdLn;
    private String company;
    private String email;
}
