package com.example.lms.service;

import com.example.lms.dto.*;
import com.example.lms.entity.Member;
import com.example.lms.repository.MemberRepository;
import com.example.lms.util.PasswordUtil;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;


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

        
        if ("admin".equalsIgnoreCase(req.getRole())) {
            if (!isAdmin) throw new RuntimeException("Only admin can create admin");
            m.setRole("admin");
        } else {
            m.setRole("member");
        }

        
        String rawPwd = PasswordUtil.generateRandomPassword();
        m.setHashedPwd(encoder.encode(rawPwd));
        m.setStatus("active");

        // ensure membership start is set (database has default current_date)
        if (m.getMembershipStart() == null) {
            m.setMembershipStart(LocalDate.now());
        }

        Member saved = repo.save(m);

        
        emailService.sendPasswordEmail(saved.getEmail(), rawPwd);

        return saved;
    }

    @Override
    public Member updateMember(Integer id, UpdateMemberRequest req,
                               Integer requesterId, boolean isAdmin) {

        Member m = repo.findById(id).orElseThrow();

        
        if (!isAdmin && !id.equals(requesterId))
            throw new RuntimeException("Forbidden");

        m.setName(req.getName());
        m.setPhone(req.getPhone());
        m.setAddress(req.getAddress());

        return repo.save(m);
    }

    @Override
    public void deleteMember(Integer id, Integer requesterId, boolean isAdmin) {

        
        if (!isAdmin && !id.equals(requesterId))
            throw new RuntimeException("Forbidden");

        repo.deleteById(id);
    }

    @Override
    public void changePassword(Integer id, ChangePasswordRequest req) {

        Member m = repo.findById(id).orElseThrow();

        if (!encoder.matches(req.getOldPassword(), m.getHashedPwd()))
            throw new RuntimeException("Wrong password");

        m.setHashedPwd(encoder.encode(req.getNewPassword()));
        repo.save(m);
    }

    @Override
    public void changestatus(Integer Id){
        Member m = repo.findById(Id).orElseThrow();
        if(m.getStatus().equals("active")){
            m.setStatus("inactive");
        }
        else{
            m.setStatus("active");
        }
        repo.save(m);
    }

    @Override
    public Page<MemberResponse> getMembers(Integer id, String status, String name,
                                           Integer requesterId, boolean isAdmin,
                                           Integer page, Integer size
                                           ) {
        String normalizedStatus = status == null ? null : status.trim().toLowerCase();
        String normalizedName = name == null ? null : name.trim().toLowerCase();
        Pageable pageable = buildPageable(page, size);

        if (id == null) {
            if (isAdmin) {
                Page<Member> memberPage = findAdminMembers(normalizedStatus, normalizedName, pageable);
                return memberPage
                        .map(this::toResponse);
            }

            if (normalizedStatus != null || normalizedName != null) {
                throw new RuntimeException("Only admin can use name/status filters");
            }

            Member self = repo.findById(requesterId).orElseThrow();
            return toSinglePage(self, pageable);
        }

        if (!isAdmin && !id.equals(requesterId)) {
            throw new RuntimeException("Forbidden");
        }

        if (!isAdmin && (normalizedStatus != null || normalizedName != null)) {
            throw new RuntimeException("Only admin can use name/status filters");
        }

        Member member = repo.findById(id).orElseThrow();
        if (isAdmin) {
            if (normalizedStatus != null && !member.getStatus().equalsIgnoreCase(normalizedStatus)) {
                return Page.empty(pageable);
            }
            if (normalizedName != null &&
                    !member.getName().toLowerCase().contains(normalizedName)) {
                return Page.empty(pageable);
            }
        }
        return toSinglePage(member, pageable);
    }

    private Pageable buildPageable(Integer page, Integer size) {
        int safePage = page == null || page < 0 ? 0 : page;
        int safeSize = size == null || size <= 0 ? 10 : size;
       

        return PageRequest.of(safePage, safeSize);
    }

    private Page<Member> findAdminMembers(String status, String name, Pageable pageable) {
        if (status != null && name != null) {
            return repo.findByStatusIgnoreCaseAndNameContainingIgnoreCase(status, name, pageable);
        }
        if (status != null) {
            return repo.findByStatusIgnoreCase(status, pageable);
        }
        if (name != null) {
            return repo.findByNameContainingIgnoreCase(name, pageable);
        }
        return repo.findAll(pageable);
    }

    private Page<MemberResponse> toSinglePage(Member member, Pageable pageable) {
        if (pageable.getPageNumber() > 0) {
            return Page.empty(pageable);
        }
        List<MemberResponse> content = List.of(toResponse(member));
        return new PageImpl<>(content, pageable, 1);
    }

    private MemberResponse toResponse(Member m) {
        return new MemberResponse(
                m.getMemberId(),
                m.getName(),
                m.getEmail(),
                m.getPhone(),
                m.getAddress(),
                m.getRole(),
                m.getStatus(),
                m.getMembershipStart(),
                m.getMembershipEnd()
        );
    }
}
