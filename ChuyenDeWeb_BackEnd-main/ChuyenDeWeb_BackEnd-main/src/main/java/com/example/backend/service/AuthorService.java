package com.example.backend.service;

import com.example.backend.model.entity.Author;
import com.example.backend.repository.AuthorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorService {
    @Autowired
    private AuthorRepository authorRepository;
    public List<Author> findAll() {
        return authorRepository.findAll();
    }
}
