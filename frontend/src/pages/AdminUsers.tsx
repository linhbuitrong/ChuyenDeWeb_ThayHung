import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Shield, User, Ban, Mail, Phone, Calendar } from 'lucide-react';

interface UserData {
  id: number;
  username: string;
  email: string;
  phone: string;
  birthday: string;
  accountType: number; // 0: Admin, 1: User
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Lỗi khi tải người dùng:', error);
      // Fallback cho trường hợp lỗi API (vd: thiếu JWT header, sai endpoint)
      if (error && (error as any).response && (error as any).response.status === 403) {
        alert('Lỗi: Bạn cần đăng nhập bằng quyền Admin (tài khoản có accountType = 0) và cung cấp JWT token.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: number, currentType: number) => {
    alert(`Chức năng cấp quyền (Chuyển loại tài khoản từ ${currentType} sang ${currentType === 1 ? 0 : 1}) đang được phát triển backend.`);
    // Thực tế sẽ gọi: await api.put(`/auth/users/${id}/role`, { accountType: newType })
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Quản lý Người dùng</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Quản lý tài khoản, phân quyền và kiểm soát truy cập</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Người dùng</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Thông tin liên hệ</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Vai trò</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right', whiteSpace: 'nowrap' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: u.accountType === 0 ? '#10b981' : '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{u.username}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {u.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={14} /> {u.email || 'Chưa cập nhật'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={14} /> {u.phone || 'Chưa cập nhật'}</div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600,
                    background: u.accountType === 0 ? '#ecfdf5' : '#eff6ff',
                    color: u.accountType === 0 ? '#059669' : '#2563eb'
                  }}>
                    {u.accountType === 0 ? <Shield size={12} /> : <User size={12} />}
                    {u.accountType === 0 ? 'Admin' : 'Độc giả'}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button onClick={() => handleRoleChange(u.id, u.accountType)} title="Phân quyền" style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', color: '#0f172a', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>
                      Đổi quyền
                    </button>
                    <button title="Khóa tài khoản" style={{ padding: '0.4rem', borderRadius: '6px', color: '#ef4444', background: '#fef2f2', border: 'none', cursor: 'pointer' }}>
                      <Ban size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
