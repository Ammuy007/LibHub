package com.example.lms.repository;

import com.example.lms.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    Optional<Category> findByCategoryNameIgnoreCase(String name);

    Page<Category> findByCategoryNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT new com.example.lms.dto.CategoryCountResponse(c.categoryName, COUNT(bc.bookId)) "
            +
            "FROM Category c JOIN BookCategory bc ON c.category_id = bc.categoryId " +
            "GROUP BY c.categoryName ORDER BY COUNT(bc.bookId) DESC")
    java.util.List<com.example.lms.dto.CategoryCountResponse> findCategoryCounts();

    @Query("SELECT c.categoryName FROM Category c JOIN BookCategory bc ON c.category_id = bc.categoryId " +
            "WHERE bc.bookId = :bookId ORDER BY bc.categoryId ASC")
    List<String> findCategoryNamesByBookId(@Param("bookId") Integer bookId);
}
