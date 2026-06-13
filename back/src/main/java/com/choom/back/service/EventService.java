package com.choom.back.service;

import com.choom.back.dto.EventRequest;
import com.choom.back.dto.EventResponse;
import com.choom.back.entity.Event;
import com.choom.back.exception.NotFoundException;
import com.choom.back.repository.EventRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class EventService {
    private final EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAllEvents();
    }

    public Event getEventById(UUID id) {
        Event event = eventRepository.findEventById(id);
        if (event == null) {
            throw new NotFoundException("Event with id " + id + " not found");
        }
        return event;
    }

    public Event createEvent(EventRequest eventRequest) {
        return eventRepository.createEvent(eventRequest);
    }

    public Event updateEvent(UUID id, EventRequest eventRequest) {
        Event event = eventRepository.findEventById(id);
        if (event == null) {
            throw new NotFoundException("Event with id " + id + " not found");
        }
        return eventRepository.updateEvent(id, eventRequest);
    }

    public void deleteEvent(UUID id) {
        Event event = eventRepository.findEventById(id);
        if (event == null) {
            throw new NotFoundException("Event with id " + id + " not found");
        }
        eventRepository.deleteEvent(id);
    }
}
