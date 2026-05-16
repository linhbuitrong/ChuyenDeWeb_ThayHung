// controller/ArticleController.java
package com.example.backend.controller;

import com.example.backend.model.ArticleDTO;
import com.example.backend.model.ArticleUpdateDTO;
import com.example.backend.model.entity.Article;
import com.example.backend.repository.ArticleContentRepository;
import com.example.backend.repository.AuthorRepository;
import com.example.backend.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "http://localhost:3000")
public class ArticleController {

    @Autowired
   private ArticleService articleService;
    @Autowired
    private ArticleContentRepository articleContentRepository;
    @Autowired
    private AuthorRepository authorRepository;

    @GetMapping
    public List<ArticleDTO> getAllArticles() {
        return articleService.getAllArticleDTOs();
    }

//        return articles.stream().map(article -> {
//            AtomicReference<String> authorName = new AtomicReference<>("Unknown");
//            if (article.getAuthorId() != null) {
//                authorRepository.findById(article.getAuthorId().intValue()).ifPresent(author ->
//                        authorName.set(author.getName()));
//            }
//
//            // Có thể lấy `description` từ `link` hoặc sau này bạn thêm field riêng
//            String description = "Xem thêm tại: " + article.getLink();
//
//            return new ArticleDTO(
//                    article.getArticleId(),
//                    article.getTitle(),
//                    description,
//                    authorName.get(),
//                    article.getCreatedAt()
//            );
//        }).toList();

    @PostMapping
    public ResponseEntity<?> createArticle(@RequestBody ArticleDTO dto) {
        articleService.createArticle(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Integer id) {
        try {
            articleService.deleteArticle(id);
            return ResponseEntity.ok("Xoá thành công bài viết có ID: " + id);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(
            @PathVariable Integer id,
            @RequestBody ArticleUpdateDTO dto) {
        try {
            Article updated = articleService.updateArticle(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }


}
