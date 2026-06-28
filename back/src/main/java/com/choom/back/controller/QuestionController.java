package com.choom.back.controller;

import com.choom.back.entity.Question;
import com.choom.back.service.QuestionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@AllArgsConstructor
@RestController

public class QuestionController {
    private final QuestionService questionServices;

    @GetMapping("/question")
    public ResponseEntity<List<Question>> getAllQuestions(){
         return ResponseEntity.status(HttpStatus.OK).body(questionServices.getAllQuestions());
        }

    @GetMapping("/question/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable UUID id){
            Question question= questionServices.getQuestionById(id);
            return ResponseEntity.status(HttpStatus.OK).body(question);
    }

    @GetMapping("/question/session/{sessionId}")
    public ResponseEntity<List<Question>> getQuestionsBySessionId(@PathVariable UUID sessionId){
        List<Question> questions = questionServices.getQuestionsBySessionId(sessionId);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/question")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question){
        Question created = questionServices.createQuestion(question);

            return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/question/session/{sessionId}")
    public ResponseEntity<Question> createQuestionForSession(
            @PathVariable UUID sessionId,
            @RequestBody Question question
    ){
        Question created = questionServices.createQuestionForSession(sessionId, question);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/question/{id}/upvote")
    public ResponseEntity<String> upvote(
            @PathVariable UUID id
    ){
        questionServices.upvoteQuestion(id);
        return ResponseEntity.ok("Upvote added");
    }



}
