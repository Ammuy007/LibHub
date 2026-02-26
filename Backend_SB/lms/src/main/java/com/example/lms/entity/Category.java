package com.example.lms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer category_id;

    @Column(nullable = false, unique = true,name="category_name")
    private String categoryName;

    public Integer getCategory_id() { return category_id; }
    public void setCategory_id(Integer category_id) { this.category_id = category_id; }

    public String getCategory_name() { return categoryName; }
    public void setCategory_name(String category_name) { this.categoryName = category_name; }
}