package com.choom.back.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EventRequest {
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
}
