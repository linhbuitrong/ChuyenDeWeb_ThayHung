import express from 'express';
import Parser from 'rss-parser';
import cors from 'cors';
import axios from 'axios';
import cheerio from 'cheerio';


const app = express();
const port = 4000;

app.use(cors());

app.get('/rss', async (req, res) => {
        const parser = new Parser();
        const RSS_URL = req.query.url; // Lấy URL từ query parameter
        if (!RSS_URL) {
                return res.status(400).json({ error: 'RSS URL is required' });
        }

        try {
                const feed = await parser.parseURL(RSS_URL);
                res.json(feed.items);
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

app.get('/scrape', async (req, res) => {
        const ARTICLE_URL = req.query.url; // Lấy URL bài báo từ query parameter
        if (!ARTICLE_URL) {
                return res.status(400).json({ error: 'Article URL is required' });
        }

        try {
                const finalUrl = ARTICLE_URL.startsWith('http') ? ARTICLE_URL : "https://dantri.com.vn" + ARTICLE_URL;
                const response = await axios.get(finalUrl);
                const html = response.data;
                const $ = cheerio.load(html);

                const data = [];
                // Lấy tiêu đề
                const title = $('.title-page').text();
                // Lấy tên tác giả
                const author = $('.author-name').text();
                // Lấy thời gian đăng bài
                const time = $('.author-time').text();
                // Chọn nội dung có class 'txt_content'
                const txtContent = $('.singular-content');


                txtContent.find('.video').remove();
                // Tìm tất cả các thẻ <figure> trong txt_content và đảm bảo hình ảnh có đầy đủ URL
                txtContent.find('figure img').each((index, img) => {
                        const imgSrc = $(img).attr('data-original') || $(img).attr('data-srcset');
                        if (imgSrc) {
                                $(img).attr('src', imgSrc.split(' ')[0]); // Chọn URL đầu tiên trong srcset
                        }
                });

                // Chỉ chọn các thẻ <p> và <figure> trong txt_content
                const elements = txtContent.contents().filter((index, element) => {
                        return element.tagName === 'p' || element.tagName === 'figure';
                });

                // Lấy HTML của các phần tử đã chọn
                let content = '';
                elements.each((index, element) => {
                        content += $.html(element);
                });

                data.push(title,author,time, content);
                res.json(data);
        } catch (error) {
                console.log("Lỗi cào dữ liệu nè: ", error); // Thêm dòng này
                res.status(500).json({ error: error.message });
        }
});

app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
});
