package com.choom.back.exception;

public class SessionNotLive extends RuntimeException {
    public SessionNotLive(String message) {
        super(message);
    }
}
