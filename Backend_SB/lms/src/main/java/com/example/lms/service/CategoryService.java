package com.example.lms.service;

import com.example.lms.dto.CategoryRequest;
import com.example.lms.dto.CategoryResponse;
import com.example.lms.entity.Category;
import com.example.lms.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryResponse create(CategoryRequest categoryRequest) {
        Category category = new Category();
        category.setCategory_name(categoryRequest.getCategory_name());
        Category saved = categoryRepository.save(category);
        return toResponse(saved);
    }

    public CategoryResponse update(Integer id, CategoryRequest updated) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existing.setCategory_name(updated.getCategory_name());
        Category saved = categoryRepository.save(existing);
        return toResponse(saved);
    }

    public Page<CategoryResponse> getCategories(Integer id, Integer page, Integer size) {

    Pageable pageable = buildPageable(page, size);

    
    if (id != null) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return toSinglePage(category, pageable);
    }

    
    Page<Category> categoryPage = categoryRepository.findAll(pageable);

    return categoryPage.map(this::toResponse);
}

    public void delete(Integer id) {
        categoryRepository.deleteById(id);
    }

    private CategoryResponse toResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setCategory_id(category.getCategory_id());
        response.setCategory_name(category.getCategory_name());
        return response;
    }

    private Pageable buildPageable(Integer page, Integer size) {
        int safePage = page == null || page < 0 ? 0 : page;
        int safeSize = size == null || size <= 0 ? 10 : size;
        return PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.ASC, "categoryName"));
    }

    private Page<CategoryResponse> toSinglePage(Category category, Pageable pageable) {
        if (pageable.getPageNumber() > 0) {
            return Page.empty(pageable);
        }
        return new PageImpl<>(List.of(toResponse(category)), pageable, 1);
    }
}
