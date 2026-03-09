package com.example.lms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendPasswordEmail(String to, String password) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);   
        message.setTo(to);       
        message.setSubject("LibHub - Login Credentials");
        message.setText(
                "Welcome to LibHub \n\n" +
                "Your login password: " + password + "\n\n"
                
        );

        mailSender.send(message);
    }
}