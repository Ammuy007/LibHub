package com.example.lms.repository;

import com.example.lms.entity.BookCategory;
import com.example.lms.entity.BookCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookCategoryRepository extends JpaRepository<BookCategory, BookCategoryId> {

    List<BookCategory> findByCategoryId(Integer categoryId);

    List<BookCategory> findByBookId(Integer bookId);
}