package com.example.lms.repository;

import com.example.lms.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<Loan, Integer> {
    long countByMember_MemberIdAndReturnDateIsNull(Integer memberId);
    boolean existsByMember_MemberIdAndCopy_Book_BookIdAndReturnDateIsNull(Integer memberId, Integer bookId);
}