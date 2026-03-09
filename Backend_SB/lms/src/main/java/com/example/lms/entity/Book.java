package com.example.lms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "book")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "book_id")
    private Integer bookId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String isbn;

    private String publisher;

    private Integer publish_year;

    private Integer edition;

    private String author;
    
    @Column(length = 2000)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDate createdAt;


   
    public Integer getBook_id() { return bookId; }
    public void setBook_id(Integer book_id) { this.bookId = book_id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public Integer getPublish_year() { return publish_year; }
    public void setPublish_year(Integer publish_year) { this.publish_year = publish_year; }

    public Integer getEdition() { return edition; }
    public void setEdition(Integer edition) { this.edition = edition; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}