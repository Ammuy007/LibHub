package com.example.lms.service;

import com.example.lms.dto.DashboardStatsResponse;
import com.example.lms.dto.CategoryCountResponse;
import com.example.lms.dto.LoanResponse;
import com.example.lms.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final BookRepository bookRepository;
    private final CopyRepository copyRepository;
    private final LoanRepository loanRepository;
    private final FineRepository fineRepository;
    private final CategoryRepository categoryRepository;

    public DashboardServiceImpl(BookRepository bookRepository,
            CopyRepository copyRepository,
            LoanRepository loanRepository,
            FineRepository fineRepository,
            CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.copyRepository = copyRepository;
        this.loanRepository = loanRepository;
        this.fineRepository = fineRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public DashboardStatsResponse getStats() {
        long totalBooks = bookRepository.count();
        long availableCopies = copyRepository.count();
        long issuedBooks = copyRepository.countByStatusIgnoreCase("issued");

        long overdueLoans = loanRepository.countByReturnDateIsNullAndDueDateBefore(LocalDate.now());
        Double unpaidFines = fineRepository.sumUnpaidFines();

        return new DashboardStatsResponse(
                totalBooks,
                availableCopies,
                issuedBooks,
                overdueLoans,
                unpaidFines != null ? unpaidFines : 0.0);
    }

    @Override
    public List<CategoryCountResponse> getCategoryCounts() {
        return categoryRepository.findCategoryCounts();
    }

    @Override
    public List<LoanResponse> getPriorityFollowUps() {
        // Loans overdue > 14 days
        LocalDate fourteenDaysAgo = LocalDate.now().minusDays(14);
        return loanRepository
                .findByReturnDateIsNullAndDueDateBefore(fourteenDaysAgo,
                        org.springframework.data.domain.PageRequest.of(0, 10))
                .map(this::mapToResponse)
                .getContent();
    }

    private LoanResponse mapToResponse(com.example.lms.entity.Loan loan) {
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
                loan.getCreatedAt());
    }
}
