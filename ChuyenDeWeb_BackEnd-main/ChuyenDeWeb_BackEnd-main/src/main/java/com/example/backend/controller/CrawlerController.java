package com.example.backend.controller;

import com.example.backend.service.RssCrawlerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.repository.ArticleRepository;
import com.example.backend.repository.ArticleContentRepository;
import com.example.backend.repository.CommentRepository;

@RestController
@RequestMapping("/api/crawler")
@CrossOrigin(origins = "http://localhost:5173")
public class CrawlerController {

    @Autowired
    private RssCrawlerService rssCrawlerService;

    @Autowired
    private ArticleRepository articleRepository;
    
    @Autowired
    private ArticleContentRepository articleContentRepository;

    @Autowired
    private CommentRepository commentRepository;

    // API de goi cao du lieu thu cong
    @PostMapping("/run")
    public ResponseEntity<?> runCrawler() {
        try {
            // Xoa binh luan truoc de tranh loi Foreign Key
            commentRepository.deleteAll();
            // Xoa noi dung
            articleContentRepository.deleteAll();
            // Xoa bai viet
            articleRepository.deleteAll();

            // Cao tin tu TAT CA cac chuyen muc cua VNExpress
            int totalCount = rssCrawlerService.crawlAllCategories();

            return ResponseEntity.ok("Crawler chay thanh cong! Da lay duoc " + totalCount + " bai viet tu 9 chuyen muc.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Loi khi chay crawler: " + e.getMessage());
        }
    }
}
