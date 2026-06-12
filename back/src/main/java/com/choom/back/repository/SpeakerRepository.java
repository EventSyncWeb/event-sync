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
import java.util.List;
import java.util.UUID;

@Repository
@AllArgsConstructor
public class SpeakerRepository {
    private DBConfig dbConfig;

    public List<Speaker> findAllSpeaker() {
        List<Speaker> speakers = new ArrayList<>();
        String query = """
            SELECT id, session_id, first_name, last_name, description, linkedln, company, email
            FROM speaker
            ORDER BY id; 
        """;

        try (Connection con = dbConfig.getConnection();
             PreparedStatement stmt = con.prepareStatement(query);) {
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Speaker speaker = new Speaker();
                speaker.setId(UUID.fromString(rs.getString("id")));
                speaker.setSession((Session) rs.getObject("session"));
                speaker.setFirstName(rs.getString("first_name"));
                speaker.setLastName(rs.getString("last_name"));
                speaker.setBiography(rs.getString("description"));
                speaker.setLinkdLn(rs.getString("linkedln"));
                speaker.setCompany(rs.getString("company"));
                speaker.setEmail(rs.getString("email"));
                speakers.add(speaker);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return speakers;
    }

    public Speaker findSpeakerById(UUID id) {
        String query = """
                SELECT id, session_id, first_name, last_name, description, linkedln, company, email
                FROM speaker
                WHERE id = ?;
                """;

        try(Connection con = dbConfig.getConnection();
        PreparedStatement stmt = con.prepareStatement(query);) {
            stmt.setObject(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                Speaker speaker = new Speaker();
                speaker.setId(UUID.fromString(rs.getString("id")));
                speaker.setSession((Session) rs.getObject("session"));
                speaker.setFirstName(rs.getString("first_name"));
                speaker.setLastName(rs.getString("last_name"));
                speaker.setBiography(rs.getString("description"));
                speaker.setLinkdLn(rs.getString("linkedln"));
                speaker.setCompany(rs.getString("company"));
                speaker.setEmail(rs.getString("email"));
                return speaker;
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    public Speaker findSpeakerBySessiontId(UUID sessionId) {
        String query = """
                SELECT id, session_id, first_name, last_name, description, linkedln, company, email
                FROM speaker
                WHERE session_id = ?
                """;

        try(Connection connection = dbConfig.getConnection();
        PreparedStatement stmt = connection.prepareStatement(query);) {
            stmt.setObject(1, sessionId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Speaker speaker = new Speaker();
                speaker.setId(UUID.fromString(rs.getString("id")));
                speaker.setSession((Session) rs.getObject("session"));
                speaker.setFirstName(rs.getString("first_name"));
                speaker.setLastName(rs.getString("last_name"));
                speaker.setBiography(rs.getString("description"));
                speaker.setLinkdLn(rs.getString("linkedln"));
                speaker.setCompany(rs.getString("company"));
                speaker.setEmail(rs.getString("email"));
                return speaker;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }


}
