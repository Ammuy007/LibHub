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
    List<Loan> findByMember_MemberIdOrderByIssueDateDesc(Integer memberId);
    List<Loan> findByReturnDateIsNullAndDueDateBeforeOrderByDueDateAsc(LocalDate date);
    Page<Loan> findByMember_MemberId(Integer memberId, Pageable pageable);
    Page<Loan> findByReturnDateIsNullAndDueDateBefore(LocalDate date, Pageable pageable);
    Page<Loan> findByMember_MemberIdAndReturnDateIsNullAndDueDateBefore(Integer memberId, LocalDate date, Pageable pageable);
}
