package com.example.backend.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
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

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề tối đa 255 ký tự")
    private String title;

    @NotBlank(message = "Tên tác giả không được để trống")
    private String author;

    private LocalDateTime createdAt;
    private String imageId;

    @NotEmpty(message = "Bài viết phải có ít nhất 1 nội dung")
    @Valid
    private List<ContentDTO> contents;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ContentDTO {
        @NotBlank(message = "Loại nội dung không được trống")
        private String type; // "text" or "image"

        @NotBlank(message = "Nội dung không được trống")
        private String content;
    }
}
