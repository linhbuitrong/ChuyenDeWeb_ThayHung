import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Trash2, Edit, Plus, Folder, AlertCircle } from 'lucide-react';

interface Category {
  categoryId: number;
  name: string;
  description: string;
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/category');
      setCategories(res.data);
    } catch (error) {
      console.error('Lỗi khi tải chuyên mục:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Cảnh báo: Xoá chuyên mục có thể ảnh hưởng đến các bài viết thuộc chuyên mục này. Bạn có chắc chắn?')) return;
    try {
      await api.delete(`/category/${id}`);
      setCategories(categories.filter(c => c.categoryId !== id));
      alert('Xoá chuyên mục thành công');
    } catch (error) {
      alert('Không thể xoá chuyên mục này vì đang có bài viết tham chiếu.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Quản lý Chuyên mục</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Quản lý các thể loại tin tức trên hệ thống</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)', cursor: 'pointer' }}>
          <Plus size={16} /> Thêm chuyên mục mới
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>ID</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Tên chuyên mục</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Mô tả</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.categoryId} style={{ borderTop: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#475569' }}>#{cat.categoryId}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#0f172a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Folder size={16} color="#3b82f6" /> {cat.name}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem', color: '#475569', fontSize: '0.9rem' }}>{cat.description || 'Không có mô tả'}</td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button title="Sửa" style={{ padding: '0.4rem', borderRadius: '6px', color: '#3b82f6', background: '#eff6ff', border: 'none', cursor: 'pointer' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(cat.categoryId)} title="Xóa" style={{ padding: '0.4rem', borderRadius: '6px', color: '#ef4444', background: '#fef2f2', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                  Chưa có chuyên mục nào. Hãy tạo chuyên mục đầu tiên!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;
