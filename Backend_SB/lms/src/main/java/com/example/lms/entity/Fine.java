package com.example.lms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fine")
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fine_id")
    private Integer fineId;

    @OneToOne
    @JoinColumn(name = "loan_id", unique = true)
    private Loan loan;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "paid_amount")
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(nullable = false)
    private String status = "unpaid"; 

    @Column(name = "paid_date")
    private LocalDate paidDate;

    public Integer getFineId() { return fineId; }
    public void setFineId(Integer fineId) { this.fineId = fineId; }
    public Loan getLoan() { return loan; }
    public void setLoan(Loan loan) { this.loan = loan; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate;}
    
}