package com.example.backend.controller;

import com.example.backend.model.entity.Author;
import com.example.backend.service.AuthorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/author")
public class AuthorController {
    @Autowired
    private AuthorService authorService;
    @GetMapping
    public List<Author> getAllAuthors() {
        return authorService.findAll();
    }
}
