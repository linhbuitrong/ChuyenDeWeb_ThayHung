package com.example.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileUpdateRequest {
    private String email;
    private String phone;
    private String birthday; // format: yyyy-MM-dd
}
