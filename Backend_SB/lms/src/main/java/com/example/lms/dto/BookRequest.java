package com.example.lms.dto;

public class BookRequest {

    private String title;
    private String isbn;
    private String publisher;
    private Integer publish_year;
    private Integer edition;
    private String author;
    private java.util.List<String> categories;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public Integer getPublish_year() {
        return publish_year;
    }

    public void setPublish_year(Integer publish_year) {
        this.publish_year = publish_year;
    }

    public Integer getEdition() {
        return edition;
    }

    public void setEdition(Integer edition) {
        this.edition = edition;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public java.util.List<String> getCategories() {
        return categories;
    }

    public void setCategories(java.util.List<String> categories) {
        this.categories = categories;
    }
}
