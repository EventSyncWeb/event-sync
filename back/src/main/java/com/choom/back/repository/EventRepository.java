package com.choom.back.repository;

import com.choom.back.config.DBConfig;
import com.choom.back.dto.EventRequest;
import com.choom.back.entity.Event;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
@AllArgsConstructor
public class EventRepository {

    private final DBConfig dbConfig;

    public List<Event> getEventList() {
        List<Event> eventList = new ArrayList<>();
        String query = """
                SELECT id, title, description, start_date, end_date, location
                FROM event
                """;
        try (Connection connection = dbConfig.getConnection()) {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                Event event = new Event();
                UUID id = (UUID) resultSet.getObject("id");
                event.setId(id);
                event.setTitle(resultSet.getString("title"));
                event.setDescription(resultSet.getString("description"));
                event.setStartDate(resultSet.getDate("start_date").toLocalDate());
                event.setEndDate(resultSet.getDate("end_date").toLocalDate());
                event.setLocation(resultSet.getString("location"));
                eventList.add(event);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Internal Server Error");
        }
        return eventList;
    }

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
                event.setStartDate(eventRequest.getStartDate());
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
                event.setStartDate(eventRequest.getStartDate());
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
        String query = """
                DELETE FROM event WHERE id = ?;
        """;
        try(Connection connection = dbConfig.getConnection()) {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setObject(1, id);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Internal Server Error");
        }
        return "Event with id: " + id + " has been deleted.";
    }

    public List<Event> findAllEvents() {
        List<Event> events = new ArrayList<>();
        String query = """
                SELECT id, title, description, start_date, end_date, location
                FROM event
                ORDER BY start_date;
        """;
        try (Connection connection = dbConfig.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                Event event = new Event();
                event.setId((UUID) resultSet.getObject("id"));
                event.setTitle(resultSet.getString("title"));
                event.setDescription(resultSet.getString("description"));
                event.setStartDate(resultSet.getDate("start_date").toLocalDate());
                event.setEndDate(resultSet.getDate("end_date").toLocalDate());
                event.setLocation(resultSet.getString("location"));
                events.add(event);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Internal Server Error");
        }
        return events;
    }

    public List<Event> findEventsByTitle(String query) {
        List<Event> events = new ArrayList<>();
        String sql = """
                SELECT id, title, description, start_date, end_date, location
                FROM event
                WHERE title ILIKE ?
                ORDER BY start_date;
        """;
        try (Connection connection = dbConfig.getConnection();
             PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, "%" + query + "%");
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Event event = new Event();
                event.setId((UUID) rs.getObject("id"));
                event.setTitle(rs.getString("title"));
                event.setDescription(rs.getString("description"));
                event.setStartDate(rs.getDate("start_date").toLocalDate());
                event.setEndDate(rs.getDate("end_date").toLocalDate());
                event.setLocation(rs.getString("location"));
                events.add(event);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Internal Server Error");
        }
        return events;
    }

    public Event findEventById(UUID id) {
        String query = """
                SELECT id, title, description, start_date, end_date, location
                FROM event
                WHERE id = ?;
        """;
        try (Connection connection = dbConfig.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(query)) {
            preparedStatement.setObject(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                Event event = new Event();
                event.setId((UUID) resultSet.getObject("id"));
                event.setTitle(resultSet.getString("title"));
                event.setDescription(resultSet.getString("description"));
                event.setStartDate(resultSet.getDate("start_date").toLocalDate());
                event.setEndDate(resultSet.getDate("end_date").toLocalDate());
                event.setLocation(resultSet.getString("location"));
                return event;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Internal Server Error");
        }
        return null;
    }
}
