package com.choom.back.repository;

import com.choom.back.config.DBConfig;
import com.choom.back.entity.Question;
import com.choom.back.exception.BadRequestException;
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
        String findQuestionQuery = "select id, content, author_name, creation_date, upvote_count, session_id from question where id=?";

        try(Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(findQuestionQuery)) {
            preparedStatement.setObject(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            if(resultSet.next()){
                Question question = mapQuestion(resultSet);
                return Optional.of(question);
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    };

    public List<Question> findQuestionsBySessionId(UUID sessionId, String visitorId){
        List<Question> questions = new ArrayList<>();
        String findBySessionId = """
            SELECT q.id, q.content, q.author_name, q.creation_date, q.upvote_count, q.session_id,
                   CASE WHEN qv.id IS NOT NULL THEN TRUE ELSE FALSE END AS voted_by_current_user
            FROM question q
            LEFT JOIN question_vote qv ON qv.question_id = q.id AND qv.visitor_id = ?
            WHERE q.session_id = ?
        """;

        try(Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(findBySessionId)){
            preparedStatement.setString(1, visitorId);
            preparedStatement.setObject(2, sessionId);
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()){
                questions.add(mapQuestion(resultSet));
            }
            return  questions;
        }catch (SQLException e){
            throw  new RuntimeException(e);
        }
    }

    public List<Question> findAllQuestions(){
            List<Question> questions = new ArrayList<>();
            String findAllQuery = "select id, content, author_name, creation_date, upvote_count, session_id from question";

            try(Connection connection = dbConfig.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(findAllQuery)){
                ResultSet resultSet= preparedStatement.executeQuery();
                while(resultSet.next()){
                    questions.add(mapQuestion(resultSet));
                }
                return questions;
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }

    }

    public Question createQuestion(Question question){

        String saveQuestionQuery = "Insert into question (id, content, author_name, creation_date, upvote_count, session_id) " +
                "values (?, ? , ?, ?, ?, ?) ";

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

            preparedStatement.setObject(6, question.getSessionId());

            preparedStatement.executeUpdate();
            return question;

        } catch (SQLException e) {
            throw new RuntimeException("error saving question",e);
        }
    }

    private Question mapQuestion(ResultSet resultSet) throws SQLException {
        Question question = new Question();
        question.setId(resultSet.getObject("id", UUID.class));
        question.setContent(resultSet.getString("content"));
        question.setAuthorName(resultSet.getString("author_name"));
        question.setCreationDate(resultSet.getTimestamp("creation_date"));
        question.setUpvoteCount(resultSet.getInt("upvote_count"));
        question.setSessionId((UUID) resultSet.getObject("session_id"));
        try {
            question.setVotedByCurrentUser(resultSet.getBoolean("voted_by_current_user"));
        } catch (SQLException ignored) {
            question.setVotedByCurrentUser(false);
        }
        return question;
    }

    public void upvoteCount(UUID questionId, String visitorId){
        String insertVoteQuery = """
            INSERT INTO question_vote (id, question_id, visitor_id)
            VALUES (gen_random_uuid(), ?, ?)
            ON CONFLICT (question_id, visitor_id) DO NOTHING
        """;
        String updateCountQuery = """
            UPDATE question
            SET upvote_count = upvote_count + 1
            WHERE id = ?
        """;
        try (Connection connection = dbConfig.getConnection()) {
            try (PreparedStatement ps = connection.prepareStatement(insertVoteQuery)) {
                ps.setObject(1, questionId);
                ps.setString(2, visitorId);
                int rows = ps.executeUpdate();
                if (rows == 0) {
                    throw new BadRequestException("You have already voted for this question");
                }
            }
            try (PreparedStatement ps = connection.prepareStatement(updateCountQuery)) {
                ps.setObject(1, questionId);
                int rows = ps.executeUpdate();
                if (rows == 0) {
                    throw new RuntimeException("Question not found");
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }



}
