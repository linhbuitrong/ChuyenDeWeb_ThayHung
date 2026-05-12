package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
@NoArgsConstructor
@Data
@AllArgsConstructor
public class ArticleDTO {
    private Integer id;
    private String title;
    private String author;
    private LocalDateTime createdAt;
    private String imageId;
    private List<ContentDTO> contents;

    @Data
    @AllArgsConstructor
    public static class ContentDTO {
        private String type; // "text" or "image"
        private String content;
    }
}
