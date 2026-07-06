import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, User, MessageCircle, Send } from 'lucide-react';

interface ContentDTO {
  type: string;
  content: string;
}

interface Article {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  imageId: string;
  contents: ContentDTO[];
}

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  user: {
    username: string;
  };
}

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');

  useEffect(() => {
    const fetchArticleAndComments = async () => {
      try {
        const [articleRes, commentsRes] = await Promise.all([
          api.get(`/articles/${id}`),
          api.get(`/comment/article/${id}`)
        ]);
        setArticle(articleRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticleAndComments();
  }, [id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post('/comment', {
        articleId: Number(id),
        userId: Number(userId),
        content: newComment
      });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (error) {
      alert('Lỗi khi đăng bình luận');
    }
  };

  if (loading) return <div className="container mt-4 text-center">Đang tải...</div>;
  if (!article) return <div className="container mt-4 text-center">Không tìm thấy bài viết</div>;

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="article-detail-title">{article.title}</h1>
      <div className="article-meta" style={{ marginBottom: '2rem' }}>
        <span className="flex items-center gap-2">
          <User size={16} /> {article.author}
        </span>
        <span className="flex items-center gap-2">
          <Calendar size={16} /> {new Date(article.createdAt).toLocaleDateString('vi-VN')}
        </span>
      </div>

      {article.imageId && (
        <img src={article.imageId} alt={article.title} className="article-detail-img" />
      )}

      <div className="article-body" style={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
        {article.contents.map((content, idx) => {
          if (content.type === 'text') {
            return <p key={idx} style={{ marginBottom: '1.5rem' }}>{content.content}</p>;
          }
          if (content.type === 'image') {
            return <img key={idx} src={content.content} alt="Content" style={{ width: '100%', borderRadius: '0.5rem', marginBottom: '1.5rem' }} />;
          }
          return null;
        })}
      </div>

      <hr style={{ margin: '3rem 0', borderColor: 'var(--border-color)' }} />

      {/* Comments Section */}
      <div className="comments-section">
        <h3 className="flex items-center gap-2" style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          <MessageCircle size={24} /> Bình luận ({comments.length})
        </h3>

        {token ? (
          <form onSubmit={handlePostComment} style={{ marginBottom: '2rem' }}>
            <div className="flex gap-2">
              <input
                type="text"
                className="form-input"
                placeholder="Viết bình luận của bạn..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={!newComment.trim()}>
                <Send size={18} /> Gửi
              </button>
            </div>
          </form>
        ) : (
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
            <p className="text-muted">Vui lòng đăng nhập để bình luận.</p>
          </div>
        )}

        <div className="comments-list grid gap-4">
          {comments.map((comment) => (
            <div key={comment.commentId} className="card" style={{ padding: '1rem' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--primary-color)' }}>{comment.user.username}</strong>
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                  {new Date(comment.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
          {comments.length === 0 && <p className="text-muted">Chưa có bình luận nào.</p>}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
