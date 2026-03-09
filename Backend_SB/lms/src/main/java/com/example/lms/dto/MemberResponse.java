package com.example.lms.dto;

public class MemberResponse {

    private Integer id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String role;
    private String status;
    private java.time.LocalDate membershipStart;
    private java.time.LocalDate membershipEnd;

    public MemberResponse(Integer id, String name, String email,
                          String phone, String address,
                          String role, String status,
                          java.time.LocalDate membershipStart,
                          java.time.LocalDate membershipEnd) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.role = role;
        this.status = status;
        this.membershipStart = membershipStart;
        this.membershipEnd = membershipEnd;
    }

    public Integer getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public String getRole() { return role; }
    public String getStatus() { return status; }
    public java.time.LocalDate getMembershipStart() { return membershipStart; }
    public java.time.LocalDate getMembershipEnd() { return membershipEnd; }
}