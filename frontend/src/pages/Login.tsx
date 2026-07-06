import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { username, password });
      const { token, id, accountType, username: user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      localStorage.setItem('accountType', accountType);
      localStorage.setItem('username', user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data || 'Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await api.post('/auth/google', { token: credentialResponse.credential });
      const { token, id, accountType, username: user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      localStorage.setItem('accountType', accountType);
      localStorage.setItem('username', user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data || 'Đăng nhập Google thất bại');
    }
  };

  const handleFacebookSuccess = async (response: any) => {
    try {
      const res = await api.post('/auth/facebook', { token: response.accessToken });
      const { token, id, accountType, username: user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      localStorage.setItem('accountType', accountType);
      localStorage.setItem('username', user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data || 'Đăng nhập Facebook thất bại');
    }
  };

  return (
    <div className="auth-container animate-fade-in card">
      <h2 className="auth-title">Đăng nhập</h2>
      {error && <div className="card" style={{ backgroundColor: '#fef2f2', borderColor: 'var(--danger-color)', color: 'var(--danger-color)', padding: '1rem', marginBottom: '1.5rem' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Tên đăng nhập</label>
          <input
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Mật khẩu</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          Đăng nhập
        </button>
      </form>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '1rem', gap: '10px' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Đăng nhập Google thất bại')}
        />
        
        <FacebookLogin
          appId="2146458403421402"
          onSuccess={handleFacebookSuccess}
          onFail={(error) => {
            console.log('Login Failed!', error);
            setError('Đăng nhập Facebook thất bại');
          }}
          onProfileSuccess={(response) => {
            console.log('Get Profile Success!', response);
          }}
          className="btn btn-primary"
          style={{ backgroundColor: '#4267b2', color: 'white', border: 'none', borderRadius: '4px', padding: '0 12px', fontSize: '14px', fontWeight: '500', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          children="Sign in with Facebook"
        />
      </div>

      <p className="text-center text-muted mt-4">
        Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 500 }}>Đăng ký ngay</Link>
      </p>
      
      <p className="text-center text-muted mt-2">
        <Link to="/forgot-password" style={{ color: 'var(--primary-color)', fontWeight: 500, fontSize: '14px' }}>Quên mật khẩu?</Link>
      </p>
    </div>
  );
};

export default Login;
