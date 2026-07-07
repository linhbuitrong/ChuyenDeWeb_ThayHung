package com.example.backend.repository;

import com.example.backend.model.entity.SavedArticle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedArticleRepository extends JpaRepository<SavedArticle, Integer> {
    List<SavedArticle> findByUser_IdOrderBySavedAtDesc(int userId);
    Optional<SavedArticle> findByUser_IdAndArticle_ArticleId(int userId, Integer articleId);
    boolean existsByUser_IdAndArticle_ArticleId(int userId, Integer articleId);
    void deleteByUser_IdAndArticle_ArticleId(int userId, Integer articleId);
}
