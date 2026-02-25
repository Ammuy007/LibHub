package com.example.lms.service;

import org.springframework.stereotype.Service;

// ✅ NEW: implementation so Spring can create bean
@Service
public class EmailServiceImpl implements EmailService {

    @Override
    public void sendPasswordEmail(String to, String password) {

        // 🔧 TEMP: console email (replace with SMTP later)
        System.out.println("=== EMAIL SENT ===");
        System.out.println("To: " + to);
        System.out.println("Your LMS password: " + password);
        System.out.println("==================");

    }
} 