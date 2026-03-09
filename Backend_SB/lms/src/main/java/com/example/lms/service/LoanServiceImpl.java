package com.example.lms.service;

import com.example.lms.dto.LoanRequest;
import com.example.lms.dto.LoanResponse;
import com.example.lms.dto.LoanUpdateRequest;
import com.example.lms.entity.Copy;
import com.example.lms.entity.Loan;
import com.example.lms.entity.Member;
import com.example.lms.repository.CopyRepository;
import com.example.lms.repository.LoanRepository;
import com.example.lms.repository.MemberRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
        if(copy.getStatus().equalsIgnoreCase("UNAVAILABLE")) {
            throw new RuntimeException("Copy is currently unavailable");
        }
        long activeLoans =
            loanRepository.countByMember_MemberIdAndReturnDateIsNull(member.getMemberId());

    if (activeLoans >= 3) {
        throw new RuntimeException("Member already has maximum 3 active loans");
    }

    //  only one copy of same book
    Integer bookId = copy.getBook().getBook_id();

    boolean alreadyHasBook =
            loanRepository.existsByMember_MemberIdAndCopy_Book_BookIdAndReturnDateIsNull(
                    member.getMemberId(), bookId);

    if (alreadyHasBook) {
        throw new RuntimeException("Member already has a copy of this book");
    }
        Loan loan = new Loan();
        loan.setCopy(copy);
        loan.setMember(member);
        System.out.println("Issue Date: " + request.getIssueDate());
        
        loan.setIssueDate(request.getIssueDate());
        loan.setReturnDate(null);
        loan.setDueDate(request.getIssueDate().plusDays(14));
        if (request.getRemarks() != null) {
            loan.setRemarks(request.getRemarks());
        }
        
        Loan saved = loanRepository.save(loan);
        copy.setStatus("unavailable");
        copyRepository.save(copy);
        return mapToResponse(saved);
    }

    @Override
    public LoanResponse updateLoan(Integer loanId, LoanUpdateRequest request) {
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

    
    if (request.getIssueDate() != null) {
        loan.setIssueDate(request.getIssueDate());

        // recompute dueDate only if user didn't send one
        if (request.getDueDate() == null) {
            loan.setDueDate(request.getIssueDate().plusDays(14));
        }
    }

    // dueDate explicit override
    if (request.getDueDate() != null) {
        loan.setDueDate(request.getDueDate());
    }

    // returnDate update
    if (request.getReturnDate() != null) {
        loan.setReturnDate(request.getReturnDate());
    }

    if (request.getRemarks() != null) {
        loan.setRemarks(request.getRemarks());
    }

    Loan updated = loanRepository.save(loan);
    return mapToResponse(updated);
}

    @Override
    public void deleteLoan(Integer loanId) {
        loanRepository.deleteById(loanId);
    }

    @Override
    public Page<LoanResponse> getLoans(Integer loanId, Boolean overdue,
                                       Integer requesterMemberId, boolean isAdmin,
                                       Integer page, Integer size) {
        boolean applyOverdue = Boolean.TRUE.equals(overdue);
        Pageable pageable = buildPageable(page, size, applyOverdue);

        if (loanId == null) {
            Page<Loan> loanPage;
            if (isAdmin && applyOverdue) {
                loanPage = loanRepository.findByReturnDateIsNullAndDueDateBefore(LocalDate.now(), pageable);
            } else if (isAdmin) {
                loanPage = loanRepository.findAll(pageable);
            } else if (applyOverdue) {
                loanPage = loanRepository.findByMember_MemberIdAndReturnDateIsNullAndDueDateBefore(
                        requesterMemberId, LocalDate.now(), pageable);
            } else {
                loanPage = loanRepository.findByMember_MemberId(requesterMemberId, pageable);
            }
            return loanPage.map(this::mapToResponse);
        }

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (!isAdmin && !loan.getMember().getMemberId().equals(requesterMemberId)) {
            throw new AccessDeniedException("You are not allowed to access this loan");
        }
        if (applyOverdue) {
            boolean isOverdue = loan.getReturnDate() == null && loan.getDueDate().isBefore(LocalDate.now());
            if (!isOverdue) {
                return Page.empty(pageable);
            }
        }
        return toSinglePage(loan, pageable);
    }

    private Pageable buildPageable(Integer page, Integer size, boolean overdue) {
        int safePage = page == null || page < 0 ? 0 : page;
        int safeSize = size == null || size <= 0 ? 10 : size;
        if (overdue) {
            return PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.ASC, "dueDate"));
        }
        return PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "issueDate"));
    }

    private Page<LoanResponse> toSinglePage(Loan loan, Pageable pageable) {
        if (pageable.getPageNumber() > 0) {
            return Page.empty(pageable);
        }
        List<LoanResponse> content = List.of(mapToResponse(loan));
        return new PageImpl<>(content, pageable, 1);
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
                loan.getReturnDate(),
                loan.getRemarks(),
                loan.getCreatedAt()
        );
    }
    @Override
    public List<LoanResponse> getOverdueLoans() {
        return loanRepository.findByReturnDateIsNullAndDueDateBeforeOrderByDueDateAsc(LocalDate.now())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public LoanResponse returnBook(Integer loanId) {

    Loan loan = loanRepository.findById(loanId)
            .orElseThrow(() -> new RuntimeException("Loan not found"));

    if (loan.getReturnDate() != null) {
        throw new RuntimeException("Book already returned");
    }

    
    loan.setReturnDate(LocalDate.now());

    
    Copy copy = loan.getCopy();
    copy.setStatus("available");

    copyRepository.save(copy);
    Loan updated = loanRepository.save(loan);

    return mapToResponse(updated);
    }
}
