package com.example.lms.controller;

import com.example.lms.dto.LoanRequest;
import com.example.lms.dto.LoanResponse;
import com.example.lms.dto.LoanUpdateRequest;
import com.example.lms.dto.ReturnLoanRequest;
import com.example.lms.service.LoanService;

import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/loans")
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

    @PutMapping("/return")
    @PreAuthorize("hasRole('ADMIN')")
    public LoanResponse returnBookByCopy(@RequestBody ReturnLoanRequest request) {
        return loanService.returnBookByCopy(request.getCopyId(), request.getRemarks());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteLoan(@PathVariable Integer id) {
        loanService.deleteLoan(id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MEMBER')")
    public Page<LoanResponse> getLoans(@RequestParam(name = "id", required = false) Integer id,
            @RequestParam(name = "memberId", required = false) Integer memberId,
            @RequestParam(name = "overdue", required = false, defaultValue = "false") Boolean overdue,
            @RequestParam(name = "active", required = false, defaultValue = "false") Boolean active,
            @RequestParam(name = "page", defaultValue = "0") Integer page,
            @RequestParam(name = "size", defaultValue = "10") Integer size,
            Authentication authentication) {
        Integer requesterMemberId = (Integer) authentication.getPrincipal();
        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return loanService.getLoans(id, memberId, overdue, active, requesterMemberId, isAdmin, page, size);
    }

}
