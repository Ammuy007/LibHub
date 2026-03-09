package com.example.lms.repository;

import com.example.lms.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    Optional<Category> findByCategoryNameIgnoreCase(String name);
    Page<Category> findByCategoryNameContainingIgnoreCase(String name, Pageable pageable);
}
