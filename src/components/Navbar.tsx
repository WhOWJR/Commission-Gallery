import React, { useState } from 'react';
import { Search, Heart, Sliders, PlusCircle, Settings, User, FileText, Image as ImageIcon, Film } from 'lucide-react';
import { WorkType } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: WorkType | 'all';
  setSelectedType: (type: WorkType | 'all') => void;
  onlyBookmarked: boolean;
  setOnlyBookmarked: (val: boolean) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  onlyBookmarked,
  setOnlyBookmarked,
  onOpenAdmin,
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    setCurrentTab('home');
  };

  const clearSearch = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  const handleTypeSelect = (type: WorkType | 'all') => {
    setSelectedType(type);
    setOnlyBookmarked(false);
    setCurrentTab('home');
  };

  const toggleBookmarkFilter = () => {
    setOnlyBookmarked(!onlyBookmarked);
    setCurrentTab('home');
  };

  // Popular quick tags
  const quickTags = ['櫻花', '賽博龐克', '奇幻', '治癒系', '背景神作', '霓虹燈'];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm" id="pixiv-navbar">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Upper Row: Brand, Search, User actions */}
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer select-none shrink-0" 
            onClick={() => {
              setCurrentTab('home');
              clearSearch();
              setSelectedType('all');
              setOnlyBookmarked(false);
            }}
            id="brand-logo"
          >
            <div className="w-8 h-8 bg-[#0096fa] rounded-full flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white transform rotate-45"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-sans font-bold text-xl text-gray-900 tracking-tight flex items-baseline">
                <span className="text-[#0096fa]">pixiv</span>
                <span className="text-gray-500 text-xs ml-1.5 font-medium border-l border-gray-200 pl-1.5">委託庫</span>
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-xl mx-2 md:mx-4" id="search-form">
            <div className="relative">
              <input
                type="text"
                placeholder="搜尋作品名稱、描述、標籤或作者..."
                className="w-full h-10 pl-4 pr-10 bg-[#f2f4f6] hover:bg-gray-150 focus:bg-white border-none rounded-md text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0096fa] transition-all"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0096fa]"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0" id="navbar-actions">
            <button
              onClick={toggleBookmarkFilter}
              className={`p-2.5 rounded-full transition-colors relative ${
                onlyBookmarked 
                  ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={onlyBookmarked ? "顯示全部" : "只顯示收藏作品"}
              id="bookmark-filter-btn"
            >
              <Heart size={18} fill={onlyBookmarked ? "currentColor" : "none"} />
              {onlyBookmarked && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-4 h-10 bg-[#0096fa] hover:bg-[#007ed2] active:bg-[#0066ad] text-white font-medium text-sm rounded-full transition-all shadow-sm"
              id="admin-panel-btn"
            >
              <Settings size={16} />
              <span className="hidden md:inline">作品管理與投稿</span>
            </button>
          </div>

        </div>

        {/* Lower Row: Navigation and Sub-categories */}
        <div className="flex items-center justify-between h-12 border-t border-gray-100 text-sm overflow-x-auto scrollbar-none" id="sub-navbar">
          <nav className="flex items-center space-x-1 md:space-x-2 h-full shrink-0">
            <button
              onClick={() => handleTypeSelect('all')}
              className={`flex items-center gap-1 px-4 h-full border-b-2 font-medium transition-all ${
                currentTab === 'home' && selectedType === 'all' && !onlyBookmarked
                  ? 'border-[#0096fa] text-[#0096fa]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              id="tab-all"
            >
              全部作品
            </button>
            <button
              onClick={() => handleTypeSelect('illustration')}
              className={`flex items-center gap-1.5 px-4 h-full border-b-2 font-medium transition-all ${
                currentTab === 'home' && selectedType === 'illustration'
                  ? 'border-[#0096fa] text-[#0096fa]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              id="tab-illust"
            >
              <ImageIcon size={14} />
              插畫 / 圖
            </button>
            <button
              onClick={() => handleTypeSelect('animation')}
              className={`flex items-center gap-1.5 px-4 h-full border-b-2 font-medium transition-all ${
                currentTab === 'home' && selectedType === 'animation'
                  ? 'border-[#0096fa] text-[#0096fa]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              id="tab-anim"
            >
              <Film size={14} />
              動圖 / 動畫
            </button>
            <button
              onClick={() => handleTypeSelect('novel')}
              className={`flex items-center gap-1.5 px-4 h-full border-b-2 font-medium transition-all ${
                currentTab === 'home' && selectedType === 'novel'
                  ? 'border-[#0096fa] text-[#0096fa]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              id="tab-novel"
            >
              <FileText size={14} />
              小說 / 文
            </button>
            <button
              onClick={() => setCurrentTab('creators')}
              className={`flex items-center gap-1.5 px-4 h-full border-b-2 font-medium transition-all ${
                currentTab === 'creators'
                  ? 'border-[#0096fa] text-[#0096fa]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              id="tab-creators"
            >
              <User size={14} />
              作者一覽
            </button>
          </nav>

          {/* Quick Search Tags for Desktop */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 shrink-0 select-none">
            <span className="text-gray-400 font-medium">常用標籤:</span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setLocalQuery(`#${tag}`);
                  setSearchQuery(`#${tag}`);
                  setCurrentTab('home');
                }}
                className="px-2 py-1 bg-gray-100 text-gray-500 text-[11px] rounded hover:bg-[#0096fa]/10 hover:text-[#0096fa] transition-colors cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

      </div>
    </header>
  );
};
