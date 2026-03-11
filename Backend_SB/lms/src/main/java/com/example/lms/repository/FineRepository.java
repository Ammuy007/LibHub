package com.example.lms.repository;

import com.example.lms.entity.Fine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FineRepository extends JpaRepository<Fine, Integer> {
    Optional<Fine> findByLoan_LoanId(Integer loanId);

    List<Fine> findByLoanMemberMemberId(Integer memberId);

    @org.springframework.data.jpa.repository.Query("SELECT f FROM Fine f WHERE f.loan.member.memberId = :memberId ORDER BY CASE WHEN f.status = 'unpaid' THEN 0 ELSE 1 END, f.createdAt DESC")
    List<Fine> findByMemberIdSorted(Integer memberId);

    List<Fine> findByStatusIgnoreCase(String status);

    Page<Fine> findByLoanMemberMemberId(Integer memberId, Pageable pageable);

    Page<Fine> findByStatusIgnoreCase(String status, Pageable pageable);

    Page<Fine> findByLoanMemberMemberIdAndStatusIgnoreCase(Integer memberId, String status, Pageable pageable);

    long countByStatusIgnoreCaseNot(String status);

    boolean existsByLoan_LoanIdAndStatusIgnoreCase(Integer loanId, String status);

    boolean existsByLoan_Member_MemberIdAndStatusIgnoreCase(Integer memberId, String status);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(f.amount - COALESCE(f.paidAmount, 0)) FROM Fine f WHERE f.status <> 'paid'")
    Double sumUnpaidFines();
}
