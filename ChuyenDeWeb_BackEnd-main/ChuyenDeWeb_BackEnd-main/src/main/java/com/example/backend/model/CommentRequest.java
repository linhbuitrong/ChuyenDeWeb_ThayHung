package com.example.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentRequest {
    @NotNull(message = "Thiếu ID bài viết")
    private Integer articleId;

    @NotNull(message = "Thiếu ID người dùng")
    private Integer userId;

    @NotBlank(message = "Nội dung bình luận không được trống")
    private String content;
}
