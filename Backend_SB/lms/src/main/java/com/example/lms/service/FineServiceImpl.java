package com.example.lms.service;

import com.example.lms.dto.FineRequest;
import com.example.lms.dto.FineResponse;
import com.example.lms.entity.Fine;
import com.example.lms.entity.Loan;
import com.example.lms.repository.FineRepository;
import com.example.lms.repository.LoanRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class FineServiceImpl implements FineService {

    private final FineRepository fineRepository;
    private final LoanRepository loanRepository;

    public FineServiceImpl(FineRepository fineRepository,
                           LoanRepository loanRepository) {
        this.fineRepository = fineRepository;
        this.loanRepository = loanRepository;
    }
    @Scheduled(cron = "0 0 1 * * ?") 
    public void checkAndCreateFinesScheduled() {
        loanRepository.findAll()
                .forEach(loan -> checkAndCreateFine(loan.getLoanId()));
    }
    // AUTO CREATE when overdue
    @Override
    public void checkAndCreateFine(Integer loanId) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        
        if (loan.getReturnDate() != null) return;

       
        if (!loan.getDueDate().isBefore(LocalDate.now())) return;

        
        if (fineRepository.findByLoan_LoanId(loanId).isPresent()) return;

        long daysLate = loan.getDueDate().until(LocalDate.now()).getDays();
        BigDecimal amount = BigDecimal.valueOf(daysLate * 10); 

        Fine fine = new Fine();
        fine.setLoan(loan);
        fine.setAmount(amount);
        fine.setPaidAmount(BigDecimal.ZERO);
        fine.setStatus("unpaid");

        fineRepository.save(fine);
    }

    
    @Override
    public FineResponse createFine(FineRequest request) {

        Loan loan = loanRepository.findById(request.getLoanId())
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        Fine fine = new Fine();
        fine.setLoan(loan);
        fine.setAmount(request.getAmount());
        if (request.getReason() != null) {
            fine.setReason(request.getReason());
        }

        applyPaymentFields(fine, request);

        return map(fineRepository.save(fine));
    }

  
    @Override
    public FineResponse updateFine(Integer fineId, FineRequest request) {

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        if (request.getAmount() != null)
            fine.setAmount(request.getAmount());
        if (request.getReason() != null) {
            fine.setReason(request.getReason());
        }

        applyPaymentFields(fine, request);

        return map(fineRepository.save(fine));
    }

    private void applyPaymentFields(Fine fine, FineRequest request) {

        if (request.getPaidAmount() != null)
            fine.setPaidAmount(request.getPaidAmount());

        if (request.getStatus() != null)
            fine.setStatus(request.getStatus());

        if (request.getPaidDate() != null)
            fine.setPaidDate(request.getPaidDate());

        
        if (fine.getPaidAmount() != null && fine.getAmount() != null) {
        if (fine.getPaidAmount().compareTo(fine.getAmount()) >= 0)
            fine.setStatus("paid");
        else
            fine.setStatus("unpaid");
        }
    }

    @Override
    public void deleteFine(Integer fineId) {
        fineRepository.deleteById(fineId);
    }

    @Override
    public Page<FineResponse> getFines(Integer fineId, Integer memberId, String status,
                                       Integer requesterMemberId, boolean isAdmin,
                                       Integer page, Integer size) {
        String normalizedStatus = status == null ? null : status.trim().toLowerCase();
        Pageable pageable = buildPageable(page, size);

        if (!isAdmin && memberId != null) {
            throw new AccessDeniedException("Only admin can use memberId filter");
        }

        if (fineId == null) {
            Page<Fine> finePage;
            if (isAdmin) {
                if (memberId != null && normalizedStatus != null) {
                    finePage = fineRepository.findByLoanMemberMemberIdAndStatusIgnoreCase(
                            memberId, normalizedStatus, pageable);
                } else if (memberId != null) {
                    finePage = fineRepository.findByLoanMemberMemberId(memberId, pageable);
                } else if (normalizedStatus != null) {
                    finePage = fineRepository.findByStatusIgnoreCase(normalizedStatus, pageable);
                } else {
                    finePage = fineRepository.findAll(pageable);
                }
            } else {
                if (normalizedStatus != null) {
                    finePage = fineRepository.findByLoanMemberMemberIdAndStatusIgnoreCase(
                            requesterMemberId, normalizedStatus, pageable);
                } else {
                    finePage = fineRepository.findByLoanMemberMemberId(requesterMemberId, pageable);
                }
            }
            return finePage.map(this::map);
        }

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        Integer ownerId = fine.getLoan().getMember().getMemberId();
        if (!isAdmin && !ownerId.equals(requesterMemberId)) {
            throw new AccessDeniedException("You cannot view this fine");
        }
        if (memberId != null && !ownerId.equals(memberId)) {
            return Page.empty(pageable);
        }
        if (normalizedStatus != null && !fine.getStatus().equalsIgnoreCase(normalizedStatus)) {
            return Page.empty(pageable);
        }
        return toSinglePage(fine, pageable);
    }
    @Override
    public FineResponse markFinePaid(Integer fineId) {

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        if ("paid".equalsIgnoreCase(fine.getStatus()))
            return map(fine);

        
        fine.setPaidAmount(fine.getAmount());
        fine.setStatus("paid");
        fine.setPaidDate(LocalDate.now());

        Fine updated = fineRepository.save(fine);
        return map(updated);
    }
    private Pageable buildPageable(Integer page, Integer size) {
        int safePage = page == null || page < 0 ? 0 : page;
        int safeSize = size == null || size <= 0 ? 10 : size;
        return PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "fineId"));
    }

    private Page<FineResponse> toSinglePage(Fine fine, Pageable pageable) {
        if (pageable.getPageNumber() > 0) {
            return Page.empty(pageable);
        }
        return new PageImpl<>(List.of(map(fine)), pageable, 1);
    }
    private FineResponse map(Fine fine) {
        Loan loan = fine.getLoan();

        return new FineResponse(
                fine.getFineId(),
                loan.getLoanId(),
                loan.getMember().getMemberId(),
                loan.getMember().getName(),
                fine.getAmount(),
                fine.getPaidAmount(),
                fine.getStatus(),
                fine.getPaidDate(),
                fine.getReason(),
                fine.getCreatedAt()
        );
    }
}
