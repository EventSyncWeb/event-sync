package com.choom.back.controller;

import com.choom.back.entity.Session;
import com.choom.back.service.SessionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/session")
@AllArgsConstructor
public class SessionController {
    private SessionService sessionService;

    @GetMapping
    public ResponseEntity<List<Session>> getAllSessions() {
        List<Session> sessions = sessionService.getAllSession();
        return ResponseEntity.ok().body(sessions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable UUID id) {
        Session session = sessionService.getSessionById(id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(session);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Session>> getSessionsByEventId(@PathVariable UUID eventId) {
        List<Session> sessions = sessionService.getSessionByEventId(eventId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(sessions);
    }

    @PostMapping
    public ResponseEntity<Session> createSession(@RequestBody Session session) {
        Session createdSession = sessionService.createSession(session);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdSession);
    }

    @PutMapping("{sessionId}")
    public ResponseEntity<Session> updateSession(@PathVariable UUID id, @RequestBody Session session) {
        Session updatedSession = sessionService.updateSession(id, session);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(updatedSession);
    }
}
