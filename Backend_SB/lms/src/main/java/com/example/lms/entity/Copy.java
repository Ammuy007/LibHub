package com.example.lms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "copy")
public class Copy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer copy_id;

    
    @ManyToOne(optional = false)
    @JoinColumn(name = "book_id")
    private Book book;

    @Column(nullable = false)
    private String status;

    public Integer getCopy_id() { return copy_id; }
    public void setCopy_id(Integer copy_id) { this.copy_id = copy_id; }
    public Integer getCopyId() { return copy_id; }
    public void setCopyId(Integer copyId) { this.copy_id = copyId; }

    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
