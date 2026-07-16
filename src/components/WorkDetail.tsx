import React, { useState, useEffect } from 'react';
import { 
  Heart, Eye, Calendar, Tag, ChevronLeft, Send, 
  MessageSquare, User, ExternalLink, Type, ZoomIn, X 
} from 'lucide-react';
import { Work, Creator, WorkComment } from '../types';

interface WorkDetailProps {
  work: Work;
  creators: Creator[];
  comments: WorkComment[];
  onBack: () => void;
  onSelectCreator: (creatorId: string) => void;
  onSelectTag: (tag: string) => void;
  onToggleBookmark: (workId: string) => void;
  onAddComment: (workId: string, content: string, name: string) => void;
}

export const WorkDetail: React.FC<WorkDetailProps> = ({
  work,
  creators,
  comments,
  onBack,
  onSelectCreator,
  onSelectTag,
  onToggleBookmark,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [commenterName, setCommenterName] = useState('訪客委託愛好者');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Novel Reader Settings
  const [novelTheme, setNovelTheme] = useState<'light' | 'warm' | 'dark'>('warm');
  const [fontSize, setFontSize] = useState<number>(18); // default size in px

  // Animation Controls
  const [animSpeed, setAnimSpeed] = useState<number>(1);
  const [animKey, setAnimKey] = useState<number>(0); // force reload animation element for speed adjustments if needed

  const creator = creators.find((c) => c.id === work.creatorId);

  // Auto scroll to top when mounting this view
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Record mock view increment
    work.views += 1;
  }, [work]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(work.id, commentText.trim(), commenterName.trim() || '無名訪客');
    setCommentText('');
  };

  const getNovelThemeClasses = () => {
    switch (novelTheme) {
      case 'warm':
        return 'bg-[#f6f1e9] text-[#443c30] border-amber-200';
      case 'dark':
        return 'bg-[#1e1e1e] text-[#d4d4d4] border-neutral-800';
      default:
        return 'bg-white text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="py-4 md:py-8 max-w-7xl mx-auto px-4 md:px-6" id={`work-detail-${work.id}`}>
      {/* Back navigation */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-[#0096fa] font-medium text-sm mb-6 transition-colors select-none group cursor-pointer"
        id="detail-back-btn"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>返回作品列表</span>
      </button>

      {/* Main Grid: Left Column (Content), Right Column (Meta & Comments) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==================== LEFT COLUMN: CONTENT VIEW ==================== */}
        <div className="lg:col-span-8 flex flex-col gap-6" id="detail-content-area">
          
          {/* Illustration/Image Content View */}
          {work.type === 'illustration' && (
            <div className="flex flex-col gap-4 bg-gray-50 p-4 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
              {/* Main Image Slider/Gallery */}
              <div className="relative rounded-xl overflow-hidden bg-black/5 flex items-center justify-center max-h-[75vh]">
                <img
                  src={work.images[activeImageIndex]}
                  alt={`${work.title} - ${activeImageIndex + 1}`}
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] object-contain cursor-zoom-in rounded-lg shadow-sm"
                  onClick={() => setLightboxImage(work.images[activeImageIndex])}
                />
                <button
                  onClick={() => setLightboxImage(work.images[activeImageIndex])}
                  className="absolute bottom-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                  title="點擊放大圖片"
                >
                  <ZoomIn size={18} />
                </button>
              </div>

              {/* Thumbnail selector if multi-image */}
              {work.images.length > 1 && (
                <div className="flex flex-wrap gap-2.5 justify-center py-2 border-t border-gray-200/50 mt-2">
                  {work.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                        activeImageIndex === index 
                          ? 'border-[#0096fa] scale-105 shadow-sm' 
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="Thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Animation / GIF / Video Player */}
          {work.type === 'animation' && (
            <div className="bg-[#1a1a1a] p-4 md:p-8 rounded-2xl border border-neutral-800 shadow-md flex flex-col gap-4 items-center relative">
              <div className="relative max-h-[70vh] w-full flex items-center justify-center overflow-hidden rounded-xl bg-black">
                {work.animationUrl ? (
                  <img
                    key={`${animKey}-${animSpeed}`}
                    src={work.animationUrl}
                    alt={work.title}
                    referrerPolicy="no-referrer"
                    style={{
                      animationDuration: `${1 / animSpeed}s`
                    }}
                    className="max-h-[60vh] object-contain"
                  />
                ) : (
                  <img
                    src={work.images[0]}
                    alt={work.title}
                    referrerPolicy="no-referrer"
                    className="max-h-[60vh] object-contain opacity-50"
                  />
                )}
              </div>

              {/* Player control HUD */}
              <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl flex items-center justify-between text-neutral-300 text-xs">
                <span className="font-mono tracking-wider font-semibold text-[#0096fa]">● 動圖播放中</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">撥放速度:</span>
                  {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        setAnimSpeed(speed);
                        setAnimKey(prev => prev + 1);
                      }}
                      className={`px-2 py-1 rounded font-mono font-medium transition-all ${
                        animSpeed === speed 
                          ? 'bg-[#0096fa] text-white font-bold' 
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Novel Reader Content View */}
          {work.type === 'novel' && (
            <div className={`rounded-2xl border p-6 md:p-10 shadow-xs transition-colors duration-300 ${getNovelThemeClasses()}`}>
              {/* Novel Toolbar / Customizer */}
              <div className="flex flex-wrap gap-4 items-center justify-between pb-6 border-b border-dashed border-current/20 mb-8 text-sm select-none">
                <div className="flex items-center gap-1">
                  <Type size={16} />
                  <span className="font-semibold">閱讀器偏好設定</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Theme Switcher */}
                  <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
                    <button
                      onClick={() => setNovelTheme('light')}
                      className={`px-2.5 py-1 rounded text-xs transition-colors ${
                        novelTheme === 'light' 
                          ? 'bg-white text-gray-800 shadow-xs font-semibold' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      明亮
                    </button>
                    <button
                      onClick={() => setNovelTheme('warm')}
                      className={`px-2.5 py-1 rounded text-xs transition-colors ${
                        novelTheme === 'warm' 
                          ? 'bg-[#efdfca] text-[#5c3e16] shadow-xs font-semibold' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      羊皮紙
                    </button>
                    <button
                      onClick={() => setNovelTheme('dark')}
                      className={`px-2.5 py-1 rounded text-xs transition-colors ${
                        novelTheme === 'dark' 
                          ? 'bg-neutral-800 text-neutral-200 shadow-xs font-semibold' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      深色
                    </button>
                  </div>

                  {/* Font Size Selector */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                      className="w-7 h-7 bg-black/5 dark:bg-white/5 flex items-center justify-center rounded-lg hover:bg-black/10 text-xs font-bold"
                      title="縮小字體"
                    >
                      A-
                    </button>
                    <span className="text-xs font-mono font-medium">{fontSize}px</span>
                    <button
                      onClick={() => setFontSize(Math.min(26, fontSize + 2))}
                      className="w-7 h-7 bg-black/5 dark:bg-white/5 flex items-center justify-center rounded-lg hover:bg-black/10 text-xs font-bold"
                      title="放大字體"
                    >
                      A+
                    </button>
                  </div>
                </div>
              </div>

              {/* Title & Stats */}
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight mb-3">
                  {work.title}
                </h1>
                <div className="text-xs opacity-75 font-mono flex items-center justify-center gap-2 flex-wrap">
                  <span>作者：{creator ? creator.name : '未知'}</span>
                  <span>|</span>
                  <span>字數估計：{work.novelContent?.length || 0} 字</span>
                  <span>|</span>
                  <span>發表於 {new Date(work.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Novel Main Body Text */}
              <div 
                className="leading-relaxed font-sans select-text whitespace-pre-wrap tracking-wide"
                style={{ fontSize: `${fontSize}px` }}
              >
                {work.novelContent || '尚無內容'}
              </div>

              <div className="mt-12 pt-6 border-t border-dashed border-current/20 text-center text-xs opacity-60">
                — 本章結束 —
              </div>
            </div>
          )}

          {/* Tag cloud display on the detail page bottom */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-gray-500 mr-2 flex items-center gap-1 select-none">
              <Tag size={14} className="text-[#0096fa]" />
              分類標籤:
            </span>
            {work.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onSelectTag(tag)}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-[#0096fa]/10 hover:text-[#0096fa] font-medium text-gray-600 rounded-full transition-all cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>

        </div>

        {/* ==================== RIGHT COLUMN: METADATA & SIDEBAR ==================== */}
        <div className="lg:col-span-4 flex flex-col gap-6" id="detail-sidebar">
          
          {/* Creator Profile Card */}
          {creator && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-gray-150 shadow-xs cursor-pointer"
                  onClick={() => onSelectCreator(creator.id)}
                />
                <div>
                  <h4 
                    className="font-bold text-gray-900 text-sm hover:text-[#0096fa] transition-colors cursor-pointer"
                    onClick={() => onSelectCreator(creator.id)}
                  >
                    {creator.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">委託創作者</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                {creator.bio}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => onSelectCreator(creator.id)}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg text-center transition-all cursor-pointer"
                >
                  查看畫師作品
                </button>
                {creator.links && creator.links.length > 0 && (
                  <a
                    href={creator.links[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-[#0096fa]/10 hover:bg-[#0096fa]/20 text-[#0096fa] text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <span>聯絡畫師</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Work Metadata Info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col gap-3.5 text-xs text-gray-500">
            <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100">作品詳細資訊</h3>
            
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-400">作品標題</span>
              <span className="font-semibold text-gray-800 text-right max-w-[70%] truncate">{work.title}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-400">類型</span>
              <span className="capitalize font-semibold text-gray-800">
                {work.type === 'illustration' ? '插圖繪作 (圖)' : work.type === 'animation' ? '動態影像 (動圖)' : '輕小說創作 (文)'}
              </span>
            </div>

            {work.commissionDate && (
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-400">委託取得時間</span>
                <span className="font-semibold text-gray-800 flex items-center gap-1">
                  <Calendar size={12} className="text-gray-400" />
                  {work.commissionDate}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-400">收錄日期</span>
              <span className="font-semibold text-gray-800">
                {new Date(work.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-400">數據統計</span>
              <span className="font-semibold text-gray-800 flex items-center gap-3">
                <span className="flex items-center gap-0.5">
                  <Eye size={12} /> {work.views}
                </span>
                <span className="flex items-center gap-0.5">
                  <Heart size={12} fill="none" /> {work.likes}
                </span>
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100 mt-2 whitespace-pre-wrap text-[11px]">
              {work.description}
            </p>

            <button
              onClick={() => onToggleBookmark(work.id)}
              className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all mt-2 cursor-pointer ${
                work.isBookmarked
                  ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Heart size={14} fill={work.isBookmarked ? "currentColor" : "none"} />
              <span>{work.isBookmarked ? '已收藏此成品' : '加入個人收藏'}</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5 pb-2 border-b border-gray-100 select-none">
              <MessageSquare size={16} className="text-[#0096fa]" />
              <span>委託點評 & 紀錄 ({comments.length})</span>
            </h3>

            {/* Comment write-box */}
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="留名 (預設為訪客)"
                  className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0096fa] w-1/2"
                  value={commenterName}
                  onChange={(e) => setCommenterName(e.target.value)}
                />
              </div>
              <div className="relative">
                <textarea
                  rows={2}
                  placeholder="寫下您對此委託成品的評價、畫師回饋或心得備忘..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 focus:bg-white rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0096fa] resize-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2.5 bottom-2.5 p-1.5 bg-[#0096fa] hover:bg-[#0084dd] text-white rounded-lg transition-colors cursor-pointer"
                  title="送出點評"
                >
                  <Send size={12} />
                </button>
              </div>
            </form>

            {/* Comments list */}
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto scrollbar-thin pr-1">
              {comments.length === 0 ? (
                <p className="text-center text-xs text-gray-400 py-4 italic select-none">
                  尚無評語，留下第一個委託備忘吧！
                </p>
              ) : (
                comments.map((comm) => (
                  <div key={comm.id} className="flex gap-2.5 p-2 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <img
                      src={comm.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&q=80'}
                      alt="avatar"
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover mt-0.5 border border-gray-150"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between font-medium text-[10px] text-gray-400 mb-0.5">
                        <span className="font-bold text-gray-700 truncate max-w-[120px]">
                          {comm.authorName}
                        </span>
                        <span>
                          {new Date(comm.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed break-words">
                        {comm.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Modal for Zoomed Image */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
          id="image-lightbox"
        >
          <button 
            className="absolute top-4 right-4 p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            onClick={() => setLightboxImage(null)}
          >
            <X size={24} />
          </button>
          <img
            src={lightboxImage}
            alt="Fullscreen view"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

    </div>
  );
};
