package com.choom.back.entity;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class Event {
    private UUID is;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
}
