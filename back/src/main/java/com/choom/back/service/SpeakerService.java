package com.choom.back.service;

import com.choom.back.entity.Session;
import com.choom.back.entity.Speaker;
import com.choom.back.exception.BadRequestException;
import com.choom.back.repository.SessionRepository;
import com.choom.back.repository.SpeakerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SpeakerService {

    private final SpeakerRepository speakerRepository;
    private final SessionRepository sessionRepository;

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
        List<UUID> sessionIds = speaker.getSessions().stream()
                .map(Session::getId)
                .collect(Collectors.toList());
        validateNoTimeConflict(sessionIds);
        return speakerRepository.saveSpeaker(speaker);
    }

    private void validateNoTimeConflict(List<UUID> sessionIds) {
        if (sessionIds == null || sessionIds.size() < 2) return;
        List<Session> sessions = sessionRepository.findSessionsByIds(sessionIds);
        for (int i = 0; i < sessions.size(); i++) {
            for (int j = i + 1; j < sessions.size(); j++) {
                Session a = sessions.get(i);
                Session b = sessions.get(j);
                if (a.getDate().equals(b.getDate())
                        && a.getStartTime().isBefore(b.getEndTime())
                        && b.getStartTime().isBefore(a.getEndTime())) {
                    throw new BadRequestException("Speaker cannot be assigned to overlapping sessions");
                }
            }
        }
    }
}