package com.choom.back.service;

import com.choom.back.entity.Room;
import com.choom.back.exception.BadRequestException;
import com.choom.back.exception.NotFoundException;
import com.choom.back.repository.RoomRepository;
import com.choom.back.validator.RoomValidator;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final RoomValidator roomValidator;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(UUID id) {
        Room room = roomRepository.findById(id);
        if (room == null) {
            throw new NotFoundException("Room with id " + id + " not found");
        }
        return room;
    }

    public Room createRoom(Room room) {
        roomValidator.validate(room);
        if (room.getId() == null) {
            room.setId(UUID.randomUUID());
        }
        return roomRepository.create(room);
    }

    public Room updateRoom(UUID id, Room room) {
        roomValidator.validate(room);
        Room existing = roomRepository.findById(id);
        if (existing == null) {
            throw new NotFoundException("Room with id " + id + " not found");
        }
        room.setId(id);
        return roomRepository.update(room);
    }

    public void deleteRoom(UUID id) {
        Room existing = roomRepository.findById(id);
        if (existing == null) {
            throw new NotFoundException("Room with id " + id + " not found");
        }
        roomRepository.deleteById(id);
    }
}
