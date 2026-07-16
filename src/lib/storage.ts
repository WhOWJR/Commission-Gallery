import { Work, Creator, WorkComment } from '../types';
import { DEFAULT_WORKS, DEFAULT_CREATORS, DEFAULT_COMMENTS } from '../data';

const STORAGE_KEYS = {
  WORKS: 'pixiv_gallery_works_v1',
  CREATORS: 'pixiv_gallery_creators_v1',
  COMMENTS: 'pixiv_gallery_comments_v1',
};

export function getInitialData() {
  let works = DEFAULT_WORKS;
  let creators = DEFAULT_CREATORS;
  let comments = DEFAULT_COMMENTS;

  try {
    const savedWorks = localStorage.getItem(STORAGE_KEYS.WORKS);
    if (savedWorks) {
      works = JSON.parse(savedWorks);
    } else {
      localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(works));
    }

    const savedCreators = localStorage.getItem(STORAGE_KEYS.CREATORS);
    if (savedCreators) {
      creators = JSON.parse(savedCreators);
    } else {
      localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(creators));
    }

    const savedComments = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    if (savedComments) {
      comments = JSON.parse(savedComments);
    } else {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    }
  } catch (e) {
    console.error('Failed to parse localStorage data, falling back to defaults', e);
  }

  return { works, creators, comments };
}

export function saveWorks(works: Work[]) {
  localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(works));
}

export function saveCreators(creators: Creator[]) {
  localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(creators));
}

export function saveComments(comments: Record<string, WorkComment[]>) {
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
}

export function resetDatabase() {
  localStorage.removeItem(STORAGE_KEYS.WORKS);
  localStorage.removeItem(STORAGE_KEYS.CREATORS);
  localStorage.removeItem(STORAGE_KEYS.COMMENTS);
  return getInitialData();
}

export function exportDatabase() {
  const data = {
    works: JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKS) || '[]'),
    creators: JSON.parse(localStorage.getItem(STORAGE_KEYS.CREATORS) || '[]'),
    comments: JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}'),
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
  return JSON.stringify(data, null, 2);
}

export function importDatabase(jsonString: string) {
  try {
    const data = JSON.parse(jsonString);
    if (Array.isArray(data.works) && Array.isArray(data.creators)) {
      localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(data.works));
      localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(data.creators));
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(data.comments || {}));
      return true;
    }
  } catch (e) {
    console.error('Failed to import database JSON', e);
  }
  return false;
}
