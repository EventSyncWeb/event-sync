package com.choom.back.repository;

import com.choom.back.config.DBConfig;
import com.choom.back.entity.Room;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
@AllArgsConstructor
public class RoomRepository {

    private final DBConfig dbConfig;

    public List<Room> findAll() {
        List<Room> rooms = new ArrayList<>();
        String query = """
                SELECT id, name, capacity
                FROM room
                ORDER BY name;
                """;
        try (Connection connection = dbConfig.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Room room = new Room();
                room.setId((UUID) rs.getObject("id"));
                room.setName(rs.getString("name"));
                room.setCapacity(rs.getInt("capacity"));
                rooms.add(room);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Internal Server Error");
        }
        return rooms;
    }

    public Room findById(UUID id) {
        String query = """
                SELECT id, name, capacity
                FROM room
                WHERE id = ?;
                """;
        try (Connection connection = dbConfig.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setObject(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                Room room = new Room();
                room.setId((UUID) rs.getObject("id"));
                room.setName(rs.getString("name"));
                room.setCapacity(rs.getInt("capacity"));
                return room;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Internal Server Error");
        }
        return null;
    }

    public Room create(Room room) {
        String query = """
                INSERT INTO room (id, name, capacity)
                VALUES (?, ?, ?)
                RETURNING id;
                """;
        try (Connection connection = dbConfig.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setObject(1, room.getId());
            stmt.setString(2, room.getName());
            stmt.setInt(3, room.getCapacity());
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                UUID returnedId = (UUID) rs.getObject("id");
                room.setId(returnedId);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Internal Server Error");
        }
        return room;
    }

    public Room update(Room room) {
        String query = """
                UPDATE room
                SET name = ?, capacity = ?
                WHERE id = ?
                RETURNING id;
                """;
        try (Connection connection = dbConfig.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setString(1, room.getName());
            stmt.setObject(2, room.getId());
            stmt.setInt(3, room.getCapacity());
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                room.setId((UUID) rs.getObject("id"));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Internal Server Error");
        }
        return room;
    }

    public void deleteById(UUID id) {
        String query = """
                DELETE FROM room WHERE id = ?;
                """;
        try (Connection connection = dbConfig.getConnection();
             PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setObject(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Internal Server Error");
        }
    }
}
