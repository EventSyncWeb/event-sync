package com.choom.back.entity;

import lombok.Data;

import java.util.UUID;

@Data
public class Room {
    private UUID id;
    private String name;
}
