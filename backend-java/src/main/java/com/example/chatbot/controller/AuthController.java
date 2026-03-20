package com.example.chatbot.controller;

import com.example.chatbot.dto.AuthDto;
import com.example.chatbot.model.User;
import com.example.chatbot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDto dto) {
        if (dto.getEmail() == null || dto.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }
        try {
            User user = userService.register(dto.getEmail(), dto.getPassword(), dto.getRole());
            return ResponseEntity.status(201).body(Map.of("message", "User registered successfully", "role", user.getRole()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDto dto) {
        if (dto.getEmail() == null || dto.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        return userService.login(dto.getEmail(), dto.getPassword())
                .map(user -> ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "user", Map.of("id", user.getId(), "email", user.getEmail(), "role", user.getRole()),
                        "token", "mock-jwt-token-xyz-123"
                )))
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Invalid email or password")));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestParam String email) {
        return userService.getProfile(email)
                .map(user -> ResponseEntity.ok(Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "role", user.getRole(),
                        "username", user.getEmail().split("@")[0]
                )))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }
}
