package com.example.lms.controller;

import com.example.lms.dto.FineRequest;
import com.example.lms.dto.FineResponse;
import org.springframework.security.core.Authentication;
import com.example.lms.service.FineService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/fines")

public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
    }
    @PutMapping("/{id}/mark-paid")
    @PreAuthorize("hasRole('ADMIN')")
    public FineResponse markPaid(@PathVariable Integer id) {
        return fineService.markFinePaid(id);
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public FineResponse create(@RequestBody FineRequest request) {
        return fineService.createFine(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public FineResponse update(@PathVariable Integer id,
                               @RequestBody FineRequest request) {
        return fineService.updateFine(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Integer id) {
        fineService.deleteFine(id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MEMBER')")
    public Page<FineResponse> getFines(@RequestParam(required = false) Integer id,
                                       @RequestParam(required = false) Integer memberId,
                                       @RequestParam(required = false) String status,
                                       @RequestParam(defaultValue = "0") Integer page,
                                       @RequestParam(defaultValue = "10") Integer size,
                                       Authentication authentication) {
        Integer requesterMemberId = (Integer) authentication.getPrincipal();
        boolean isAdmin = authentication.getAuthorities()
                .stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));

        return fineService.getFines(id, memberId, status, requesterMemberId, isAdmin, page, size);
    }
}
