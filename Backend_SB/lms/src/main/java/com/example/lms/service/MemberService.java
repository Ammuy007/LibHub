package com.example.lms.service;

import com.example.lms.dto.*;
import com.example.lms.entity.Member;
import org.springframework.data.domain.Page;

public interface MemberService {

    Member createMember(CreateMemberRequest req, boolean isAdmin);

    Member updateMember(Integer id, UpdateMemberRequest req,
                        Integer requesterId, boolean isAdmin);

    void deleteMember(Integer id, Integer requesterId, boolean isAdmin);

    void changePassword(Integer id, ChangePasswordRequest req);

    void changestatus(Integer id);

    Page<MemberResponse> getMembers(Integer id, String status, String name,
                                    Integer requesterId, boolean isAdmin,
                                    Integer page, Integer size);
}
