package com.choom.back.entity;

import lombok.Data;

import java.sql.Timestamp;
import java.util.UUID;

@Data
public class Question {
    private UUID id;
    private String content;
    private String authorName;
    private Timestamp creationDate;
    private Integer upvoteCount;
    private UUID sessionId;
}
