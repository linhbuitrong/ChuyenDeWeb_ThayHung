package com.example.backend.repository;

import com.example.backend.model.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Integer> {
    boolean existsByLink(String link);
    List<Article> findByCategoryId(Integer categoryId);
}