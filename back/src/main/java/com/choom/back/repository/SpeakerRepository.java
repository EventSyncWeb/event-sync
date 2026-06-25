package com.choom.back.repository;

import com.choom.back.config.DBConfig;
import com.choom.back.entity.Speaker;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
@AllArgsConstructor
public class SpeakerRepository {
    private DBConfig dbConfig;

    public List<Speaker> findAllSpeaker() {
        List<Speaker> speakers = new ArrayList<>();
        String query = """
            SELECT s.id, s.first_name, s.last_name, s.description, s.linkedIn, s.company, s.email,
                   ss.session_id, sess.title AS session_title
            FROM speaker s
            LEFT JOIN session_speakers ss ON s.id = ss.speaker_id
            LEFT JOIN session sess ON ss.session_id = sess.id
            ORDER BY s.id; 
        """;

        try (Connection con = dbConfig.getConnection();
             PreparedStatement stmt = con.prepareStatement(query)) {
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                speakers.add(mapSpeaker(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return speakers;
    }

    public List<Speaker> findSpeakersByName(String query) {
        List<Speaker> speakers = new ArrayList<>();
        String sql = """
                SELECT s.id, s.first_name, s.last_name, s.description, s.linkedIn, s.company, s.email,
                       ss.session_id, sess.title AS session_title
                FROM speaker s
                LEFT JOIN session_speakers ss ON s.id = ss.speaker_id
                LEFT JOIN session sess ON ss.session_id = sess.id
                WHERE s.first_name ILIKE ? OR s.last_name ILIKE ?
                ORDER BY s.id;
        """;
        try (Connection con = dbConfig.getConnection();
             PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, "%" + query + "%");
            stmt.setString(2, "%" + query + "%");
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                speakers.add(mapSpeaker(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return speakers;
    }

    public Speaker findSpeakerById(UUID id) {
        String query = """
                SELECT s.id, s.first_name, s.last_name, s.description, s.linkedIn, s.company, s.email,
                       ss.session_id, sess.title AS session_title
                FROM speaker s
                LEFT JOIN session_speakers ss ON s.id = ss.speaker_id
                LEFT JOIN session sess ON ss.session_id = sess.id
                WHERE s.id = ?;
                """;

        try(Connection con = dbConfig.getConnection();
        PreparedStatement stmt = con.prepareStatement(query)) {
            stmt.setObject(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return mapSpeaker(rs);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    public List<Speaker> findSpeakersBySessionId(UUID sessionId) {
        List<Speaker> speakers = new ArrayList<>();
        String query = """
                SELECT s.id, s.first_name, s.last_name, s.description, s.linkedIn, s.company, s.email,
                       ss.session_id, sess.title AS session_title
                FROM speaker s
                JOIN session_speakers ss ON s.id = ss.speaker_id
                LEFT JOIN session sess ON ss.session_id = sess.id
                WHERE ss.session_id = ?
                """;

        try(Connection connection = dbConfig.getConnection();
        PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setObject(1, sessionId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                speakers.add(mapSpeaker(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return speakers;
    }

    private Speaker mapSpeaker(ResultSet rs) throws SQLException {
        Speaker speaker = new Speaker();
        speaker.setId(UUID.fromString(rs.getString("id")));
        speaker.setFirstName(rs.getString("first_name"));
        speaker.setLastName(rs.getString("last_name"));
        speaker.setBiography(rs.getString("description"));
        speaker.setLinkedIn(rs.getString("linkedIn"));
        speaker.setCompany(rs.getString("company"));
        speaker.setEmail(rs.getString("email"));
        speaker.setSessionId(rs.getObject("session_id") != null ? (UUID) rs.getObject("session_id") : null);
        speaker.setSessionTitle(rs.getString("session_title"));
        return speaker;
    }

    public Speaker saveSpeaker(Speaker speaker) {
        String query = "INSERT INTO speaker (id, first_name, last_name, description, linkedIn, company, email) VALUES (?, ?, ?, ?, ?, ?, ?)";
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
                stmt.executeUpdate();
            }

            if (speaker.getSessionId() != null) {
                String linkQuery = "INSERT INTO session_speakers (session_id, speaker_id) VALUES (?, ?)";
                try (PreparedStatement linkStmt = connection.prepareStatement(linkQuery)) {
                    linkStmt.setObject(1, speaker.getSessionId());
                    linkStmt.setObject(2, speaker.getId());
                    linkStmt.executeUpdate();
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return speaker;
    }

}
