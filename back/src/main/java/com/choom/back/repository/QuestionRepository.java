package com.choom.back.repository;

import com.choom.back.config.DBConfig;
import com.choom.back.entity.Question;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@AllArgsConstructor
@Repository
public class QuestionRepository {
    private final DBConfig dbConfig;

    public Optional<Question> findQuestionById(UUID id){
        String findQuestionQuery = "select id, content, author_name, creation_date,upvote_count from question where id=?";

        try(Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(findQuestionQuery)) {
            preparedStatement.setObject(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            if(resultSet.next()){
                Question question = new Question();
                question.setId(resultSet.getObject( "id",UUID.class));
                question.setContent(resultSet.getString("content"));
                question.setAuthorName(resultSet.getString("author_name"));
                question.setCreationDate(resultSet.getTimestamp("creation_date"));
                question.setUpvoteCount(resultSet.getInt(("upvote_count")));

                return Optional.of(question);
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    };

    public List<Question> findAllQuestions(){
            List<Question> questions = new ArrayList<>();
            String findAllQuery = "select id, content, author_name, creation_date,upvote_count from question";

            try(Connection connection = dbConfig.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(findAllQuery)){
                ResultSet resultSet= preparedStatement.executeQuery();
                while(resultSet.next()){
                    Question question = new Question();
                    question.setId(resultSet.getObject( "id",UUID.class));
                    question.setContent(resultSet.getString("content"));
                    question.setAuthorName(resultSet.getString("author_name"));
                    question.setCreationDate(resultSet.getTimestamp("creation_date"));
                    question.setUpvoteCount(resultSet.getInt(("upvote_count")));
                    questions.add(question);
                }
                return questions;
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }

    }

    public Question createQuestion(Question question){

        String saveQuestionQuery = "Insert into question (id, content,author_name, creation_date, upvote_count) " +
                "values (?, ? , ?, ?, ?) ";

        try(Connection connection = dbConfig.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(saveQuestionQuery)){

            if(question.getId() == null){
                question.setId(UUID.randomUUID());
            }

            preparedStatement.setObject(1, question.getId());
            preparedStatement.setString(2, question.getContent());
            preparedStatement.setString(3, question.getAuthorName());

            Timestamp creationDate = question.getCreationDate() != null
                    ? question.getCreationDate()
                    : new Timestamp(System.currentTimeMillis());
            preparedStatement.setTimestamp(4, creationDate);

            preparedStatement.setInt(5, question.getUpvoteCount() != null
                    ? question.getUpvoteCount()
                    : 0);

            preparedStatement.executeUpdate();
            return question;

        } catch (SQLException e) {
            throw new RuntimeException("error saving question",e);
        }
    }




}
