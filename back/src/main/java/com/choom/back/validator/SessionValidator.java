package com.choom.back.validator;

import com.choom.back.entity.Session;
import com.choom.back.repository.SessionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor

public class SessionValidator {
    private SessionRepository sessionRepository;

    public void validate(Session session) {
        String message = "";

        if (session == null) {
            message += "Session is null";
        }

        if(session.getSessionId() == null) {
            message += "Session ID is required";
        }

        if(session.getEventId() == null) {
            message += "Event ID is required";
        }

        if(session.getTitle() == null || session.getTitle().isEmpty()) {
            message += "Title is required";
        }

        if(session.getDescription() == null || session.getDescription().isEmpty()) {
            message += "Description is required";
        }

        if(session.getStartTime().isAfter(session.getEndTime())) {
            message += "Start time is after end time";
        }

        if(session.getRoom() == null || !session.getRoom().equals(session.getRoom())) {
            message += "Either room number is incorrect or the room doesn't exist";
        }

        if(session.getSessionId() != null && sessionRepository.existsSessionById(session.getSessionId())) {
            message += "Session with id: "+ session.getSessionId() + " already exists";
        }

        if(!message.isEmpty()) {
            throw new RuntimeException(message);
        }
    }

    public void ExistingValidate(UUID id) {
        String message = "";

        if(id == null) {
            message += "Session ID is required";
        }



        if(!message.isEmpty()) {
            throw new RuntimeException(message);
        }

        if(id != null && !sessionRepository.existsSessionById(id)) {
            message += "Session with id: "+ id + " does not exist";
        }
    }

    public void UpdateValidate(UUID id, Session session) {
        String message = "";
        if(id == null) {
            message += "Session ID is required";
        }

        if(session == null) {
            message += "Session is null";
        }

        if(session.getEventId() == null) {
            message += "Event ID is required";
        }

        if(session.getTitle() == null || session.getTitle().isBlank()) {
            message += "Title is required";
        }

        if(session.getDescription() == null || session.getDescription().isBlank()) {
            message += "Description is required";
        }

        if(session.getStartTime().isAfter(session.getEndTime())) {
            message += "Start time is after end time";
        }

        if(session.getRoom() == null || !session.getRoom().equals(session.getRoom())) {
            message += "Room number is incorrect or the room doesn't exist";
        }

        if(session.getSessionId() != null && sessionRepository.existsSessionById(session.getSessionId())) {
            message += "Session with id: "+ session.getSessionId() + " already exists";
        }

        if(session.getDescription() == null || session.getDescription().isBlank()) {
            message += "Description is required";
        }


    }

}
