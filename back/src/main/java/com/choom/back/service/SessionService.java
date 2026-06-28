package com.choom.back.service;

import com.choom.back.dto.SessionRequest;
import com.choom.back.entity.Session;
import com.choom.back.entity.Speaker;
import com.choom.back.exception.BadRequestException;
import com.choom.back.exception.NotFoundException;
import com.choom.back.repository.SessionRepository;
import com.choom.back.validator.SessionValidator;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class SessionService {
    private final SessionRepository sessionRepository;
    private final SessionValidator sessionValidator;

    public List<Session> getAllSession(){
        List<Session> sessions = sessionRepository.findAllSession();
        sessions.forEach(s -> s.setOnLive(isOnLive(s)));
        return sessions;
    }

    public Session getSessionById(UUID id){
        Session session = sessionRepository.findSessionById(id);
        if (session == null) {
            throw new NotFoundException("Session with id " + id + " not found");
        }
        session.setOnLive(isOnLive(session));
        return session;
    }

    public boolean isOnLive(Session session) {
        if (session.getDate() == null || session.getStartTime() == null || session.getEndTime() == null) {
            return false;
        }
        LocalDate now = LocalDate.now();
        LocalTime nowTime = LocalTime.now();
        return session.getDate().equals(now)
                && !nowTime.isBefore(session.getStartTime())
                && !nowTime.isAfter(session.getEndTime());
    }

    public List<Session> getSessionByEventId(UUID eventId){
        List<Session> sessions = sessionRepository.findSessionByEventId(eventId);
        if(sessions.isEmpty()){
            throw new NotFoundException("Session with id " + eventId + " not found");
        }
        sessions.forEach(s -> s.setOnLive(isOnLive(s)));
        return sessions;
    }

    public Session createSession(SessionRequest sessionRequest){
        Session session = new Session();
        session.setEventId(sessionRequest.getEventId());
        session.setTitle(sessionRequest.getTitle());
        session.setDescription(sessionRequest.getDescription());
        session.setDate(sessionRequest.getDate());
        session.setStartTime(sessionRequest.getStartTime());
        session.setEndTime(sessionRequest.getEndTime());
        session.setRoom(sessionRequest.getRoom());
        session.setRoomName(sessionRequest.getRoomName());
        for(UUID speakerId : sessionRequest.getSpeakersIds()) {
            Speaker speaker = new Speaker();
            speaker.setId(speakerId);
            session.getSpeakers().add(speaker);
        }
        sessionValidator.validate(session);

        Session created = sessionRepository.createSession(session);
        if(created == null){
            throw new BadRequestException("Failed to create session");
        }
        return created;
    }

    public Session updateSession(UUID id, SessionRequest sessionRequest){
        Session session = new Session();
        session.setEventId(sessionRequest.getEventId());
        session.setTitle(sessionRequest.getTitle());
        session.setDescription(sessionRequest.getDescription());
        session.setDate(sessionRequest.getDate());
        session.setStartTime(sessionRequest.getStartTime());
        session.setEndTime(sessionRequest.getEndTime());
        session.setRoom(sessionRequest.getRoom());
        session.setRoomName(sessionRequest.getRoomName());
        for(UUID speakerId : sessionRequest.getSpeakersIds()) {
            Speaker speaker = new Speaker();
            speaker.setId(speakerId);
            session.getSpeakers().add(speaker);
        }
        sessionValidator.UpdateValidate(id, session);
        session.setId(id);

        Session updated = sessionRepository.updateSession(session);
        if(updated == null){
           throw new BadRequestException("Failed to update session");
        }
        return updated;
    }
    public void deleteSession(UUID id){
        if(!sessionRepository.existsSessionById(id)) {
            throw new NotFoundException("Session with id " + id + " not found");
        }
        sessionRepository.deleteSessionById(id);
    }

}
