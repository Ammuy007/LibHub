package com.example.lms.service;

import com.example.lms.dto.LoanRequest;
import com.example.lms.dto.LoanResponse;
import com.example.lms.dto.LoanUpdateRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface LoanService {

    LoanResponse createLoan(LoanRequest request);

    LoanResponse updateLoan(Integer loanId, LoanUpdateRequest request);
    LoanResponse returnBook(Integer loanId);

    void deleteLoan(Integer loanId);

    Page<LoanResponse> getLoans(Integer loanId, Boolean overdue,
                                Integer requesterMemberId, boolean isAdmin,
                                Integer page, Integer size);
    List<LoanResponse> getOverdueLoans();

}
