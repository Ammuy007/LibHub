package com.example.lms.repository;

import com.example.lms.entity.BookCategory;
import com.example.lms.entity.BookCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookCategoryRepository extends JpaRepository<BookCategory, BookCategoryId> {

    List<BookCategory> findByCategoryId(Integer categoryId);

    List<BookCategory> findByBookId(Integer bookId);

    void deleteByBookId(Integer bookId);

    @Query(value = """
        SELECT c.category_name
        FROM book_category bc
        JOIN category c ON c.category_id = bc.category_id
        WHERE bc.book_id = :bookId
        ORDER BY bc.category_id ASC
        """, nativeQuery = true)
    List<String> findCategoryNamesByBookId(@Param("bookId") Integer bookId);
}
