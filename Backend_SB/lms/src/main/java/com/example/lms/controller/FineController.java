package com.example.lms.controller;

import com.example.lms.dto.FineRequest;
import com.example.lms.dto.FineResponse;
import org.springframework.security.core.Authentication;
import com.example.lms.service.FineService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fines")

public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
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

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MEMBER')")
    public FineResponse get(@PathVariable Integer id,Authentication authentication) {
        Integer requesterMemberId = (Integer) authentication.getPrincipal();
        boolean isAdmin = authentication.getAuthorities()
                .stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        
        return fineService.getFine(id,requesterMemberId, isAdmin);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<FineResponse> getAll() {
        return fineService.getAllFines();
    }
    @GetMapping("/my")
    @PreAuthorize("hasRole('MEMBER')")
    public List<FineResponse> getMyFines(Authentication authentication) {
        Integer requesterMemberId = (Integer) authentication.getPrincipal();
        
        return fineService.getFinesForMember(requesterMemberId);
    }
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<FineResponse> getByStatus(@PathVariable String status) {
        return fineService.getFinesByStatus(status);
    }
}