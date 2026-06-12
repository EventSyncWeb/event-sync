package com.choom.back.service;

import com.choom.back.dto.EventResponse;
import com.sun.jdi.request.EventRequest;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class EventService {

    public void createEvent(EventRequest eventRequest) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public EventResponse updateEvent(EventRequest eventRequest) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void deleteEvent(UUID id) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
