package com.example.lms.repository;

import com.example.lms.entity.Copy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CopyRepository extends JpaRepository<Copy, Integer> {

    // ✅ NEW: all copies of a book
    List<Copy> findByBook_BookId(Integer bookId);

    // ✅ NEW: count by status
    long countByBook_BookIdAndStatus(Integer bookId, String status);
}