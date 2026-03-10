package com.example.lms.service;

import com.example.lms.dto.ReportResponse;
import com.example.lms.dto.CategoryCountResponse;
import com.example.lms.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
public class ReportServiceImpl implements ReportService {

    private final LoanRepository loanRepository;
    private final MemberRepository memberRepository;
    private final FineRepository fineRepository;
    private final CategoryRepository categoryRepository;
    private final CopyRepository copyRepository;

    public ReportServiceImpl(LoanRepository loanRepository,
            MemberRepository memberRepository,
            FineRepository fineRepository,
            CategoryRepository categoryRepository,
            CopyRepository copyRepository) {
        this.loanRepository = loanRepository;
        this.memberRepository = memberRepository;
        this.fineRepository = fineRepository;
        this.categoryRepository = categoryRepository;
        this.copyRepository = copyRepository;
    }

    @Override
    public ReportResponse getMonthlyReport(int month, int year) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = YearMonth.of(year, month).atEndOfMonth();
        LocalDate today = LocalDate.now();

        // 1. Total Loans in the month
        long totalLoans = loanRepository.findAll().stream()
                .filter(l -> !l.getIssueDate().isBefore(start) && !l.getIssueDate().isAfter(end))
                .count();

        // 2. New Members in the month
        long newMembers = memberRepository.findAll().stream()
                .filter(m -> m.getMembershipStart() != null && !m.getMembershipStart().isBefore(start)
                        && !m.getMembershipStart().isAfter(end))
                .count();

        // 3. Fines collected (paymentDate belongs to selected month)
        // Note: Using paid_date as paymentDate
        double totalFinesCollected = fineRepository.findAll().stream()
                .filter(f -> f.getPaidDate() != null && !f.getPaidDate().isBefore(start)
                        && !f.getPaidDate().isAfter(end))
                .mapToDouble(f -> f.getPaidAmount().doubleValue())
                .sum();

        // 4. Fine Collection Metrics (Filtered by month)
        // Pending Fines = sum(fine.amount) where fine.status == "unpaid" AND
        // fine.createdAt in selectedMonth
        double pendingFines = fineRepository.findAll().stream()
                .filter(f -> "unpaid".equalsIgnoreCase(f.getStatus()))
                .filter(f -> f.getCreatedAt() != null &&
                        !f.getCreatedAt().toLocalDate().isBefore(start) &&
                        !f.getCreatedAt().toLocalDate().isAfter(end))
                .mapToDouble(f -> f.getAmount().doubleValue())
                .sum();

        // 5. Overdue Analysis (Active within selected month)
        // Should we use the end of the month as the reference point for "selected
        // month" report?
        // The requirement says: currentDate > dueDate AND returned == false
        // For a historical report, we should ideally look at the state at 'end'.
        // But the prompt says "currentDate - dueDate". We'll use 'today' if it's within
        // the month,
        // or 'end' of the month if it's a past month.
        LocalDate referenceDate = today.isBefore(end) ? today : end;

        java.util.List<com.example.lms.entity.Loan> overdueLoans = loanRepository.findAll().stream()
                .filter(l -> l.getReturnDate() == null && l.getDueDate().isBefore(referenceDate))
                .toList();

        long overdueCount = overdueLoans.size();
        double averageOverdueDays = 0;
        java.util.Map<String, Long> distribution = new java.util.HashMap<>();
        distribution.put("1-3 Days", 0L);
        distribution.put("4-7 Days", 0L);
        distribution.put("1-2 Weeks", 0L);
        distribution.put("2+ Weeks", 0L);

        if (overdueCount > 0) {
            long totalDays = 0;
            for (com.example.lms.entity.Loan l : overdueLoans) {
                long days = java.time.temporal.ChronoUnit.DAYS.between(l.getDueDate(), referenceDate);
                totalDays += days;

                if (days <= 3)
                    distribution.put("1-3 Days", distribution.get("1-3 Days") + 1);
                else if (days <= 7)
                    distribution.put("4-7 Days", distribution.get("4-7 Days") + 1);
                else if (days <= 14)
                    distribution.put("1-2 Weeks", distribution.get("1-2 Weeks") + 1);
                else
                    distribution.put("2+ Weeks", distribution.get("2+ Weeks") + 1);
            }
            averageOverdueDays = Math.round((double) totalDays / overdueCount);
        }

        // 6. Popular Genres (Top 5 + Other)
        java.util.List<CategoryCountResponse> allCategories = categoryRepository.findCategoryCounts();
        long totalIssuesAcrossCategories = allCategories.stream().mapToLong(CategoryCountResponse::count).sum();

        java.util.List<CategoryCountResponse> topCategories = new java.util.ArrayList<>();
        if (!allCategories.isEmpty()) {
            topCategories.addAll(allCategories.stream().limit(5).toList());
            if (allCategories.size() > 5) {
                long otherCount = allCategories.stream().skip(5).mapToLong(CategoryCountResponse::count).sum();
                topCategories.add(new CategoryCountResponse("Other", otherCount));
            }
        }

        // 7. Collection Health Metrics (Library-Wide)
        // Stock Utilization = (activeLoans / totalCopies) * 100
        long activeLoans = loanRepository.findAll().stream().filter(l -> l.getReturnDate() == null).count();
        long totalCopies = copyRepository.count();
        double stockUtilization = totalCopies > 0 ? ((double) activeLoans / totalCopies) * 100 : 0;

        // Return Rate = (onTimeReturns / totalCompletedLoans) * 100
        java.util.List<com.example.lms.entity.Loan> completedLoans = loanRepository.findAll().stream()
                .filter(l -> l.getReturnDate() != null).toList();
        long totalCompletedLoans = completedLoans.size();
        long onTimeReturns = completedLoans.stream()
                .filter(l -> !l.getReturnDate().isAfter(l.getDueDate())).count();
        double returnRate = totalCompletedLoans > 0 ? ((double) onTimeReturns / totalCompletedLoans) * 100 : 0;

        return new ReportResponse(
                month,
                year,
                totalLoans,
                newMembers,
                totalFinesCollected,
                averageOverdueDays,
                overdueCount,
                totalFinesCollected,
                pendingFines,
                distribution,
                topCategories,
                stockUtilization,
                returnRate);
    }
}
