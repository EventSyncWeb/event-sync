package com.choom.back.controller;

import com.choom.back.entity.Speaker;
import com.choom.back.service.SpeakerService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/speakers")
@AllArgsConstructor
public class SpeakerController {

    private final SpeakerService speakerService;

    @GetMapping
    public ResponseEntity<?> getAllSpeakers(@RequestParam(required = false) String q) {
        try {
            List<Speaker> speakers = speakerService.getAllSpeakers(q);
            return ResponseEntity.ok(speakers);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSpeakerById(@PathVariable UUID id) {
        try {
            Speaker speaker = speakerService.getSpeakerById(id);
            if (speaker == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Speaker not found"));
            }
            return ResponseEntity.ok(speaker);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getSpeakersBySessionId(@PathVariable UUID sessionId) {
        try {
            List<Speaker> speakers = speakerService.getSpeakersBySessionId(sessionId);
            return ResponseEntity.ok(speakers);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createSpeaker(@RequestBody Speaker speaker) {
        try {
            Speaker created = speakerService.createSpeaker(speaker);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}