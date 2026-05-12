package com.example.backend.service;

import com.example.backend.model.entity.ArticleContent;
import com.example.backend.repository.ArticleContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleContentService {
    @Autowired
    private ArticleContentRepository articleContentRepository;
    public List<ArticleContent> findAll() {
        return articleContentRepository.findAll();
    }
}
