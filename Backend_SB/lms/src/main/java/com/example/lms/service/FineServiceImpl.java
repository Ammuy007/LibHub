package com.example.lms.service;

import com.example.lms.dto.FineRequest;
import com.example.lms.dto.FineResponse;
import com.example.lms.entity.Fine;
import com.example.lms.entity.Loan;
import com.example.lms.repository.FineRepository;
import com.example.lms.repository.LoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FineServiceImpl implements FineService {

    private final FineRepository fineRepository;
    private final LoanRepository loanRepository;

    public FineServiceImpl(FineRepository fineRepository,
                           LoanRepository loanRepository) {
        this.fineRepository = fineRepository;
        this.loanRepository = loanRepository;
    }
    @Scheduled(cron = "0 0 1 * * ?") // every midnight
    public void checkAndCreateFinesScheduled() {
        loanRepository.findAll()
                .forEach(loan -> checkAndCreateFine(loan.getLoanId()));
    }
    // ✅ AUTO CREATE when overdue
    @Override
    public void checkAndCreateFine(Integer loanId) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        // already returned → no fine
        if (loan.getReturnDate() != null) return;

        // not overdue
        if (!loan.getDueDate().isBefore(LocalDate.now())) return;

        // fine already exists
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

    // ✅ ADMIN create
    @Override
    public FineResponse createFine(FineRequest request) {

        Loan loan = loanRepository.findById(request.getLoanId())
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        Fine fine = new Fine();
        fine.setLoan(loan);
        fine.setAmount(request.getAmount());

        applyPaymentFields(fine, request);

        return map(fineRepository.save(fine));
    }

    // ✅ ADMIN update / mark paid / partial
    @Override
    public FineResponse updateFine(Integer fineId, FineRequest request) {

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        if (request.getAmount() != null)
            fine.setAmount(request.getAmount());

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

        // auto status logic
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
    public FineResponse getFine(Integer fineId,
                                Integer requesterMemberId,
                                boolean isAdmin) {

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        Integer ownerId = fine.getLoan().getMember().getMemberId();

        if (!isAdmin && !ownerId.equals(requesterMemberId)) {
            throw new AccessDeniedException("You cannot view this fine");
        }

        return map(fine);
    }

    @Override
    public List<FineResponse> getFinesForMember(Integer requesterMemberId) {

        List<Fine> fines;
            fines = fineRepository.findByLoanMemberMemberId(requesterMemberId);
        return fines.stream()
                .map(this::map)
                .toList();
    }
    @Override
    public List<FineResponse> getAllFines() {
        return fineRepository.findAll()
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }
    @Override
    public List<FineResponse> getFinesByStatus(String status) {
    return fineRepository.findByStatusIgnoreCase(status)
            .stream()
            .map(this::map)
            .toList();
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
                fine.getPaidDate()
        );
    }
}