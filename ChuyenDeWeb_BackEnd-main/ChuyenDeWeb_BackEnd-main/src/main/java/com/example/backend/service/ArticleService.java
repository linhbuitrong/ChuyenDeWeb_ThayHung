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
    public void createArticle(ArticleDTO dto) {
        Article article = new Article();
        article.setTitle(dto.getTitle());
        article.setImageId(dto.getImageId());
        article.setStatus(Article.Status.draft); // or published
        article.setCreatedAt(LocalDateTime.now());

        // Gán tác giả (theo tên, nên cải tiến để truyền authorId thì tốt hơn)
        Author author = authorRepository.findByName(dto.getAuthor())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tác giả: " + dto.getAuthor()));
        article.setAuthorId(author.getAuthorId());

        articleRepository.save(article);

        // Lưu nội dung
        int index = 0;
        for (ArticleDTO.ContentDTO contentDTO : dto.getContents()) {
            ArticleContent content = new ArticleContent();
            content.setArticleId(article.getArticleId());
            content.setContent(contentDTO.getContent());

            // Chuyển về enum an toàn
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


    public void deleteArticle(Integer id) {
        if (!articleRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy bài viết với ID: " + id);
        }
        articleRepository.deleteById(id);
    }
    public Article updateArticle(Integer id, ArticleUpdateDTO dto) {
        // 1. Tìm bài viết theo ID
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        // 2. Cập nhật thông tin bài viết
        article.setTitle(dto.getTitle());
        article.setImageId(dto.getImageId());
        article.setUpdatedAt(LocalDateTime.now());
        article.setStatus((dto.getStatus() != null) ? Article.Status.valueOf(dto.getStatus()) : Article.Status.draft);

        // 3. Cập nhật tác giả (dựa theo tên)
        Author author = authorRepository.findByName(dto.getAuthor())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tác giả"));
        article.setAuthorId(author.getAuthorId());

        // 4. Lưu thay đổi vào DB
        articleRepository.save(article);

        // 5. Cập nhật nội dung bài viết

        // 5.1. Xoá hết nội dung cũ
        articleContentRepository.deleteByArticleId(id);

        // 5.2. Ghi lại nội dung mới từ danh sách `contents`
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
