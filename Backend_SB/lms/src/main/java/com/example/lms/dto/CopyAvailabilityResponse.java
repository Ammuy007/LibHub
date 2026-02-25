package com.example.lms.dto;

public class CopyAvailabilityResponse {

    private Integer bookId;
    private long available;
    private long unavailable;

    public Integer getBookId() { return bookId; }
    public void setBookId(Integer bookId) { this.bookId = bookId; }

    public long getAvailable() { return available; }
    public void setAvailable(long available) { this.available = available; }

    public long getUnavailable() { return unavailable; }
    public void setUnavailable(long unavailable) { this.unavailable = unavailable; }
}