package com.example.lms.controller;

import com.example.lms.dto.*;
import com.example.lms.security.JwtUtil;

import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.lms.entity.Member;
import com.example.lms.repository.MemberRepository;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final MemberRepository repo;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder;

    public AuthController(MemberRepository repo, JwtUtil jwtUtil, BCryptPasswordEncoder encoder) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
        this.encoder = encoder;
    }

    // @PostMapping("/login")
    // public LoginResponse login(@RequestBody LoginRequest req) {

    //     Member m = repo.findByEmail(req.getEmail())
    //             .orElseThrow(() -> new RuntimeException("User not found"));

    //     if (!encoder.matches(req.getPassword(), m.getHashedPwd())) {
    //         throw new RuntimeException("Invalid password");
    //     }

    //     String token = jwtUtil.generateToken(m.getEmail());
    //     return new LoginResponse(token);
    // }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

    Member m = repo.findByEmail(req.getEmail()).orElse(null);

    if (m == null) {
        return ResponseEntity.status(401).body("User not found");
    }

    if (!encoder.matches(req.getPassword(), m.getHashedPwd())) {
        return ResponseEntity.status(401).body("Invalid password");
    }

    String token = jwtUtil.generateToken(m.getEmail(),
        m.getRole(),
        m.getMemberId());
    return ResponseEntity.ok(new LoginResponse(token));
}
}