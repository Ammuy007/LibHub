package com.example.lms.dto;

public record DashboardStatsResponse(
        long totalBooks,
        long availableCopies,
        long issuedBooks,
        long overdueLoans,
        double unpaidFines) {
}
