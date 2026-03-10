package com.example.lms.repository;

import com.example.lms.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    Optional<Member> findByEmail(String email);

    Page<Member> findByStatusIgnoreCase(String status, Pageable pageable);

    Page<Member> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Member> findByStatusIgnoreCaseAndNameContainingIgnoreCase(String status, String name, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT MAX(m.memberId) FROM Member m")
    Integer findMaxId();
}
