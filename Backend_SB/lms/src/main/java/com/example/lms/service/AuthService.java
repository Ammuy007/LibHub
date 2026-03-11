package com.example.lms.service;

import com.example.lms.dto.LoginRequest;
public interface AuthService {
    String login(LoginRequest request);
}
