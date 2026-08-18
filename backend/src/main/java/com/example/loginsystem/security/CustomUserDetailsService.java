package com.example.loginsystem.security;

import com.example.loginsystem.entity.Interviewer;
import com.example.loginsystem.entity.User;
import com.example.loginsystem.repository.InterviewerRepository;
import com.example.loginsystem.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InterviewerRepository interviewerRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // Check Candidate
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {

            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPassword(),
                    Collections.singletonList(
                            new SimpleGrantedAuthority(user.getRole())
                    )
            );
        }

        // Check Interviewer
        Interviewer interviewer =
                interviewerRepository.findByEmail(email).orElse(null);

        if (interviewer != null) {

            return new org.springframework.security.core.userdetails.User(
                    interviewer.getEmail(),
                    interviewer.getPassword(),
                    Collections.singletonList(
                            new SimpleGrantedAuthority(interviewer.getRole())
                    )
            );
        }

        throw new UsernameNotFoundException("User not found.");
    }
}