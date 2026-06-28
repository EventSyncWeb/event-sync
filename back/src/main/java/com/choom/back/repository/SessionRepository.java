package com.choom.back.repository;

import com.choom.back.config.DBConfig;
import com.choom.back.entity.Session;
import com.choom.back.entity.Speaker;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
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
                SELECT s.id, s.title, s.description, s.date, s.start_time, s.end_time, s.room_id, s.event_id, r.name AS room_name
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
                session.setDate(resultSet.getDate("date").toLocalDate());
                session.setStartTime(resultSet.getTime("start_time").toLocalTime());
                session.setEndTime(resultSet.getTime("end_time").toLocalTime());
                session.setRoom((UUID) resultSet.getObject("room_id"));
                session.setRoomName(resultSet.getString("room_name"));
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
                SELECT s.id, s.title, s.description, s.date, s.start_time, s.end_time, s.room_id, s.event_id, r.name AS room_name
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
                session.setDate(resultSet.getDate("date").toLocalDate());
                session.setStartTime(resultSet.getTime("start_time").toLocalTime());
                session.setEndTime(resultSet.getTime("end_time").toLocalTime());
                session.setRoom((UUID) resultSet.getObject("room_id"));
                session.setRoomName(resultSet.getString("room_name"));
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
                SELECT s.id, s.title, s.description, s.date, s.start_time, s.end_time, s.room_id, s.event_id, r.name AS room_name
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
                session.setDate(resultSet.getDate("date").toLocalDate());
                session.setStartTime(resultSet.getTime("start_time").toLocalTime());
                session.setEndTime(resultSet.getTime("end_time").toLocalTime());
                session.setRoom((UUID) resultSet.getObject("room_id"));
                session.setRoomName(resultSet.getString("room_name"));
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
                INSERT INTO session (id, title, description, start_time, end_time, room_id, event_id, date)
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
            preparedStatement.setObject(8, session.getEventId());
            preparedStatement.setObject(9, session.getDate());
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
                SET title = ?, description = ?, date = ?, start_time = ?, end_time = ?, room_id = ?, capacity = ?, event_id = ?
                WHERE id = ?
        """;
        try(Connection connection = dbConfig.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, session.getTitle());
            preparedStatement.setString(2, session.getDescription());
            preparedStatement.setObject(3, session.getDate());
            preparedStatement.setObject(4, session.getStartTime());
            preparedStatement.setObject(5, session.getEndTime());
            preparedStatement.setObject(6, session.getRoom());
            preparedStatement.setObject(8, session.getEventId());
            preparedStatement.setObject(9, session.getId());

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

    public boolean existsConflictingSession(UUID roomId, LocalTime startTime, LocalTime endTime, UUID excludeId) {
        return existsConflictingSession(roomId, null, startTime, endTime, excludeId);
    }

    public boolean existsConflictingSession(UUID roomId, LocalDate date, LocalTime startTime, LocalTime endTime, UUID excludeId) {
        String query;
        boolean hasDate = date != null;
        if (excludeId != null) {
            if (hasDate) {
                query = """
                    SELECT COUNT(*) FROM session
                    WHERE room_id = ?
                      AND date = ?
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
                      AND id != ?
                """;
            }
        } else {
            if (hasDate) {
                query = """
                    SELECT COUNT(*) FROM session
                    WHERE room_id = ?
                      AND date = ?
                      AND start_time < ?
                      AND end_time > ?
                """;
            } else {
                query = """
                    SELECT COUNT(*) FROM session
                    WHERE room_id = ?
                      AND start_time < ?
                      AND end_time > ?
                """;
            }
        }

        try (Connection connection = dbConfig.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setObject(1, roomId);
            int idx = 2;
            if (hasDate) {
                stmt.setObject(idx++, date);
            }
            stmt.setObject(idx++, endTime);
            stmt.setObject(idx++, startTime);
            if (excludeId != null) {
                stmt.setObject(idx, excludeId);
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
                speaker.setFirstName(rs.getString("first_name"));
                speaker.setLastName(rs.getString("last_name"));
                speaker.setBiography(rs.getString("description"));
                speaker.setLinkedIn(rs.getString("linkedIn"));
                speaker.setCompany(rs.getString("company"));
                speaker.setEmail(rs.getString("email"));
                Session s = new Session();
                s.setId(sessionId);
                s.setTitle(rs.getString("session_title"));
                speaker.getSessions().add(s);
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

    public boolean existsSpeakerTimeConflict(UUID speakerId, LocalDate date, LocalTime startTime, LocalTime endTime, UUID excludeSessionId) {
        String query;
        if (excludeSessionId != null) {
            query = """
                SELECT COUNT(*) FROM session s
                JOIN session_speakers ss ON s.id = ss.session_id
                WHERE ss.speaker_id = ?
                  AND s.date = ?
                  AND s.start_time < ?
                  AND s.end_time > ?
                  AND s.id != ?
            """;
        } else {
            query = """
                SELECT COUNT(*) FROM session s
                JOIN session_speakers ss ON s.id = ss.session_id
                WHERE ss.speaker_id = ?
                  AND s.date = ?
                  AND s.start_time < ?
                  AND s.end_time > ?
            """;
        }

        try (Connection connection = dbConfig.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setObject(1, speakerId);
            stmt.setObject(2, date);
            stmt.setObject(3, endTime);
            stmt.setObject(4, startTime);
            if (excludeSessionId != null) {
                stmt.setObject(5, excludeSessionId);
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

    public boolean toggleFavorite(UUID sessionId, String visitorId) {
        String checkQuery = "SELECT COUNT(*) FROM session_favorite WHERE session_id = ? AND visitor_id = ?";
        String insertQuery = "INSERT INTO session_favorite (id, session_id, visitor_id) VALUES (gen_random_uuid(), ?, ?)";
        String deleteQuery = "DELETE FROM session_favorite WHERE session_id = ? AND visitor_id = ?";

        try (Connection connection = dbConfig.getConnection();
             PreparedStatement checkPs = connection.prepareStatement(checkQuery)) {
            checkPs.setObject(1, sessionId);
            checkPs.setString(2, visitorId);
            ResultSet rs = checkPs.executeQuery();
            rs.next();
            if (rs.getInt(1) > 0) {
                try (PreparedStatement deletePs = connection.prepareStatement(deleteQuery)) {
                    deletePs.setObject(1, sessionId);
                    deletePs.setString(2, visitorId);
                    deletePs.executeUpdate();
                }
                return false;
            } else {
                try (PreparedStatement insertPs = connection.prepareStatement(insertQuery)) {
                    insertPs.setObject(1, sessionId);
                    insertPs.setString(2, visitorId);
                    insertPs.executeUpdate();
                }
                return true;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean isFavorited(UUID sessionId, String visitorId) {
        String query = "SELECT COUNT(*) FROM session_favorite WHERE session_id = ? AND visitor_id = ?";
        try (Connection connection = dbConfig.getConnection();
             PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setObject(1, sessionId);
            ps.setString(2, visitorId);
            ResultSet rs = ps.executeQuery();
            rs.next();
            return rs.getInt(1) > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Session> findFavoriteSessions(String visitorId) {
        List<Session> sessionList = new ArrayList<>();
        String query = """
                SELECT s.id, s.title, s.description, s.date, s.start_time, s.end_time, s.room_id, s.event_id, r.name AS room_name
                FROM session s
                LEFT JOIN room r ON s.room_id = r.id
                JOIN session_favorite sf ON sf.session_id = s.id
                WHERE sf.visitor_id = ?
                ORDER BY s.start_time
                """;

        try (Connection connection = dbConfig.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setString(1, visitorId);
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                Session session = new Session();
                session.setId((UUID) resultSet.getObject("id"));
                session.setTitle(resultSet.getString("title"));
                session.setDescription(resultSet.getString("description"));
                session.setDate(resultSet.getDate("date").toLocalDate());
                session.setStartTime(resultSet.getTime("start_time").toLocalTime());
                session.setEndTime(resultSet.getTime("end_time").toLocalTime());
                session.setRoom((UUID) resultSet.getObject("room_id"));
                session.setRoomName(resultSet.getString("room_name"));
                session.setEventId((UUID) resultSet.getObject("event_id"));
                session.setSpeakers(findSpeakersForSession(session.getId()));
                sessionList.add(session);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return sessionList;
    }

    public List<Session> findSessionsByIds(Collection<UUID> ids) {
        if (ids == null || ids.isEmpty()) return List.of();
        List<Session> sessions = new ArrayList<>();
        String placeholders = String.join(",", Collections.nCopies(ids.size(), "?"));
        String query = "SELECT id, date, start_time, end_time FROM session WHERE id IN (" + placeholders + ")";

        try (Connection connection = dbConfig.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {
            int i = 1;
            for (UUID id : ids) {
                stmt.setObject(i++, id);
            }
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Session s = new Session();
                s.setId((UUID) rs.getObject("id"));
                s.setDate(rs.getDate("date").toLocalDate());
                s.setStartTime(rs.getTime("start_time").toLocalTime());
                s.setEndTime(rs.getTime("end_time").toLocalTime());
                sessions.add(s);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return sessions;
    }


}
