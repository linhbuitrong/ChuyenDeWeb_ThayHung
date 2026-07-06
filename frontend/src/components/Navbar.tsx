import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Newspaper, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const accountType = localStorage.getItem('accountType');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accountType');
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">
          <Newspaper size={28} />
          ChuyenDeWeb News
        </Link>
        <div className="nav-links">
          {token ? (
            <>
              {accountType === '0' && (
                <Link to="/admin" className="nav-link flex items-center gap-2">
                  <LayoutDashboard size={18} /> Admin
                </Link>
              )}
              <div className="flex items-center gap-2 text-muted">
                <User size={18} /> <span>Xin chào, {username}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline flex items-center gap-2">
                <LogOut size={16} /> Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary">Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
