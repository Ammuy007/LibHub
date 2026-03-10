package com.example.lms.controller;

import com.example.lms.dto.*;
import com.example.lms.entity.Member;
import com.example.lms.service.MemberService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/members")
public class MemberController {

    private final MemberService service;

    public MemberController(MemberService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Member create(@RequestBody CreateMemberRequest req,
            Authentication auth) {

        return service.createMember(req, true);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal")
    public Member update(@PathVariable Integer id,
            @RequestBody UpdateMemberRequest req,
            Authentication auth) {

        Integer requesterId = (Integer) auth.getPrincipal();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return service.updateMember(id, req, requesterId, isAdmin);
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("#id == authentication.principal")
    public void changePassword(@PathVariable Integer id,
            @RequestBody ChangePasswordRequest req) {

        service.changePassword(id, req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/changestatus")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void changestatus(@PathVariable Integer id) {
        service.changestatus(id);
    }

    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id,
            Authentication auth) {

        Integer requesterId = (Integer) auth.getPrincipal();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        service.deleteMember(id, requesterId, isAdmin);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MEMBER')")
    public Page<MemberResponse> getMembers(@RequestParam(required = false) Integer id,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            Authentication auth) {
        Integer requesterId = (Integer) auth.getPrincipal();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return service.getMembers(id, status, name, requesterId, isAdmin, page, size);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/next-id")
    public Integer getNextId() {
        Integer maxId = service.getNextMemberId();
        return (maxId == null ? 0 : maxId) + 1;
    }
}
