package com.choom.back.repository;

import com.choom.back.config.DBConfig;
import com.choom.back.dto.EventRequest;
import com.choom.back.entity.Event;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.UUID;

@Repository
@AllArgsConstructor
public class EventRepository {

    private final DBConfig dbConfig;

    public Event createEvent(EventRequest eventRequest) {
        Event event = new Event();
        String query = """
                INSERT INTO event(title, description, start_date, end_date, location)
                VALUES (?, ?, ?, ?, ?)
                RETURNING id;
                """;
        try (Connection connection = dbConfig.getConnection()) {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, eventRequest.getTitle());
            preparedStatement.setString(2, eventRequest.getDescription());
            preparedStatement.setDate(3, Date.valueOf(eventRequest.getStartDate()));
            preparedStatement.setDate(4, Date.valueOf(eventRequest.getEndDate()));
            preparedStatement.setString(5, eventRequest.getLocation());

            ResultSet resultSet = preparedStatement.executeQuery();
            if(resultSet.next()) {
                UUID returnedId = (UUID) resultSet.getObject("id");
                event.setId(returnedId);
                event.setTitle(eventRequest.getTitle());
                event.setDescription(eventRequest.getDescription());
                eventRequest.setStartDate(eventRequest.getStartDate());
                event.setEndDate(eventRequest.getEndDate());
                event.setLocation(eventRequest.getLocation());
            }
        }
        catch (SQLException e) {
            throw new RuntimeException("Internal Server Error");
        }
        return event;
    }

    public Event updateEvent(UUID id, EventRequest eventRequest) {
        Event event = new Event();
        String query = """
                UPDATE event
                SET title = ?, description = ?, start_date = ?, end_date = ?, location = ?
                WHERE id = ?
                RETURNING id;
        """;
        try (Connection connection = dbConfig.getConnection()) {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, eventRequest.getTitle());
            preparedStatement.setString(2, eventRequest.getDescription());
            preparedStatement.setDate(3, Date.valueOf(eventRequest.getStartDate()));
            preparedStatement.setDate(4, Date.valueOf(eventRequest.getEndDate()));
            preparedStatement.setString(5, eventRequest.getLocation());
            preparedStatement.setObject(6, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            if(resultSet.next()){
                UUID returnedId = (UUID) resultSet.getObject("id");
                event.setId(returnedId);
                event.setTitle(eventRequest.getTitle());
                event.setDescription(eventRequest.getDescription());
                eventRequest.setStartDate(eventRequest.getStartDate());
                event.setEndDate(eventRequest.getEndDate());
                event.setLocation(eventRequest.getLocation());
            }
        }
        catch (SQLException e) {
            throw new RuntimeException("Internal Server Error");
        }
        return event;
    }

    public String deleteEvent(UUID id) {
        String message = "";
        String query = """
                DELETE FROM event WHERE id = ?;
        """;
        try(Connection connection = dbConfig.getConnection()) {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setObject(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            if(resultSet.next()) {
                message = "Event with id: " + id + " has been deleted.";
            }
        } catch (SQLException e) {
            throw new RuntimeException("Internal Server Error");
        }
        return message;
    }
}
