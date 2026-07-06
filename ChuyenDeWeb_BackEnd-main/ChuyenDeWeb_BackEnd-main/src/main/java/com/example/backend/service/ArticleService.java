package com.example.backend.service;

import com.example.backend.model.entity.ArticleContent;
import com.example.backend.model.ArticleUpdateDTO;
import com.example.backend.model.entity.Article;
import com.example.backend.model.ArticleDTO;
import com.example.backend.model.entity.Author;
import com.example.backend.repository.ArticleContentRepository;
import com.example.backend.repository.ArticleRepository;
import com.example.backend.repository.AuthorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.backend.repository.CommentRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ArticleService {
    @Autowired
    private AuthorRepository authorRepository;
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private ArticleContentRepository articleContentRepository;
    @Autowired
    private CommentRepository commentRepository;

    @Transactional(readOnly = true)
    public ArticleDTO getArticleDTOById(Integer id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với ID: " + id));

        String authorName = authorRepository.findById((int) article.getAuthorId().longValue())
                .map(author -> author.getName())
                .orElse("Unknown");

        List<ArticleDTO.ContentDTO> contents = articleContentRepository.findByArticleId(article.getArticleId())
                .stream()
                .map(content -> new ArticleDTO.ContentDTO(
                        content.getContentType().name().toLowerCase(),
                        content.getContent()
                ))
                .toList();

        return new ArticleDTO(
                article.getArticleId(),
                article.getTitle(),
                authorName,
                article.getCreatedAt(),
                article.getImageId(),
                contents
        );
    }

    @Transactional(readOnly = true)
    public List<ArticleDTO> getAllArticleDTOs() {
        List<Article> articles = articleRepository.findAll();

        return articles.stream().map(article -> {
            String authorName = authorRepository.findById((int) article.getAuthorId().longValue())
                    .map(author -> author.getName())
                    .orElse("Unknown");

            List<ArticleDTO.ContentDTO> contents = articleContentRepository.findByArticleId(article.getArticleId())
                    .stream()
                    .map(content -> new ArticleDTO.ContentDTO(
                            content.getContentType().name().toLowerCase(),
                            content.getContent()
                    ))
                    .toList();

            return new ArticleDTO(
                    article.getArticleId(),
                    article.getTitle(),
                    authorName,
                    article.getCreatedAt(),
                    article.getImageId(),
                    contents
            );
        }).toList();
    }

    @Transactional(readOnly = true)
    public List<ArticleDTO> getArticleDTOsByCategoryId(Integer categoryId) {
        List<Article> articles = articleRepository.findByCategoryId(categoryId);

        return articles.stream().map(article -> {
            String authorName = authorRepository.findById((int) article.getAuthorId().longValue())
                    .map(author -> author.getName())
                    .orElse("Unknown");

            List<ArticleDTO.ContentDTO> contents = articleContentRepository.findByArticleId(article.getArticleId())
                    .stream()
                    .map(content -> new ArticleDTO.ContentDTO(
                            content.getContentType().name().toLowerCase(),
                            content.getContent()
                    ))
                    .toList();

            return new ArticleDTO(
                    article.getArticleId(),
                    article.getTitle(),
                    authorName,
                    article.getCreatedAt(),
                    article.getImageId(),
                    contents
            );
        }).toList();
    }

    @Transactional
    public void createArticle(ArticleDTO dto) {
        Article article = new Article();
        article.setTitle(dto.getTitle());
        article.setImageId(dto.getImageId());
        article.setStatus(Article.Status.draft);
        article.setCreatedAt(LocalDateTime.now());

        Author author = authorRepository.findByName(dto.getAuthor())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tác giả: " + dto.getAuthor()));
        article.setAuthorId(author.getAuthorId());

        articleRepository.save(article);

        // Lưu nội dung bài viết
        int index = 0;
        for (ArticleDTO.ContentDTO contentDTO : dto.getContents()) {
            ArticleContent content = new ArticleContent();
            content.setArticleId(article.getArticleId());
            content.setContent(contentDTO.getContent());

            try {
                ArticleContent.ContentType contentType = ArticleContent.ContentType.valueOf(
                        contentDTO.getType().toLowerCase()
                );
                content.setContentType(contentType);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Loại nội dung không hợp lệ: " + contentDTO.getType());
            }

            content.setOrderIndex(index++);
            content.setVersion(1);
            content.setCreatedAt(LocalDateTime.now());

            articleContentRepository.save(content);
        }
    }

    @Transactional
    public void deleteArticle(Integer id) {
        if (!articleRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy bài viết với ID: " + id);
        }
        // Xoá comment và nội dung trước rồi mới xoá bài viết (tránh lỗi FK)
        commentRepository.deleteByArticle_ArticleId(id);
        articleContentRepository.deleteByArticleId(id);
        articleRepository.deleteById(id);
    }

    @Transactional
    public Article updateArticle(Integer id, ArticleUpdateDTO dto) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        article.setTitle(dto.getTitle());
        article.setImageId(dto.getImageId());
        article.setUpdatedAt(LocalDateTime.now());
        article.setStatus((dto.getStatus() != null) ? Article.Status.valueOf(dto.getStatus()) : Article.Status.draft);

        Author author = authorRepository.findByName(dto.getAuthor())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tác giả"));
        article.setAuthorId(author.getAuthorId());

        articleRepository.save(article);

        // Xoá nội dung cũ rồi ghi lại
        articleContentRepository.deleteByArticleId(id);

        if (dto.getContents() != null && !dto.getContents().isEmpty()) {
            int index = 0;
            for (ArticleDTO.ContentDTO contentDTO : dto.getContents()) {
                ArticleContent content = new ArticleContent();
                content.setArticleId(article.getArticleId());
                content.setContent(contentDTO.getContent());
                content.setContentType(ArticleContent.ContentType.valueOf(contentDTO.getType().toLowerCase()));
                content.setOrderIndex(index++);
                content.setVersion(1);
                content.setCreatedAt(LocalDateTime.now());

                articleContentRepository.save(content);
            }
        }

        return article;
    }

}
