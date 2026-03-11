package com.example.lms.dto;

public class MeResponse {
    private String role;
    private Integer memberId;

    public MeResponse(String role, Integer memberId) {
        this.role = role;
        this.memberId = memberId;
    }

    public String getRole() {
        return role;
    }

    public Integer getMemberId() {
        return memberId;
    }
}
