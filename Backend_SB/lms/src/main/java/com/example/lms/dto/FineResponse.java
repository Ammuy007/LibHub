package com.example.lms.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FineResponse {

    private Integer fineId;
    private Integer loanId;
    private Integer memberId;
    private String memberName;
    private BigDecimal amount;
    private BigDecimal paidAmount;
    private String status;
    private LocalDate paidDate;
    private String reason;
    private java.time.OffsetDateTime createdAt;

    public FineResponse(Integer fineId,
                        Integer loanId,
                        Integer memberId,
                        String memberName,
                        BigDecimal amount,
                        BigDecimal paidAmount,
                        String status,
                        LocalDate paidDate,
                        String reason,
                        java.time.OffsetDateTime createdAt) {
        this.fineId = fineId;
        this.loanId = loanId;
        this.memberId = memberId;
        this.memberName = memberName;
        this.amount = amount;
        this.paidAmount = paidAmount;
        this.status = status;
        this.paidDate = paidDate;
        this.reason = reason;
        this.createdAt = createdAt;
    }

    
    public Integer getFineId() { return fineId; }
    public Integer getLoanId() { return loanId; }
    public Integer getMemberId() { return memberId; }
    public String getMemberName() { return memberName; }
    public BigDecimal getAmount() { return amount; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public String getStatus() { return status; }
    public LocalDate getPaidDate() { return paidDate; }
    public String getReason() { return reason; }
    public java.time.OffsetDateTime getCreatedAt() { return createdAt; }
}