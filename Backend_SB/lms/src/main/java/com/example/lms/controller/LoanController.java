package com.example.lms.controller;

import com.example.lms.dto.LoanRequest;
import com.example.lms.dto.LoanResponse;
import com.example.lms.dto.LoanUpdateRequest;
import com.example.lms.service.LoanService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public LoanResponse createLoan(@RequestBody LoanRequest request) {
        return loanService.createLoan(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public LoanResponse updateLoan(@PathVariable Integer id,
                                   @RequestBody LoanUpdateRequest request) {
        return loanService.updateLoan(id, request);
    }
    @PutMapping("/{id}/return")
    @PreAuthorize("hasRole('ADMIN')")
    public LoanResponse returnBook(@PathVariable Integer id) {
        return loanService.returnBook(id);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteLoan(@PathVariable Integer id) {
        loanService.deleteLoan(id);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MEMBER')")
    public LoanResponse getLoanById(@PathVariable Integer id, Authentication authentication) {
        
        //System.out.println("HELLO WORLD");
        Integer requesterMemberId = (Integer) authentication.getPrincipal();
        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        System.out.println("Requester ID: " + requesterMemberId);
        System.out.println(authentication.getAuthorities());
        return loanService.getLoanById(id, requesterMemberId, isAdmin);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<LoanResponse> getAllLoans() {
        return loanService.getAllLoans();
    }
}
