package com.example.backend.service;

import com.example.backend.model.CommentRequest;
import com.example.backend.model.entity.Article;
import com.example.backend.model.entity.Comment;
import com.example.backend.model.entity.User;
import com.example.backend.repository.ArticleRepository;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Comment> getCommentsByArticleId(Integer articleId) {
        return commentRepository.findByArticle_ArticleId(articleId);
    }

    @Transactional
    public Comment createComment(CommentRequest req) {
        Article article = articleRepository.findById(req.getArticleId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với ID: " + req.getArticleId()));

        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + req.getUserId()));

        Comment comment = new Comment();
        comment.setArticle(article);
        comment.setUser(user);
        comment.setContent(req.getContent());
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Integer id) {
        if (!commentRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy bình luận với ID: " + id);
        }
        commentRepository.deleteById(id);
    }
}
