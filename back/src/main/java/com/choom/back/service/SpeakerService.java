package com.choom.back.service;

import com.choom.back.entity.Speaker;
import com.choom.back.repository.SpeakerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class SpeakerService {

    private final SpeakerRepository speakerRepository;

    public List<Speaker> getAllSpeakers(String query) {
        if (query != null && !query.trim().isEmpty()) {
            return speakerRepository.findSpeakersByName(query.trim());
        }
        return speakerRepository.findAllSpeaker();
    }

    public Speaker getSpeakerById(UUID id) {
        return speakerRepository.findSpeakerById(id);
    }

    public List<Speaker> getSpeakersBySessionId(UUID sessionId) {
        return speakerRepository.findSpeakersBySessionId(sessionId);
    }

    public Speaker createSpeaker(Speaker speaker) {
        return speakerRepository.saveSpeaker(speaker);
    }
}