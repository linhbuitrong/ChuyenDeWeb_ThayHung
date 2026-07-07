import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Trash2, Edit, Plus, FileText, Eye, MessageSquare, TrendingUp, Search, Filter, MoreVertical } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  status?: string; // Tạm thêm status để hiển thị giao diện
}

const AdminDashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();
  const accountType = localStorage.getItem('accountType');

  useEffect(() => {
    if (accountType !== '0') {
      alert('Bạn không có quyền truy cập trang này');
      navigate('/');
      return;
    }
    fetchArticles();
  }, [accountType, navigate]);

  const fetchArticles = async () => {
    try {
      const res = await api.get('/articles');
      // Thêm status random hoặc 'published' mặc định cho bài viết cũ
      const data = res.data.map((a: any) => ({
        ...a,
        status: Math.random() > 0.2 ? 'published' : 'draft'
      }));
      setArticles(data);
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá bài viết này?')) return;
    try {
      await api.delete(`/articles/${id}`);
      setArticles(articles.filter(a => a.id !== id));
    } catch (error) {
      alert('Lỗi khi xoá bài viết');
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 1. Thống kê nhanh (Metric Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
          { title: 'Tổng bài viết', value: articles.length, icon: <FileText size={24} color="#3b82f6" />, bg: '#eff6ff' },
          { title: 'Lượt xem trang', value: '124.5K', icon: <Eye size={24} color="#10b981" />, bg: '#ecfdf5' },
          { title: 'Bình luận mới', value: '+42', icon: <MessageSquare size={24} color="#f59e0b" />, bg: '#fffbeb' },
          { title: 'Tăng trưởng', value: '+15%', icon: <TrendingUp size={24} color="#8b5cf6" />, bg: '#f5f3ff' },
        ].map((stat, i) => (
          <div key={i} style={{ 
            background: 'white', padding: '1.5rem', borderRadius: '12px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1.25rem' 
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{stat.title}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Quản lý bài viết */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* Header bảng & Công cụ */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Danh sách bài viết</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Quản lý và xuất bản các bài viết trên hệ thống</p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem 0.75rem' }}>
              <Search size={16} color="#94a3b8" />
              <input type="text" placeholder="Tìm tiêu đề..." style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '0.5rem', fontSize: '0.875rem' }} />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: 500, fontSize: '0.875rem' }}>
              <Filter size={16} /> Lọc
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)' }}>
              <Plus size={16} /> Viết bài mới
            </button>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Bài viết</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Tác giả</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Trạng thái</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Ngày đăng</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right', whiteSpace: 'nowrap' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} style={{ borderTop: '1px solid #e2e8f0', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: #{article.id}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                        {article.author.charAt(0)}
                      </div>
                      <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>{article.author}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600,
                      background: article.status === 'published' ? '#dcfce7' : '#f1f5f9',
                      color: article.status === 'published' ? '#166534' : '#475569'
                    }}>
                      {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#475569', whiteSpace: 'nowrap' }}>
                    {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button title="Sửa bài" style={{ padding: '0.4rem', borderRadius: '6px', color: '#3b82f6', background: '#eff6ff', border: 'none', cursor: 'pointer' }}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(article.id)} title="Xóa" style={{ padding: '0.4rem', borderRadius: '6px', color: '#ef4444', background: '#fef2f2', border: 'none', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                      <button title="Thêm" style={{ padding: '0.4rem', borderRadius: '6px', color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                    Chưa có bài viết nào trong hệ thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        {articles.length > 0 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.875rem' }}>
            <span>Hiển thị 1 đến {articles.length} của {articles.length} bài viết</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ padding: '0.4rem 0.8rem', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white' }} disabled>Trước</button>
              <button style={{ padding: '0.4rem 0.8rem', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white' }} disabled>Sau</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
