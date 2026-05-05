package com.choom.back.controller;

import com.choom.back.entity.Answer;
import com.choom.back.exception.BadRequestException;
import com.choom.back.exception.NotFoundException;
import com.choom.back.service.AnswerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class AnswerController {
    AnswerService answerService;

    @GetMapping("/answers")
    public ResponseEntity<?> getAllAnswers(){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(answerService.getAllAnswers());
        }catch (BadRequestException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/answer/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable UUID id){
        try{
            Answer answer= answerService.getAnswerById(id);
            return ResponseEntity.status(HttpStatus.OK).body(answerService.getAnswerById(id));
        }catch (BadRequestException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Answer> createAnswer(@RequestBody Answer answer){
//        try{
        Answer answerMapped = answerService.mapToEntity(answer);
        Answer created = answerService.createAnswer(answerMapped);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
//        }catch (IllegalArgumentException e){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input:" + e.getMessage());
//        }catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Failed to create question: " + e.getMessage());
//        }
    }
}
