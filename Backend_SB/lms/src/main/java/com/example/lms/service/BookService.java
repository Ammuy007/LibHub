package com.example.lms.service;

import com.example.lms.dto.BookRequest;
import com.example.lms.dto.BookResponse;
import com.example.lms.entity.Book;

import java.util.List;

public interface BookService {

    List<BookResponse> getAll(String isbn, String title, String author);

    BookResponse create(BookRequest req);

    BookResponse update(Integer id, BookRequest req);

    void delete(Integer id);
    List<Book> getBooksByCategory(Integer categoryId);
}
