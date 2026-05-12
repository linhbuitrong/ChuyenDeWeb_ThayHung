package com.example.backend.model;

import ch.qos.logback.core.status.Status;
import com.example.backend.model.ArticleDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ArticleUpdateDTO {
    private String title;
    private String link;
    private String imageId;
    private Integer authorId;
    private Integer categoryId;
    private String status;
    private String author; // Nếu bạn lấy theo tên tác giả thay vì ID
    private List<ArticleDTO.ContentDTO> contents;
}
