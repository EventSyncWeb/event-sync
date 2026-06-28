package com.choom.back.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class Speaker {

    private UUID id;
    private String firstName;
    private String lastName;
    private String biography;
    private String linkedIn;
    private String company;
    private String email;
    private String profilePic;
    @JsonIgnoreProperties("speakers")
    private List<Session> sessions = new ArrayList<>();
}
