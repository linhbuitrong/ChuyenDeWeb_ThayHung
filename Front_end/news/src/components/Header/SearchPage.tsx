import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from "../../store/store";
import { useState } from 'react';

interface NewsItem {
    title: string;
    description: string;
    imageUrl?: string;
    newsUrl?: string;
    link?: string;
    content?: string;
}

interface Category {
    name: string;
    items: NewsItem[];
}
function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Highlight từ khóa
function highlightText(text: string, keyword: string) {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return (
        <>
            {parts.map((part, index) =>
                part.toLowerCase() === keyword.toLowerCase() ? (
                    <mark key={index}>{part}</mark>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </>
    );
}

function SearchPage() {
    const query = new URLSearchParams(useLocation().search);
    const searchTerm = query.get('query')?.toLowerCase() || '';

    const cates: Category[] = useSelector((state: RootState) => state.cate.cates);

    const allNews: (NewsItem & { category: string })[] = cates.flatMap((cate: Category) =>
        cate.items.map(item => {
            // Lấy ảnh từ imageUrl
            let imageUrl = item.imageUrl?.trim() || '';
            if (!imageUrl && item.content) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(item.content, 'text/html');
                const imgElement = doc.querySelector('img');
                if (imgElement) {
                    imageUrl = imgElement.getAttribute('src') || '';
                }
            }

            const rawNewsUrl = item.newsUrl || (item.link ? item.link.replace('https://dantri.com.vn/', '') : '');

            return {
                ...item,
                category: cate.name,
                newsUrl: rawNewsUrl,
                imageUrl: imageUrl || 'https://via.placeholder.com/120x80?text=No+Image',
            };
        })
    );

    const filteredNews = allNews.filter(news =>
        news.title.toLowerCase().includes(searchTerm)
    );

    return (
        <div style={{ padding: 20 }}>
            {filteredNews.length === 0 ? (
                <p>Không tìm thấy bài báo nào.</p>
            ) : (
                filteredNews.map((news, index) => <NewsItemCard key={index} news={news} searchTerm={searchTerm} />)
            )}
        </div>
    );
}

interface NewsItemCardProps {
    news: NewsItem & { category: string };
    searchTerm: string;
}

function NewsItemCard({ news, searchTerm }: NewsItemCardProps) {
    const [imgSrc, setImgSrc] = useState(news.imageUrl || 'https://via.placeholder.com/120x80?text=No+Image');

    const handleImgError = () => {
        setImgSrc('https://via.placeholder.com/120x80?text=No+Image');
    };

    return (
        <div style={{ marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
            {/* Link giữ nguyên path đầy đủ, có category trong newsUrl */}
            <Link to={`/${news.newsUrl}`} style={{ textDecoration: 'none', color: 'black' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 15 }}>
                    <img
                        src={imgSrc}
                        alt="Ảnh bài báo"
                        style={{ width: 120, height: 80, objectFit: 'cover' }}
                        onError={handleImgError}
                    />
                    <div>
                        <h3>{highlightText(news.title, searchTerm)}</h3>
                        <p>{news.description}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default SearchPage;
