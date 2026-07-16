export type PlatformType = 'twitter' | 'pixiv' | 'plurk' | 'email' | 'website' | 'other';

export interface CreatorLink {
  id: string;
  platform: PlatformType;
  label: string;
  url: string;
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  bio: string;
  links: CreatorLink[];
}

export type WorkType = 'illustration' | 'animation' | 'novel';

export interface Work {
  id: string;
  title: string;
  description: string;
  type: WorkType;
  creatorId: string;
  tags: string[];
  createdAt: string; // ISO date or YYYY-MM-DD
  commissionDate?: string; // YYYY-MM
  images: string[]; // For illustrations/images (supports multi-image)
  animationUrl?: string; // For animation (GIF/video)
  novelContent?: string; // For novels
  likes: number;
  views: number;
  isBookmarked?: boolean;
}

export interface WorkComment {
  id: string;
  workId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}
