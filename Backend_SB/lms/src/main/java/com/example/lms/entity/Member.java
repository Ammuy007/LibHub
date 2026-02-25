package com.example.lms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;

@Entity
@Table(name = "member")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)   // Swagger: show but not in request
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // JSON: ignore input
    private Integer member_id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    @Column(length = 20)
    private String phone;

    private String address;

    @Column(name = "hashed_pwd", nullable = false)
    private String hashedPwd;

    @Column(nullable = false)
    private String role="member";
    @Column(nullable = false)
    private String status = "active";
    public Member() {}

    public Integer getMemberId() { return member_id; }
    public void setMember_id(Integer member_id) { this.member_id = member_id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getHashedPwd() { return hashedPwd; }
    public void setHashedPwd(String hashedPwd) { this.hashedPwd = hashedPwd; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}