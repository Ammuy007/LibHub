package com.example.lms.service;

import com.example.lms.dto.BookRequest;
import com.example.lms.dto.BookResponse;
import com.example.lms.entity.Book;
import com.example.lms.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDate;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository repo;
    private final BookInfoService bookInfoService;
    private final com.example.lms.repository.CategoryRepository categoryRepo;
    private final com.example.lms.repository.BookCategoryRepository bookCategoryRepo;

    public BookServiceImpl(BookRepository repo,
            BookInfoService bookInfoService,
            com.example.lms.repository.CategoryRepository categoryRepo,
            com.example.lms.repository.BookCategoryRepository bookCategoryRepo) {
        this.repo = repo;
        this.bookInfoService = bookInfoService;
        this.categoryRepo = categoryRepo;
        this.bookCategoryRepo = bookCategoryRepo;
    }

    private BookResponse toResponse(Book b, List<String> categories) {
        BookResponse r = new BookResponse();
        r.setBook_id(b.getBook_id());
        r.setTitle(b.getTitle());
        r.setIsbn(b.getIsbn());
        r.setPublisher(b.getPublisher());
        r.setPublish_year(b.getPublish_year());
        r.setEdition(b.getEdition());
        r.setAuthor(b.getAuthor());
        r.setDescription(b.getDescription());
        r.setCreatedAt(b.getCreatedAt());
        r.setCategories(categories);
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

        Map<Integer, List<String>> categoriesByBookId = new HashMap<>();
        if (!books.isEmpty()) {
            List<Integer> bookIds = books.stream().map(Book::getBook_id).toList();
            for (Object[] row : repo.findCategoryNamesByBookIds(bookIds)) {
                if (row == null || row.length < 2) continue;
                Number bookIdValue = (Number) row[0];
                String categoryName = (String) row[1];
                if (bookIdValue == null || categoryName == null) continue;
                Integer bookId = bookIdValue.intValue();
                categoriesByBookId.computeIfAbsent(bookId, k -> new java.util.ArrayList<>()).add(categoryName);
            }
        }

        return books.stream()
                .filter(b -> id == null || b.getBook_id().equals(id))
                .filter(b -> isbn == null || b.getIsbn().toLowerCase().contains(isbn.toLowerCase()))
                .filter(b -> title == null || b.getTitle().toLowerCase().contains(title.toLowerCase()))
                .filter(b -> author == null || b.getAuthor().toLowerCase().contains(author.toLowerCase()))
                .map(b -> toResponse(b, categoriesByBookId.getOrDefault(b.getBook_id(), List.of())))
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
        b.setCreatedAt(LocalDate.now());

        Book savedBook = repo.save(b);

        if (req.getCategories() != null) {
            for (String catName : req.getCategories()) {
                com.example.lms.entity.Category category = categoryRepo.findByCategoryNameIgnoreCase(catName)
                        .orElseGet(() -> {
                            com.example.lms.entity.Category newCat = new com.example.lms.entity.Category();
                            newCat.setCategory_name(catName);
                            return categoryRepo.save(newCat);
                        });

                com.example.lms.entity.BookCategory bookCat = new com.example.lms.entity.BookCategory();
                bookCat.setBookId(savedBook.getBook_id());
                bookCat.setCategoryId(category.getCategory_id());
                bookCategoryRepo.save(bookCat);
            }
        }

        List<String> categories = bookCategoryRepo.findCategoryNamesByBookId(savedBook.getBook_id());
        return toResponse(savedBook, categories);
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

        Book saved = repo.save(b);
        List<String> categories = bookCategoryRepo.findCategoryNamesByBookId(saved.getBook_id());
        return toResponse(saved, categories);
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
