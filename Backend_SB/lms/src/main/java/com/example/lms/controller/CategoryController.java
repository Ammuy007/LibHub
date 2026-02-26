package com.example.lms.controller;

import com.example.lms.entity.Category;
import com.example.lms.service.CategoryService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryService.create(category);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Category update(@PathVariable Integer id, @RequestBody Category category) {
        return categoryService.update(id, category);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAll();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public Category getById(@PathVariable Integer id) {
        return categoryService.getById(id);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        categoryService.delete(id);
    }
}