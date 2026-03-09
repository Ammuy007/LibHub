package com.example.lms.dto;

public class CopyResponse {

    private Integer copyId;
    private Integer bookId;
    private String status;
    private java.time.OffsetDateTime createdAt;

    public Integer getCopyId() { return copyId; }
    public void setCopyId(Integer copyId) { this.copyId = copyId; }

    public Integer getBookId() { return bookId; }
    public void setBookId(Integer bookId) { this.bookId = bookId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public java.time.OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.OffsetDateTime createdAt) { this.createdAt = createdAt; }
}