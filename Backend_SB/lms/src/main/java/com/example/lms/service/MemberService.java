package com.example.lms.service;

import com.example.lms.dto.*;
import com.example.lms.entity.Member;

public interface MemberService {

    Member createMember(CreateMemberRequest req, boolean isAdmin);

    Member updateMember(Integer id, UpdateMemberRequest req,
                        Integer requesterId, boolean isAdmin);

    void deleteMember(Integer id, Integer requesterId, boolean isAdmin);

    void changePassword(Integer id, ChangePasswordRequest req);

    void deactivateMember(Integer id);

    void activateMember(Integer id);
    MemberResponse getMember(Integer id, Integer requesterId, boolean isAdmin);
}