package com.choom.back.validator;

import com.choom.back.entity.Event;
import com.choom.back.entity.Session;
import com.choom.back.exception.BadRequestException;
import com.choom.back.repository.EventRepository;
import com.choom.back.repository.SessionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor
public class SessionValidator {
    private SessionRepository sessionRepository;
    private EventRepository eventRepository;

    public void validate(Session session) {
        String message = "";

        if (session == null) {
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

        if(session.getStartTime() == null) {
            message += "Start time is required";
        }

        if(session.getEndTime() == null) {
            message += "End time is required";
        }

        if(session.getStartTime() != null && session.getEndTime() != null
                && !session.getEndTime().isAfter(session.getStartTime())) {
            message += "Start time must be before end time";
        }

        if(session.getRoom() == null) {
            message += "Room is required";
        }

        if (session.getRoom() != null && session.getStartTime() != null && session.getEndTime() != null) {
            if (sessionRepository.existsConflictingSession(session.getRoom(), session.getStartTime(), session.getEndTime(), null)) {
                message += "A session already exists in this room during the specified time";
            }
        }

        if (session.getEventId() != null && session.getDate() != null) {
            Event event = eventRepository.findEventById(session.getEventId());
            if (event != null) {
                if (session.getDate().isBefore(event.getStartDate()) || session.getDate().isAfter(event.getEndDate())) {
                    message += "Session time must be within the event date range";
                }
            }
        }

        if(!message.isEmpty()) {
            throw new BadRequestException(message);
        }
    }

    public void ExistingValidate(UUID id) {
        if(id == null) {
            throw new BadRequestException("Session ID is required");
        }

        if(!sessionRepository.existsSessionById(id)) {
            throw new BadRequestException("Session with id: " + id + " does not exist");
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

        if(session.getStartTime() == null) {
            message += "Start time is required";
        }

        if(session.getEndTime() == null) {
            message += "End time is required";
        }

        if(session.getStartTime() != null && session.getEndTime() != null
                && session.getStartTime().isAfter(session.getEndTime())) {
            message += "Start time must be before end time";
        }

        if(session.getRoom() == null) {
            message += "Room is required";
        }

        if (session.getRoom() != null && session.getStartTime() != null && session.getEndTime() != null) {
            if (sessionRepository.existsConflictingSession(session.getRoom(), session.getStartTime(), session.getEndTime(), id)) {
                message += "A session already exists in this room during the specified time";
            }
        }

        if (session.getEventId() != null && session.getDate() != null) {
            Event event = eventRepository.findEventById(session.getEventId());
            if (event != null) {
                if (session.getDate().isBefore(event.getStartDate()) || session.getDate().isAfter(event.getEndDate())) {
                    message += "Session time must be within the event date range";
                }
            }
        }

        if(!message.isEmpty()) {
            throw new BadRequestException(message);
        }
    }
}
