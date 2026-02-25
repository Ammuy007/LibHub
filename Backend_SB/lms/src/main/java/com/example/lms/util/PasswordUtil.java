package com.example.lms.util;

import java.util.UUID;

public class PasswordUtil {

    public static String generateRandomPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}