import React, { useState, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, Save, X, RefreshCw, Download, 
  Upload, Sparkles, Image as ImageIcon, Film, FileText, 
  UserPlus, UserCheck, Link as LinkIcon, Trash, AlertTriangle, Check 
} from 'lucide-react';
import { Work, Creator, CreatorLink, WorkType, PlatformType } from '../types';

interface AdminPanelProps {
  works: Work[];
  creators: Creator[];
  onAddWork: (work: Omit<Work, 'id' | 'likes' | 'views'>) => void;
  onUpdateWork: (work: Work) => void;
  onDeleteWork: (workId: string) => void;
  onAddCreator: (creator: Omit<Creator, 'id'>) => void;
  onUpdateCreator: (creator: Creator) => void;
  onDeleteCreator: (creatorId: string) => void;
  onImportDatabase: (json: string) => boolean;
  onExportDatabase: () => string;
  onResetDatabase: () => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  works,
  creators,
  onAddWork,
  onUpdateWork,
  onDeleteWork,
  onAddCreator,
  onUpdateCreator,
  onDeleteCreator,
  onImportDatabase,
  onExportDatabase,
  onResetDatabase,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'works' | 'creators' | 'backup'>('works');

  // Work Form State
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [workTitle, setWorkTitle] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [workType, setWorkType] = useState<WorkType>('illustration');
  const [workCreatorId, setWorkCreatorId] = useState('');
  const [workTags, setWorkTags] = useState('');
  const [workCommissionDate, setWorkCommissionDate] = useState('');
  const [workImagesInput, setWorkImagesInput] = useState(''); // comma-separated URLs
  const [workAnimationUrl, setWorkAnimationUrl] = useState('');
  const [workNovelContent, setWorkNovelContent] = useState('');
  const [workUploadedImages, setWorkUploadedImages] = useState<string[]>([]); // base64 uploads

  // Creator Form State
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [isAddingCreator, setIsAddingCreator] = useState(false);
  const [creatorName, setCreatorName] = useState('');
  const [creatorBio, setCreatorBio] = useState('');
  const [creatorAvatar, setCreatorAvatar] = useState('');
  const [creatorBanner, setCreatorBanner] = useState('');
  const [creatorLinks, setCreatorLinks] = useState<Omit<CreatorLink, 'id'>[]>([]);

  // Backup and storage alerts
  const [backupMessage, setBackupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workImageUploadRef = useRef<HTMLInputElement>(null);
  const creatorAvatarUploadRef = useRef<HTMLInputElement>(null);
  const creatorBannerUploadRef = useRef<HTMLInputElement>(null);

  // Load Work for Editing
  const startEditWork = (work: Work) => {
    setEditingWork(work);
    setIsAddingWork(false);
    setWorkTitle(work.title);
    setWorkDescription(work.description);
    setWorkType(work.type);
    setWorkCreatorId(work.creatorId);
    setWorkTags(work.tags.join(', '));
    setWorkCommissionDate(work.commissionDate || '');
    setWorkImagesInput(work.images.filter(img => !img.startsWith('data:')).join(', '));
    setWorkUploadedImages(work.images.filter(img => img.startsWith('data:')));
    setWorkAnimationUrl(work.animationUrl || '');
    setWorkNovelContent(work.novelContent || '');
  };

  // Start Adding Work
  const startAddWork = () => {
    setIsAddingWork(true);
    setEditingWork(null);
    setWorkTitle('');
    setWorkDescription('');
    setWorkType('illustration');
    setWorkCreatorId(creators[0]?.id || '');
    setWorkTags('');
    setWorkCommissionDate(new Date().toISOString().substring(0, 7)); // YYYY-MM
    setWorkImagesInput('');
    setWorkUploadedImages([]);
    setWorkAnimationUrl('');
    setWorkNovelContent('');
  };

  const handleSaveWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workTitle.trim()) return alert('請輸入作品標題！');
    if (!workCreatorId) return alert('請先建立並選擇創作者！');

    // Combine pasted URL images and base64 uploaded images
    const rawUrls = workImagesInput.split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    const combinedImages = [...rawUrls, ...workUploadedImages];

    if (workType !== 'novel' && combinedImages.length === 0 && !workAnimationUrl) {
      return alert('插畫或動圖必須提供至少一張圖片/動態網址！');
    }

    const tagsArray = workTags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const workData = {
      title: workTitle.trim(),
      description: workDescription.trim(),
      type: workType,
      creatorId: workCreatorId,
      tags: tagsArray,
      commissionDate: workCommissionDate,
      images: combinedImages,
      animationUrl: workType === 'animation' ? workAnimationUrl.trim() : undefined,
      novelContent: workType === 'novel' ? workNovelContent : undefined,
      createdAt: editingWork ? editingWork.createdAt : new Date().toISOString(),
    };

    if (editingWork) {
      onUpdateWork({
        ...editingWork,
        ...workData,
        likes: editingWork.likes,
        views: editingWork.views,
      });
      setEditingWork(null);
    } else {
      onAddWork(workData);
      setIsAddingWork(false);
    }
  };

  // Base64 File Loader Helper
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'work' | 'avatar' | 'banner') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      // Check file size (recommend < 1MB for localStorage ease)
      if (file.size > 2 * 1024 * 1024) {
        alert(`檔案「${file.name}」大於 2MB。為節省空間防止滿額，建議使用壓縮過的圖檔，或黏貼雲端圖片網址！`);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (target === 'work') {
          setWorkUploadedImages(prev => [...prev, base64]);
        } else if (target === 'avatar') {
          setCreatorAvatar(base64);
        } else if (target === 'banner') {
          setCreatorBanner(base64);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Load Creator for Editing
  const startEditCreator = (creator: Creator) => {
    setEditingCreator(creator);
    setIsAddingCreator(false);
    setCreatorName(creator.name);
    setCreatorBio(creator.bio);
    setCreatorAvatar(creator.avatar);
    setCreatorBanner(creator.banner);
    setCreatorLinks(creator.links.map(l => ({ platform: l.platform, label: l.label, url: l.url })));
  };

  // Start Adding Creator
  const startAddCreator = () => {
    setIsAddingCreator(true);
    setEditingCreator(null);
    setCreatorName('');
    setCreatorBio('');
    setCreatorAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80');
    setCreatorBanner('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop&q=80');
    setCreatorLinks([
      { platform: 'twitter', label: '', url: '' }
    ]);
  };

  const handleSaveCreator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorName.trim()) return alert('請輸入創作者名稱！');

    const validLinks = creatorLinks
      .filter(link => link.url.trim() !== '')
      .map((link, idx) => ({
        id: `link_${Date.now()}_${idx}`,
        ...link,
        label: link.label.trim() || link.platform
      }));

    const creatorData = {
      name: creatorName.trim(),
      bio: creatorBio.trim(),
      avatar: creatorAvatar.trim(),
      banner: creatorBanner.trim(),
      links: validLinks
    };

    if (editingCreator) {
      onUpdateCreator({
        ...editingCreator,
        ...creatorData
      });
      setEditingCreator(null);
    } else {
      onAddCreator(creatorData);
      setIsAddingCreator(false);
    }
  };

  const handleAddLinkRow = () => {
    setCreatorLinks(prev => [...prev, { platform: 'twitter', label: '', url: '' }]);
  };

  const handleRemoveLinkRow = (idx: number) => {
    setCreatorLinks(prev => prev.filter((_, i) => i !== idx));
  };

  const handleLinkChange = (idx: number, field: 'platform' | 'label' | 'url', value: string) => {
    setCreatorLinks(prev => prev.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Database actions
  const handleExport = () => {
    const jsonString = onExportDatabase();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixiv_gallery_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBackupMessage({ type: 'success', text: '資料庫已成功打包下載！' });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = onImportDatabase(content);
      if (success) {
        setBackupMessage({ type: 'success', text: '資料庫匯入成功！頁面即將重新整理。' });
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setBackupMessage({ type: 'error', text: '匯入失敗，請確認是否為正確的 JSON 備份檔案。' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6" id="admin-panel-container">
      {/* Header section */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
        <div>
          <h2 className="font-sans font-black text-xl md:text-2xl text-gray-900 tracking-tight flex items-center gap-2">
            <span>後台管理系統</span>
            <span className="text-xs bg-[#0096fa]/10 text-[#0096fa] font-bold px-2 py-0.5 rounded-full select-none">
              投稿與設定
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">在這裡，您可以自由編輯委託人資料、作品，以及備份您的所有收藏檔案。</p>
        </div>
        
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
          title="關閉後台"
        >
          <X size={20} />
        </button>
      </div>

      {/* Grid: Left Column Nav Tabs / Right Column main work area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Tabs Nav Column */}
        <div className="md:col-span-3 flex flex-row md:flex-col gap-1.5 bg-gray-50 p-2 rounded-xl border border-gray-150 overflow-x-auto shrink-0 select-none">
          <button
            onClick={() => { setActiveTab('works'); setIsAddingWork(false); setEditingWork(null); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all w-full text-left whitespace-nowrap ${
              activeTab === 'works' 
                ? 'bg-[#0096fa] text-white shadow-xs' 
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            <ImageIcon size={16} />
            <span>作品管理 ({works.length})</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('creators'); setIsAddingCreator(false); setEditingCreator(null); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all w-full text-left whitespace-nowrap ${
              activeTab === 'creators' 
                ? 'bg-[#0096fa] text-white shadow-xs' 
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            <UserCheck size={16} />
            <span>作者管理 ({creators.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all w-full text-left whitespace-nowrap ${
              activeTab === 'backup' 
                ? 'bg-[#0096fa] text-white shadow-xs' 
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            <Download size={16} />
            <span>資料備份與還原</span>
          </button>
        </div>

        {/* Right Active Panel View Column */}
        <div className="md:col-span-9" id="admin-main-stage">
          
          {/* ========================================================= */}
          {/* 1. WORKS MANAGEMENT TAB                                  */}
          {/* ========================================================= */}
          {activeTab === 'works' && (
            <div className="flex flex-col gap-6">
              
              {/* Form edit/creation state */}
              {(isAddingWork || editingWork) ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-7 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                    <h3 className="font-bold text-gray-900 text-base">
                      {editingWork ? `編輯作品：「${editingWork.title}」` : '新增委託投稿'}
                    </h3>
                    <button
                      onClick={() => { setIsAddingWork(false); setEditingWork(null); }}
                      className="text-gray-400 hover:text-gray-700 text-xs font-semibold px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      取消編輯
                    </button>
                  </div>

                  {/* Form fields */}
                  <form onSubmit={handleSaveWork} className="flex flex-col gap-5">
                    
                    {/* Basic Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">作品名稱 (必填)</label>
                        <input
                          type="text"
                          placeholder="例如：櫻花下的祈願"
                          className="w-full px-3.5 py-2 border border-gray-200 focus:border-[#0096fa] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0096fa]"
                          value={workTitle}
                          onChange={(e) => setWorkTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">委託創作者 (必選)</label>
                        <select
                          className="w-full px-3.5 py-2 border border-gray-200 focus:border-[#0096fa] rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0096fa] bg-white"
                          value={workCreatorId}
                          onChange={(e) => setWorkCreatorId(e.target.value)}
                          required
                        >
                          <option value="">-- 請選擇創作者 --</option>
                          {creators.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        {creators.length === 0 && (
                          <span className="text-[10px] text-rose-500 mt-1 block">提示：目前無創作者，請先去「作者管理」中建立！</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">投稿作品分類</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setWorkType('illustration')}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                              workType === 'illustration' 
                                ? 'bg-[#0096fa]/10 border-[#0096fa] text-[#0096fa]' 
                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            <ImageIcon size={14} />
                            <span>插畫 / 圖</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setWorkType('animation')}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                              workType === 'animation' 
                                ? 'bg-[#0096fa]/10 border-[#0096fa] text-[#0096fa]' 
                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            <Film size={14} />
                            <span>動圖 / 動畫</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setWorkType('novel')}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                              workType === 'novel' 
                                ? 'bg-emerald-50 border-emerald-500/30 text-emerald-600' 
                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            <FileText size={14} />
                            <span>小說 / 文</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">委託取得年月</label>
                        <input
                          type="month"
                          className="w-full px-3.5 py-2 border border-gray-200 focus:border-[#0096fa] rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0096fa]"
                          value={workCommissionDate}
                          onChange={(e) => setWorkCommissionDate(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Tag list */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">作品標籤 (英文/中文，以半形逗號分隔)</label>
                      <input
                        type="text"
                        placeholder="例如：原創, 櫻花, 神社, 背景神作"
                        className="w-full px-3.5 py-2 border border-gray-200 focus:border-[#0096fa] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0096fa]"
                        value={workTags}
                        onChange={(e) => setWorkTags(e.target.value)}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">作品描述 / 委託備忘錄</label>
                      <textarea
                        rows={3}
                        placeholder="寫下關於這件委託案的心得、靈感、背景，或是與繪師的合作過程..."
                        className="w-full p-3.5 border border-gray-200 focus:border-[#0096fa] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0096fa] resize-none"
                        value={workDescription}
                        onChange={(e) => setWorkDescription(e.target.value)}
                      />
                    </div>

                    {/* Conditional inputs based on workType */}
                    {workType === 'novel' ? (
                      <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-500/20">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-bold text-emerald-700">小說內文正文 (支持換行排版)</label>
                          <span className="text-[10px] text-emerald-600 font-mono">
                            當前字數：{(workNovelContent || '').length} 字
                          </span>
                        </div>
                        <textarea
                          rows={12}
                          placeholder="請將小說本文黏貼於此..."
                          className="w-full p-4 border border-emerald-200 focus:border-emerald-500 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed bg-white"
                          value={workNovelContent}
                          onChange={(e) => setWorkNovelContent(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col gap-4">
                        <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                          <ImageIcon size={14} className="text-[#0096fa]" />
                          <span>媒體檔案輸入 (圖/動圖)</span>
                        </span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Option A: Input URLs */}
                          <div className="flex flex-col gap-2">
                            <label className="block text-[11px] text-gray-500 font-medium">1. 黏貼外鏈圖片網址 (多張以英文逗號分隔)</label>
                            <textarea
                              rows={2}
                              placeholder="https://example.com/art1.jpg, https://example.com/art2.jpg"
                              className="w-full p-2.5 border border-gray-200 focus:border-[#0096fa] rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0096fa] font-mono bg-white"
                              value={workImagesInput}
                              onChange={(e) => setWorkImagesInput(e.target.value)}
                            />
                            <span className="text-[10px] text-gray-400">推薦：使用 Imgur / Discord 連結，不佔用本機瀏覽器容量額度。</span>
                          </div>

                          {/* Option B: Upload File Base64 */}
                          <div className="flex flex-col gap-2">
                            <label className="block text-[11px] text-gray-500 font-medium">2. 上傳本機作品圖檔 (自動壓縮為 Base64 格式)</label>
                            <div 
                              onClick={() => workImageUploadRef.current?.click()}
                              className="border-2 border-dashed border-gray-300 hover:border-[#0096fa] bg-white rounded-lg p-3 text-center cursor-pointer hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center gap-1"
                            >
                              <Upload size={18} className="text-gray-400 group-hover:text-[#0096fa]" />
                              <span className="text-xs text-gray-600 font-semibold">點擊或拖曳檔案上傳</span>
                              <span className="text-[9px] text-gray-400">支援 .jpg, .png, .webp (單一限 2MB)</span>
                            </div>
                            <input
                              type="file"
                              ref={workImageUploadRef}
                              className="hidden"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleImageFileChange(e, 'work')}
                            />
                          </div>
                        </div>

                        {/* Display uploaded local files preview */}
                        {workUploadedImages.length > 0 && (
                          <div className="mt-2">
                            <span className="text-[11px] font-bold text-gray-500 block mb-1.5">已上傳之本地圖檔 ({workUploadedImages.length}):</span>
                            <div className="flex flex-wrap gap-2">
                              {workUploadedImages.map((b64, index) => (
                                <div key={index} className="relative w-14 h-14 rounded-md overflow-hidden border border-gray-200 group">
                                  <img src={b64} alt="Uploaded preview" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setWorkUploadedImages(prev => prev.filter((_, i) => i !== index))}
                                    className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    title="刪除"
                                  >
                                    <Trash size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Special input for GIF animation URL if type is animation */}
                        {workType === 'animation' && (
                          <div className="mt-2 border-t border-gray-150 pt-3">
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">動畫 / GIF 專用動態網址</label>
                            <input
                              type="text"
                              placeholder="https://media.giphy.com/.../giphy.gif"
                              className="w-full px-3.5 py-2 border border-gray-200 focus:border-[#0096fa] rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0096fa] font-mono bg-white"
                              value={workAnimationUrl}
                              onChange={(e) => setWorkAnimationUrl(e.target.value)}
                            />
                            <span className="text-[10px] text-gray-400 block mt-1">若投稿為動圖，請填寫 GIF 動態圖片直連。</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action controls */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                      <button
                        type="button"
                        onClick={() => { setIsAddingWork(false); setEditingWork(null); }}
                        className="px-5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 text-sm font-semibold rounded-full transition-colors cursor-pointer"
                      >
                        放棄
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#0096fa] hover:bg-[#007cd1] text-white text-sm font-bold rounded-full flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Save size={16} />
                        <span>儲存投遞</span>
                      </button>
                    </div>

                  </form>
                </div>
              ) : (
                // View works table/list
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6 flex-wrap gap-4 select-none">
                    <h3 className="font-bold text-gray-900 text-sm">已投稿的作品檔案列表</h3>
                    
                    <button
                      onClick={startAddWork}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>投稿新作品</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold select-none">
                          <th className="py-3 px-2">縮圖</th>
                          <th className="py-3 px-4">作品名稱</th>
                          <th className="py-3 px-4">類型</th>
                          <th className="py-3 px-4">作者</th>
                          <th className="py-3 px-4">取得年月</th>
                          <th className="py-3 px-4 text-center">操作項目</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {works.map((work) => {
                          const workCreator = creators.find(c => c.id === work.creatorId);
                          return (
                            <tr key={work.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-3.5 px-2">
                                <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 border border-gray-150">
                                  {work.type === 'novel' ? (
                                    <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold select-none">
                                      文
                                    </div>
                                  ) : (
                                    <img
                                      src={work.animationUrl || work.images[0]}
                                      alt="Cover"
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-bold text-gray-800 max-w-[200px] truncate">{work.title}</td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  work.type === 'illustration' 
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                                    : work.type === 'animation' 
                                    ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                }`}>
                                  {work.type === 'illustration' ? '插畫' : work.type === 'animation' ? '動圖' : '小說'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-gray-500 font-medium">{workCreator?.name || '未知作者'}</td>
                              <td className="py-3.5 px-4 font-mono text-gray-400 font-medium">{work.commissionDate || '—'}</td>
                              <td className="py-3.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => startEditWork(work)}
                                    className="p-1.5 text-gray-500 hover:text-[#0096fa] hover:bg-blue-50 rounded transition-all cursor-pointer"
                                    title="編輯"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`確定要刪除「${work.title}」這份委託成品嗎？數據將無法復原。`)) {
                                        onDeleteWork(work.id);
                                      }
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-all cursor-pointer"
                                    title="刪除"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                        {works.length === 0 && (
                          <tr className="select-none">
                            <td colSpan={6} className="py-8 text-center text-gray-400 italic">
                              尚無任何投稿作品，點擊右上角新增吧！
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* 2. CREATORS MANAGEMENT TAB                               */}
          {/* ========================================================= */}
          {activeTab === 'creators' && (
            <div className="flex flex-col gap-6">
              
              {(isAddingCreator || editingCreator) ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-7 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                    <h3 className="font-bold text-gray-900 text-base">
                      {editingCreator ? `編輯創作者：「${editingCreator.name}」` : '新增委託創作者'}
                    </h3>
                    <button
                      onClick={() => { setIsAddingCreator(false); setEditingCreator(null); }}
                      className="text-gray-400 hover:text-gray-700 text-xs font-semibold px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      取消編輯
                    </button>
                  </div>

                  <form onSubmit={handleSaveCreator} className="flex flex-col gap-5">
                    {/* Basic info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">創作者 / 畫師名稱 (必填)</label>
                        <input
                          type="text"
                          placeholder="例如：星野 紡"
                          className="w-full px-3.5 py-2 border border-gray-200 focus:border-[#0096fa] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0096fa]"
                          value={creatorName}
                          onChange={(e) => setCreatorName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">創作者簡介 / 接單及聯絡指引</label>
                      <textarea
                        rows={3}
                        placeholder="描述該創作者擅長的畫風、約稿報價、聯絡偏好或社群主頁簡述..."
                        className="w-full p-3.5 border border-gray-200 focus:border-[#0096fa] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0096fa] resize-none"
                        value={creatorBio}
                        onChange={(e) => setCreatorBio(e.target.value)}
                      />
                    </div>

                    {/* Images URLs & upload */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col gap-4">
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <UserPlus size={14} className="text-[#0096fa]" />
                        <span>頭像與橫幅設定 (Avatar & Banner)</span>
                      </span>

                      {/* Avatar config */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="block text-[11px] text-gray-500 font-medium">創作者頭像 (Avatar URL)</label>
                          <input
                            type="text"
                            placeholder="貼上頭像圖片 URL..."
                            className="w-full px-3 py-1.5 border border-gray-200 focus:border-[#0096fa] rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0096fa] font-mono bg-white"
                            value={creatorAvatar}
                            onChange={(e) => setCreatorAvatar(e.target.value)}
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => creatorAvatarUploadRef.current?.click()}
                              className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-600 text-[10px] font-bold border border-gray-200 rounded cursor-pointer"
                            >
                              上傳頭像檔案
                            </button>
                            <input
                              type="file"
                              ref={creatorAvatarUploadRef}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageFileChange(e, 'avatar')}
                            />
                            {creatorAvatar.startsWith('data:') && (
                              <span className="text-[10px] text-emerald-600 font-bold">✓ 已轉 Base64</span>
                            )}
                          </div>
                        </div>

                        {/* Banner config */}
                        <div className="flex flex-col gap-2">
                          <label className="block text-[11px] text-gray-500 font-medium">個人首頁橫幅 (Banner URL)</label>
                          <input
                            type="text"
                            placeholder="貼上背景橫幅圖片 URL..."
                            className="w-full px-3 py-1.5 border border-gray-200 focus:border-[#0096fa] rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0096fa] font-mono bg-white"
                            value={creatorBanner}
                            onChange={(e) => setCreatorBanner(e.target.value)}
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => creatorBannerUploadRef.current?.click()}
                              className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-600 text-[10px] font-bold border border-gray-200 rounded cursor-pointer"
                            >
                              上傳橫幅檔案
                            </button>
                            <input
                              type="file"
                              ref={creatorBannerUploadRef}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageFileChange(e, 'banner')}
                            />
                            {creatorBanner.startsWith('data:') && (
                              <span className="text-[10px] text-emerald-600 font-bold">✓ 已轉 Base64</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social links row manager */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-3 select-none">
                        <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                          <LinkIcon size={14} className="text-[#0096fa]" />
                          <span>聯絡管道與社交連結設定</span>
                        </span>
                        
                        <button
                          type="button"
                          onClick={handleAddLinkRow}
                          className="px-2.5 py-1 bg-white hover:bg-gray-100 text-[#0096fa] font-bold text-[10px] border border-gray-200 rounded flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus size={10} />
                          新增聯絡管道
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                        {creatorLinks.map((link, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            {/* Platform */}
                            <select
                              className="px-2 py-1.5 border border-gray-200 focus:border-[#0096fa] rounded-lg text-xs text-gray-800 bg-white"
                              value={link.platform}
                              onChange={(e) => handleLinkChange(index, 'platform', e.target.value)}
                            >
                              <option value="twitter">X (Twitter)</option>
                              <option value="pixiv">Pixiv</option>
                              <option value="plurk">Plurk 噗浪</option>
                              <option value="email">Email</option>
                              <option value="website">個人網站</option>
                              <option value="other">其他</option>
                            </select>

                            {/* Label */}
                            <input
                              type="text"
                              placeholder="連結名稱 (例: 星野小鋪)"
                              className="flex-1 px-3 py-1.5 border border-gray-200 focus:border-[#0096fa] rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
                              value={link.label}
                              onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                            />

                            {/* URL */}
                            <input
                              type="text"
                              placeholder="完整網址連結 (或電子郵件)"
                              className="flex-1 px-3 py-1.5 border border-gray-200 focus:border-[#0096fa] rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none font-mono"
                              value={link.url}
                              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                            />

                            {/* Delete row */}
                            <button
                              type="button"
                              onClick={() => handleRemoveLinkRow(index)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="移除此行"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        ))}

                        {creatorLinks.length === 0 && (
                          <span className="text-xs text-gray-400 italic py-2 text-center select-none">尚未加入任何聯絡連結，可點擊上方新增。</span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                      <button
                        type="button"
                        onClick={() => { setIsAddingCreator(false); setEditingCreator(null); }}
                        className="px-5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 text-sm font-semibold rounded-full transition-colors cursor-pointer"
                      >
                        放棄
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#0096fa] hover:bg-[#007cd1] text-white text-sm font-bold rounded-full flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Save size={16} />
                        <span>儲存創作者</span>
                      </button>
                    </div>

                  </form>
                </div>
              ) : (
                // View creators list
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6 flex-wrap gap-4 select-none">
                    <h3 className="font-bold text-gray-900 text-sm">已登錄的創作者名錄</h3>
                    
                    <button
                      onClick={startAddCreator}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>新增合作作者</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {creators.map((creator) => {
                      const cWorksCount = works.filter(w => w.creatorId === creator.id).length;
                      return (
                        <div key={creator.id} className="border border-gray-150 p-4 rounded-xl flex items-center justify-between bg-gray-50/20 hover:bg-gray-50 transition-all">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <img
                              src={creator.avatar}
                              alt={creator.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                            <div className="overflow-hidden">
                              <h4 className="font-bold text-gray-800 text-xs truncate">{creator.name}</h4>
                              <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">作品收錄數量：{cWorksCount} 份</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => startEditCreator(creator)}
                              className="p-1.5 text-gray-500 hover:text-[#0096fa] hover:bg-blue-50 rounded transition-all cursor-pointer"
                              title="編輯"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (cWorksCount > 0) {
                                  return alert(`此作者尚綁定有 ${cWorksCount} 件作品，請先將其作品轉移或刪除，方可註銷此作者！`);
                                }
                                if (confirm(`確定要註銷創作者「${creator.name}」嗎？這會清除其所有的聯絡資訊與簡介。`)) {
                                  onDeleteCreator(creator.id);
                                }
                              }}
                              className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-all cursor-pointer"
                              title="刪除"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {creators.length === 0 && (
                      <div className="col-span-2 text-center py-6 text-gray-400 italic select-none">
                        目前名錄為空。
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* 3. BACKUP & RESTORE TAB                                   */}
          {/* ========================================================= */}
          {activeTab === 'backup' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
              
              <div>
                <h3 className="font-bold text-gray-900 text-base">資料庫備份與安全維護</h3>
                <p className="text-xs text-gray-400 mt-1">本系統完全運行在您本機瀏覽器中。為了保障委託資料及點評安全，強烈建議定期匯出備份檔案。</p>
              </div>

              {backupMessage && (
                <div className={`p-4 rounded-xl text-xs flex items-center gap-2 font-medium ${
                  backupMessage.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  <Check size={16} />
                  <span>{backupMessage.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Block */}
                <div className="border border-gray-200 p-5 rounded-2xl bg-gray-50/20 flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1 mb-2 select-none">
                      <Download size={16} className="text-[#0096fa]" />
                      <span>1. 匯出完整作品庫</span>
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      這會將您目前擁有的所有 <b>插畫作品、文字本文、動圖設定、創作者名錄及留言點評</b> 統整成一個專用 <b>.json</b> 檔案下載到電腦中儲存。
                    </p>
                  </div>

                  <button
                    onClick={handleExport}
                    className="w-full py-2.5 bg-[#0096fa] hover:bg-[#007cd1] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Download size={14} />
                    <span>打包下載備份 JSON 檔</span>
                  </button>
                </div>

                {/* Import Block */}
                <div className="border border-gray-200 p-5 rounded-2xl bg-gray-50/20 flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1 mb-2 select-none">
                      <Upload size={16} className="text-emerald-600" />
                      <span>2. 匯入還原備份</span>
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      選擇先前在本網站下載的備份 <b>JSON 檔案</b> 進行載入。<b>注意：這將會覆寫當前本機瀏覽器的所有現有作品資料！</b>
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Upload size={14} />
                      <span>上傳還原 JSON 檔</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".json"
                      onChange={handleImportFile}
                    />
                  </div>
                </div>
              </div>

              {/* Danger Zone: Reset database */}
              <div className="border border-rose-200 rounded-2xl p-5 mt-4 bg-rose-50/10">
                <h4 className="font-bold text-rose-600 text-sm flex items-center gap-1.5 mb-2 select-none">
                  <AlertTriangle size={16} />
                  <span>危險區域：重設資料庫</span>
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  如果想要清空所有自訂內容，或是想要重新載入系統提供的預設精美插畫、小說、動圖範例，可以執行重設。執行此動作將清空所有未備份的資料！
                </p>
                
                <button
                  onClick={() => {
                    if (confirm('警告！您確定要清除現有的所有委託記錄與設定，並重新載入原廠預設的精美範例作品嗎？')) {
                      onResetDatabase();
                      setBackupMessage({ type: 'success', text: '已重設作品集至出廠設定！頁面即將重新整理。' });
                      setTimeout(() => window.location.reload(), 1000);
                    }
                  }}
                  className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  清除所有資料，重設並載入範例作品
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
