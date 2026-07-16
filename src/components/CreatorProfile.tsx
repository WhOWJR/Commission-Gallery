import React, { useState } from 'react';
import { 
  Twitter, Mail, Globe, Heart, Eye, ArrowLeft, 
  ExternalLink, FileText, Image as ImageIcon, Film, Link as LinkIcon 
} from 'lucide-react';
import { Creator, Work, CreatorLink } from '../types';

interface CreatorProfileProps {
  creator: Creator;
  works: Work[];
  onSelectWork: (work: Work) => void;
  onBack: () => void;
  onToggleBookmark: (workId: string, e: React.MouseEvent) => void;
}

export const CreatorProfile: React.FC<CreatorProfileProps> = ({
  creator,
  works,
  onSelectWork,
  onBack,
  onToggleBookmark,
}) => {
  const [profileTab, setProfileTab] = useState<'all' | 'illustration' | 'animation' | 'novel'>('all');

  const creatorWorks = works.filter((w) => w.creatorId === creator.id);
  const filteredWorks = profileTab === 'all' 
    ? creatorWorks 
    : creatorWorks.filter((w) => w.type === profileTab);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter size={14} />;
      case 'email':
        return <Mail size={14} />;
      case 'website':
        return <Globe size={14} />;
      default:
        return <LinkIcon size={14} />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'bg-[#1da1f2]/10 hover:bg-[#1da1f2]/20 text-[#1da1f2] border-[#1da1f2]/20';
      case 'pixiv':
        return 'bg-[#0096fa]/10 hover:bg-[#0096fa]/20 text-[#0096fa] border-[#0096fa]/20';
      case 'plurk':
        return 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 border-orange-500/20';
      case 'email':
        return 'bg-gray-500/10 hover:bg-gray-500/20 text-gray-700 border-gray-500/20';
      case 'website':
        return 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border-emerald-500/20';
      default:
        return 'bg-neutral-500/10 hover:bg-neutral-500/20 text-neutral-600 border-neutral-500/20';
    }
  };

  const getPlatformLabel = (link: CreatorLink) => {
    if (link.platform === 'twitter') return 'X / Twitter';
    if (link.platform === 'pixiv') return 'Pixiv 主頁';
    if (link.platform === 'plurk') return '噗浪 Plurk';
    if (link.platform === 'email') return '電子信箱';
    if (link.platform === 'website') return '作品官網';
    return link.label || '其他外部連結';
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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8" id={`creator-profile-${creator.id}`}>
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 font-medium text-sm mb-6 transition-colors select-none cursor-pointer"
        id="profile-back-btn"
      >
        <ArrowLeft size={16} />
        <span>返回</span>
      </button>

      {/* Banner & Bio Header block */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs mb-8" id="profile-hero">
        {/* Banner image */}
        <div className="h-44 md:h-64 bg-gray-100 relative">
          <img
            src={creator.banner}
            alt="Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* User basic profile metadata info offset */}
        <div className="px-6 pb-6 pt-2 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          {/* Avatar and Info */}
          <div className="flex flex-col md:flex-row gap-4 md:items-end -mt-16 md:-mt-20">
            <img
              src={creator.avatar}
              alt={creator.name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover bg-white z-10 shrink-0"
            />
            <div className="z-10 mb-1">
              <h2 className="font-sans font-black text-gray-900 text-xl md:text-2xl tracking-tight flex items-center gap-2">
                {creator.name}
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-1">委託合作創作者</p>
            </div>
          </div>

          {/* Social Links Badge list */}
          <div className="flex flex-wrap gap-2 md:max-w-xl" id="creator-social-links">
            {creator.links && creator.links.length > 0 ? (
              creator.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${getPlatformColor(link.platform)}`}
                >
                  {getPlatformIcon(link.platform)}
                  <span>{getPlatformLabel(link)}</span>
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              ))
            ) : (
              <span className="text-xs text-gray-400 italic">尚未填寫聯絡連結</span>
            )}
          </div>

        </div>

        {/* Bio description */}
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 select-none">個人簡介 / 接單說明</h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {creator.bio || '此創作者尚未填寫自我介紹。'}
          </p>
        </div>

      </div>

      {/* Grid Filter / Sub Tabs inside the profile */}
      <div className="border-b border-gray-200 mb-6 flex items-center justify-between" id="profile-sub-tabs">
        <div className="flex space-x-1">
          <button
            onClick={() => setProfileTab('all')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
              profileTab === 'all'
                ? 'border-[#0096fa] text-[#0096fa]'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            全部作品 ({creatorWorks.length})
          </button>
          <button
            onClick={() => setProfileTab('illustration')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 flex items-center gap-1.5 transition-all ${
              profileTab === 'illustration'
                ? 'border-[#0096fa] text-[#0096fa]'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <ImageIcon size={14} />
            <span>插畫 ({creatorWorks.filter((w) => w.type === 'illustration').length})</span>
          </button>
          <button
            onClick={() => setProfileTab('animation')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 flex items-center gap-1.5 transition-all ${
              profileTab === 'animation'
                ? 'border-[#0096fa] text-[#0096fa]'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Film size={14} />
            <span>動圖 ({creatorWorks.filter((w) => w.type === 'animation').length})</span>
          </button>
          <button
            onClick={() => setProfileTab('novel')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 flex items-center gap-1.5 transition-all ${
              profileTab === 'novel'
                ? 'border-[#0096fa] text-[#0096fa]'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <FileText size={14} />
            <span>小說 ({creatorWorks.filter((w) => w.type === 'novel').length})</span>
          </button>
        </div>
      </div>

      {/* Grid Content List */}
      {filteredWorks.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-xs select-none">
          <p className="text-sm text-gray-400">目前沒有發表此類別的委託成品。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="profile-works-grid">
          {filteredWorks.map((work, idx) => {
            const isNovel = work.type === 'novel';
            const isAnimation = work.type === 'animation';
            
            return (
              <div
                key={work.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 flex flex-col group cursor-pointer"
                onClick={() => onSelectWork(work)}
              >
                {/* Visual Area */}
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

                {/* Info Area */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-sans font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-[#0096fa] transition-colors mb-2">
                      {work.title}
                    </h4>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {work.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] text-gray-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                    <span className="text-[10px] text-gray-400">
                      委託時間：{work.commissionDate || '未記'}
                    </span>
                    <div className="flex items-center gap-2.5 text-gray-400 text-xs">
                      <button
                        onClick={(e) => onToggleBookmark(work.id, e)}
                        className={`p-1 rounded-full transition-colors ${
                          work.isBookmarked 
                            ? 'text-rose-500 hover:bg-rose-50' 
                            : 'text-gray-300 hover:text-rose-500 hover:bg-rose-50'
                        }`}
                      >
                        <Heart size={13} fill={work.isBookmarked ? "currentColor" : "none"} />
                      </button>
                      <span className="flex items-center gap-0.5 text-[11px]">
                        <Eye size={12} />
                        {work.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
