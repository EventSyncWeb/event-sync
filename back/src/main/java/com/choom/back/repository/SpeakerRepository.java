package com.choom.back.repository;

import com.choom.back.config.DBConfig;
import com.choom.back.entity.Session;
import com.choom.back.entity.Speaker;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
@AllArgsConstructor
public class SpeakerRepository {
    private DBConfig dbConfig;

    public List<Speaker> findAllSpeaker() {
        Map<UUID, Speaker> speakerMap = new LinkedHashMap<>();
        String query = """
            SELECT s.id, s.first_name, s.last_name, s.description, s.linkedIn, s.company, s.email, s.profile_pic,
                   ss.session_id, sess.title AS session_title
            FROM speaker s
            LEFT JOIN session_speakers ss ON s.id = ss.speaker_id
            LEFT JOIN session sess ON ss.session_id = sess.id
            ORDER BY s.id
        """;

        try (Connection con = dbConfig.getConnection();
             PreparedStatement stmt = con.prepareStatement(query)) {
            ResultSet rs = stmt.executeQuery();
            aggregateSpeakers(rs, speakerMap);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return new ArrayList<>(speakerMap.values());
    }

    public List<Speaker> findSpeakersByName(String query) {
        Map<UUID, Speaker> speakerMap = new LinkedHashMap<>();
        String sql = """
                SELECT s.id, s.first_name, s.last_name, s.description, s.linkedIn, s.company, s.email, s.profile_pic,
                       ss.session_id, sess.title AS session_title
                FROM speaker s
                LEFT JOIN session_speakers ss ON s.id = ss.speaker_id
                LEFT JOIN session sess ON ss.session_id = sess.id
                WHERE s.first_name ILIKE ? OR s.last_name ILIKE ?
                ORDER BY s.id
        """;
        try (Connection con = dbConfig.getConnection();
             PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, "%" + query + "%");
            stmt.setString(2, "%" + query + "%");
            ResultSet rs = stmt.executeQuery();
            aggregateSpeakers(rs, speakerMap);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return new ArrayList<>(speakerMap.values());
    }

    public Speaker findSpeakerById(UUID id) {
        Map<UUID, Speaker> speakerMap = new LinkedHashMap<>();
        String query = """
                SELECT s.id, s.first_name, s.last_name, s.description, s.linkedIn, s.company, s.email, s.profile_pic,
                       ss.session_id, sess.title AS session_title
                FROM speaker s
                LEFT JOIN session_speakers ss ON s.id = ss.speaker_id
                LEFT JOIN session sess ON ss.session_id = sess.id
                WHERE s.id = ?
                """;

        try(Connection con = dbConfig.getConnection();
        PreparedStatement stmt = con.prepareStatement(query)) {
            stmt.setObject(1, id);
            ResultSet rs = stmt.executeQuery();
            aggregateSpeakers(rs, speakerMap);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return speakerMap.isEmpty() ? null : speakerMap.values().iterator().next();
    }

    public List<Speaker> findSpeakersBySessionId(UUID sessionId) {
        Map<UUID, Speaker> speakerMap = new LinkedHashMap<>();
        String query = """
                SELECT s.id, s.first_name, s.last_name, s.description, s.linkedIn, s.company, s.email, s.profile_pic,
                       ss_all.session_id, sess_all.title AS session_title
                FROM speaker s
                JOIN session_speakers ss_filter ON s.id = ss_filter.speaker_id AND ss_filter.session_id = ?
                LEFT JOIN session_speakers ss_all ON s.id = ss_all.speaker_id
                LEFT JOIN session sess_all ON ss_all.session_id = sess_all.id
                """;

        try(Connection connection = dbConfig.getConnection();
        PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setObject(1, sessionId);
            ResultSet rs = stmt.executeQuery();
            aggregateSpeakers(rs, speakerMap);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return new ArrayList<>(speakerMap.values());
    }

    private void aggregateSpeakers(ResultSet rs, Map<UUID, Speaker> speakerMap) throws SQLException {
        while (rs.next()) {
            UUID id = UUID.fromString(rs.getString("id"));
            Speaker speaker = speakerMap.get(id);
            if (speaker == null) {
                speaker = new Speaker();
                speaker.setId(id);
                speaker.setFirstName(rs.getString("first_name"));
                speaker.setLastName(rs.getString("last_name"));
                speaker.setBiography(rs.getString("description"));
                speaker.setLinkedIn(rs.getString("linkedIn"));
                speaker.setCompany(rs.getString("company"));
                speaker.setEmail(rs.getString("email"));
                speaker.setProfilePic(rs.getString("profile_pic"));
                speakerMap.put(id, speaker);
            }
            UUID sessionId = rs.getObject("session_id") != null ? (UUID) rs.getObject("session_id") : null;
            if (sessionId != null) {
                String title = rs.getString("session_title");
                if (speaker.getSessions().stream().noneMatch(s -> s.getId().equals(sessionId))) {
                    Session s = new Session();
                    s.setId(sessionId);
                    s.setTitle(title);
                    speaker.getSessions().add(s);
                }
            }
        }
    }

    public Speaker saveSpeaker(Speaker speaker) {
        String query = "INSERT INTO speaker (id, first_name, last_name, description, linkedIn, company, email, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection connection = dbConfig.getConnection()) {
            if (speaker.getId() == null) {
                speaker.setId(UUID.randomUUID());
            }

            try (PreparedStatement stmt = connection.prepareStatement(query)) {
                stmt.setObject(1, speaker.getId());
                stmt.setString(2, speaker.getFirstName());
                stmt.setString(3, speaker.getLastName());
                stmt.setString(4, speaker.getBiography());
                stmt.setString(5, speaker.getLinkedIn());
                stmt.setString(6, speaker.getCompany());
                stmt.setString(7, speaker.getEmail());
                stmt.setString(8, speaker.getProfilePic());
                stmt.executeUpdate();
            }

            saveSpeakerSessions(connection, speaker.getId(), speaker.getSessions());

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return speaker;
    }

    void saveSpeakerSessions(Connection connection, UUID speakerId, List<Session> sessions) {
        if (sessions == null || sessions.isEmpty()) return;
        String linkQuery = "INSERT INTO session_speakers (session_id, speaker_id) VALUES (?, ?)";
        try (PreparedStatement linkStmt = connection.prepareStatement(linkQuery)) {
            for (Session session : sessions) {
                linkStmt.setObject(1, session.getId());
                linkStmt.setObject(2, speakerId);
                linkStmt.addBatch();
            }
            linkStmt.executeBatch();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
