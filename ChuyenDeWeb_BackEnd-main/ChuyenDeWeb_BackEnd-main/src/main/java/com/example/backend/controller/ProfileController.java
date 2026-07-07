package com.example.backend.controller;

import com.example.backend.model.ProfileUpdateRequest;
import com.example.backend.model.entity.Comment;
import com.example.backend.model.entity.SavedArticle;
import com.example.backend.model.entity.User;
import com.example.backend.model.entity.Article;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.SavedArticleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private SavedArticleRepository savedArticleRepository;

    @Autowired
    private ArticleRepository articleRepository;

    // ==================== THÔNG TIN CÁ NHÂN ====================

    // Lấy thông tin người dùng theo ID
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable int userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
        }
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("phone", user.getPhone());
        profile.put("birthday", user.getBirthday());
        profile.put("accountType", user.getAccountType());
        return ResponseEntity.ok(profile);
    }

    // Cập nhật thông tin cá nhân
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable int userId, @RequestBody ProfileUpdateRequest req) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
        }
        if (req.getEmail() != null) user.setEmail(req.getEmail());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getBirthday() != null && !req.getBirthday().isEmpty()) {
            user.setBirthday(LocalDate.parse(req.getBirthday(), DateTimeFormatter.ISO_DATE));
        }
        userRepository.save(user);
        return ResponseEntity.ok("Cập nhật thành công");
    }

    // ==================== TIN ĐÃ LƯU (BOOKMARK) ====================

    // Lấy danh sách bài viết đã lưu
    @GetMapping("/{userId}/saved")
    public ResponseEntity<?> getSavedArticles(@PathVariable int userId) {
        List<SavedArticle> savedList = savedArticleRepository.findByUser_IdOrderBySavedAtDesc(userId);
        // Trả về danh sách bài viết kèm thời gian lưu
        List<Map<String, Object>> result = new ArrayList<>();
        for (SavedArticle sa : savedList) {
            Map<String, Object> item = new HashMap<>();
            Article a = sa.getArticle();
            item.put("savedId", sa.getId());
            item.put("articleId", a.getArticleId());
            item.put("title", a.getTitle());
            item.put("imageId", a.getImageId());
            item.put("categoryId", a.getCategoryId());
            item.put("publishedAt", a.getPublishedAt());
            item.put("savedAt", sa.getSavedAt());
            result.add(item);
        }
        return ResponseEntity.ok(result);
    }

    // Lưu bài viết (bookmark)
    @PostMapping("/{userId}/saved/{articleId}")
    public ResponseEntity<?> saveArticle(@PathVariable int userId, @PathVariable Integer articleId) {
        // Kiểm tra đã lưu chưa
        if (savedArticleRepository.existsByUser_IdAndArticle_ArticleId(userId, articleId)) {
            return ResponseEntity.badRequest().body("Bài viết đã được lưu trước đó");
        }
        User user = userRepository.findById(userId).orElse(null);
        Article article = articleRepository.findById(articleId).orElse(null);
        if (user == null || article == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy dữ liệu");
        }
        SavedArticle saved = new SavedArticle(user, article);
        savedArticleRepository.save(saved);
        return ResponseEntity.ok("Đã lưu bài viết");
    }

    // Bỏ lưu bài viết (xóa bookmark)
    @DeleteMapping("/{userId}/saved/{articleId}")
    public ResponseEntity<?> unsaveArticle(@PathVariable int userId, @PathVariable Integer articleId) {
        SavedArticle sa = savedArticleRepository.findByUser_IdAndArticle_ArticleId(userId, articleId).orElse(null);
        if (sa == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bài viết chưa được lưu");
        }
        savedArticleRepository.delete(sa);
        return ResponseEntity.ok("Đã bỏ lưu bài viết");
    }

    // Kiểm tra bài viết đã được lưu chưa (cho nút bookmark trên trang chi tiết)
    @GetMapping("/{userId}/saved/check/{articleId}")
    public ResponseEntity<?> checkSaved(@PathVariable int userId, @PathVariable Integer articleId) {
        boolean isSaved = savedArticleRepository.existsByUser_IdAndArticle_ArticleId(userId, articleId);
        return ResponseEntity.ok(Map.of("saved", isSaved));
    }

    // ==================== LỊCH SỬ BÌNH LUẬN ====================

    // Lấy tất cả bình luận của 1 người dùng
    @GetMapping("/{userId}/comments")
    public ResponseEntity<?> getUserComments(@PathVariable int userId) {
        List<Comment> comments = commentRepository.findByUser_IdOrderByCreatedAtDesc(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Comment c : comments) {
            Map<String, Object> item = new HashMap<>();
            item.put("commentId", c.getCommentId());
            item.put("content", c.getContent());
            item.put("createdAt", c.getCreatedAt());
            item.put("articleId", c.getArticle().getArticleId());
            item.put("articleTitle", c.getArticle().getTitle());
            result.add(item);
        }
        return ResponseEntity.ok(result);
    }
}
