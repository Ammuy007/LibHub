package com.example.lms.service;

public interface EmailService {

    void sendPasswordEmail(String to, String password);

    void sendOverdueNotice(String to, String subject, String body);

}
