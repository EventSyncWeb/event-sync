package com.choom.back.controller;

import com.choom.back.entity.Speaker;
import com.choom.back.service.SpeakerService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/speakers")
@AllArgsConstructor
public class SpeakerController {

    private final SpeakerService speakerService;

    @GetMapping
    public List<Speaker> getAllSpeakers() {
        return speakerService.getAllSpeakers();
    }

    @GetMapping("/{id}")
    public Speaker getSpeakerById(
            @PathVariable UUID id
    ) {
        return speakerService.getSpeakerById(id);
    }

    @GetMapping("/session/{sessionId}")
    public Speaker getSpeakerBySessionId(
            @PathVariable UUID sessionId
    ) {
        return speakerService.getSpeakerBySessionId(sessionId);
    }

    @PostMapping
    public Speaker createSpeaker(
            @RequestBody Speaker speaker
    ) {
        return speakerService.createSpeaker(speaker);
    }
}