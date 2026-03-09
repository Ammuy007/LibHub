package com.example.lms.service;

import com.example.lms.dto.CopyAvailabilityResponse;
import com.example.lms.dto.CopyRequest;
import com.example.lms.entity.Copy;

import java.util.List;

public interface CopyService {

    
    List<Copy> createCopies(CopyRequest req);

    List<Copy> getCopies(Integer id, Integer bookId, String status);

    void delete(Integer id);

    
    CopyAvailabilityResponse getAvailability(Integer bookId);
}
