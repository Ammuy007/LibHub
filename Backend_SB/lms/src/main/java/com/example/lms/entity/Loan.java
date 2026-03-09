package com.example.lms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "loan")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loan_id")
    private Integer loanId;

    @ManyToOne
    @JoinColumn(name = "copy_id")
    private Copy copy;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    
    public Integer getLoanId() { return loanId; }
    public void setLoanId(Integer loanId) { this.loanId = loanId; }
    public Copy getCopy() { return copy; }
    public void setCopy(Copy copy) { this.copy = copy; }
    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }
    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate;}
    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    

}
