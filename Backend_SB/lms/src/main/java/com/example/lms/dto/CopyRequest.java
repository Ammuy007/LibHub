package com.example.lms.dto;

public class CopyRequest {

    private Integer bookId;
    
    // ✅ NEW: number of copies to create
    private int count;

    public Integer getBookId() { return bookId; }
    public void setBookId(Integer bookId) { this.bookId = bookId; }
    
    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }
}