package com.example.lms.service;

import com.example.lms.dto.DashboardStatsResponse;
import com.example.lms.dto.CategoryCountResponse;
import com.example.lms.dto.LoanResponse;
import java.util.List;

public interface DashboardService {
    DashboardStatsResponse getStats();

    List<CategoryCountResponse> getCategoryCounts();

    List<LoanResponse> getPriorityFollowUps();
}
