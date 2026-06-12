package com.choom.back.entity;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class Session {
    private UUID eventId;
    private UUID SessionId;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private UUID room;
    private List<Question> questions;
}