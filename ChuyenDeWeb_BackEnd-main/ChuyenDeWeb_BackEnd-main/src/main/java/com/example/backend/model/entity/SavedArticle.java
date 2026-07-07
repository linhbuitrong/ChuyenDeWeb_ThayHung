package com.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "saved_articles")
public class SavedArticle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    @Column(name = "saved_at")
    private LocalDateTime savedAt;

    public SavedArticle() {}

    public SavedArticle(User user, Article article) {
        this.user = user;
        this.article = article;
        this.savedAt = LocalDateTime.now();
    }
}
