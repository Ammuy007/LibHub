package com.example.lms.security;

import com.example.lms.entity.Member;
import com.example.lms.repository.MemberRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository repo;

    public CustomUserDetailsService(MemberRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Member m = repo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new User(
                m.getEmail(),
                m.getHashedPwd(),
                Collections.emptyList()
        );
    }
}