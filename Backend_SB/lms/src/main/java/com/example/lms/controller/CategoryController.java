package com.example.lms.controller;

import com.example.lms.dto.CategoryRequest;
import com.example.lms.dto.CategoryResponse;
import com.example.lms.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public CategoryResponse create(@RequestBody CategoryRequest categoryRequest) {
        return categoryService.create(categoryRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public CategoryResponse update(@PathVariable Integer id, @RequestBody CategoryRequest categoryRequest) {
        return categoryService.update(id, categoryRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public Page<CategoryResponse> getCategories(@RequestParam(required = false) Integer id,
                                                @RequestParam(defaultValue = "0") Integer page,
                                                @RequestParam(defaultValue = "10") Integer size) {
        return categoryService.getCategories(id, page, size);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        categoryService.delete(id);
    }
}
