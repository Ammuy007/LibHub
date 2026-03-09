package com.example.lms.service;

import com.example.lms.dto.BookRequest;
import com.example.lms.dto.BookResponse;

import java.util.List;

public interface BookService {

    List<BookResponse> getBooks(Integer id, String isbn, String title,
                                String author, String category, boolean isAdmin);

    BookResponse create(BookRequest req);

    BookResponse update(Integer id, BookRequest req);

    void delete(Integer id);
}
