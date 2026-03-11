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

    LoanResponse returnBookByCopy(Integer copyId, String remarks);

    void deleteLoan(Integer loanId);

    Page<LoanResponse> getLoans(Integer loanId, Integer memberId, Boolean overdue,
            Boolean active, Integer requesterMemberId, boolean isAdmin,
            Integer page, Integer size);

    List<LoanResponse> getOverdueLoans();

}
