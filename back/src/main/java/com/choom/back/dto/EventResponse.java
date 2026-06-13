package com.choom.back.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class EventResponse {
    private UUID id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
}
