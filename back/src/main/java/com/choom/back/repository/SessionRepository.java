package com.choom.back.repository;

import com.choom.back.config.DBConfig;
import com.choom.back.entity.Session;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
@AllArgsConstructor
public class SessionRepository {

    private DBConfig dbConfig;


    public void validateActiveSession(Connection connection) throws SQLException {
        String checkSessionQuery = "SELECT COUNT(*) FROM session WHERE start_time <= ? AND (end_time IS NULL OR end_time >= ?)";

        try (PreparedStatement sessionStatement = connection.prepareStatement(checkSessionQuery)) {
            Timestamp now = new Timestamp(System.currentTimeMillis());
            sessionStatement.setTimestamp(1, now);
            sessionStatement.setTimestamp(2, now);

            ResultSet rs = sessionStatement.executeQuery();
            rs.next();

            if (rs.getInt(1) == 0) {
                throw new IllegalStateException("No active session. Question cannot be created outside of a session.");
            }
        }
    }

    public List<Session> findAllSession() {
        List<Session> sessionList = new ArrayList<>();
        String query = """
                SELECT id, title, description, start_time, end_time, room_id, capacity, event_id
                FROM session
                ORDER BY start_time; 
                """;

        try(Connection connection = dbConfig.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(query)){
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()){

                Session session = new Session();
                session.setSessionId((UUID) resultSet.getObject("id"));
                session.setTitle(resultSet.getString("title"));
                session.setDescription(resultSet.getString("description"));
                session.setStartTime(resultSet.getTimestamp("start_time").toLocalDateTime());
                session.setEndTime(resultSet.getTimestamp("end_time").toLocalDateTime());
                session.setRoom((UUID) resultSet.getObject("room_id"));
                session.setEventId((UUID) resultSet.getObject("event_id"));
                sessionList.add(session);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return sessionList;
    }

    public Session findSessionById(UUID id) {
        String  query = """
                SELECT id, title, description, start_time, end_time, room_id, capacity, event_id
                FROM session
                WHERE id = ?;
        """;

        try(Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query)){
            preparedStatement.setObject(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()){
                Session session = new Session();
                session.setSessionId((UUID) resultSet.getObject("id"));
                session.setTitle(resultSet.getString("title"));
                session.setDescription(resultSet.getString("description"));
                session.setStartTime(resultSet.getTimestamp("start_time").toLocalDateTime());
                session.setEndTime(resultSet.getTimestamp("end_time").toLocalDateTime());
                session.setRoom((UUID) resultSet.getObject("room_id"));
                session.setEventId((UUID) resultSet.getObject("event_id"));
                return session;
            }
    }
        catch (SQLException e) {
        throw new RuntimeException(e);
        }
        return null;
    }

    public List<Session> findSessionByEventId(UUID eventId) {
        List<Session> sessionList = new ArrayList<>();
        String query = """
                SELECT id, title, description, start_time, end_time, room_id, capacity, event_id
                FROM session
                WHERE event_id = ?
                ORDER BY start_time; 
                """;

        try(Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setObject(1, eventId);
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()){
                Session session = new Session();
                session.setSessionId((UUID) resultSet.getObject("id"));
                session.setTitle(resultSet.getString("title"));
                session.setDescription(resultSet.getString("description"));
                session.setStartTime(resultSet.getTimestamp("start_time").toLocalDateTime());
                session.setEndTime(resultSet.getTimestamp("end_time").toLocalDateTime());
                session.setRoom((UUID) resultSet.getObject("room_id"));
                session.setEventId((UUID) resultSet.getObject("event_id"));
                sessionList.add(session);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return sessionList;
    }

    public Session createSession(Session session) {
        String query = """
                INSERT INTO session (id, title, description, start_time, end_time, room_id, capacity, event_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
        """;

        try(Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setObject(1, session.getSessionId());
            preparedStatement.setString(2, session.getTitle());
            preparedStatement.setString(3, session.getDescription());
            preparedStatement.setObject(4, session.getStartTime());
            preparedStatement.setObject(5, session.getEndTime());
            preparedStatement.setObject(6, session.getRoom());
            preparedStatement.setObject(7, session.getEventId());
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return session;

    }


    public Session updateSession(Session session) {
        String query = """
                UPDATE session
                SET title = ?, description = ?, start_time = ?, end_time = ?, room_id = ?, capacity = ?, event_id = ?
                WHERE id = ?
        """;
        try(Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, session.getTitle());
            preparedStatement.setString(2, session.getDescription());
            preparedStatement.setObject(3, session.getStartTime());
            preparedStatement.setObject(4, session.getEndTime());
            preparedStatement.setObject(5, session.getRoom());
            preparedStatement.setObject(6, session.getEventId());
            preparedStatement.setObject(7, session.getSessionId());

            preparedStatement.executeUpdate();
        }catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return session;

    }

    public void deleteSessionById(UUID id) {
        String query = """
                        DELETE FROM session
                        WHERE id = ?;
                """;

        try (Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setObject(1, id);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteAllSession() {
        String query = """
                        DELETE FROM session
        """;
        try(Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean existsSessionById(UUID id) {
        String query = """
                        SELECT COUNT(id) 
                        FROM session
        """;

        try (Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setObject(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            if(resultSet.next()) {
                return resultSet.getInt(1) > 0;
            }
        }catch (SQLException e) {
            throw new  RuntimeException(e);
        }
        return false;
    }


}
