package com.example.lms.repository;

public interface CopyAvailabilityProjection {
    Integer getBookId();
    long getAvailable();
    long getUnavailable();
}
