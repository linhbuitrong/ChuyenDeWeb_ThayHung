import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Đường dẫn đặt lại mật khẩu không hợp lệ.');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp!');
      return;
    }

    if (!token) {
      setError('Không tìm thấy token hợp lệ!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post(`/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`);
      setMessage(res.data || 'Đặt lại mật khẩu thành công!');
      setTimeout(() => navigate('/login'), 3000); // Redirect after 3s
    } catch (err: any) {
      setError(err.response?.data || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in card">
      <h2 className="auth-title">Đặt lại mật khẩu mới</h2>
      
      {error && <div className="card" style={{ backgroundColor: '#fef2f2', borderColor: 'var(--danger-color)', color: 'var(--danger-color)', padding: '1rem', marginBottom: '1.5rem' }}>{error}</div>}
      {message && <div className="card" style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e', color: '#16a34a', padding: '1rem', marginBottom: '1.5rem' }}>{message}</div>}
      
      {!message && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mật khẩu mới</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading || !token}>
            {isLoading ? 'Đang lưu...' : 'Đặt lại mật khẩu'}
          </button>
        </form>
      )}
      
      <p className="text-center text-muted mt-4">
        <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 500 }}>Quay lại đăng nhập</Link>
      </p>
    </div>
  );
};

export default ResetPassword;
