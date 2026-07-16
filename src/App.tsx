import React, { useState, useEffect } from 'react';
import { 
  Heart, Users, Image as ImageIcon, Film, FileText, 
  Settings, AlertCircle, PlusCircle, Sparkles, Star 
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { WorkGrid } from './components/WorkGrid';
import { WorkDetail } from './components/WorkDetail';
import { CreatorProfile } from './components/CreatorProfile';
import { AdminPanel } from './components/AdminPanel';
import { Work, Creator, WorkComment, WorkType } from './types';
import { 
  getInitialData, saveWorks, saveCreators, saveComments, 
  resetDatabase, exportDatabase, importDatabase 
} from './lib/storage';

interface ViewState {
  tab: 'home' | 'creators' | 'detail' | 'creator_profile' | 'admin';
  workId?: string;
  creatorId?: string;
}

export default function App() {
  // Database States
  const [works, setWorks] = useState<Work[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [comments, setComments] = useState<Record<string, WorkComment[]>>({});

  // View & Navigation Stack
  const [viewStack, setViewStack] = useState<ViewState[]>([{ tab: 'home' }]);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<WorkType | 'all'>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Initialize data on load
  useEffect(() => {
    const { works: initWorks, creators: initCreators, comments: initComments } = getInitialData();
    setWorks(initWorks);
    setCreators(initCreators);
    setComments(initComments);
  }, []);

  const currentView = viewStack[viewStack.length - 1] || { tab: 'home' };

  // Helper to push onto navigation stack
  const navigateTo = (tab: ViewState['tab'], workId?: string, creatorId?: string) => {
    setViewStack((prev) => [...prev, { tab, workId, creatorId }]);
  };

  // Helper to pop from navigation stack
  const navigateBack = () => {
    setViewStack((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  // Reset to first page
  const navigateToHome = () => {
    setViewStack([{ tab: 'home' }]);
  };

  // Database mutations
  const handleAddWork = (newWorkData: Omit<Work, 'id' | 'likes' | 'views'>) => {
    const newWork: Work = {
      ...newWorkData,
      id: `work_${Date.now()}`,
      likes: 0,
      views: 0,
    };
    const updated = [newWork, ...works];
    setWorks(updated);
    saveWorks(updated);
  };

  const handleUpdateWork = (updatedWork: Work) => {
    const updated = works.map((w) => (w.id === updatedWork.id ? updatedWork : w));
    setWorks(updated);
    saveWorks(updated);
  };

  const handleDeleteWork = (workId: string) => {
    const updated = works.filter((w) => w.id !== workId);
    setWorks(updated);
    saveWorks(updated);
    
    // Clean comments
    const updatedComments = { ...comments };
    delete updatedComments[workId];
    setComments(updatedComments);
    saveComments(updatedComments);

    // If deleting currently viewed work, go back
    if (currentView.tab === 'detail' && currentView.workId === workId) {
      navigateBack();
    }
  };

  const handleAddCreator = (newCreatorData: Omit<Creator, 'id'>) => {
    const newCreator: Creator = {
      ...newCreatorData,
      id: `creator_${Date.now()}`,
    };
    const updated = [...creators, newCreator];
    setCreators(updated);
    saveCreators(updated);
  };

  const handleUpdateCreator = (updatedCreator: Creator) => {
    const updated = creators.map((c) => (c.id === updatedCreator.id ? updatedCreator : c));
    setCreators(updated);
    saveCreators(updated);
  };

  const handleDeleteCreator = (creatorId: string) => {
    const updated = creators.filter((c) => c.id !== creatorId);
    setCreators(updated);
    saveCreators(updated);
    
    // If deleting currently viewed creator, go back
    if (currentView.tab === 'creator_profile' && currentView.creatorId === creatorId) {
      navigateBack();
    }
  };

  const handleAddComment = (workId: string, content: string, name: string) => {
    const newComment: WorkComment = {
      id: `comment_${Date.now()}`,
      workId,
      authorName: name || '訪客委託愛好者',
      authorAvatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=85`,
      content,
      createdAt: new Date().toISOString(),
    };

    const workComments = comments[workId] || [];
    const updatedComments = {
      ...comments,
      [workId]: [...workComments, newComment],
    };
    setComments(updatedComments);
    saveComments(updatedComments);
  };

  const handleToggleBookmark = (workId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const updated = works.map((w) => {
      if (w.id === workId) {
        const isBookmarked = !w.isBookmarked;
        return {
          ...w,
          isBookmarked,
          likes: isBookmarked ? w.likes + 1 : Math.max(0, w.likes - 1),
        };
      }
      return w;
    });
    setWorks(updated);
    saveWorks(updated);
  };

  // Restore defaults
  const handleResetDatabase = () => {
    const { works: resetW, creators: resetC, comments: resetComm } = resetDatabase();
    setWorks(resetW);
    setCreators(resetC);
    setComments(resetComm);
    navigateToHome();
  };

  // Filtering Logic
  const getFilteredWorks = () => {
    return works.filter((work) => {
      // 1. Filter by bookmarks
      if (onlyBookmarked && !work.isBookmarked) {
        return false;
      }

      // 2. Filter by type
      if (selectedType !== 'all' && work.type !== selectedType) {
        return false;
      }

      // 3. Filter by search query
      if (searchQuery) {
        const query = searchQuery.trim();
        const creator = creators.find((c) => c.id === work.creatorId);
        
        // Tag exact query style e.g., "#櫻花" or "#賽博"
        if (query.startsWith('#')) {
          const cleanTag = query.substring(1);
          return work.tags.some((tag) => tag.toLowerCase() === cleanTag.toLowerCase());
        }

        const normQuery = query.toLowerCase();
        const matchesTitle = work.title.toLowerCase().includes(normQuery);
        const matchesDesc = work.description.toLowerCase().includes(normQuery);
        const matchesCreator = creator ? creator.name.toLowerCase().includes(normQuery) : false;
        const matchesTags = work.tags.some((t) => t.toLowerCase().includes(normQuery));

        return matchesTitle || matchesDesc || matchesCreator || matchesTags;
      }

      return true;
    });
  };

  const filteredWorks = getFilteredWorks();
  const activeWork = works.find((w) => w.id === currentView.workId);
  const activeCreator = creators.find((c) => c.id === currentView.creatorId);

  // Quick stats calculations for visual counters
  const totalIllustsCount = works.filter((w) => w.type === 'illustration').length;
  const totalAnimsCount = works.filter((w) => w.type === 'animation').length;
  const totalNovelsCount = works.filter((w) => w.type === 'novel').length;
  const totalBookmarksCount = works.filter((w) => w.isBookmarked).length;

  return (
    <div className="min-h-screen bg-[#f2f4f6] flex flex-col font-sans" id="gallery-app-root">
      
      {/* Pixiv-style Header Navbar */}
      <Navbar
        currentTab={currentView.tab}
        setCurrentTab={(tab) => {
          if (tab === 'home') navigateToHome();
          else navigateTo(tab as any);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        onlyBookmarked={onlyBookmarked}
        setOnlyBookmarked={setOnlyBookmarked}
        onOpenAdmin={() => navigateTo('admin')}
      />

      {/* Main Content Stage */}
      <main className="flex-1 w-full" id="main-content">
        
        {/* VIEW 1: HOME GRID */}
        {currentView.tab === 'home' && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6" id="home-view">
            
            {/* Gallery Stats Banner / Mini Dashboard */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs select-none">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#0096fa]/10 rounded-full text-[#0096fa] animate-pulse">
                  <Star size={20} fill="currentColor" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-sm tracking-tight">我的個人委託典藏檔案庫</h2>
                  <p className="text-xs text-gray-400 mt-0.5">模擬 Pixiv 介面，典藏收納了我所委託到的所有精美插畫、動圖與輕小說。</p>
                </div>
              </div>

              {/* Counts metrics list */}
              <div className="flex flex-wrap items-center gap-3 md:gap-5 text-xs text-gray-500 font-medium shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-150 rounded-lg">
                  <ImageIcon size={14} className="text-[#0096fa]" />
                  <span>插畫：<b>{totalIllustsCount}</b> 件</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-150 rounded-lg">
                  <Film size={14} className="text-purple-600" />
                  <span>動圖：<b>{totalAnimsCount}</b> 件</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-150 rounded-lg">
                  <FileText size={14} className="text-emerald-600" />
                  <span>小說：<b>{totalNovelsCount}</b> 件</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg">
                  <Heart size={14} fill="currentColor" />
                  <span>已收藏：<b>{totalBookmarksCount}</b></span>
                </div>
              </div>
            </div>

            {/* Sub-header title with active filters */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4 select-none">
              <h3 className="font-sans font-black text-gray-900 text-base tracking-tight flex items-center gap-2">
                <span>
                  {onlyBookmarked 
                    ? '我收藏的委託成品' 
                    : selectedType === 'illustration' 
                    ? '收錄插畫作品' 
                    : selectedType === 'animation' 
                    ? '收錄動圖作品' 
                    : selectedType === 'novel' 
                    ? '收錄小說創作' 
                    : '全部委託成品'}
                </span>
                <span className="text-xs bg-gray-200 text-gray-500 font-bold px-2 py-0.5 rounded-full">
                  {filteredWorks.length}
                </span>
              </h3>

              {searchQuery && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>搜尋「{searchQuery}」的結果</span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-[#0096fa] hover:underline font-bold"
                  >
                    清除
                  </button>
                </div>
              )}
            </div>

            {/* Works Card Grid */}
            <WorkGrid
              works={filteredWorks}
              creators={creators}
              onSelectWork={(work) => navigateTo('detail', work.id)}
              onSelectCreator={(creatorId) => navigateTo('creator_profile', undefined, creatorId)}
              onToggleBookmark={handleToggleBookmark}
              onResetData={handleResetDatabase}
            />
          </div>
        )}

        {/* VIEW 2: CREATORS DIRECTORY */}
        {currentView.tab === 'creators' && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6" id="creators-view">
            <div className="pb-3 border-b border-gray-200 mb-6 select-none">
              <h3 className="font-sans font-black text-gray-900 text-lg tracking-tight">
                合作畫師 / 委託作者名錄 ({creators.length})
              </h3>
              <p className="text-xs text-gray-500 mt-1">列出所有承接並創作過您委託作品的優秀創作者，點擊可進入專屬作品展示頁。</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator) => {
                const cWorks = works.filter((w) => w.creatorId === creator.id);
                return (
                  <div
                    key={creator.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Banner mini */}
                    <div className="h-20 bg-gray-100 relative select-none">
                      <img
                        src={creator.banner}
                        alt="Banner"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/25" />
                    </div>

                    {/* Avatar and bio offset */}
                    <div className="p-5 flex-1 flex flex-col gap-3 relative -mt-8">
                      <div className="flex items-end gap-3 z-10">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-full border-4 border-white shadow-xs object-cover bg-white cursor-pointer"
                          onClick={() => navigateTo('creator_profile', undefined, creator.id)}
                        />
                        <div className="mb-1 select-text">
                          <h4 
                            className="font-bold text-gray-900 text-sm hover:text-[#0096fa] transition-colors cursor-pointer"
                            onClick={() => navigateTo('creator_profile', undefined, creator.id)}
                          >
                            {creator.name}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                            已發表：{cWorks.length} 份成品
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 select-text pt-2">
                        {creator.bio || '尚未填寫簡介說明。'}
                      </p>
                    </div>

                    {/* View portfolio button */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                      <button
                        onClick={() => navigateTo('creator_profile', undefined, creator.id)}
                        className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
                      >
                        進入作者主頁
                      </button>
                    </div>
                  </div>
                );
              })}

              {creators.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white border border-gray-100 rounded-2xl shadow-xs select-none">
                  <AlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">目前作者一覽為空，請到「作品管理與投稿」去新增創作者！</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: WORK DETAIL PAGE */}
        {currentView.tab === 'detail' && activeWork && (
          <WorkDetail
            work={activeWork}
            creators={creators}
            comments={comments[activeWork.id] || []}
            onBack={navigateBack}
            onSelectCreator={(creatorId) => navigateTo('creator_profile', undefined, creatorId)}
            onSelectTag={(tag) => {
              setSearchQuery(`#${tag}`);
              navigateToHome();
            }}
            onToggleBookmark={(workId) => handleToggleBookmark(workId)}
            onAddComment={handleAddComment}
          />
        )}

        {/* VIEW 4: CREATOR PROFILE */}
        {currentView.tab === 'creator_profile' && activeCreator && (
          <CreatorProfile
            creator={activeCreator}
            works={works}
            onSelectWork={(work) => navigateTo('detail', work.id)}
            onBack={navigateBack}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {/* VIEW 5: ADMIN BACK-STAGE PANEL */}
        {currentView.tab === 'admin' && (
          <AdminPanel
            works={works}
            creators={creators}
            onAddWork={handleAddWork}
            onUpdateWork={handleUpdateWork}
            onDeleteWork={handleDeleteWork}
            onAddCreator={handleAddCreator}
            onUpdateCreator={handleUpdateCreator}
            onDeleteCreator={handleDeleteCreator}
            onExportDatabase={exportDatabase}
            onImportDatabase={importDatabase}
            onResetDatabase={handleResetDatabase}
            onClose={navigateBack}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12 text-center text-xs text-gray-400 select-none">
        <p className="font-mono">© 2026 Pixiv Style Personal Commission Gallery. Built with React & Tailwind CSS.</p>
      </footer>

    </div>
  );
}
