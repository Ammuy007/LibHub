package com.example.lms.service;

import com.example.lms.dto.LoanRequest;
import com.example.lms.dto.LoanResponse;
import com.example.lms.dto.LoanUpdateRequest;

import java.util.List;

public interface LoanService {

    LoanResponse createLoan(LoanRequest request);

    LoanResponse updateLoan(Integer loanId, LoanUpdateRequest request);
    LoanResponse returnBook(Integer loanId);

    void deleteLoan(Integer loanId);

    LoanResponse getLoanById(Integer loanId, Integer requesterMemberId, boolean isAdmin);

    List<LoanResponse> getAllLoans();
}
