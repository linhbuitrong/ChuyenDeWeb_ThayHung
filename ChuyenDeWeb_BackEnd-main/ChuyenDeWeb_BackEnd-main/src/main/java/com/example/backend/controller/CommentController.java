package com.example.backend.controller;

import com.example.backend.model.CommentRequest;
import com.example.backend.model.entity.Comment;
import com.example.backend.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping
    public List<Comment> getComments() {
        return commentService.getAllComments();
    }

    // Lấy bình luận theo bài viết
    @GetMapping("/article/{articleId}")
    public List<Comment> getCommentsByArticle(@PathVariable Integer articleId) {
        return commentService.getCommentsByArticleId(articleId);
    }

    @PostMapping
    public ResponseEntity<?> createComment(@Valid @RequestBody CommentRequest req) {
        Comment saved = commentService.createComment(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Integer id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok("Xoá bình luận thành công");
    }
}
