import React from 'react';
import { Heart, Eye, Film, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { Work, Creator } from '../types';

interface WorkGridProps {
  works: Work[];
  creators: Creator[];
  onSelectWork: (work: Work) => void;
  onSelectCreator: (creatorId: string) => void;
  onToggleBookmark: (workId: string, e: React.MouseEvent) => void;
  onResetData?: () => void;
}

export const WorkGrid: React.FC<WorkGridProps> = ({
  works,
  creators,
  onSelectWork,
  onSelectCreator,
  onToggleBookmark,
  onResetData,
}) => {
  const getCreator = (creatorId: string) => {
    return creators.find((c) => c.id === creatorId);
  };

  const getNovelCover = (title: string, index: number) => {
    return (
      <div className="w-full h-full bg-[#fff8ef] border-2 border-dashed border-[#e6d0b5] rounded-xl relative flex flex-col items-center justify-center p-4 select-none">
        {/* Book structure/lines */}
        <div className="w-10 h-1 bg-[#e6d0b5] mb-2 rounded-full"></div>
        <div className="w-8 h-1 bg-[#e6d0b5] mb-2 rounded-full"></div>
        <div className="w-12 h-1 bg-[#e6d0b5] mb-4 rounded-full"></div>
        
        {/* Title */}
        <div className="text-center px-2 z-10">
          <h3 className="font-sans font-bold text-gray-800 text-xs md:text-sm tracking-wide leading-snug line-clamp-3">
            {title}
          </h3>
        </div>

        {/* Left side book spine simulation */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#e6d0b5]/20 border-r border-[#e6d0b5]/10 rounded-l-lg" />
      </div>
    );
  };

  if (works.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-gray-150 shadow-sm my-8" id="empty-state">
        <AlertCircle size={48} className="text-gray-300 mb-4 animate-pulse" />
        <h3 className="text-lg font-bold text-gray-800 mb-2">未找到任何委託成品</h3>
        <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
          您可以嘗試更換搜尋關鍵字、標籤，或到右上角「作品管理與投稿」添加新的作品。
        </p>
        {onResetData && (
          <button
            onClick={onResetData}
            className="px-5 py-2 bg-[#0096fa]/10 hover:bg-[#0096fa]/20 text-[#0096fa] font-semibold text-sm rounded-full transition-colors cursor-pointer"
          >
            重置並載入範例作品
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-6" id="work-grid-container">
      {works.map((work, idx) => {
        const creator = getCreator(work.creatorId);
        const isNovel = work.type === 'novel';
        const isAnimation = work.type === 'animation';
        
        return (
          <div
            key={work.id}
            id={`work-card-${work.id}`}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 flex flex-col group cursor-pointer"
            onClick={() => onSelectWork(work)}
          >
            {/* Card Image Area */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 shrink-0">
              {isNovel ? (
                getNovelCover(work.title, idx)
              ) : (
                <>
                  <img
                    src={isAnimation ? work.animationUrl || work.images[0] : work.images[0]}
                    alt={work.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {isAnimation && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center transition-all group-hover:bg-black/25">
                      <div className="w-10 h-10 border-2 border-white/60 rounded-full flex items-center justify-center backdrop-blur-xs bg-black/20">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5"></div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Top-Left Badge: Multi-image count */}
              {!isNovel && work.images.length > 1 && (
                <div className="absolute top-2.5 right-12 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wider flex items-center gap-0.5 select-none z-10">
                  <span>{work.images.length}P</span>
                </div>
              )}

              {/* Top-Right Badge: Work Type Badge (Geometric Balance style) */}
              <div className="absolute top-2.5 right-2.5 z-10 select-none">
                {isAnimation && (
                  <span className="px-2 py-1 bg-[#10b981] text-white rounded text-[10px] font-bold shadow-sm">
                    GIF
                  </span>
                )}
                {isNovel && (
                  <span className="px-2 py-1 bg-[#f59e0b] text-white rounded text-[10px] font-bold shadow-sm">
                    NOVEL
                  </span>
                )}
                {!isNovel && !isAnimation && (
                  <span className="px-2 py-1 bg-white/90 text-gray-800 backdrop-blur-xs rounded text-[10px] font-bold shadow-sm border border-gray-200">
                    ILLUST
                  </span>
                )}
              </div>
            </div>

            {/* Card Content Area */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                {/* Title */}
                <h4 className="font-sans font-bold text-gray-900 text-sm tracking-tight line-clamp-1 group-hover:text-[#0096fa] transition-colors mb-2">
                  {work.title}
                </h4>

                {/* Tags preview */}
                <div className="flex flex-wrap gap-1 mb-4 h-[18px] overflow-hidden">
                  {work.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-gray-400 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Creator, Likes, Views */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                {/* Creator Profile */}
                {creator ? (
                  <div 
                    className="flex items-center gap-2 group/creator overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCreator(creator.id);
                    }}
                  >
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover border border-gray-100 shrink-0"
                    />
                    <span className="text-xs text-gray-600 font-medium truncate group-hover/creator:text-[#0096fa] transition-colors">
                      {creator.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">未知作者</span>
                )}

                {/* Engagement metrics */}
                <div className="flex items-center gap-2.5 shrink-0 select-none">
                  <button
                    onClick={(e) => onToggleBookmark(work.id, e)}
                    className={`p-1 rounded-full transition-colors ${
                      work.isBookmarked 
                        ? 'text-rose-500 hover:bg-rose-50' 
                        : 'text-gray-300 hover:text-rose-500 hover:bg-rose-50'
                    }`}
                    title={work.isBookmarked ? "取消收藏" : "加入收藏"}
                  >
                    <Heart size={14} fill={work.isBookmarked ? "currentColor" : "none"} />
                  </button>
                  <div className="flex items-center text-gray-400 text-[11px] gap-0.5">
                    <Eye size={12} />
                    <span>{work.views}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};
