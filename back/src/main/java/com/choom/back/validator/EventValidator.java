package com.choom.back.validator;

import com.choom.back.dto.EventRequest;
import com.choom.back.exception.BadRequestException;
import org.springframework.stereotype.Component;

@Component
public class EventValidator {
    public void validate(EventRequest eventRequest) {
        String message = "";
        if(eventRequest.getTitle() == null || eventRequest.getTitle().isBlank()) {
            message += "Title field cannot empty ";
        }
        if(eventRequest.getDescription() == null || eventRequest.getDescription().isBlank()) {
            message += "Description field cannot empty ";
        }
        if(eventRequest.getLocation() == null || eventRequest.getLocation().isBlank()) {
            message += "Location field cannot empty ";
        }
        if(eventRequest.getStartDate() == null) {
            message += "Start date field cannot empty ";
        }
        if(eventRequest.getEndDate() == null) {
            message += "End date field cannot empty ";
        }
        if(eventRequest.getStartDate() != null && eventRequest.getEndDate() != null
                && !eventRequest.getEndDate().isAfter(eventRequest.getStartDate())) {
            message += "Start date should be before end date ";
        }
        if(eventRequest.getStartDate() != null) {
            String startDateString = eventRequest.getStartDate().toString();
            if(!startDateString.matches("\\d{4}-\\d{2}-\\d{2}")) {
                message += "Start date should be in the format yyyy-mm-dd ";
            }
        }
        if(eventRequest.getEndDate() != null) {
            String endDateString = eventRequest.getEndDate().toString();
            if(!endDateString.matches("\\d{4}-\\d{2}-\\d{2}")) {
                message += "End date should be in the format yyyy-mm-dd ";
            }
        }
        if(!message.isBlank()) {
            throw new BadRequestException(message);
        }
    }
}
