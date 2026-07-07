import React from 'react';
import { Save, Settings as SettingsIcon, Globe, Lock, Bell } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Tính năng lưu cấu hình đang được phát triển.');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Cài đặt hệ thống</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Cấu hình chung cho toàn bộ website NewsAdmin</p>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
          <button style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#10b981', borderBottom: '2px solid #10b981', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} /> Cấu hình chung
          </button>
          <button style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#64748b', borderBottom: '2px solid transparent', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} /> Bảo mật
          </button>
          <button style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#64748b', borderBottom: '2px solid transparent', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} /> Thông báo
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tên Trang Web</label>
              <input type="text" defaultValue="ChuyenDeWeb News" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Mô tả ngắn (SEO)</label>
              <textarea defaultValue="Trang tin tức cập nhật nhanh nhất, chính xác nhất về mọi lĩnh vực." rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Liên Hệ</label>
                <input type="email" defaultValue="admin@chuyendeweb.vn" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Số điện thoại</label>
                <input type="text" defaultValue="1900 1234" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#10b981' }} />
                <span style={{ fontWeight: 500, color: '#334155', fontSize: '0.95rem' }}>Cho phép độc giả đăng ký tài khoản mới</span>
              </label>
            </div>
            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#10b981' }} />
                <span style={{ fontWeight: 500, color: '#334155', fontSize: '0.95rem' }}>Bật kiểm duyệt bình luận (Admin phải duyệt mới được hiện)</span>
              </label>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)' }}>
              <Save size={18} /> Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
