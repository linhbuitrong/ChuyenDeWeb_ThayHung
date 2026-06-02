package com.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Integer commentId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    private String content;
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Comment() {
    }
    public Comment(Integer commentId, User user, Article article, String content, LocalDateTime createdAt) {
        this.commentId = commentId;
        this.user = user;
        this.article = article;
        this.content = content;
        this.createdAt = createdAt;
    }
}
