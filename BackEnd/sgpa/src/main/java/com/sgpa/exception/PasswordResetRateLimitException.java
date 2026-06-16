package com.sgpa.exception;

public class PasswordResetRateLimitException extends RuntimeException {

    public PasswordResetRateLimitException(String message) {
        super(message);
    }
}
