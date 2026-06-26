package com.choom.back.validator;

import com.choom.back.entity.Question;
import com.choom.back.entity.Session;
import com.choom.back.exception.BadRequestException;
import com.choom.back.exception.SessionNotLive;
import com.choom.back.repository.SessionRepository;
import com.choom.back.service.SessionService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class QuestionValidator {
    private final SessionRepository sessionRepository;
    private final SessionService sessionService;

    public void validateCreate(Question question) {
        String message = "";

        if (question == null) {
            message += "Question is null";
        }

        if (question.getSessionId() == null) {
            message += "Session ID is required";
        }

        if (question.getContent() == null || question.getContent().isBlank()) {
            message += "Content is required";
        }

        if (question.getAuthorName() == null || question.getAuthorName().isBlank()) {
            message += "Author name is required";
        }

        if (question.getSessionId() != null) {
            Session session = sessionRepository.findSessionById(question.getSessionId());
            if (session == null) {
                message += "Session not found";
            } else if (!sessionService.isOnLive(session)) {
                throw new SessionNotLive("Cannot create question: session is not live");
            }
        }

        if (!message.isEmpty()) {
            throw new BadRequestException(message);
        }
    }
}
