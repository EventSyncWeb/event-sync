package com.choom.back.controller;

import com.choom.back.entity.Speaker;
import com.choom.back.service.SpeakerService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/speakers")
@AllArgsConstructor
public class SpeakerController {

    private final SpeakerService speakerService;

    @GetMapping
    public ResponseEntity<List<Speaker>> getAllSpeakers(@RequestParam(required = false) String q) {
        List<Speaker> speakers = speakerService.getAllSpeakers(q);
        return ResponseEntity.ok()
                .header("Content-Range", "speakers 0-" + speakers.size() + "/" + speakers.size())
                .body(speakers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Speaker> getSpeakerById(@PathVariable UUID id) {
        Speaker speaker = speakerService.getSpeakerById(id);
        if (speaker == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(speaker);
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<Speaker>> getSpeakersBySessionId(@PathVariable UUID sessionId) {
        List<Speaker> speakers = speakerService.getSpeakersBySessionId(sessionId);
        return ResponseEntity.ok(speakers);
    }

    @PostMapping
    public ResponseEntity<Speaker> createSpeaker(@RequestBody Speaker speaker) {
        Speaker created = speakerService.createSpeaker(speaker);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}