import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '3rem 0', marginTop: '4rem' }}>
      <div className="container grid grid-cols-3">
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '1rem' }}>
            ChuyenDeWeb News
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Trang thông tin tổng hợp tin tức tự động hàng đầu. Cập nhật liên tục 24/7 từ các nguồn báo chí uy tín nhất Việt Nam.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Chuyên mục</h4>
          <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Thời sự</li>
            <li>Kinh doanh</li>
            <li>Công nghệ</li>
            <li>Giáo dục</li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Liên hệ</h4>
          <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e1', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Tòa soạn: Khu công nghệ cao, TP.HCM</li>
            <li>Hotline: 0123.456.789</li>
            <li>Email: toasoan@chuyendeweb.vn</li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ borderTop: '1px solid #334155', marginTop: '2rem', paddingTop: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
        © 2026 ChuyenDeWeb News. Đồ án môn học Chuyên đề Web.
      </div>
    </footer>
  );
};

export default Footer;
