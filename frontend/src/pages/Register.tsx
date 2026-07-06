import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    birthday: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/register', formData);
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      if (err.response?.data?.details) {
        // Lấy error message đầu tiên từ validation
        const firstError = Object.values(err.response.data.details)[0] as string;
        setError(firstError);
      } else {
        setError(err.response?.data || 'Đăng ký thất bại');
      }
    }
  };

  return (
    <div className="auth-container animate-fade-in card" style={{ maxWidth: '500px' }}>
      <h2 className="auth-title">Đăng ký tài khoản</h2>
      
      {error && <div className="card" style={{ backgroundColor: '#fef2f2', borderColor: 'var(--danger-color)', color: 'var(--danger-color)', padding: '1rem', marginBottom: '1.5rem' }}>{error}</div>}
      {success && <div className="card" style={{ backgroundColor: '#ecfdf5', borderColor: 'var(--success-color)', color: 'var(--success-color)', padding: '1rem', marginBottom: '1.5rem' }}>{success}</div>}

      <form onSubmit={handleRegister}>
        <div className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label">Tên đăng nhập *</label>
            <input type="text" name="username" className="form-input" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu *</label>
            <input type="password" name="password" className="form-input" required minLength={6} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input type="email" name="email" className="form-input" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input type="text" name="phone" className="form-input" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Ngày sinh</label>
            <input type="date" name="birthday" className="form-input" onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          Đăng ký
        </button>
      </form>
      <p className="text-center text-muted mt-4">
        Đã có tài khoản? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 500 }}>Đăng nhập</Link>
      </p>
    </div>
  );
};

export default Register;
