package com.example.lms.controller;

import com.example.lms.dto.*;
import com.example.lms.entity.Member;
import com.example.lms.service.MemberService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/members")
public class MemberController {

    private final MemberService service; // 🔄 CHANGED: use service not repo

    public MemberController(MemberService service) {
        this.service = service;
    }

    // CREATE
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Member create(@RequestBody CreateMemberRequest req,
                         Authentication auth) {

        return service.createMember(req, true); // 🔄 CHANGED
    }

    // UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal")
    public Member update(@PathVariable Integer id,
                         @RequestBody UpdateMemberRequest req,
                         Authentication auth) {

        Integer requesterId = (Integer) auth.getPrincipal();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return service.updateMember(id, req, requesterId, isAdmin); // 🔄
    }

    // CHANGE PASSWORD
    @PutMapping("/{id}/password")
    @PreAuthorize("#id == authentication.principal")
    public void changePassword(@PathVariable Integer id,
                               @RequestBody ChangePasswordRequest req) {

        service.changePassword(id, req); // ✅ NEW
    }

    // DEACTIVATE
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/deactivate")
    public void deactivate(@PathVariable Integer id) {
        service.deactivateMember(id); // ✅ NEW
    }

    // ACTIVATE
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/activate")
    public void activate(@PathVariable Integer id) {
        service.activateMember(id); // ✅ NEW
    }

    // DELETE
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id,
                       Authentication auth) {

        Integer requesterId = (Integer) auth.getPrincipal();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        service.deleteMember(id, requesterId, isAdmin); // 🔄 CHANGED
    }
    // VIEW ONE
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal")
    public MemberResponse getById(@PathVariable Integer id,
                                Authentication auth) {

        Integer requesterId = (Integer) auth.getPrincipal();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return service.getMember(id, requesterId, isAdmin);
    }
}