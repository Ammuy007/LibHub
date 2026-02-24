package com.example.lms.controller;

import com.example.lms.entity.Member;
import com.example.lms.repository.MemberRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("v1/members")
public class MemberController {

    private final MemberRepository repo;

    public MemberController(MemberRepository repo) {
        this.repo = repo;
    }

    // CREATE
    @PostMapping
    public Member create(@RequestBody Member m) {
        m.setMember_id(null);
        return repo.save(m);
    }

    // READ ALL
    @GetMapping
    public List<Member> getAll() {
        return repo.findAll();
    }

    // READ ONE
    @GetMapping("/{id}")
    public Member getById(@PathVariable Integer id) {
        return repo.findById(id).orElse(null);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Member update(@PathVariable Integer id,
                         @RequestBody Member m) {
        m.setMember_id(id);
        return repo.save(m);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        repo.deleteById(id);
    }
}