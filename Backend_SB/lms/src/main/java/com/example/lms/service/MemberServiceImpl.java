package com.example.lms.service;

import com.example.lms.dto.*;
import com.example.lms.entity.Member;
import com.example.lms.repository.MemberRepository;
import com.example.lms.util.PasswordUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository repo;
    private final PasswordEncoder encoder;
    private final EmailService emailService;

    public MemberServiceImpl(MemberRepository repo,
                             PasswordEncoder encoder,
                             EmailService emailService) {
        this.repo = repo;
        this.encoder = encoder;
        this.emailService = emailService;
    }

    @Override
    public Member createMember(CreateMemberRequest req, boolean isAdmin) {

        Member m = new Member();
        m.setName(req.getName());
        m.setEmail(req.getEmail());
        m.setPhone(req.getPhone());
        m.setAddress(req.getAddress());

        // 🔄 CHANGED: role rules
        if ("admin".equalsIgnoreCase(req.getRole())) {
            if (!isAdmin) throw new RuntimeException("Only admin can create admin");
            m.setRole("admin");
        } else {
            m.setRole("member");
        }

        // 🔄 CHANGED: random password + hashing
        String rawPwd = PasswordUtil.generateRandomPassword();
        m.setHashedPwd(encoder.encode(rawPwd));
        m.setStatus("active");

        Member saved = repo.save(m);

        // ✅ NEW: email password
        emailService.sendPasswordEmail(saved.getEmail(), rawPwd);

        return saved;
    }

    @Override
    public Member updateMember(Integer id, UpdateMemberRequest req,
                               Integer requesterId, boolean isAdmin) {

        Member m = repo.findById(id).orElseThrow();

        // 🔄 CHANGED: self/admin rule
        if (!isAdmin && !id.equals(requesterId))
            throw new RuntimeException("Forbidden");

        m.setName(req.getName());
        m.setPhone(req.getPhone());
        m.setAddress(req.getAddress());

        return repo.save(m);
    }

    @Override
    public void deleteMember(Integer id, Integer requesterId, boolean isAdmin) {

        // 🔄 CHANGED: self/admin rule
        if (!isAdmin && !id.equals(requesterId))
            throw new RuntimeException("Forbidden");

        repo.deleteById(id);
    }

    @Override
    public void changePassword(Integer id, ChangePasswordRequest req) {

        Member m = repo.findById(id).orElseThrow();

        // 🔄 CHANGED: verify old password
        if (!encoder.matches(req.getOldPassword(), m.getHashedPwd()))
            throw new RuntimeException("Wrong password");

        m.setHashedPwd(encoder.encode(req.getNewPassword()));
        repo.save(m);
    }

    @Override
    public void deactivateMember(Integer id) {
        Member m = repo.findById(id).orElseThrow();
        m.setStatus("inactive");
        repo.save(m);
    }

    @Override
    public void activateMember(Integer id) {
        Member m = repo.findById(id).orElseThrow();
        m.setStatus("active");
        repo.save(m);
    }
    @Override
public MemberResponse getMember(Integer id, Integer requesterId, boolean isAdmin) {

    Member m = repo.findById(id).orElseThrow();

    // 🔒 access rule
    if (!isAdmin && !id.equals(requesterId))
        throw new RuntimeException("Forbidden");

    return new MemberResponse(
            m.getMemberId(),
            m.getName(),
            m.getEmail(),
            m.getPhone(),
            m.getAddress(),
            m.getRole(),
            m.getStatus()
    );
}
}