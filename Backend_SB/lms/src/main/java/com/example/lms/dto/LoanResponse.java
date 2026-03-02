package com.example.lms.dto;

import java.time.LocalDate;

public class LoanResponse {

    private Integer loanId;
    private Integer copyId;
    private String bookTitle;
    private Integer memberId;
    private String memberName;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private LocalDate returnDate;

    // constructor

    public LoanResponse(Integer loanId, Integer copyId, String bookTitle,
                        Integer memberId, String memberName,
                        LocalDate issueDate, LocalDate dueDate,
                        LocalDate returnDate) {
        this.loanId = loanId;
        this.copyId = copyId;
        this.bookTitle = bookTitle;
        this.memberId = memberId;
        this.memberName = memberName;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
    }

    // getters
    public Integer getLoanId() { return loanId; }
    public Integer getCopyId() { return copyId; }
    public String getBookTitle() { return bookTitle; }
    public Integer getMemberId() { return memberId; }
    public String getMemberName() { return memberName; }
    public LocalDate getIssueDate() { return issueDate; }
    public LocalDate getDueDate() { return dueDate; }
    public LocalDate getReturnDate() { return returnDate; }
}