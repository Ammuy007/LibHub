package com.example.lms.service;

import com.example.lms.dto.BookRequest;
import com.example.lms.dto.BookResponse;
import com.example.lms.entity.Book;
import com.example.lms.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository repo;
    private final BookInfoService bookInfoService;

    public BookServiceImpl(BookRepository repo,
                           BookInfoService bookInfoService) {
        this.repo = repo;
        this.bookInfoService = bookInfoService;
    }

    private BookResponse toResponse(Book b) {
        BookResponse r = new BookResponse();
        r.setBook_id(b.getBook_id());
        r.setTitle(b.getTitle());
        r.setIsbn(b.getIsbn());
        r.setPublisher(b.getPublisher());
        r.setPublish_year(b.getPublish_year());
        r.setEdition(b.getEdition());
        r.setAuthor(b.getAuthor());
        r.setDescription(b.getDescription()); // ✅ NEW
        return r;
    }

    @Override
    public List<BookResponse> getAll(String isbn, String title, String author) {

        List<Book> books;

        if (isbn != null)
            books = repo.findByIsbnContainingIgnoreCase(isbn);
        else if (title != null)
            books = repo.findByTitleContainingIgnoreCase(title);
        else if (author != null)
            books = repo.findByAuthorContainingIgnoreCase(author);
        else
            books = repo.findAll();

        return books.stream().map(this::toResponse).collect(Collectors.toList());
    }

    
    
    @Override
    public BookResponse create(BookRequest req) {

        Book b = new Book();
        b.setTitle(req.getTitle());
        b.setIsbn(req.getIsbn());
        b.setPublisher(req.getPublisher());
        b.setPublish_year(req.getPublish_year());
        b.setEdition(req.getEdition());
        b.setAuthor(req.getAuthor());

        // ✅ NEW: fetch description from API
        String desc = bookInfoService.fetchDescriptionByIsbn(req.getIsbn());
        b.setDescription(desc);

        return toResponse(repo.save(b));
    }

    @Override
    public BookResponse update(Integer id, BookRequest req) {

        Book b = repo.findById(id).orElseThrow();

        b.setTitle(req.getTitle());
        b.setIsbn(req.getIsbn());
        b.setPublisher(req.getPublisher());
        b.setPublish_year(req.getPublish_year());
        b.setEdition(req.getEdition());
        b.setAuthor(req.getAuthor());

        return toResponse(repo.save(b));
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}