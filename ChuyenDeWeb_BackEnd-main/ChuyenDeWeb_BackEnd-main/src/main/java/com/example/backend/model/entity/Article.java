package com.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@Table(name = "articles")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="article_id")
    private Integer articleId;


    private String title;
    private String link;

    @Column(name = "image_id")
    private String imageId;

    private Integer authorId;
    private Integer categoryId;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum Status {
        draft, published, archived;
        public static Status fromString(String value) {
            return Status.valueOf(value.toLowerCase());
        }
    }

  public Article(){}


}
