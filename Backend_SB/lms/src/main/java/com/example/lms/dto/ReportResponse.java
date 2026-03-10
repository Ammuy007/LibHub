package com.example.lms.dto;

import java.util.List;

public record ReportResponse(
        int month,
        int year,
        long totalLoans,
        long newMembers,
        double totalFinesCollected,
        double averageOverdueDays,
        long overdueCount,
        double collectedFines,
        double pendingFines,
        java.util.Map<String, Long> overdueDistribution,
        java.util.List<CategoryCountResponse> topCategories,
        double stockUtilization,
        double returnRate) {
}
