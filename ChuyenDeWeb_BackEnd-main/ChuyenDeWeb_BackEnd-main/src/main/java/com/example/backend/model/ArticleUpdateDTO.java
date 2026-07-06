package com.example.backend.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ArticleUpdateDTO {
    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề tối đa 255 ký tự")
    private String title;

    private String link;
    private String imageId;
    private Integer authorId;
    private Integer categoryId;
    private String status;

    @NotBlank(message = "Tên tác giả không được trống")
    private String author;

    @Valid
    private List<ArticleDTO.ContentDTO> contents;
}
