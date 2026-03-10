package com.example.lms.service;

import com.example.lms.dto.ReportResponse;
import java.util.List;

public interface ReportService {
    ReportResponse getMonthlyReport(int month, int year);
}
