import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      const res = await api.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
      setMessage(res.data || 'Yêu cầu đã được gửi. Vui lòng kiểm tra email.');
    } catch (err: any) {
      setError(err.response?.data || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in card">
      <h2 className="auth-title">Quên Mật Khẩu</h2>
      <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
        Nhập địa chỉ email của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu.
      </p>
      
      {error && <div className="card" style={{ backgroundColor: '#fef2f2', borderColor: 'var(--danger-color)', color: 'var(--danger-color)', padding: '1rem', marginBottom: '1.5rem' }}>{error}</div>}
      {message && <div className="card" style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e', color: '#16a34a', padding: '1rem', marginBottom: '1.5rem' }}>{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Nhập email của bạn"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
          {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </button>
      </form>
      
      <p className="text-center text-muted mt-4">
        <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 500 }}>Quay lại đăng nhập</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
