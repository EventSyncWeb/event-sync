package com.choom.back.repository;

import com.choom.back.config.DBConfig;
import com.choom.back.entity.Session;
import com.choom.back.entity.Speaker;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
                SELECT s.id, s.title, s.description, s.start_time, s.end_time, s.room_id, s.capacity, s.event_id, r.name AS room_name
                FROM session s
                LEFT JOIN room r ON s.room_id = r.id
                ORDER BY s.start_time; 
                """;

        try(Connection connection = dbConfig.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(query)){
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()){

                Session session = new Session();
                session.setId((UUID) resultSet.getObject("id"));
                session.setTitle(resultSet.getString("title"));
                session.setDescription(resultSet.getString("description"));
                session.setStartTime(resultSet.getTime("start_time").toLocalTime());
                session.setEndTime(resultSet.getTime("end_time").toLocalTime());
                session.setRoom((UUID) resultSet.getObject("room_id"));
                session.setRoomName(resultSet.getString("room_name"));
                session.setCapacity((Integer) resultSet.getObject("capacity"));
                session.setEventId((UUID) resultSet.getObject("event_id"));
                session.setSpeakers(findSpeakersForSession(session.getId()));
                sessionList.add(session);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return sessionList;
    }

    public Session findSessionById(UUID id) {
        String  query = """
                SELECT s.id, s.title, s.description, s.start_time, s.end_time, s.room_id, s.capacity, s.event_id, r.name AS room_name
                FROM session s
                LEFT JOIN room r ON s.room_id = r.id
                WHERE s.id = ?;
        """;

        try(Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query)){
            preparedStatement.setObject(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()){
                Session session = new Session();
                session.setId((UUID) resultSet.getObject("id"));
                session.setTitle(resultSet.getString("title"));
                session.setDescription(resultSet.getString("description"));
                session.setStartTime(resultSet.getTime("start_time").toLocalTime());
                session.setEndTime(resultSet.getTime("end_time").toLocalTime());
                session.setRoom((UUID) resultSet.getObject("room_id"));
                session.setRoomName(resultSet.getString("room_name"));
                session.setCapacity((Integer) resultSet.getObject("capacity"));
                session.setEventId((UUID) resultSet.getObject("event_id"));
                session.setSpeakers(findSpeakersForSession(session.getId()));
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
                SELECT s.id, s.title, s.description, s.start_time, s.end_time, s.room_id, s.capacity, s.event_id, r.name AS room_name
                FROM session s
                LEFT JOIN room r ON s.room_id = r.id
                WHERE s.event_id = ?
                ORDER BY s.start_time; 
                """;

        try(Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setObject(1, eventId);
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()){
                Session session = new Session();
                session.setId((UUID) resultSet.getObject("id"));
                session.setTitle(resultSet.getString("title"));
                session.setDescription(resultSet.getString("description"));
                session.setStartTime(resultSet.getTime("start_time").toLocalTime());
                session.setEndTime(resultSet.getTime("end_time").toLocalTime());
                session.setRoom((UUID) resultSet.getObject("room_id"));
                session.setRoomName(resultSet.getString("room_name"));
                session.setCapacity((Integer) resultSet.getObject("capacity"));
                session.setEventId((UUID) resultSet.getObject("event_id"));
                session.setSpeakers(findSpeakersForSession(session.getId()));
                sessionList.add(session);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return sessionList;
    }

    public Session createSession(Session session) {
        if (session.getId() == null) {
            session.setId(UUID.randomUUID());
        }

        String query = """
                INSERT INTO session (id, title, description, start_time, end_time, room_id, capacity, event_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """;

        try(Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setObject(1, session.getId());
            preparedStatement.setString(2, session.getTitle());
            preparedStatement.setString(3, session.getDescription());
            preparedStatement.setObject(4,session.getStartTime());
            preparedStatement.setObject(5, session.getEndTime());
            preparedStatement.setObject(6, session.getRoom());
            preparedStatement.setObject(7, session.getCapacity());
            preparedStatement.setObject(8, session.getEventId());
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        if (session.getSpeakers() != null && !session.getSpeakers().isEmpty()) {
            saveSessionSpeakers(session.getId(), session.getSpeakers());
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
            preparedStatement.setObject(6, session.getCapacity());
            preparedStatement.setObject(7, session.getEventId());
            preparedStatement.setObject(8, session.getId());

            preparedStatement.executeUpdate();
        }catch (SQLException e) {
            throw new RuntimeException(e);
        }

        deleteSessionSpeakers(session.getId());
        if (session.getSpeakers() != null && !session.getSpeakers().isEmpty()) {
            saveSessionSpeakers(session.getId(), session.getSpeakers());
        }

        return session;

    }

    public void deleteSessionById(UUID id) {
        try (Connection connection = dbConfig.getConnection()) {
            String deleteSpeakersQuery = "DELETE FROM session_speakers WHERE session_id = ?";
            try (PreparedStatement stmt = connection.prepareStatement(deleteSpeakersQuery)) {
                stmt.setObject(1, id);
                stmt.executeUpdate();
            }

            String deleteSessionQuery = "DELETE FROM session WHERE id = ?";
            try (PreparedStatement stmt = connection.prepareStatement(deleteSessionQuery)) {
                stmt.setObject(1, id);
                stmt.executeUpdate();
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteAllSession() {
        try(Connection connection = dbConfig.getConnection()) {
            String deleteSpeakersQuery = "DELETE FROM session_speakers";
            try (PreparedStatement stmt = connection.prepareStatement(deleteSpeakersQuery)) {
                stmt.executeUpdate();
            }

            String deleteSessionQuery = "DELETE FROM session";
            try (PreparedStatement stmt = connection.prepareStatement(deleteSessionQuery)) {
                stmt.executeUpdate();
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean existsSessionById(UUID id) {
        String query = """
                        SELECT COUNT(id)
                        FROM session
                        WHERE id = ?
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

    public boolean existsConflictingSession(UUID roomId, LocalDateTime startTime, LocalDateTime endTime, UUID excludeId) {
        String query;
        if (excludeId != null) {
            query = """
                SELECT COUNT(*) FROM session
                WHERE room_id = ?
                  AND start_time < ?
                  AND end_time > ?
                  AND id != ?
            """;
        } else {
            query = """
                SELECT COUNT(*) FROM session
                WHERE room_id = ?
                  AND start_time < ?
                  AND end_time > ?
            """;
        }

        try (Connection connection = dbConfig.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setObject(1, roomId);
            stmt.setObject(2, endTime);
            stmt.setObject(3, startTime);
            if (excludeId != null) {
                stmt.setObject(4, excludeId);
            }
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return false;
    }

    private List<Speaker> findSpeakersForSession(UUID sessionId) {
        List<Speaker> speakers = new ArrayList<>();
        String query = """
                SELECT s.id, s.first_name, s.last_name, s.description, s.linkedIn, s.company, s.email,
                       sess.title AS session_title
                FROM speaker s
                JOIN session_speakers ss ON s.id = ss.speaker_id
                LEFT JOIN session sess ON ss.session_id = sess.id
                WHERE ss.session_id = ?
                """;

        try (Connection connection = dbConfig.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setObject(1, sessionId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Speaker speaker = new Speaker();
                speaker.setId((UUID) rs.getObject("id"));
                speaker.setSessionId(sessionId);
                speaker.setSessionTitle(rs.getString("session_title"));
                speaker.setFirstName(rs.getString("first_name"));
                speaker.setLastName(rs.getString("last_name"));
                speaker.setBiography(rs.getString("description"));
                speaker.setLinkedIn(rs.getString("linkedIn"));
                speaker.setCompany(rs.getString("company"));
                speaker.setEmail(rs.getString("email"));
                speakers.add(speaker);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return speakers;
    }

    private void saveSessionSpeakers(UUID sessionId, List<Speaker> speakers) {
        String query = "INSERT INTO session_speakers (session_id, speaker_id) VALUES (?, ?)";
        try (Connection connection = dbConfig.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {
            for (Speaker speaker : speakers) {
                stmt.setObject(1, sessionId);
                stmt.setObject(2, speaker.getId());
                stmt.addBatch();
            }
            stmt.executeBatch();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private void deleteSessionSpeakers(UUID sessionId) {
        String query = "DELETE FROM session_speakers WHERE session_id = ?";
        try (Connection connection = dbConfig.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setObject(1, sessionId);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }



}
