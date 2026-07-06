import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, User, RefreshCw, TrendingUp } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  imageId: string;
  contents: any[];
}

const Home: React.FC = () => {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<{categoryId: number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [activeCategory, setActiveCategory] = useState('Trang chủ');

  const fetchArticles = async () => {
    try {
      const res = await api.get('/articles');
      setAllArticles(res.data);
      setDisplayedArticles(res.data);
      setActiveCategory('Trang chủ');
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/category');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const handleSync = async () => {
    try {
      setSyncing(true);
      const res = await api.post('/crawler/run');
      alert(res.data);
      await fetchCategories(); // Tai lai danh sach chuyen muc sau khi cao
      await fetchArticles();
    } catch (error: any) {
      alert('Lỗi: ' + (error.response?.data || error.message));
    } finally {
      setSyncing(false);
    }
  };

  const handleCategoryClick = async (categoryName: string, categoryId?: number) => {
    setActiveCategory(categoryName);
    setVisibleCount(5);

    if (categoryName === 'Trang chủ' || !categoryId) {
      setDisplayedArticles(allArticles);
      return;
    }

    // Goi API Backend de loc bai viet theo categoryId tu DB
    try {
      const res = await api.get(`/articles?categoryId=${categoryId}`);
      setDisplayedArticles(res.data);
    } catch (error) {
      console.error('Error filtering by category:', error);
      setDisplayedArticles([]);
    }
  };

  if (loading) return <div className="container mt-4 text-center">Đang tải...</div>;

  // Lấy dữ liệu để chia Layout từ mảng đã lọc
  const reversedArticles = [...displayedArticles].reverse();
  const heroArticle = reversedArticles.length > 0 ? reversedArticles[0] : null;
  const subHeroArticles = reversedArticles.slice(1, 4);
  const listArticles = reversedArticles.slice(4);
  const topReadArticles = reversedArticles.slice(0, 5); // Mock cho sidebar "Đọc nhiều"

  return (
    <>
      {/* Thanh chuyên mục (Mock) */}
      <div className="category-nav">
        <div className="container">
          <ul className="category-list">
            <li 
              style={{ color: activeCategory === 'Trang chủ' ? 'var(--primary-color)' : 'inherit' }} 
              onClick={() => handleCategoryClick('Trang chủ')}
            >Trang chủ</li>
            {categories.map(cat => (
              <li 
                key={cat.categoryId}
                style={{ color: activeCategory === cat.name ? 'var(--primary-color)' : 'inherit' }}
                onClick={() => handleCategoryClick(cat.name, cat.categoryId)}
              >{cat.name}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Tin tức nóng hổi</h2>
          <button 
            className="btn btn-outline flex items-center gap-2" 
            onClick={handleSync} 
            disabled={syncing}
          >
            <RefreshCw size={18} className={syncing ? 'spin' : ''} />
            {syncing ? 'Đang lấy tin...' : 'Tự động lấy tin mới (Admin)'}
          </button>
        </div>
        
        {/* Khối 1: Hero Section (Tin nổi bật) */}
        {heroArticle && (
          <div className="hero-section">
            <Link to={`/article/${heroArticle.id}`} className="hero-main">
              <img src={heroArticle.imageId} alt={heroArticle.title} className="article-img" />
              <h2 className="article-title">{heroArticle.title}</h2>
              <div className="text-muted flex items-center gap-2" style={{ fontSize: '0.875rem' }}>
                <User size={14} /> {heroArticle.author} &bull; <Calendar size={14} /> {new Date(heroArticle.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </Link>
            
            <div className="hero-side">
              {subHeroArticles.map(article => (
                <Link to={`/article/${article.id}`} key={article.id} className="side-card">
                  <img src={article.imageId} alt={article.title} className="article-img" />
                  <div>
                    <h3 className="article-title">{article.title}</h3>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Khối Banner Quảng Cáo (Mock) */}
        <div style={{ margin: '2rem 0' }}>
          <img 
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200&h=150" 
            alt="Quảng cáo" 
            style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} 
          />
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Quảng cáo</div>
        </div>

        {/* Khối 2: List Section & Sidebar */}
        <div className="list-section">
          {/* Cột trái: Danh sách bài mới */}
          <div className="list-articles">
            <h3 className="sidebar-title">Mới cập nhật</h3>
            {listArticles.slice(0, visibleCount).map(article => (
              <Link to={`/article/${article.id}`} key={article.id} className="list-item">
                <img src={article.imageId} alt={article.title} className="article-img" />
                <div>
                  <h3 className="article-title">{article.title}</h3>
                  <div className="text-muted flex items-center gap-2 mb-2" style={{ fontSize: '0.875rem' }}>
                    <User size={14} /> {article.author} &bull; <Calendar size={14} /> {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    Bấm vào để xem chi tiết bài báo...
                  </p>
                </div>
              </Link>
            ))}
            
            {visibleCount < listArticles.length && (
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', fontWeight: 600 }}
                onClick={() => setVisibleCount(prev => prev + 5)}
              >
                Xem thêm tin mới
              </button>
            )}
          </div>

          {/* Cột phải: Tin đọc nhiều */}
          <div className="sidebar">
            <h3 className="sidebar-title flex items-center gap-2">
              <TrendingUp size={20} /> Đọc nhiều nhất
            </h3>
            <div className="hero-side">
              {topReadArticles.map((article, idx) => (
                <Link to={`/article/${article.id}`} key={`top-${article.id}`} className="side-card" style={{ borderBottom: '1px dashed var(--border-color)' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--border-color)', lineHeight: 1, paddingRight: '0.5rem' }}>
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="article-title" style={{ fontSize: '0.95rem' }}>{article.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {displayedArticles.length === 0 && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Chưa có bài viết nào thuộc chuyên mục {activeCategory}.</h3>
            <p className="text-muted mt-4">Vui lòng chọn chuyên mục khác hoặc tải thêm bài viết.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
