package com.example.backend.model;

public class AuthResponse {
    private Long id;
    private String username;
    private int accountType;

    public AuthResponse(Long id, String username, int accountType) {
        this.id = id;
        this.username = username;
        this.accountType = accountType;
    }

    // Getters (nếu dùng @RestController sẽ tự động serialize JSON)
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public int getAccountType() {
        return accountType;
    }
}
