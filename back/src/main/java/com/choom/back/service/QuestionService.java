package com.choom.back.service;

import com.choom.back.entity.Question;
import com.choom.back.exception.NotFoundException;
import com.choom.back.repository.QuestionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class QuestionService {
    QuestionRepository questionRepository;

    public List<Question> getAllQuestions(){
        return questionRepository.findAllQuestions();
    }

    public Question getQuestionById(UUID id){
        Optional<Question> optionalQuestion = questionRepository.findQuestionById(id);

        if(optionalQuestion.isEmpty()){
            throw new NotFoundException("Question.id=" + id + "is not found");
        }
        return optionalQuestion.get();
    }

    public Question createQuestion (Question question){

        return questionRepository.createQuestion(question);
    }

}

