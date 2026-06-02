package com.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "article_contents")
public class ArticleContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id")
    private Integer contentId;

    @Column(name = "article_id")
    private Integer articleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type")
    private ContentType contentType;

    private String content;

    @Column(name = "order_index")
    private Integer orderIndex;

    private Integer version;

    private LocalDateTime createdAt;

    public enum ContentType {
        text, image
    }

    public ArticleContent() {
    }
}
