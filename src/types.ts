export type SpoilerMode = 'spoiler-free' | 'full-universe';

export type SpiralState = 'FIGYEL' | 'EMLÉKEZIK' | 'VÁLASZOL' | 'ÁTÍR' | 'LÉLEGZIK';

export interface TimelineItem {
  id: string;
  step: number;
  title: string;
  subtitle?: string;
  date?: string;
  summary: string;
  fullDetail: string;
  isSpoiler: boolean;
  atmosphere: string[];
  location: string;
  quote?: string;
}

export interface Character {
  id: string;
  name: string;
  codeName?: string;
  role: string;
  age?: string | number;
  category: 'human' | 'entity' | 'guardian';
  badge: string;
  shortDesc: string;
  fullBio: string;
  quotes: string[];
  keyAttributes: { label: string; value: string }[];
  isSpoiler: boolean;
  classifiedData?: string;
}

export interface Guardian {
  id: string;
  number: number;
  name: string;
  designation: string;
  domain: string;
  description: string;
  quote: string;
  isNameless?: boolean;
  isSpoiler: boolean;
}

export type ArchiveCategory =
  | 'Expedíciós jelentések'
  | 'Georadarfelvételek'
  | 'Műholdképek'
  | 'Ismeretlen szimbólumok'
  | 'Rádiójelek'
  | 'Őrzők'
  | 'Végtelen'
  | 'Δ–82'
  | 'Spirálok'
  | 'Eltűnt személyek'
  | 'Időanomáliák'
  | 'Törés'
  | 'Vörös Porszoba';

export interface ArchiveDocument {
  id: string;
  docNumber: string;
  title: string;
  category: ArchiveCategory;
  classification: 'TOP SECRET' | 'RESTRICTED' | 'EYES ONLY / Δ' | 'ARCHIVED';
  date: string;
  location: string;
  summary: string;
  transcript: string[];
  metadata: { [key: string]: string };
  isSpoiler: boolean;
}

export interface Chapter {
  id: string;
  romanPart: string;
  title: string;
  subtitle: string;
  summary: string;
  deepDescription: string;
  mood: string;
  keywords: string[];
  keyCharacters: string[];
  location: string;
  relatedMystery: string;
  isSpoiler: boolean;
}

export interface MysteryItem {
  id: string;
  number: string;
  question: string;
  teaser: string;
  revelation: string;
  quote: string;
  coordinateLink?: string;
  isSpoiler: boolean;
}

export interface DidYouKnowItem {
  id: string;
  fact: string;
  context: string;
  tag: string;
}

export interface BookChapter {
  id: string;
  index: number;
  partTitle?: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
}

export interface Bookmark {
  id: string;
  chapterIndex: number;
  chapterTitle: string;
  paragraphIndex: number;
  snippet: string;
  createdAt: string;
  percentage: number;
}

export type ReaderTheme = 'night' | 'paper' | 'dark';
export type ReaderFont = 'serif' | 'sans' | 'mono';
export type ReaderLineHeight = 'normal' | 'comfortable' | 'large';
export type ReaderViewMode = 'scroll' | 'paginated';

export interface ReaderSettings {
  fontSize: number; // 14, 16, 18, 20, 24
  fontFamily: ReaderFont;
  lineHeight: ReaderLineHeight;
  theme: ReaderTheme;
  viewMode: ReaderViewMode;
}

export interface ReadingProgress {
  chapterIndex: number;
  paragraphIndex: number;
  percentage: number;
  lastReadTimestamp: number;
}

