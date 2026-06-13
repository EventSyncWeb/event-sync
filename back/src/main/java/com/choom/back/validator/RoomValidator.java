package com.choom.back.validator;

import com.choom.back.entity.Room;
import com.choom.back.exception.BadRequestException;
import org.springframework.stereotype.Component;

@Component
public class RoomValidator {
    public void validate(Room room) {
        String message = "";
        if (room == null) {
            message += "Room is null";
        }
        if (room.getName() == null || room.getName().isBlank()) {
            message += "Room name is required";
        }
        if (!message.isEmpty()) {
            throw new BadRequestException(message);
        }
    }
}
