import { Creator, Work, WorkComment } from './types';

export const DEFAULT_CREATORS: Creator[] = [
  {
    id: 'creator_1',
    name: '星野 紡 (Hoshino Tsumugi)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop&q=80',
    bio: '專職日系插畫家、概念美術設計。擅長繪製溫暖光影與奇幻美景。接單開放中，委託合作請透過 X (Twitter) 或 Email 聯繫！',
    links: [
      { id: 'l1', platform: 'twitter', label: '@hoshino_tsumugi', url: 'https://twitter.com' },
      { id: 'l2', platform: 'pixiv', label: '星野紡@pixiv', url: 'https://www.pixiv.net' },
      { id: 'l3', platform: 'email', label: 'tsumugi@example.com', url: 'mailto:tsumugi@example.com' },
      { id: 'l4', platform: 'website', label: '個人作品集官網', url: 'https://example.com' }
    ]
  },
  {
    id: 'creator_2',
    name: '霧羽 (Kiriha)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=400&fit=crop&q=80',
    bio: '主攻賽博龐克與極簡科技風插畫、動態 GIF 設計。喜歡在黑夜中鋪陳霓虹色彩。',
    links: [
      { id: 'l5', platform: 'twitter', label: '@kiriha_neon', url: 'https://twitter.com' },
      { id: 'l6', platform: 'plurk', label: '霧羽Plurk', url: 'https://www.plurk.com' },
      { id: 'l7', platform: 'pixiv', label: '霧羽_Kiriha', url: 'https://www.pixiv.net' }
    ]
  },
  {
    id: 'creator_3',
    name: '筆墨留香 (InkWriter)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&h=400&fit=crop&q=80',
    bio: '輕小說作家，熱愛奇幻冒險與日常治癒系創作。委託寫作請來信或私訊。目前專注於為委託人量身打造專屬的文字世界。',
    links: [
      { id: 'l8', platform: 'email', label: 'ink_writer@example.com', url: 'mailto:ink_writer@example.com' },
      { id: 'l9', platform: 'website', label: '角川小說連載頁', url: 'https://example.com' },
      { id: 'l10', platform: 'plurk', label: '筆墨留香噗浪', url: 'https://www.plurk.com' }
    ]
  }
];

export const DEFAULT_WORKS: Work[] = [
  {
    id: 'work_1',
    title: '櫻花紛飛的平行時空',
    description: '2026年春季委託。星野老師繪製的櫻花神社背景，光影與細節都處理得非常精緻，完美呈現了幻想中的春日祭典氣氛。這是這批委託中最喜歡的一張！',
    type: 'illustration',
    creatorId: 'creator_1',
    tags: ['插畫', '原創角色', '櫻花', '神社', '背景神作', '光影表現'],
    createdAt: '2026-04-12T15:30:00Z',
    commissionDate: '2026-04',
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&q=80'
    ],
    likes: 248,
    views: 1250,
    isBookmarked: true
  },
  {
    id: 'work_2',
    title: '賽博霓虹街頭：孤獨旅者',
    description: '委託霧羽老師製作的動態插畫。孤獨的劍客站立在繁華的未來雨夜街頭，霓虹招牌與積水倒影輕微閃爍，非常適合當作動態桌布使用！',
    type: 'animation',
    creatorId: 'creator_2',
    tags: ['動圖', '賽博龐克', '雨夜', '霓虹燈', '動態桌布', '武士'],
    createdAt: '2026-05-18T10:00:00Z',
    commissionDate: '2026-05',
    images: ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&q=80'],
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Zsd24xbHNocmkyc3U2MW1rNDB6bW96c3cyNWVqbnU2Nzhzcm82ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Vdf9C8bK0GvD2/giphy.gif',
    likes: 412,
    views: 1890,
    isBookmarked: true
  },
  {
    id: 'work_3',
    title: '月落之時的約定',
    description: '委託筆墨留香老師創作的治癒系短篇小說。描述在被遺忘的小鎮上，主角與守護精靈在星空下的最後一次對話，情感細膩深沉。',
    type: 'novel',
    creatorId: 'creator_3',
    tags: ['小說', '奇幻', '治癒系', '精靈', '短篇故事', '星空'],
    createdAt: '2026-06-05T08:15:00Z',
    commissionDate: '2026-06',
    images: [],
    novelContent: `第一章：銀月與流星

小鎮的邊緣有一座廢棄的風車，每到夏末，這裡的夜空就會變得無比清澈。

阿爾特獨自坐在風車乾癟的木質看台上，雙腿懸空，輕輕地晃盪著。夜晚的風有些涼意，吹散了他額前的碎髮，也吹得下方麥田發出如浪潮般的沙沙聲。

「你又在發呆了，阿爾特。」

一個空靈的聲音從他耳畔響起。隨之而來的，是一抹淡藍色的微光，在夜色中如螢火般飄舞，最終在阿爾特的身旁凝聚成一個嬌小的少女身影。

那是艾莉亞，守護這片森林與廢棄風車的星光精靈。她的身軀半透明，長髮彷彿是由點點碎星編織而成，每走一步，空氣中都會留下一絲淡淡的熒光。

「我只是在想，如果明天天亮時我必須離開，這裡的風車還會繼續轉動嗎？」阿爾特沒有轉頭，他的目光緊緊鎖定在遠方地平線上那顆最亮的星星。

艾莉亞抱膝坐下，將頭靠在自己的膝蓋上，聲音輕柔得像是一場夢境：「風車會累，麥田會枯萎，但約定不會消失。阿爾特，你看過那些流星嗎？它們從極高、極冷的地方墜落，只為了在熱烈的空氣中燃燒一瞬。」

「那一瞬就夠了嗎？」阿爾特低聲問。

「因為在墜落的那一刻，它們看到了整個世界的溫柔。」艾莉亞伸出手指，在空中輕輕劃過。一道亮藍色的軌跡隨著她的動作浮現，化作一朵短暫綻放的星光之花，然後悄然消散。

第二章：最後的歌謠

夜漸漸深了，夜空中的銀月高懸，將兩人的影子拉得極長。

阿爾特從懷裡拿出一支古舊的木笛。這是他來到這個小鎮時唯一的行李。

「再為我吹奏一次那首曲子吧，」艾莉亞轉過頭，亮晶晶的眼眸中倒映著阿爾特落寞的臉龐，「那首關於旅人與星光的歌。」

阿爾特點了點頭。他將木笛湊到唇邊，深吸一口氣，輕柔而略帶哀傷的旋律隨即在風中流淌開來。

笛聲穿過麥田，掠過林梢，彷彿將整個世界的喧囂都撫平了。

隨著旋律的推進，艾莉亞的身軀開始發出更加明亮的光芒。她閉上眼睛，隨著音樂輕輕哼唱起無字的歌謠。她的歌聲與笛聲完美融合，讓周圍的空氣都泛起了水波般的漣漪。

阿爾特感覺到眼眶有些濕潤。他知道，這是艾莉亞力量即將耗盡的徵兆。精靈無法離開這片風車，而身為人類旅者的他，卻必須為了生存繼續踏上旅途。

一曲終了。

「謝謝你，阿爾特。」艾莉亞的聲音變得比先前更加縹緲。她的雙腳已經化作無數藍色的光粒子，正一點點飄向夜空。

「艾莉亞！」阿爾特丟下木笛，試圖去抓住她的手。

但他的手穿過了那層溫暖的光芒，什麼也沒有抓到。

艾莉亞微笑著，伸出半透明的手指，輕輕點在阿爾特的額頭上。一絲溫涼的感覺滲入他的靈魂，抹平了所有的恐懼與不捨。

「別哭，旅人。當下一次月落之時，只要你吹響這支笛子，我就會在你的夢裡，與你再次相遇。」

話音落下，艾莉亞的身軀徹底化作一陣璀璨的流星雨，沖天而起，融入了那浩瀚無垠的銀河之中。

風車下，只剩下阿爾特一人，以及地上靜靜躺著的木笛。但他的心中，那片星光卻永遠地亮了起來。`,
    likes: 185,
    views: 940,
    isBookmarked: false
  },
  {
    id: 'work_4',
    title: '夢幻星河軌道：無限列車',
    description: '星野老師的另一幅經典神作。在湛藍星空與銀河軌道上奔馳的奇幻火車，極具童話色彩，色彩斑斕且充滿想像力。這張圖的透視感與細節真的令人驚嘆。',
    type: 'illustration',
    creatorId: 'creator_1',
    tags: ['插畫', '奇幻', '銀河', '火車', '唯美', '童話風'],
    createdAt: '2026-07-02T12:00:00Z',
    commissionDate: '2026-07',
    images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000&q=80'],
    likes: 350,
    views: 1420,
    isBookmarked: true
  },
  {
    id: 'work_5',
    title: '深夜霓虹行駛：無限循環',
    description: '委託霧羽老師製作的第二款動畫。行駛在雨中東京高架橋上的電車，車窗外是無盡的摩天大樓霓虹燈，完美循環。看著看著心靈就平靜了下來。',
    type: 'animation',
    creatorId: 'creator_2',
    tags: ['動圖', '東京', '電車', '霓虹燈', '完美循環', '療癒'],
    createdAt: '2026-07-10T14:20:00Z',
    commissionDate: '2026-07',
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&q=80'],
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3o2NG9oMHU5Nm9sdGg4Nm1kMHN2ejFpajR0eWhwNHh2cjRhdmZ5cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d48u1PD8lzNH2/giphy.gif',
    likes: 298,
    views: 1120,
    isBookmarked: false
  }
];

export const DEFAULT_COMMENTS: Record<string, WorkComment[]> = {
  'work_1': [
    {
      id: 'c1',
      workId: 'work_1',
      authorName: '精靈使者',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&q=80',
      content: '星野老師的櫻花真的畫得太美了！那個光線灑下來的感覺完全神還原！',
      createdAt: '2026-04-12T16:00:00Z'
    },
    {
      id: 'c2',
      workId: 'work_1',
      authorName: '委託人本人',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&q=80',
      content: '非常滿意這次的成品，特別是第二張的光影草稿，直接珍藏！',
      createdAt: '2026-04-12T18:20:00Z'
    }
  ],
  'work_2': [
    {
      id: 'c3',
      workId: 'work_2',
      authorName: '霓虹狂熱者',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&q=80',
      content: '這個動態背景的霓虹招牌閃爍頻率太舒服了！大推霧羽老師！',
      createdAt: '2026-05-18T11:45:00Z'
    }
  ],
  'work_3': [
    {
      id: 'c4',
      workId: 'work_3',
      authorName: '讀書蟲',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&q=80',
      content: '「在墜落的那一刻，它們看到了整個世界的溫柔。」這句台詞直接讓我淚目，寫得太美了。',
      createdAt: '2026-06-05T09:30:00Z'
    }
  ]
};
