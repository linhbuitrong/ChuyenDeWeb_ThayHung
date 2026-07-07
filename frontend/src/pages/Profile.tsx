import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Bookmark, MessageSquare, Edit3, Save, X, Trash2, Calendar, Mail, Phone, Shield } from 'lucide-react';
import api from '../api/axios';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone: string;
  birthday: string;
  accountType: number;
}

interface SavedArticleItem {
  savedId: number;
  articleId: number;
  title: string;
  imageId: string;
  categoryId: number;
  publishedAt: string;
  savedAt: string;
}

interface CommentItem {
  commentId: number;
  content: string;
  createdAt: string;
  articleId: number;
  articleTitle: string;
}

type TabType = 'profile' | 'saved' | 'comments';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedArticles, setSavedArticles] = useState<SavedArticleItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ email: '', phone: '', birthday: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!userId) return;
    if (activeTab === 'saved') fetchSaved();
    if (activeTab === 'comments') fetchComments();
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/profile/${userId}`);
      setProfile(res.data);
      setEditForm({
        email: res.data.email || '',
        phone: res.data.phone || '',
        birthday: res.data.birthday || '',
      });
    } catch {
      setMessage({ text: 'Không thể tải thông tin', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchSaved = async () => {
    try {
      const res = await api.get(`/profile/${userId}/saved`);
      setSavedArticles(res.data);
    } catch {
      console.error('Lỗi tải tin đã lưu');
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/profile/${userId}/comments`);
      setComments(res.data);
    } catch {
      console.error('Lỗi tải bình luận');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put(`/profile/${userId}`, editForm);
      setMessage({ text: 'Cập nhật thành công!', type: 'success' });
      setEditing(false);
      fetchProfile();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch {
      setMessage({ text: 'Cập nhật thất bại', type: 'error' });
    }
  };

  const handleUnsave = async (articleId: number) => {
    try {
      await api.delete(`/profile/${userId}/saved/${articleId}`);
      setSavedArticles(prev => prev.filter(a => a.articleId !== articleId));
    } catch {
      console.error('Lỗi bỏ lưu');
    }
  };

  const getAccountLabel = (type: number) => {
    switch (type) {
      case 0: return 'Quản trị viên';
      case 2: return 'Premium';
      default: return 'Thành viên';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
        borderRadius: '1.5rem',
        padding: '2.5rem',
        color: 'white',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '30%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 700,
            border: '3px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(10px)',
          }}>
            {profile?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{profile?.username}</h1>
            <span style={{
              display: 'inline-block', marginTop: '0.5rem',
              background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem',
              borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600,
              backdropFilter: 'blur(10px)',
            }}>
              <Shield size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              {getAccountLabel(profile?.accountType ?? 1)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '0',
        borderBottom: '2px solid var(--border-color)',
        marginBottom: '2rem',
      }}>
        {[
          { key: 'profile' as TabType, label: 'Thông tin cá nhân', icon: <User size={16} /> },
          { key: 'saved' as TabType, label: 'Tin đã lưu', icon: <Bookmark size={16} /> },
          { key: 'comments' as TabType, label: 'Bình luận của tôi', icon: <MessageSquare size={16} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.85rem 1.5rem',
              fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? 'var(--primary-color)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.key ? '2px solid var(--primary-color)' : '2px solid transparent',
              marginBottom: '-2px',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.95rem',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Thông báo */}
      {message.text && (
        <div style={{
          padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem',
          background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          fontWeight: 500,
        }}>
          {message.text}
        </div>
      )}

      {/* ================== TAB 1: THÔNG TIN CÁ NHÂN ================== */}
      {activeTab === 'profile' && profile && (
        <div className="card" style={{ padding: '2rem', borderRadius: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Thông tin cá nhân</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                <Edit3 size={14} /> Chỉnh sửa
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleUpdateProfile} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                  <Save size={14} /> Lưu
                </button>
                <button onClick={() => { setEditing(false); setEditForm({ email: profile.email || '', phone: profile.phone || '', birthday: profile.birthday || '' }); }} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                  <X size={14} /> Hủy
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {/* Tên đăng nhập (không sửa được) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <User size={20} color="var(--primary-color)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Tên đăng nhập</div>
                <div style={{ fontWeight: 600 }}>{profile.username}</div>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <Mail size={20} color="var(--primary-color)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email</div>
                {editing ? (
                  <input type="email" className="form-input" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} style={{ padding: '0.5rem 0.75rem' }} />
                ) : (
                  <div style={{ fontWeight: 600 }}>{profile.email || '—'}</div>
                )}
              </div>
            </div>

            {/* Điện thoại */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <Phone size={20} color="var(--primary-color)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Số điện thoại</div>
                {editing ? (
                  <input type="text" className="form-input" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={{ padding: '0.5rem 0.75rem' }} />
                ) : (
                  <div style={{ fontWeight: 600 }}>{profile.phone || '—'}</div>
                )}
              </div>
            </div>

            {/* Ngày sinh */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <Calendar size={20} color="var(--primary-color)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Ngày sinh</div>
                {editing ? (
                  <input type="date" className="form-input" value={editForm.birthday} onChange={e => setEditForm({ ...editForm, birthday: e.target.value })} style={{ padding: '0.5rem 0.75rem' }} />
                ) : (
                  <div style={{ fontWeight: 600 }}>{profile.birthday ? formatDate(profile.birthday) : '—'}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================== TAB 2: TIN ĐÃ LƯU ================== */}
      {activeTab === 'saved' && (
        <div>
          {savedArticles.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '1.25rem' }}>
              <Bookmark size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Bạn chưa lưu bài viết nào</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Bấm vào biểu tượng <Bookmark size={14} style={{ verticalAlign: 'middle' }} /> trên bài viết để lưu lại đọc sau
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {savedArticles.map(article => (
                <div key={article.savedId} className="card" style={{
                  display: 'flex', gap: '1.25rem', padding: '1.25rem',
                  borderRadius: '1.25rem', alignItems: 'center',
                }}>
                  <img
                    src={article.imageId || 'https://placehold.co/160x100/e2e8f0/64748b?text=No+Image'}
                    alt={article.title}
                    style={{ width: '160px', height: '100px', objectFit: 'cover', borderRadius: '0.75rem', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/article/${article.articleId}`} style={{ display: 'block' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4, marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                        {article.title}
                      </h3>
                    </Link>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Đã lưu: {formatDate(article.savedAt)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleUnsave(article.articleId)}
                    title="Bỏ lưu"
                    style={{
                      padding: '0.5rem', borderRadius: '50%', border: '1px solid var(--border-color)',
                      background: 'white', cursor: 'pointer', flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.background = '#fef2f2'; (e.target as HTMLElement).style.borderColor = '#fca5a5'; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.background = 'white'; (e.target as HTMLElement).style.borderColor = 'var(--border-color)'; }}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================== TAB 3: LỊCH SỬ BÌNH LUẬN ================== */}
      {activeTab === 'comments' && (
        <div>
          {comments.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '1.25rem' }}>
              <MessageSquare size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Bạn chưa bình luận bài viết nào</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {comments.map(cmt => (
                <div key={cmt.commentId} className="card" style={{ padding: '1.25rem', borderRadius: '1.25rem' }}>
                  <Link to={`/article/${cmt.articleId}`} style={{ display: 'block', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                      Trên bài: {cmt.articleTitle}
                    </span>
                  </Link>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-main)', margin: 0 }}>
                    "{cmt.content}"
                  </p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', display: 'block' }}>
                    {formatDate(cmt.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
