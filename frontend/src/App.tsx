import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminLayout from './components/AdminLayout';
import AdminCategories from './pages/AdminCategories';
import AdminComments from './pages/AdminComments';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => (
  <div className="page-wrapper">
    <Navbar />
    <main className="main-content">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const ComingSoon = () => (
  <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Tính năng đang phát triển</h3>
    <p>Chức năng này sẽ được cập nhật trong phiên bản tiếp theo.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route dành cho người dùng bình thường */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Route dành riêng cho Admin (CMS) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="articles" element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="comments" element={<AdminComments />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
