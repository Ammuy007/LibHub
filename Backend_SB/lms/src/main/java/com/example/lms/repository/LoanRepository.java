package com.example.lms.repository;

import com.example.lms.entity.Loan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDate;

public interface LoanRepository extends JpaRepository<Loan, Integer> {
    long countByMember_MemberIdAndReturnDateIsNull(Integer memberId);

    boolean existsByMember_MemberIdAndCopy_Book_BookIdAndReturnDateIsNull(Integer memberId, Integer bookId);

    Page<Loan> findByMember_MemberId(Integer memberId, Pageable pageable);

    long countByReturnDateIsNullAndDueDateBefore(LocalDate date);
}
