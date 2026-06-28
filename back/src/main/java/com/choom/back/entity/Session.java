package com.choom.back.entity;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
public class Session {
    private UUID eventId;
    private UUID id;
    private String title;
    private String description;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private UUID room;
    private String roomName;
    private List<Question> questions;
    private List<Speaker> speakers;
    private boolean isOnLive;
}