package com.example.lms.service;

import com.example.lms.dto.CopyAvailabilityResponse;
import com.example.lms.dto.CopyRequest;
import com.example.lms.entity.Book;
import com.example.lms.entity.Copy;
import com.example.lms.repository.BookRepository;
import com.example.lms.repository.CopyRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CopyServiceImpl implements CopyService {

    private final CopyRepository copyRepo;
    private final BookRepository bookRepo;

    public CopyServiceImpl(CopyRepository copyRepo, BookRepository bookRepo) {
        this.copyRepo = copyRepo;
        this.bookRepo = bookRepo;
    }

    @Override
    public List<Copy> createCopies(CopyRequest req) {

        // ✅ CHANGED: ensure book exists
        Book book = bookRepo.findById(req.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        int count = Math.max(req.getCount(), 1); // safety

        List<Copy> copies = new ArrayList<>();

        // ✅ CHANGED: bulk creation loop
        for (int i = 0; i < count; i++) {
            Copy c = new Copy();
            c.setBook(book);
            c.setStatus("available");
            copies.add(c);
        }

        return copyRepo.saveAll(copies);
    }

    @Override
    public Copy getById(Integer id) {
        return copyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Copy not found"));
    }

    @Override
    public List<Copy> getAll() {
        return copyRepo.findAll();
    }

    @Override
    public void delete(Integer id) {
        copyRepo.deleteById(id);
    }

    @Override
    public List<Copy> getCopiesOfBook(Integer bookId) {
        return copyRepo.findByBook_BookId(bookId);
    }

    @Override
    public CopyAvailabilityResponse getAvailability(Integer bookId) {

        // ✅ NEW: count available/unavailable
        long available = copyRepo.countByBook_BookIdAndStatus(bookId, "available");
        long unavailable = copyRepo.countByBook_BookIdAndStatus(bookId, "unavailable");

        CopyAvailabilityResponse res = new CopyAvailabilityResponse();
        res.setBookId(bookId);
        res.setAvailable(available);
        res.setUnavailable(unavailable);

        return res;
    }
}