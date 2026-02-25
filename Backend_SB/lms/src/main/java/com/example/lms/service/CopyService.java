package com.example.lms.service;

import com.example.lms.dto.CopyAvailabilityResponse;
import com.example.lms.dto.CopyRequest;
import com.example.lms.entity.Copy;

import java.util.List;

public interface CopyService {

    
    List<Copy> createCopies(CopyRequest req);

    Copy getById(Integer id);

    List<Copy> getAll();

    void delete(Integer id);

    List<Copy> getCopiesOfBook(Integer bookId);

    
    CopyAvailabilityResponse getAvailability(Integer bookId);
}