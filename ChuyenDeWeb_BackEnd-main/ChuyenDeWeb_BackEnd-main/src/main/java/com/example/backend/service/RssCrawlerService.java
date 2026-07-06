package com.example.backend.service;

import com.example.backend.model.entity.Article;
import com.example.backend.model.entity.ArticleContent;
import com.example.backend.model.entity.Category;
import com.example.backend.repository.ArticleContentRepository;
import com.example.backend.repository.ArticleRepository;
import com.example.backend.repository.CategoryRepository;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class RssCrawlerService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ArticleContentRepository articleContentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Danh sach cac chuyen muc cua VNExpress va link RSS tuong ung
    private Map<String, String> getRssFeedMap() {
        Map<String, String> feeds = new LinkedHashMap<>();
        feeds.put("Thời sự",    "https://vnexpress.net/rss/thoi-su.rss");
        feeds.put("Thế giới",   "https://vnexpress.net/rss/the-gioi.rss");
        feeds.put("Kinh doanh", "https://vnexpress.net/rss/kinh-doanh.rss");
        feeds.put("Giải trí",   "https://vnexpress.net/rss/giai-tri.rss");
        feeds.put("Thể thao",   "https://vnexpress.net/rss/the-thao.rss");
        feeds.put("Pháp luật",  "https://vnexpress.net/rss/phap-luat.rss");
        feeds.put("Giáo dục",   "https://vnexpress.net/rss/giao-duc.rss");
        feeds.put("Sức khoẻ",   "https://vnexpress.net/rss/suc-khoe.rss");
        feeds.put("Công nghệ",  "https://vnexpress.net/rss/so-hoa.rss");
        return feeds;
    }

    // Tu dong chay khi Backend HOAN TOAN khoi dong xong
    @EventListener(ApplicationReadyEvent.class)
    public void initAutoCrawl() {
        System.out.println("=== BAT DAU TU DONG CAO TIN TUC KHI KHOI DONG ===");
        new Thread(() -> {
            try {
                Thread.sleep(3000);
                crawlAllCategories();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    // Ham chinh: Duyet qua tung chuyen muc va cao bai
    public int crawlAllCategories() {
        int totalCount = 0;
        Map<String, String> feedMap = getRssFeedMap();

        for (Map.Entry<String, String> entry : feedMap.entrySet()) {
            String categoryName = entry.getKey();
            String rssUrl = entry.getValue();

            // Tim hoac tao moi Category trong DB
            Category category = categoryRepository.findByName(categoryName)
                    .orElseGet(() -> {
                        Category newCat = new Category();
                        newCat.setName(categoryName);
                        newCat.setDescription("Chuyên mục " + categoryName);
                        return categoryRepository.save(newCat);
                    });

            try {
                int count = crawlSingleFeed(rssUrl, category.getCategoryId());
                totalCount += count;
                System.out.println("[Crawler] " + categoryName + ": +" + count + " bai moi");
            } catch (Exception e) {
                System.err.println("[Crawler] Loi khi cao " + categoryName + ": " + e.getMessage());
            }
        }

        System.out.println("=== TONG CONG: " + totalCount + " BAI MOI ===");
        return totalCount;
    }

    // Cao 1 link RSS cu the va gan category_id
    private int crawlSingleFeed(String rssUrl, Integer categoryId) {
        int count = 0;
        try {
            URL feedUrl = new URL(rssUrl);
            java.net.URLConnection connection = feedUrl.openConnection();
            connection.setRequestProperty("User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);

            SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed = input.build(new XmlReader(connection.getInputStream()));

            for (SyndEntry entry : feed.getEntries()) {
                String link = entry.getLink();

                if (articleRepository.existsByLink(link)) {
                    continue;
                }

                String title = entry.getTitle();
                Date pubDate = entry.getPublishedDate();
                String descriptionHtml = entry.getDescription() != null
                        ? entry.getDescription().getValue() : "";

                Document doc = Jsoup.parse(descriptionHtml);
                Element imgElement = doc.select("img").first();
                String imageUrl = imgElement != null ? imgElement.attr("src")
                        : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80";
                String textSummary = doc.text();

                if (title.length() > 250) title = title.substring(0, 250);
                if (link.length() > 250) link = link.substring(0, 250);
                if (imageUrl.length() > 250) imageUrl = imageUrl.substring(0, 250);
                if (textSummary.length() > 250) textSummary = textSummary.substring(0, 250) + "...";

                Article article = new Article();
                article.setTitle(title);
                article.setLink(link);
                article.setImageId(imageUrl);
                article.setAuthorId(1);
                article.setCategoryId(categoryId); // GAN CHUYEN MUC TU DONG
                article.setStatus(Article.Status.published);

                LocalDateTime publishedAt = pubDate != null
                        ? pubDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()
                        : LocalDateTime.now();
                article.setPublishedAt(publishedAt);
                article.setCreatedAt(LocalDateTime.now());
                article.setUpdatedAt(LocalDateTime.now());

                article = articleRepository.save(article);

                // Luu tom tat
                ArticleContent summaryContent = new ArticleContent();
                summaryContent.setArticleId(article.getArticleId());
                summaryContent.setContentType(ArticleContent.ContentType.text);
                summaryContent.setContent(textSummary);
                summaryContent.setOrderIndex(0);
                summaryContent.setCreatedAt(LocalDateTime.now());
                articleContentRepository.save(summaryContent);

                // Vao link goc de cao noi dung chi tiet
                try {
                    Document detailDoc = Jsoup.connect(link)
                            .userAgent("Mozilla/5.0")
                            .timeout(8000)
                            .get();
                    org.jsoup.select.Elements paragraphs = detailDoc.select(
                        "p.Normal, article.fck_detail p, div.detail-cmain-body p, " +
                        "div.detail-content p, div.content-detail p, div.cms-body p");
                    if (paragraphs.isEmpty()) {
                        paragraphs = detailDoc.select("p");
                    }
                    int orderIdx = 1;
                    for (Element p : paragraphs) {
                        String pText = p.text();
                        if (pText.isEmpty()) continue;

                        while (pText.length() > 0) {
                            int endIndex = Math.min(pText.length(), 250);
                            String chunk = pText.substring(0, endIndex);
                            pText = pText.substring(endIndex);

                            ArticleContent detailContent = new ArticleContent();
                            detailContent.setArticleId(article.getArticleId());
                            detailContent.setContentType(ArticleContent.ContentType.text);
                            detailContent.setContent(chunk);
                            detailContent.setOrderIndex(orderIdx++);
                            detailContent.setCreatedAt(LocalDateTime.now());
                            articleContentRepository.save(detailContent);
                        }
                    }
                } catch (Exception ex) {
                    System.err.println("Khong the lay chi tiet bai: " + link);
                }

                count++;
            }
        } catch (Exception e) {
            System.err.println("Loi khi cao RSS " + rssUrl + ": " + e.getMessage());
        }
        return count;
    }
}
