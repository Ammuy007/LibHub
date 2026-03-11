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

    boolean existsByCopy_Book_BookIdAndReturnDateIsNull(Integer bookId);

    Page<Loan> findByMember_MemberId(Integer memberId, Pageable pageable);

    Page<Loan> findByReturnDateIsNull(Pageable pageable);

    Page<Loan> findByMember_MemberIdAndReturnDateIsNull(Integer memberId, Pageable pageable);

    long countByReturnDateIsNullAndDueDateBefore(LocalDate date);

    Page<Loan> findByReturnDateIsNullAndDueDateBefore(LocalDate date, Pageable pageable);

    Page<Loan> findByMember_MemberIdAndReturnDateIsNullAndDueDateBefore(Integer memberId, LocalDate date,
            Pageable pageable);

    List<Loan> findByReturnDateIsNullAndDueDateBeforeOrderByDueDateAsc(LocalDate date);

    @org.springframework.data.jpa.repository.Query(
            "SELECT l FROM Loan l WHERE l.copy.copy_id = :copyId AND l.returnDate IS NULL")
    java.util.Optional<Loan> findActiveByCopyId(@org.springframework.data.repository.query.Param("copyId") Integer copyId);
}
