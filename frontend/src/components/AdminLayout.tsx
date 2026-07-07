import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, MessageSquare, Settings, LogOut, Search, Bell } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('accountType');
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Tổng quan' },
    { path: '/admin/articles', icon: <FileText size={20} />, label: 'Bài viết' },
    { path: '/admin/categories', icon: <Search size={20} />, label: 'Chuyên mục' },
    { path: '/admin/comments', icon: <MessageSquare size={20} />, label: 'Bình luận' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Người dùng' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Cài đặt' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0f172a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 100
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
            <div style={{ background: '#10b981', padding: '0.5rem', borderRadius: '8px' }}>
              <FileText size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>NewsAdmin</span>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: isActive ? 'white' : '#94a3b8',
                backgroundColor: isActive ? '#1e293b' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease'
              }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.backgroundColor = '#1e293b';
                    (e.target as HTMLElement).style.color = 'white';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.backgroundColor = 'transparent';
                    (e.target as HTMLElement).style.color = '#94a3b8';
                  }
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: 'white'
            }}>
              {username?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{username}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
            padding: '0.75rem 1rem', borderRadius: '8px', color: '#ef4444',
            backgroundColor: 'transparent', border: '1px solid rgba(239, 68, 68, 0.2)',
            cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500
          }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.backgroundColor = '#ef4444';
              (e.target as HTMLElement).style.color = 'white';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.backgroundColor = 'transparent';
              (e.target as HTMLElement).style.color = '#ef4444';
            }}
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{
          height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2rem', position: 'sticky', top: 0, zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '99px', width: '300px' }}>
            <Search size={18} color="#64748b" />
            <input type="text" placeholder="Tìm kiếm nhanh..." style={{
              border: 'none', background: 'transparent', outline: 'none', marginLeft: '0.5rem', flex: 1, fontSize: '0.9rem'
            }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button style={{ position: 'relative', color: '#64748b' }}>
              <Bell size={20} />
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%'
              }} />
            </button>
            <Link to="/" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Về trang chủ →
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <main style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
