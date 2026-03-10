package com.example.lms.controller;

import com.example.lms.dto.DashboardStatsResponse;
import com.example.lms.dto.CategoryCountResponse;
import com.example.lms.dto.LoanResponse;
import com.example.lms.service.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public DashboardStatsResponse getStats() {
        return dashboardService.getStats();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/categories")
    public List<CategoryCountResponse> getCategoryCounts() {
        return dashboardService.getCategoryCounts();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/priority-followups")
    public List<LoanResponse> getPriorityFollowUps() {
        return dashboardService.getPriorityFollowUps();
    }
}
