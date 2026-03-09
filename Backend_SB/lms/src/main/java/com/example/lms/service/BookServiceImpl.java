package com.example.lms.service;

import com.example.lms.dto.BookRequest;
import com.example.lms.dto.BookResponse;
import com.example.lms.entity.Book;
import com.example.lms.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
        r.setDescription(b.getDescription()); 
        return r;
    }

    @Override
    public List<BookResponse> getBooks(Integer id, String isbn, String title,
                                       String author, String category, boolean isAdmin) {
        if (id != null && !isAdmin) {
            throw new RuntimeException("Only admin can filter by id");
        }

        List<Book> books;
        if (category != null) {
            books = repo.findByCategoryName(category);
        } else {
            books = repo.findAll();
        }

        return books.stream()
                .filter(b -> id == null || b.getBook_id().equals(id))
                .filter(b -> isbn == null || b.getIsbn().toLowerCase().contains(isbn.toLowerCase()))
                .filter(b -> title == null || b.getTitle().toLowerCase().contains(title.toLowerCase()))
                .filter(b -> author == null || b.getAuthor().toLowerCase().contains(author.toLowerCase()))
                .map(this::toResponse)
                .toList();
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
