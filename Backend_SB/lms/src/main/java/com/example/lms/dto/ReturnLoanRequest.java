package com.example.lms.dto;

public class ReturnLoanRequest {
    private Integer copyId;
    private String remarks;

    public Integer getCopyId() { return copyId; }
    public void setCopyId(Integer copyId) { this.copyId = copyId; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
