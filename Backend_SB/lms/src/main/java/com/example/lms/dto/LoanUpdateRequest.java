package com.example.lms.dto;
import java.time.LocalDate;
public class LoanUpdateRequest {
    private Integer copyId;
    private Integer memberId;
    private LocalDate issueDate;
    private LocalDate returnDate;
    private LocalDate dueDate;
    private String remarks;
    public Integer getCopyId() { return copyId; }
    public void setCopyId(Integer copyId) { this.copyId = copyId; }
    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }
    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate;}    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }}
