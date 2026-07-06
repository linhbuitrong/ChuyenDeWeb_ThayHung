import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Trash2, Edit, Plus } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  author: string;
  createdAt: string;
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
      setArticles(res.data);
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá bài viết này?')) return;
    try {
      await api.delete(`/articles/${id}`);
      setArticles(articles.filter(a => a.id !== id));
      alert('Xoá thành công!');
    } catch (error) {
      alert('Lỗi khi xoá bài viết');
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Quản lý bài viết</h2>
        <button className="btn btn-primary" onClick={() => alert('Chức năng thêm bài viết đang hoàn thiện')}>
          <Plus size={18} /> Thêm bài viết mới
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Tiêu đề</th>
              <th style={{ padding: '1rem' }}>Tác giả</th>
              <th style={{ padding: '1rem' }}>Ngày tạo</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>{article.id}</td>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{article.title}</td>
                <td style={{ padding: '1rem' }}>{article.author}</td>
                <td style={{ padding: '1rem' }}>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div className="flex justify-center gap-2">
                    <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(article.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Không có bài viết nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
