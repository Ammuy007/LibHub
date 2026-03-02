package com.example.lms.repository;

import com.example.lms.entity.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List ;
import java.util.Optional;

public interface FineRepository extends JpaRepository<Fine, Integer> {
    Optional<Fine> findByLoan_LoanId(Integer loanId);
    List<Fine> findByLoanMemberMemberId(Integer memberId);
    List<Fine> findByStatusIgnoreCase(String status);
}