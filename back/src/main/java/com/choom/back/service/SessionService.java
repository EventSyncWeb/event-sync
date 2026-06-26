package com.choom.back.service;

import com.choom.back.entity.Session;
import com.choom.back.exception.BadRequestException;
import com.choom.back.exception.NotFoundException;
import com.choom.back.repository.SessionRepository;
import com.choom.back.validator.SessionValidator;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class SessionService {
    private final SessionRepository sessionRepository;
    private final SessionValidator sessionValidator;

    public List<Session> getAllSession(){
        return sessionRepository.findAllSession();
    }

    public Session getSessionById(UUID id){
        Session session = sessionRepository.findSessionById(id);
        if (session == null) {
            throw new NotFoundException("Session with id " + id + " not found");
        }
        return session;
    }

    public List<Session> getSessionByEventId(UUID eventId){
        List<Session> sessions = sessionRepository.findSessionByEventId(eventId);
        if(sessions.isEmpty()){
            throw new NotFoundException("Session with id " + eventId + " not found");
        }
        return sessions;
    }

    public Session createSession(Session session){
        sessionValidator.validate(session);

        Session created = sessionRepository.createSession(session);
        if(created == null){
            throw new BadRequestException("Failed to create session");
        }
        return created;
    }

    public Session updateSession(UUID id, Session session){
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
