import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, User, MessageCircle, Send, Volume2, VolumeX, Pause, Play, Share2, Bookmark, Clock, ChevronUp } from 'lucide-react';

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
  categoryId?: number;
}

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  user: {
    username: string;
  };
}

interface RelatedArticle {
  id: number;
  title: string;
  imageId: string;
  createdAt: string;
  author: string;
}

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  // Text-to-Speech states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechProgress, setSpeechProgress] = useState(0);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reading time & scroll
  const [readingTime, setReadingTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');

  // Tính thời gian đọc dựa trên số từ
  const calculateReadingTime = useCallback((contents: ContentDTO[]) => {
    const allText = contents
      .filter(c => c.type === 'text')
      .map(c => c.content)
      .join(' ');
    const wordCount = allText.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200)); // Tốc độ đọc trung bình: 200 từ/phút
  }, []);

  // Theo dõi thanh tiến trình đọc (scroll progress bar)
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(progress);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, commentsRes] = await Promise.all([
          api.get(`/articles/${id}`),
          api.get(`/comment/article/${id}`)
        ]);
        setArticle(articleRes.data);
        setComments(commentsRes.data);
        setReadingTime(calculateReadingTime(articleRes.data.contents));

        // Lấy bài viết liên quan (cùng chuyên mục hoặc toàn bộ nếu không có categoryId)
        try {
          const params = articleRes.data.categoryId
            ? { categoryId: articleRes.data.categoryId }
            : {};
          const relatedRes = await api.get('/articles', { params });
          const filtered = relatedRes.data
            .filter((a: RelatedArticle) => a.id !== articleRes.data.id)
            .slice(0, 5);
          setRelatedArticles(filtered);
        } catch {
          // Không sao nếu không lấy được bài liên quan
        }
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Kiểm tra trạng thái bookmark
    if (token && userId) {
      api.get(`/profile/${userId}/saved/check/${id}`)
        .then(res => setIsBookmarked(res.data.saved))
        .catch(() => {});
    }

    // Dọn dẹp TTS khi rời trang
    return () => {
      window.speechSynthesis.cancel();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [id, calculateReadingTime]);

  // ========================
  // TEXT-TO-SPEECH (BÁO NÓI)
  // ========================
  const getArticleText = useCallback(() => {
    if (!article) return '';
    const titleText = article.title;
    const bodyText = article.contents
      .filter(c => c.type === 'text')
      .map(c => c.content)
      .join('. ');
    return `${titleText}. ${bodyText}`;
  }, [article]);

  const startSpeech = () => {
    window.speechSynthesis.cancel(); // Hủy cái cũ nếu có
    const text = getArticleText();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Chọn giọng tiếng Việt nếu có
    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find(v => v.lang.startsWith('vi'));
    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeechProgress(100);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
    setSpeechProgress(0);

    // Giả lập thanh tiến trình dựa trên ước tính thời gian đọc
    const estimatedDuration = (text.length / 10) * 1000; // Tốc độ ước tính
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / estimatedDuration) * 100, 99);
      setSpeechProgress(progress);
    }, 500);
  };

  const togglePause = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setSpeechProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  // ========================
  // COMMENT
  // ========================
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
    } catch {
      alert('Lỗi khi đăng bình luận');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép đường dẫn bài viết!');
    }
  };

  const handleToggleBookmark = async () => {
    if (!token || !userId) {
      alert('Bạn cần đăng nhập để lưu bài viết');
      return;
    }
    try {
      if (isBookmarked) {
        await api.delete(`/profile/${userId}/saved/${id}`);
        setIsBookmarked(false);
      } else {
        await api.post(`/profile/${userId}/saved/${id}`);
        setIsBookmarked(true);
      }
    } catch {
      console.error('Lỗi khi lưu/bỏ lưu bài viết');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Vừa xong';
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="article-skeleton">
          <div style={{ width: '70%', height: '2.5rem', background: 'var(--border-color)', borderRadius: '8px', margin: '0 auto 1rem' }} />
          <div style={{ width: '40%', height: '1rem', background: 'var(--border-color)', borderRadius: '8px', margin: '0 auto 2rem' }} />
          <div style={{ width: '100%', height: '400px', background: 'var(--border-color)', borderRadius: '12px', marginBottom: '2rem' }} />
          <div style={{ width: '90%', height: '1rem', background: 'var(--border-color)', borderRadius: '8px', margin: '0 auto 0.75rem' }} />
          <div style={{ width: '95%', height: '1rem', background: 'var(--border-color)', borderRadius: '8px', margin: '0 auto 0.75rem' }} />
          <div style={{ width: '60%', height: '1rem', background: 'var(--border-color)', borderRadius: '8px', margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-muted)' }}>Không tìm thấy bài viết</h2>
      </div>
    );
  }

  return (
    <>
      {/* Thanh tiến trình đọc bài (Reading Progress Bar) */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: `${scrollProgress}%`, height: '3px',
        background: 'linear-gradient(90deg, #10b981, #06b6d4)', zIndex: 9999,
        transition: 'width 0.1s linear'
      }} />

      <article className="container animate-fade-in" style={{ maxWidth: '820px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* ===== PHẦN ĐẦU BÀI VIẾT ===== */}
        <header style={{ marginBottom: '2.5rem' }}>
          {/* Tiêu đề */}
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: "'Merriweather', serif",
            fontWeight: 700, lineHeight: 1.35, color: 'var(--text-main)', marginBottom: '1.25rem'
          }}>
            {article.title}
          </h1>

          {/* Meta info */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem',
            color: 'var(--text-muted)', fontSize: '0.9rem', paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={15} /> {article.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={15} /> {formatTimeAgo(article.createdAt)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={15} /> {readingTime} phút đọc
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageCircle size={15} /> {comments.length} bình luận
            </span>
          </div>
        </header>

        {/* ===== THANH CÔNG CỤ: BÁO NÓI + CHIA SẺ ===== */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem',
          marginBottom: '2rem', padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
          borderRadius: 'var(--radius-lg)', border: '1px solid #d1fae5'
        }}>
          {/* Nút Báo Nói */}
          {!isSpeaking ? (
            <button onClick={startSpeech} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem',
              background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white',
              borderRadius: '2rem', fontWeight: 600, fontSize: '0.875rem',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s ease'
            }}>
              <Volume2 size={18} /> Nghe bài viết
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={togglePause} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem',
                background: isPaused ? '#f59e0b' : '#3b82f6', color: 'white',
                borderRadius: '2rem', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s'
              }}>
                {isPaused ? <><Play size={16} /> Tiếp tục</> : <><Pause size={16} /> Tạm dừng</>}
              </button>
              <button onClick={stopSpeech} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem',
                background: '#ef4444', color: 'white',
                borderRadius: '2rem', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s'
              }}>
                <VolumeX size={16} /> Dừng
              </button>
            </div>
          )}

          {/* Thanh tiến trình báo nói */}
          {isSpeaking && (
            <div style={{
              flex: 1, minWidth: '120px', height: '6px',
              background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden'
            }}>
              <div style={{
                width: `${speechProgress}%`, height: '100%',
                background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                borderRadius: '3px', transition: 'width 0.5s ease'
              }} />
            </div>
          )}

          {/* Chia sẻ và Lưu */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleShare} title="Chia sẻ" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'white', border: '1px solid var(--border-color)',
              color: 'var(--text-muted)', transition: 'all 0.2s'
            }}>
              <Share2 size={16} />
            </button>
            <button title="Lưu bài" onClick={handleToggleBookmark} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px', borderRadius: '50%',
              background: isBookmarked ? 'var(--primary-color)' : 'white',
              border: isBookmarked ? 'none' : '1px solid var(--border-color)',
              color: isBookmarked ? 'white' : 'var(--text-muted)', transition: 'all 0.2s'
            }}>
              <Bookmark size={16} fill={isBookmarked ? 'white' : 'none'} />
            </button>
          </div>
        </div>

        {/* ===== ẢNH ĐẠI DIỆN ===== */}
        {article.imageId && (
          <figure style={{ marginBottom: '2.5rem' }}>
            <img src={article.imageId} alt={article.title} style={{
              width: '100%', height: 'auto', maxHeight: '480px', objectFit: 'cover',
              borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)'
            }} />
          </figure>
        )}

        {/* ===== NỘI DUNG BÀI VIẾT ===== */}
        <div style={{
          fontSize: '1.125rem', lineHeight: 1.9,
          fontFamily: "'Merriweather', serif",
          color: '#1e293b'
        }}>
          {article.contents.map((content, idx) => {
            if (content.type === 'text') {
              // Đoạn đầu tiên sẽ là sapo (drop cap)
              if (idx === 0) {
                return (
                  <p key={idx} style={{
                    marginBottom: '1.75rem', fontWeight: 700, fontSize: '1.2rem',
                    color: '#0f172a', lineHeight: 1.7,
                    borderLeft: '4px solid var(--primary-color)',
                    paddingLeft: '1.25rem'
                  }}>
                    {content.content}
                  </p>
                );
              }
              return (
                <p key={idx} style={{
                  marginBottom: '1.5rem', textAlign: 'justify'
                }}>
                  {content.content}
                </p>
              );
            }
            if (content.type === 'image') {
              return (
                <figure key={idx} style={{ margin: '2rem 0' }}>
                  <img src={content.content} alt="Ảnh minh hoạ"
                    style={{
                      width: '100%', borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  />
                  <figcaption style={{
                    textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)',
                    fontSize: '0.875rem', marginTop: '0.75rem',
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    Ảnh minh hoạ
                  </figcaption>
                </figure>
              );
            }
            return null;
          })}
        </div>

        {/* ===== BÀI VIẾT LIÊN QUAN ===== */}
        {relatedArticles.length > 0 && (
          <div style={{
            marginTop: '3rem', padding: '2rem', background: '#f8fafc',
            borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)'
          }}>
            <h3 style={{
              fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem',
              paddingBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)',
              display: 'inline-block'
            }}>
              Bài viết liên quan
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {relatedArticles.map(related => (
                <Link key={related.id} to={`/article/${related.id}`} style={{
                  display: 'flex', gap: '1rem', alignItems: 'center',
                  padding: '0.75rem', borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s', background: 'white',
                  boxShadow: 'var(--shadow-sm)'
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {related.imageId && (
                    <img src={related.imageId} alt="" style={{
                      width: '100px', height: '68px', objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)', flexShrink: 0
                    }} />
                  )}
                  <div>
                    <p style={{
                      fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.4,
                      color: 'var(--text-main)', marginBottom: '0.25rem'
                    }}>
                      {related.title}
                    </p>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatTimeAgo(related.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ===== BÌNH LUẬN ===== */}
        <div style={{ marginTop: '3rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)'
            }}>
              <MessageCircle size={20} color="white" />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>
              Bình luận <span style={{
                fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400
              }}>({comments.length})</span>
            </h3>
          </div>

          {/* Form bình luận */}
          {token ? (
            <form onSubmit={handlePostComment} style={{
              marginBottom: '2rem', display: 'flex', gap: '0.75rem'
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '0.875rem'
              }}>
                {localStorage.getItem('username')?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Viết bình luận của bạn..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{
                    flex: 1, padding: '0.75rem 1rem',
                    border: '1px solid var(--border-color)', borderRadius: '2rem',
                    fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s',
                    background: '#f8fafc'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
                <button type="submit" disabled={!newComment.trim()} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.75rem 1.25rem', borderRadius: '2rem',
                  background: newComment.trim() ? 'linear-gradient(135deg, #10b981, #059669)' : '#e2e8f0',
                  color: newComment.trim() ? 'white' : '#94a3b8',
                  fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
                  cursor: newComment.trim() ? 'pointer' : 'not-allowed'
                }}>
                  <Send size={16} /> Gửi
                </button>
              </div>
            </form>
          ) : (
            <div style={{
              padding: '1.5rem', textAlign: 'center', marginBottom: '2rem',
              background: '#f8fafc', borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-color)'
            }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Bạn cần đăng nhập để bình luận
              </p>
              <Link to="/login" style={{
                color: 'var(--primary-color)', fontWeight: 600
              }}>
                Đăng nhập ngay →
              </Link>
            </div>
          )}

          {/* Danh sách bình luận */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {comments.map((comment) => (
              <div key={comment.commentId} style={{
                display: 'flex', gap: '0.75rem', padding: '1.25rem',
                background: 'white', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                transition: 'all 0.2s'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: `hsl(${comment.user.username.length * 40}, 60%, 65%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '0.8rem'
                }}>
                  {comment.user.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '0.4rem'
                  }}>
                    <strong style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                      {comment.user.username}
                    </strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{comment.content}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p style={{
                textAlign: 'center', color: 'var(--text-muted)',
                padding: '2rem', fontStyle: 'italic'
              }}>
                Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
              </p>
            )}
          </div>
        </div>
      </article>

      {/* ===== NÚT SCROLL TO TOP ===== */}
      {showScrollTop && (
        <button onClick={scrollToTop} style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '48px', height: '48px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
          cursor: 'pointer', zIndex: 1000, transition: 'all 0.3s',
          animation: 'fadeIn 0.3s ease'
        }}>
          <ChevronUp size={24} />
        </button>
      )}
    </>
  );
};

export default ArticleDetail;
