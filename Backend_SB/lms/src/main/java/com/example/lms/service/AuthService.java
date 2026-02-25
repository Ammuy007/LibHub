package com.example.lms.service;

import com.example.lms.dto.LoginRequest;
import com.example.lms.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}