package com.example.loginsystem.controller;
import com.example.loginsystem.dto.VerifyOtpRequest;
import com.example.loginsystem.dto.ForgotPasswordRequest;
import com.example.loginsystem.dto.LoginRequest;
import com.example.loginsystem.dto.RegisterRequest;
import com.example.loginsystem.response.ApiResponse;
import com.example.loginsystem.service.UserService;
import com.example.loginsystem.dto.VerifyRegistrationRequest;

import jakarta.validation.Valid;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.loginsystem.dto.ResetPasswordRequest;
import org.springframework.web.bind.annotation.CrossOrigin;


@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ApiResponse registerUser(@Valid @RequestBody RegisterRequest request){

        return userService.registerUser(request);

    }

    @PostMapping("/login")
    public ApiResponse loginUser(@RequestBody LoginRequest request) {

        return userService.loginUser(request);

    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        ApiResponse response = userService.verifyOtp(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        ApiResponse response = userService.resetPassword(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        ApiResponse response = userService.forgotPassword(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/profile")
    public String profile() {
        return "Welcome! JWT Authentication Successful.";
    }


    @PostMapping("/verify-registration")
    public ApiResponse verifyRegistration(
            @Valid @RequestBody VerifyRegistrationRequest request) {

        return userService.verifyRegistration(
                request.getEmail(),
                request.getOtp()
        );
    }
}
