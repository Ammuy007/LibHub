package com.example.lms.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "book_category")
@IdClass(BookCategoryId.class)
public class BookCategory {

    @Id
    @Column(name = "book_id")
    private Integer bookId;

    @Id
    @Column(name = "category_id")
    private Integer categoryId;

    public Integer getBookId() { return bookId; }
    public void setBookId(Integer bookId) { this.bookId = bookId; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
}