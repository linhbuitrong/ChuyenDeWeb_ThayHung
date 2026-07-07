import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Trash2, AlertTriangle, MessageSquare, CheckCircle } from 'lucide-react';

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  user: { username: string };
  article?: { title: string, articleId: number };
}

const AdminComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await api.get('/comment');
      // Sắp xếp bình luận mới nhất lên đầu
      const sorted = res.data.sort((a: Comment, b: Comment) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComments(sorted);
    } catch (error) {
      console.error('Lỗi khi tải bình luận:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá bình luận này? Nó sẽ bị xoá vĩnh viễn.')) return;
    try {
      await api.delete(`/comment/${id}`);
      setComments(comments.filter(c => c.commentId !== id));
      alert('Xoá bình luận thành công');
    } catch (error) {
      alert('Lỗi khi xoá bình luận');
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Kiểm duyệt Bình luận</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Theo dõi và quản lý tương tác của độc giả</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Người dùng</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', width: '40%' }}>Nội dung bình luận</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Thời gian</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Kiểm duyệt</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</td></tr>
            ) : comments.map((cmt) => (
              <tr key={cmt.commentId} style={{ borderTop: '1px solid #e2e8f0', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                      {cmt.user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{cmt.user?.username}</div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '0.5rem' }}>"{cmt.content}"</div>
                  {cmt.article && (
                    <div style={{ fontSize: '0.8rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MessageSquare size={12} /> Trên bài: {cmt.article.title}
                    </div>
                  )}
                </td>
                <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                  {new Date(cmt.createdAt).toLocaleString('vi-VN')}
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button title="Duyệt (Bỏ qua)" style={{ padding: '0.4rem', borderRadius: '6px', color: '#10b981', background: '#d1fae5', border: 'none', cursor: 'pointer' }}>
                      <CheckCircle size={16} />
                    </button>
                    <button onClick={() => handleDelete(cmt.commentId)} title="Xóa/Spam" style={{ padding: '0.4rem', borderRadius: '6px', color: '#ef4444', background: '#fef2f2', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && comments.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                  Chưa có bình luận nào trên hệ thống.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminComments;
