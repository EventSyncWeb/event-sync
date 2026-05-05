package com.choom.back.service;

import com.choom.back.entity.Answer;
import com.choom.back.exception.NotFoundException;
import com.choom.back.repository.AnswerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AnswerService {
    AnswerRepository answerRepository;

    public List<Answer> getAllAnswer(){
        return answerRepository.findAllAnswer();
    }

    public Answer getAnswerById(UUID id){
        Optional<Answer> optionalAnswer = answerRepository.findAnswerById(id);

        if(optionalAnswer.isEmpty()){
            throw new NotFoundException("Answer.id=" + id + "is not found");
        }
        return optionalAnswer.get();
    }

    public Answer createAnswer (Answer answer){
        return answerRepository.createAnswer(answer);
    }

    public Answer mapToEntity(Answer answer){
        Answer a = new Answer();
        a.setId(answer.getId());
        a.setContent(answer.getContent());
        a.setCreationDate(answer.getCreationDate());
        a.setAuthorName(answer.getAuthorName());

        return a;
    }
}
