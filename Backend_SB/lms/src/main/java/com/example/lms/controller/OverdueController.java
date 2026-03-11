package com.example.lms.controller;

import com.example.lms.dto.OverdueEmailRequest;
import com.example.lms.entity.Member;
import com.example.lms.repository.MemberRepository;
import com.example.lms.service.EmailService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/overdue")
public class OverdueController {

    private final EmailService emailService;
    private final MemberRepository memberRepository;

    public OverdueController(EmailService emailService, MemberRepository memberRepository) {
        this.emailService = emailService;
        this.memberRepository = memberRepository;
    }

    @PostMapping("/send-email")
    @PreAuthorize("hasRole('ADMIN')")
    public void sendOverdueEmail(@RequestBody OverdueEmailRequest request) {
        if (request.getMemberId() == null) {
            throw new RuntimeException("Member ID is required");
        }
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        String subject = "LibHub - Overdue Notice";
        StringBuilder body = new StringBuilder();
        body.append("Hello ").append(member.getName()).append(",\n\n");
        if (request.getType() != null && request.getType().equalsIgnoreCase("fine")) {
            body.append("You have an outstanding fine");
            if (request.getReason() != null && !request.getReason().isBlank()) {
                body.append(" (").append(request.getReason()).append(")");
            }
            body.append(".\n");
        } else {
            body.append("You have an overdue loan.\n");
        }

        if (request.getBookTitle() != null) {
            body.append("Book: ").append(request.getBookTitle()).append("\n");
        }
        if (request.getDueDate() != null) {
            body.append("Due Date: ").append(request.getDueDate()).append("\n");
        }
        if (request.getDaysOverdue() != null) {
            body.append("Days Overdue: ").append(request.getDaysOverdue()).append("\n");
        }
        if (request.getFineAmount() != null) {
            body.append("Fine Amount: Rs. ").append(request.getFineAmount()).append("\n");
        }
        body.append("\nPlease return the item or settle the fine as soon as possible.\n\n");
        body.append("Thank you,\nLibHub Library");

        emailService.sendOverdueNotice(member.getEmail(), subject, body.toString());
    }
}
