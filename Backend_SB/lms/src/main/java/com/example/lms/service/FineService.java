package com.example.lms.service;

import com.example.lms.dto.FineRequest;
import com.example.lms.dto.FineResponse;
import org.springframework.data.domain.Page;



public interface FineService {

    FineResponse createFine(FineRequest request);

    FineResponse updateFine(Integer fineId, FineRequest request);

    void deleteFine(Integer fineId);
    FineResponse markFinePaid(Integer fineId);
    Page<FineResponse> getFines(Integer fineId, Integer memberId, String status,
                                Integer requesterMemberId, boolean isAdmin,
                                Integer page, Integer size);

    void checkAndCreateFine(Integer loanId);
}
