package com.example.backend.controller;

import com.example.backend.model.entity.ArticleContent;
import com.example.backend.service.ArticleContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/article/content")
public class ArticleContentController {
    @Autowired
    private ArticleContentService articleContentService;
    @GetMapping
    public List<ArticleContent> getArticleContent() {
        return articleContentService.findAll();
    }
}
