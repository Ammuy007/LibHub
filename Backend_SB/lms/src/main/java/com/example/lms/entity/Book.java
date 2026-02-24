package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "book")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Integer bookId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 20, unique = true)
    private String isbn;

    private String publisher;

    @Column(name = "publish_year")
    private Integer publishYear;

    private Integer edition;

    private String author;
}
