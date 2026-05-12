package com.example.backend.service;

import com.example.backend.model.entity.Comment;
import com.example.backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }
}
