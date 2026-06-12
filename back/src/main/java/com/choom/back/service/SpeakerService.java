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

    public List<Speaker> getAllSpeakers() {
        return speakerRepository.findAllSpeaker();
    }

    public Speaker getSpeakerById(UUID id) {
        return speakerRepository.findSpeakerById(id);
    }

    public Speaker getSpeakerBySessionId(UUID sessionId) {
        return speakerRepository.findSpeakerBySessiontId(sessionId);
    }

    public Speaker createSpeaker(Speaker speaker) {
        return speakerRepository.saveSpeaker(speaker);
    }
}