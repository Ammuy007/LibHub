package com.example.lms.controller;
import com.example.lms.dto.CopyRequest;
import com.example.lms.dto.CopyResponse;
import com.example.lms.entity.Copy;
import com.example.lms.service.CopyService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("v1/copies")
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

    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<CopyResponse> create(@RequestBody CopyRequest req) {
        return copyService.createCopies(req)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<CopyResponse> getCopies(@RequestParam(required = false) Integer id,
                                        @RequestParam(required = false) Integer bookId,
                                        @RequestParam(required = false) String status) {
        return copyService.getCopies(id, bookId, status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Integer id) {
        copyService.delete(id);
    }
}
