package com.example.lms.service;

import com.example.lms.dto.LoanRequest;
import com.example.lms.dto.LoanResponse;
import com.example.lms.entity.Copy;
import com.example.lms.entity.Loan;
import com.example.lms.entity.Member;
import com.example.lms.repository.CopyRepository;
import com.example.lms.repository.LoanRepository;
import com.example.lms.repository.MemberRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final CopyRepository copyRepository;
    private final MemberRepository memberRepository;

    public LoanServiceImpl(LoanRepository loanRepository,
                           CopyRepository copyRepository,
                           MemberRepository memberRepository) {
        this.loanRepository = loanRepository;
        this.copyRepository = copyRepository;
        this.memberRepository = memberRepository;
    }

    @Override
    public LoanResponse createLoan(LoanRequest request) {
        Copy copy = copyRepository.findById(request.getCopyId())
                .orElseThrow(() -> new RuntimeException("Copy not found"));

        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Loan loan = new Loan();
        loan.setCopy(copy);
        loan.setMember(member);
        LocalDate today = LocalDate.now();
        loan.setIssueDate(today);
        
        loan.setReturnDate(null);
        
        Loan saved = loanRepository.save(loan);
        return mapToResponse(saved);
    }

    @Override
    public LoanResponse updateLoan(Integer loanId, LoanRequest request) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (request.getCopyId() != null) {
            Copy copy = copyRepository.findById(request.getCopyId())
                    .orElseThrow(() -> new RuntimeException("Copy not found"));
            loan.setCopy(copy);
        }

        if (request.getMemberId() != null) {
            Member member = memberRepository.findById(request.getMemberId())
                    .orElseThrow(() -> new RuntimeException("Member not found"));
            loan.setMember(member);
        }

        // if (request.getIssueDate() != null){
        //     loan.setIssueDate(request.getIssueDate());
        //     loan.setDueDate(request.getIssueDate().plusDays(14));
        // }
        // if (request.getReturnDate() != null)
        //     loan.setReturnDate(request.getReturnDate());

        Loan updated = loanRepository.save(loan);
        return mapToResponse(updated);
    }

    @Override
    public void deleteLoan(Integer loanId) {
        loanRepository.deleteById(loanId);
    }

    @Override
    public LoanResponse getLoanById(Integer loanId, Integer requesterMemberId, boolean isAdmin) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (!isAdmin && !loan.getMember().getMemberId().equals(requesterMemberId)) {
            throw new AccessDeniedException("You are not allowed to access this loan");
        }

        return mapToResponse(loan);
    }

    @Override
    public List<LoanResponse> getAllLoans() {
        return loanRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private LoanResponse mapToResponse(Loan loan) {
        return new LoanResponse(
                loan.getLoanId(),
                loan.getCopy().getCopyId(),
                loan.getCopy().getBook().getTitle(),
                loan.getMember().getMemberId(),
                loan.getMember().getName(),
                loan.getIssueDate(),
                loan.getDueDate(),
                loan.getReturnDate()
        );
    }
}
