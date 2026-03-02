package com.example.lms.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FineRequest {
    private Integer loanId;
    private BigDecimal amount;
    private BigDecimal paidAmount;
    private String status;
    private LocalDate paidDate;

    public Integer getLoanId() { return loanId; }
    public void setLoanId(Integer loanId) { this.loanId = loanId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount;}
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate;}
}