package com.choom.back.repository;

import com.choom.back.config.DBConfig;
import com.choom.back.entity.Answer;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class AnswerRepository {
    DBConfig dbConfig = new DBConfig();

    public Optional<Answer> findAnswerById(UUID id){
        String findAnswerQuery = "select id, content, author_name, creation_date,upvote_count, question_id from answer where id=?";

        try(Connection connection = dbConfig.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(findAnswerQuery)) {
            preparedStatement.setObject(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            if(resultSet.next()){
                Answer answer = new Answer();
                answer.setId(resultSet.getObject( "id",UUID.class));
                answer.setContent(resultSet.getString("content"));
                answer.setAuthorName(resultSet.getString("author_name"));
                answer.setCreationDate(resultSet.getTimestamp("creation_date"));

                return Optional.of(answer);
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    };

    public List<Answer> findAllAnswer(){
        List<Answer> answers = new ArrayList<>();
        String findAllQuery = "select id, content, author_name, creation_date,question_id from answer";

        try(Connection connection = dbConfig.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(findAllQuery)){
            ResultSet resultSet= preparedStatement.executeQuery();
            while(resultSet.next()){
                Answer answer = new Answer();
                answer.setId(resultSet.getObject( "id",UUID.class));
                answer.setContent(resultSet.getString("content"));
                answer.setAuthorName(resultSet.getString("author_name"));
                answer.setCreationDate(resultSet.getTimestamp("creation_date"));
                answers.add(answer);
            }
            return answers;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }
    public Answer createAnswer(Answer answer){

        String saveAnswerQuery = "Insert into answer (id, content,author_name, creation_date, upvote_count,question_id) " +
                "values (?, ? , ?, ?,?) ";

        try(Connection connection = dbConfig.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(saveAnswerQuery)){

            if(answer.getId() == null){
                answer.setId(UUID.randomUUID());
            }

            preparedStatement.setObject(1, answer.getId());
            preparedStatement.setString(2, answer.getContent());
            preparedStatement.setString(3, answer.getAuthorName());

            Timestamp creationDate = answer.getCreationDate() != null
                    ? answer.getCreationDate()
                    : new Timestamp(System.currentTimeMillis());
            preparedStatement.setTimestamp(4, creationDate);

            preparedStatement.setInt(5, answer.getUpvoteCount() != null
                    ? answer.getUpvoteCount()
                    : 0);

            preparedStatement.setObject(6, answer.getSession());

            preparedStatement.executeUpdate();
            return answer;

        } catch (SQLException e) {
            throw new RuntimeException("error saving answer",e);
        }
    }
}
