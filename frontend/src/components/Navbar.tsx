import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Newspaper, LogOut, User, LayoutDashboard, CloudRain, Search } from 'lucide-react';
import api from '../api/axios';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem('token');
  const accountType = localStorage.getItem('accountType');
  const username = localStorage.getItem('username');
  
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<{categoryId: number, name: string}[]>([]);
  const activeCategoryId = searchParams.get('categoryId');
  const isHomeActive = !activeCategoryId && !searchParams.get('search');

  useEffect(() => {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const d = new Date();
    setCurrentDate(`${days[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
    
    // Fetch categories cho Navbar
    api.get('/category').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accountType');
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      {/* Top bar siêu nhỏ (Ngày tháng, thời tiết) */}
      <div style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.8rem', color: '#64748b' }}>
        <div className="container flex justify-between items-center py-1">
          <div className="flex gap-4">
            <span>{currentDate}</span>
            <span className="flex items-center gap-1"><CloudRain size={12} /> TP.HCM 28°C</span>
          </div>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-primary">Mới nhất</Link>
            <Link to="#" className="hover:text-primary">Tin theo khu vực</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className="nav-brand">
          <Newspaper size={32} />
          ChuyenDeWeb <span style={{ color: '#0f172a' }}>News</span>
        </Link>
        
        {/* Search box có hoạt động */}
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '400px', margin: '0 2rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', 
              borderRadius: '2rem', border: '1px solid #e2e8f0', outline: 'none',
              backgroundColor: '#f8fafc'
            }} 
          />
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
          <button type="submit" style={{ display: 'none' }}>Search</button>
        </form>

        <div className="nav-links">
          {token ? (
            <>
              {accountType === '0' && (
                <Link to="/admin" className="nav-link flex items-center gap-2">
                  <LayoutDashboard size={18} /> Admin
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2" style={{ fontWeight: 600, color: '#334155', transition: 'color 0.2s ease' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-color)')} onMouseLeave={e => (e.currentTarget.style.color = '#334155')}>
                <User size={18} /> <span>{username}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline flex items-center gap-2" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <LogOut size={16} /> Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Đăng ký</Link>
            </>
          )}
        </div>
      </div>

      {/* Chuyển Category Nav vào đây để nó luôn xuất hiện và dính trên đầu (Sticky) cùng Navbar */}
      <div className="category-nav" style={{ marginTop: 0, marginBottom: 0 }}>
        <div className="container">
          <ul className="category-list">
            <li className={isHomeActive ? 'active' : ''}>
              <Link to="/">TRANG CHỦ</Link>
            </li>
            {categories.map(cat => (
              <li key={cat.categoryId} className={activeCategoryId === String(cat.categoryId) ? 'active' : ''}>
                <Link to={`/?categoryId=${cat.categoryId}`}>{cat.name.toUpperCase()}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
