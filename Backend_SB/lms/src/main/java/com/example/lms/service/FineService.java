package com.example.lms.service;

import com.example.lms.dto.FineRequest;
import com.example.lms.dto.FineResponse;

import java.util.List;

public interface FineService {

    FineResponse createFine(FineRequest request);

    FineResponse updateFine(Integer fineId, FineRequest request);

    void deleteFine(Integer fineId);

    FineResponse getFine(Integer fineId, Integer requesterMemberId, boolean isAdmin);

    List<FineResponse> getAllFines();
    List<FineResponse> getFinesForMember(Integer requesterMemberId);
    List<FineResponse> getFinesByStatus(String status);

    void checkAndCreateFine(Integer loanId);
}