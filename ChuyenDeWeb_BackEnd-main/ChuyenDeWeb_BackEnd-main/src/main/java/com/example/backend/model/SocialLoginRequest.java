package com.example.backend.model;

public class SocialLoginRequest {
    private String token;

    public SocialLoginRequest() {}

    public SocialLoginRequest(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
