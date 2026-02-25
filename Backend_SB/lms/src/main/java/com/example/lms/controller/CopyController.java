package com.example.lms.controller;

import com.example.lms.dto.CopyAvailabilityResponse;
import com.example.lms.dto.CopyRequest;
import com.example.lms.dto.CopyResponse;
import com.example.lms.entity.Copy;
import com.example.lms.service.CopyService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/copies")
public class CopyController {

    private final CopyService copyService;

    public CopyController(CopyService copyService) {
        this.copyService = copyService;
    }

    private CopyResponse toResponse(Copy c) {
        CopyResponse r = new CopyResponse();
        r.setCopyId(c.getCopy_id());
        r.setBookId(c.getBook().getBook_id());
        r.setStatus(c.getStatus());
        return r;
    }

    // ✅ CHANGED: merged create single + bulk
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<CopyResponse> create(@RequestBody CopyRequest req) {
        return copyService.createCopies(req)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CopyResponse getById(@PathVariable Integer id) {
        return toResponse(copyService.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<CopyResponse> getAll() {
        return copyService.getAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Integer id) {
        copyService.delete(id);
    }

    // ✅ CHANGED: get all copies of a book
    @GetMapping("/book/{bookId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<CopyResponse> getCopiesOfBook(@PathVariable Integer bookId) {
        return copyService.getCopiesOfBook(bookId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ✅ NEW: availability summary
    @GetMapping("/book/{bookId}/availability")
    @PreAuthorize("hasAnyRole('ADMIN','MEMBER')")
    public CopyAvailabilityResponse getAvailability(@PathVariable Integer bookId) {
        return copyService.getAvailability(bookId);
    }
}