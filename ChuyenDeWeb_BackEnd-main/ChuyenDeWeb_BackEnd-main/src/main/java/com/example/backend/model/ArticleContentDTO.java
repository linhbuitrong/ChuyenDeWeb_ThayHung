package com.example.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArticleContentDTO {
    private String content;
    private String contentType; // "text" hoặc "image"
}