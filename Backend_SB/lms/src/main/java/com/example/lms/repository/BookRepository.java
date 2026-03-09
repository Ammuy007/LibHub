package com.example.lms.repository;

import com.example.lms.entity.Book;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BookRepository extends JpaRepository<Book, Integer> {
    List<Book> findByIsbnContainingIgnoreCase(String isbn);
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByAuthorContainingIgnoreCase(String author);
    @Query(value = """
       SELECT * FROM book
       WHERE book_id IN (
           SELECT bc.book_id
           FROM book_category bc
           JOIN category c ON c.category_id = bc.category_id
           WHERE LOWER(c.category_name) LIKE LOWER(CONCAT('%', :categoryName, '%'))
       )
       """, nativeQuery = true)
    List<Book> findByCategoryName(String categoryName);
}
