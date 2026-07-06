// controller/ArticleController.java
package com.example.backend.controller;

import com.example.backend.model.ArticleDTO;
import com.example.backend.model.ArticleUpdateDTO;
import com.example.backend.model.entity.Article;
import com.example.backend.service.ArticleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "http://localhost:5173")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public List<ArticleDTO> getAllArticles(
            @RequestParam(required = false) Integer categoryId) {
        if (categoryId != null) {
            return articleService.getArticleDTOsByCategoryId(categoryId);
        }
        return articleService.getAllArticleDTOs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleDTO> getArticleById(@PathVariable Integer id) {
        return ResponseEntity.ok(articleService.getArticleDTOById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createArticle(@Valid @RequestBody ArticleDTO dto) {
        articleService.createArticle(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Tạo bài viết thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteArticle(@PathVariable Integer id) {
        articleService.deleteArticle(id);
        return ResponseEntity.ok("Xoá thành công bài viết có ID: " + id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateArticle(
            @PathVariable Integer id,
            @Valid @RequestBody ArticleUpdateDTO dto) {
        Article updated = articleService.updateArticle(id, dto);
        return ResponseEntity.ok(updated);
    }

}
