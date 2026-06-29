package com.choom.back.dto;

import com.choom.back.entity.Question;
import com.choom.back.entity.Speaker;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
public class SessionRequest {
    private UUID eventId;
    private UUID id;
    private String title;
    private String description;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private UUID room;
    private String roomName;
    private List<UUID> speakersIds;
    private boolean isOnLive;
}
