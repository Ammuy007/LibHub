package com.example.lms.controller;

import com.example.lms.dto.BookRequest;
import com.example.lms.dto.BookResponse;
import com.example.lms.entity.Book;
import com.example.lms.service.BookService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("v1/books")
public class BookController {

    private final BookService service;

    public BookController(BookService service) {
        this.service = service;
    }
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MEMBER')")
    public List<BookResponse> getAll() {
        return service.getAll(null, null, null);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','MEMBER')")
    public List<BookResponse> search(
            @RequestParam(required = false) String isbn,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author) {

        return service.getAll(isbn, title, author);
    }

    // ADMIN
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public BookResponse create(@RequestBody BookRequest req) {
        return service.create(req);
    }

    // ADMIN
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public BookResponse update(@PathVariable Integer id,
                               @RequestBody BookRequest req) {
        return service.update(id, req);
    }

    // ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
    @GetMapping("/category/{categoryId}")
    @PreAuthorize("hasAnyRole('ADMIN','MEMBER')")
    public List<Book> getByCategory(@PathVariable Integer categoryId) {
        return service.getBooksByCategory(categoryId);
    }
}