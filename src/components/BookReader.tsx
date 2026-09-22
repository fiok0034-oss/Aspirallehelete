import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  BookOpen,
  Bookmark as BookmarkIcon,
  Settings,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  Compass,
  Sparkles,
  Layers,
  Clock,
  Trash2,
  Share2,
  Check,
  Radio,
  Eye,
  Terminal,
  Globe,
  Sliders,
  Type,
} from 'lucide-react';
import {
  BookChapter,
  Bookmark,
  ReaderSettings,
  ReadingProgress,
  ReaderTheme,
  ReaderFont,
  ReaderLineHeight,
  ReaderViewMode,
  SpoilerMode,
} from '../types';
import { BOOK_CHAPTERS, BOOK_METADATA } from '../data/bookData';
import { CHARACTERS_DATA, GUARDIANS_DATA } from '../data/loreData';
import { audioEngine } from '../utils/audioEngine';

interface BookReaderProps {
  initialChapterIndex?: number;
  spoilerMode: SpoilerMode;
  onClose: () => void;
  onNavigateToSection?: (sectionId: string) => void;
}

const STORAGE_PROGRESS_KEY = 'spiral_reader_progress';
const STORAGE_SETTINGS_KEY = 'spiral_reader_settings';
const STORAGE_BOOKMARKS_KEY = 'spiral_reader_bookmarks';

const DEFAULT_SETTINGS: ReaderSettings = {
  fontSize: 18,
  fontFamily: 'serif',
  lineHeight: 'comfortable',
  theme: 'night',
  viewMode: 'scroll',
};

export const BookReader: React.FC<BookReaderProps> = ({
  initialChapterIndex = 0,
  spoilerMode,
  onClose,
  onNavigateToSection,
}) => {
  // Load initial settings from localStorage
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Current active chapter
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(() => {
    if (initialChapterIndex !== undefined && initialChapterIndex >= 0) {
      return Math.min(initialChapterIndex, BOOK_CHAPTERS.length - 1);
    }
    try {
      const savedProg = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (savedProg) {
        const parsed = JSON.parse(savedProg);
        if (typeof parsed.chapterIndex === 'number') {
          return Math.min(Math.max(0, parsed.chapterIndex), BOOK_CHAPTERS.length - 1);
        }
      }
    } catch {
      // fallback
    }
    return 0;
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // UI Drawer / Modal states
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchKeyword, setActiveSearchKeyword] = useState<string>('');
  const [targetParagraphIndex, setTargetParagraphIndex] = useState<number | null>(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWorldOpen, setIsWorldOpen] = useState(false);
  const [worldTab, setWorldTab] = useState<'characters' | 'guardians' | 'locations'>('characters');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cinematic ending sequence state (Step 0: normal, 1: "VÉGE", 2: "VAGY MÉGSEM?", 3: "A Spirál figyel.", 4: Menu)
  const [endingStep, setEndingStep] = useState<number>(0);

  // Scroll container ref for reading area
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  // Current chapter data
  const currentChapter: BookChapter = BOOK_CHAPTERS[currentChapterIndex] || BOOK_CHAPTERS[0];

  // Total reading percentage
  const totalPercentage = Math.round(((currentChapterIndex + 1) / BOOK_CHAPTERS.length) * 100);

  // Estimated reading time for current chapter (~200 words/min)
  const currentWordCount = useMemo(() => {
    return currentChapter.paragraphs.reduce((acc, p) => acc + p.split(/\s+/).length, 0);
  }, [currentChapter]);
  const estimatedReadingMinutes = Math.max(1, Math.ceil(currentWordCount / 180));

  // Save settings when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Save progress when chapter changes
  useEffect(() => {
    try {
      const progress: ReadingProgress = {
        chapterIndex: currentChapterIndex,
        paragraphIndex: 0,
        percentage: totalPercentage,
        lastReadTimestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [currentChapterIndex, totalPercentage]);

  // Save bookmarks when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  // Scroll to top when changing chapters
  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentChapterIndex]);

  // Keyboard navigation & Ctrl+F search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F or Cmd+F opens book search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsSearchOpen(true);
        if (activeSearchKeyword && !searchQuery) {
          setSearchQuery(activeSearchKeyword);
        }
      }
      // Escape closes open modals
      if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        else if (isTocOpen) setIsTocOpen(false);
        else if (isBookmarksOpen) setIsBookmarksOpen(false);
        else if (isSettingsOpen) setIsSettingsOpen(false);
        else if (isWorldOpen) setIsWorldOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isTocOpen, isBookmarksOpen, isSettingsOpen, isWorldOpen, activeSearchKeyword, searchQuery]);

  // Toast notification timer
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Check ending trigger if on last chapter (Chapter 31 / index 41)
  const isLastChapter = currentChapterIndex === BOOK_CHAPTERS.length - 1;

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Chapter Navigation
  const goToChapter = (idx: number) => {
    if (idx >= 0 && idx < BOOK_CHAPTERS.length) {
      audioEngine.playSonarPing();
      setCurrentChapterIndex(idx);
      setIsTocOpen(false);
      setIsSearchOpen(false);
      setIsBookmarksOpen(false);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      goToChapter(currentChapterIndex - 1);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < BOOK_CHAPTERS.length - 1) {
      goToChapter(currentChapterIndex + 1);
    } else if (isLastChapter && endingStep === 0) {
      // Trigger cinematic ending
      triggerEndingSequence();
    }
  };

  // Trigger Ending Sequence (Requirement 53)
  const triggerEndingSequence = () => {
    audioEngine.playSonarPing();
    setEndingStep(1);
    setTimeout(() => {
      setEndingStep(2);
      setTimeout(() => {
        setEndingStep(3);
        setTimeout(() => {
          setEndingStep(4);
        }, 3000);
      }, 3000);
    }, 2800);
  };

  // Bookmark management
  const addBookmark = (paragraphIdx: number = 0) => {
    const snippet =
      currentChapter.paragraphs[paragraphIdx]?.substring(0, 95) || currentChapter.title;
    const newBookmark: Bookmark = {
      id: `bm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      chapterIndex: currentChapterIndex,
      chapterTitle: currentChapter.title,
      paragraphIndex: paragraphIdx,
      snippet: snippet + '...',
      createdAt: new Date().toLocaleDateString('hu-HU', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      percentage: totalPercentage,
    };
    setBookmarks((prev) => [newBookmark, ...prev]);
    showToast('Könyvjelző elmentve a fejezethez!');
  };

  const removeBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    showToast('Könyvjelző törölve');
  };

  const POPULAR_SEARCH_KEYWORDS = [
    'Viktor',
    'Spirál',
    'Lena',
    'Mira',
    'Levente',
    '82. szélességi',
    'Georadar',
    'Vörös Por',
    'Kódváros',
    'Őrző',
    'Antarktisz',
  ];

  // Search through all chapters
  const effectiveSearchKeyword = (searchQuery.trim() || activeSearchKeyword.trim());

  const searchResults = useMemo(() => {
    if (!effectiveSearchKeyword || effectiveSearchKeyword.length < 2) return [];
    const query = effectiveSearchKeyword.toLowerCase();
    const results: {
      chapterIndex: number;
      chapterTitle: string;
      paragraphIndex: number;
      text: string;
      fullParagraph: string;
    }[] = [];

    BOOK_CHAPTERS.forEach((ch, chIdx) => {
      ch.paragraphs.forEach((p, pIdx) => {
        const lower = p.toLowerCase();
        const matchPos = lower.indexOf(query);
        if (matchPos !== -1) {
          const start = Math.max(0, matchPos - 45);
          const end = Math.min(p.length, matchPos + query.length + 55);
          const snippet = (start > 0 ? '...' : '') + p.substring(start, end) + (end < p.length ? '...' : '');
          results.push({
            chapterIndex: chIdx,
            chapterTitle: ch.title,
            paragraphIndex: pIdx,
            text: snippet,
            fullParagraph: p,
          });
        }
      });
    });

    return results.slice(0, 100);
  }, [effectiveSearchKeyword]);

  // Count matches in current chapter
  const currentChapterMatchesCount = useMemo(() => {
    if (!activeSearchKeyword.trim() || activeSearchKeyword.length < 2) return 0;
    const query = activeSearchKeyword.trim().toLowerCase();
    let count = 0;
    currentChapter.paragraphs.forEach((p) => {
      const lower = p.toLowerCase();
      let pos = 0;
      while ((pos = lower.indexOf(query, pos)) !== -1) {
        count++;
        pos += query.length;
      }
    });
    return count;
  }, [currentChapter, activeSearchKeyword]);

  // Navigate directly to search result's location
  const navigateToSearchResult = (
    res: {
      chapterIndex: number;
      chapterTitle: string;
      paragraphIndex: number;
      text: string;
      fullParagraph: string;
    },
    resultIdx: number
  ) => {
    audioEngine.playSonarPing();
    const keywordToPin = searchQuery.trim() || activeSearchKeyword.trim();
    setActiveSearchKeyword(keywordToPin);
    setCurrentMatchIndex(resultIdx);
    setIsSearchOpen(false);

    if (currentChapterIndex !== res.chapterIndex) {
      setCurrentChapterIndex(res.chapterIndex);
    }

    setTargetParagraphIndex(res.paragraphIndex);

    // Scroll to the exact paragraph location smoothly
    setTimeout(() => {
      const el = document.getElementById(`reader-para-${res.paragraphIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);

    // Fade out target ring after visual focus
    setTimeout(() => {
      setTargetParagraphIndex(null);
    }, 4500);

    showToast(`Ugrás a találathoz: ${res.chapterTitle} (${res.paragraphIndex + 1}. bekezdés)`);
  };

  const handleNextMatch = () => {
    if (searchResults.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % searchResults.length;
    navigateToSearchResult(searchResults[nextIdx], nextIdx);
  };

  const handlePrevMatch = () => {
    if (searchResults.length === 0) return;
    const prevIdx = (currentMatchIndex - 1 + searchResults.length) % searchResults.length;
    navigateToSearchResult(searchResults[prevIdx], prevIdx);
  };

  const handleClearSearch = () => {
    setActiveSearchKeyword('');
    setSearchQuery('');
    setTargetParagraphIndex(null);
    showToast('Keresési kiemelés törölve');
  };

  // Safe keyword highlighter
  const renderHighlightedText = (text: string, keyword: string) => {
    if (!keyword || keyword.trim().length < 2) return text;
    const trimmed = keyword.trim();
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    if (parts.length <= 1) return text;

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="bg-cyan-400/40 text-cyan-100 font-semibold px-1 py-0.5 rounded border border-cyan-400/80 shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all animate-pulse-slow"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  // Theme styles
  const getThemeClasses = (theme: ReaderTheme) => {
    switch (theme) {
      case 'paper':
        return {
          wrapper: 'bg-[#181512] text-[#f4efe8]',
          header: 'bg-[#1e1a16]/95 border-[#322b24] text-[#e6ded2]',
          bodyText: 'text-[#e9e2d5]',
          accentText: 'text-[#d4a373]',
          border: 'border-[#383028]',
          drawer: 'bg-[#1c1814] text-[#f4efe8] border-[#383028]',
          card: 'bg-[#241f1a] border-[#3c342b]',
          buttonHover: 'hover:bg-[#2b2520]',
        };
      case 'dark':
        return {
          wrapper: 'bg-[#0a0a0b] text-[#e2e8f0]',
          header: 'bg-[#121214]/95 border-zinc-800 text-zinc-100',
          bodyText: 'text-zinc-200',
          accentText: 'text-zinc-300',
          border: 'border-zinc-800',
          drawer: 'bg-[#111113] text-zinc-100 border-zinc-800',
          card: 'bg-[#18181b] border-zinc-800',
          buttonHover: 'hover:bg-zinc-800',
        };
      case 'night':
      default:
        return {
          wrapper: 'bg-[#03060c] text-[#d6e4f0]',
          header: 'bg-[#060b16]/95 border-cyan-950/60 text-cyan-200',
          bodyText: 'text-slate-200',
          accentText: 'text-cyan-400',
          border: 'border-cyan-950/80',
          drawer: 'bg-[#070d1a] text-slate-200 border-cyan-950/80',
          card: 'bg-[#0a1224] border-cyan-900/40',
          buttonHover: 'hover:bg-cyan-950/50',
        };
    }
  };

  const themeStyle = getThemeClasses(settings.theme);

  // Font family styles
  const getFontFamilyClass = (font: ReaderFont) => {
    switch (font) {
      case 'serif':
        return 'font-serif font-light tracking-wide';
      case 'mono':
        return 'font-mono text-[0.92em] tracking-normal';
      case 'sans':
      default:
        return 'font-sans font-light tracking-normal';
    }
  };

  // Line height styles
  const getLineHeightClass = (lh: ReaderLineHeight) => {
    switch (lh) {
      case 'normal':
        return 'leading-relaxed'; // 1.625
      case 'large':
        return 'leading-[2.2]';
      case 'comfortable':
      default:
        return 'leading-[1.85]';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col select-text ${themeStyle.wrapper} transition-colors duration-300 overflow-hidden`}
    >
      {/* 1. TOP HEADER BAR */}
      <header
        className={`h-16 px-4 sm:px-6 flex items-center justify-between border-b ${themeStyle.header} backdrop-blur-md z-40 transition-colors shrink-0`}
      >
        {/* Left: Back button & Book Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              audioEngine.playSonarPing();
              onClose();
            }}
            title="Vissza a könyv-univerzum főoldalára"
            className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider flex items-center gap-2 border ${themeStyle.border} ${themeStyle.buttonHover} transition-all`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline font-bold">VISSZA</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-700/50 hidden sm:block" />

          <div>
            <div className="text-xs sm:text-sm font-cinzel font-bold tracking-wider truncate max-w-[160px] sm:max-w-xs md:max-w-md">
              {BOOK_METADATA.title}
            </div>
            <div className="text-[10px] sm:text-[11px] font-mono text-cyan-400/80 truncate max-w-[180px] sm:max-w-sm">
              {currentChapter.title}
            </div>
          </div>
        </div>

        {/* Center: Reading Progress Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-950/80 bg-cyan-950/20 font-mono text-xs text-cyan-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{totalPercentage}% elolvasva</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            {currentChapterIndex + 1} / {BOOK_CHAPTERS.length} fejezet
          </span>
        </div>

        {/* Right: Actions (Search, TOC, Bookmarks, World, Settings, Fullscreen) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Button */}
          <button
            onClick={() => {
              if (activeSearchKeyword && !searchQuery) {
                setSearchQuery(activeSearchKeyword);
              }
              setIsSearchOpen(true);
              setIsTocOpen(false);
              setIsBookmarksOpen(false);
              setIsSettingsOpen(false);
              setIsWorldOpen(false);
            }}
            title={
              activeSearchKeyword
                ? `Keresés: „${activeSearchKeyword}” (${searchResults.length} találat) [Ctrl+F]`
                : 'Keresés a teljes könyvben [Ctrl+F]'
            }
            className={`p-2 rounded border relative transition-all ${
              activeSearchKeyword
                ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : `${themeStyle.border} ${themeStyle.buttonHover} text-slate-300 hover:text-cyan-300`
            }`}
          >
            <Search className="w-4 h-4" />
            {activeSearchKeyword && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
            )}
          </button>

          {/* Table of Contents Drawer Toggle */}
          <button
            onClick={() => {
              setIsTocOpen(!isTocOpen);
              setIsSearchOpen(false);
              setIsBookmarksOpen(false);
              setIsSettingsOpen(false);
              setIsWorldOpen(false);
            }}
            title="Tartalomjegyzék"
            className={`px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 border ${
              isTocOpen
                ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                : `${themeStyle.border} ${themeStyle.buttonHover} text-slate-300`
            } transition-all`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">FEJEZETEK</span>
          </button>

          {/* Bookmarks Drawer Toggle */}
          <button
            onClick={() => {
              setIsBookmarksOpen(!isBookmarksOpen);
              setIsTocOpen(false);
              setIsSearchOpen(false);
              setIsSettingsOpen(false);
              setIsWorldOpen(false);
            }}
            title="Könyvjelzők"
            className={`p-2 rounded border ${
              isBookmarksOpen
                ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                : `${themeStyle.border} ${themeStyle.buttonHover} text-slate-300`
            } transition-all relative`}
          >
            <BookmarkIcon className="w-4 h-4" />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-slate-950 rounded-full text-[9px] font-bold flex items-center justify-center font-mono">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* World Lore Cross-Reference Toggle ("Világ Dosszié") */}
          <button
            onClick={() => {
              setIsWorldOpen(!isWorldOpen);
              setIsTocOpen(false);
              setIsSearchOpen(false);
              setIsBookmarksOpen(false);
              setIsSettingsOpen(false);
            }}
            title="Világ Dosszié (Szereplők, Őrzők, Helyszínek az olvasás megszakítása nélkül)"
            className={`px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 border ${
              isWorldOpen
                ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                : `${themeStyle.border} ${themeStyle.buttonHover} text-cyan-400`
            } transition-all`}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden md:inline">VILÁG</span>
          </button>

          {/* Reading Settings Toggle */}
          <button
            onClick={() => {
              setIsSettingsOpen(!isSettingsOpen);
              setIsTocOpen(false);
              setIsSearchOpen(false);
              setIsBookmarksOpen(false);
              setIsWorldOpen(false);
            }}
            title="Olvasási beállítások (Betűméret, Téma, Térköz)"
            className={`p-2 rounded border ${
              isSettingsOpen
                ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                : `${themeStyle.border} ${themeStyle.buttonHover} text-slate-300`
            } transition-all`}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Kilépés a teljes képernyőből' : 'Teljes képernyős olvasás'}
            className={`p-2 rounded border ${themeStyle.border} ${themeStyle.buttonHover} text-slate-300 hover:text-cyan-300 transition-all hidden sm:block`}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* FLOATING IN-READER SEARCH NAVIGATION BAR (When keyword is active) */}
      {activeSearchKeyword && (
        <div className="bg-[#050e20]/95 border-b border-cyan-500/50 px-4 py-2 text-xs font-mono flex flex-wrap items-center justify-between gap-3 shadow-[0_4px_25px_rgba(0,0,0,0.6)] z-30 shrink-0 backdrop-blur-md animate-slide-down">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Search className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
            <span className="flex items-center gap-1.5 flex-wrap">
              <span>Keresett kifejezés:</span>
              <strong className="text-cyan-200 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-400/50 shadow-[0_0_8px_rgba(56,189,248,0.3)]">
                „{activeSearchKeyword}”
              </strong>
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-cyan-400/90">
              {currentChapterMatchesCount} találat ebben a fejezetben ({searchResults.length} a könyvben)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 text-[11px]">
              Találat: <strong className="text-white">{searchResults.length > 0 ? currentMatchIndex + 1 : 0}</strong> / {searchResults.length}
            </span>

            <button
              onClick={handlePrevMatch}
              disabled={searchResults.length <= 1}
              className="px-2.5 py-1 rounded border border-slate-700 bg-slate-900/90 hover:bg-cyan-950 hover:border-cyan-500 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
              title="Előző találatra ugrás"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Előző</span>
            </button>

            <button
              onClick={handleNextMatch}
              disabled={searchResults.length <= 1}
              className="px-2.5 py-1 rounded border border-slate-700 bg-slate-900/90 hover:bg-cyan-950 hover:border-cyan-500 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
              title="Következő találatra ugrás"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Következő</span>
            </button>

            <button
              onClick={() => {
                setSearchQuery(activeSearchKeyword);
                setIsSearchOpen(true);
              }}
              className="px-2.5 py-1 rounded border border-cyan-700/80 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 text-[11px] transition-all font-semibold"
              title="Összes találat megnyitása"
            >
              Listázás
            </button>

            <button
              onClick={handleClearSearch}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all ml-1"
              title="Keresési kiemelés eltávolítása"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* READING PROGRESS BAR (Top line) */}
      <div className="w-full h-1 bg-slate-800/40 relative z-30 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-sky-300 transition-all duration-300"
          style={{ width: `${totalPercentage}%` }}
        />
      </div>

      {/* 2. MAIN READING CONTAINER */}
      <div
        ref={contentContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-10 sm:py-16 scrollbar-thin scrollbar-thumb-cyan-900/40 scrollbar-track-transparent relative"
      >
        <article className="max-w-3xl mx-auto space-y-10 sm:space-y-12">
          {/* Chapter Header Banner */}
          <div className="text-center space-y-4 pb-8 border-b border-cyan-950/40">
            {currentChapter.partTitle && (
              <div className="text-xs sm:text-sm font-mono tracking-widest text-cyan-400/90 uppercase font-semibold">
                {currentChapter.partTitle}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide drop-shadow">
              {activeSearchKeyword ? renderHighlightedText(currentChapter.title, activeSearchKeyword) : currentChapter.title}
            </h1>

            {currentChapter.subtitle && (
              <p className="text-base sm:text-lg font-mono text-cyan-300/80 italic">
                {activeSearchKeyword ? renderHighlightedText(currentChapter.subtitle, activeSearchKeyword) : currentChapter.subtitle}
              </p>
            )}

            <div className="flex items-center justify-center gap-3 pt-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> ~{estimatedReadingMinutes} perc
              </span>
              <span>•</span>
              <span>{currentChapter.paragraphs.length} bekezdés</span>
              <span>•</span>
              <button
                onClick={() => addBookmark(0)}
                className="text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1"
              >
                <BookmarkIcon className="w-3 h-3" /> Fejezet megjelölése
              </button>
            </div>
          </div>

          {/* Chapter Paragraphs */}
          <div
            className={`space-y-6 sm:space-y-8 ${getFontFamilyClass(
              settings.fontFamily
            )} ${getLineHeightClass(settings.lineHeight)}`}
            style={{ fontSize: `${settings.fontSize}px` }}
          >
            {currentChapter.paragraphs.map((para, pIdx) => {
              const isFirst = pIdx === 0;
              const isTarget = targetParagraphIndex === pIdx;

              return (
                <div
                  key={pIdx}
                  id={`reader-para-${pIdx}`}
                  className={`group relative transition-all duration-300 rounded-md p-3 -mx-3 ${
                    isTarget
                      ? 'ring-2 ring-cyan-400 bg-cyan-950/50 shadow-[0_0_25px_rgba(56,189,248,0.4)]'
                      : 'hover:bg-cyan-950/10'
                  }`}
                >
                  <p
                    className={`${themeStyle.bodyText} ${
                      isFirst
                        ? 'first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-cinzel first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-cyan-400'
                        : ''
                    }`}
                  >
                    {activeSearchKeyword
                      ? renderHighlightedText(para, activeSearchKeyword)
                      : para}
                  </p>

                  {/* Quick paragraph bookmark button on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 flex items-center gap-1 bg-[#060b16]/90 border border-cyan-900/60 rounded px-2 py-0.5 text-[11px] font-mono text-slate-400">
                    <button
                      onClick={() => addBookmark(pIdx)}
                      title="Könyvjelző ehhez a bekezdéshez"
                      className="hover:text-cyan-300 flex items-center gap-1"
                    >
                      <BookmarkIcon className="w-3 h-3" />
                      <span>Mentés</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chapter End Divider & Next / Prev controls */}
          <div className="pt-12 pb-8 border-t border-cyan-950/40 space-y-8">
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-16 bg-cyan-900/50" />
              <div className="text-cyan-400 text-lg select-none">🌀</div>
              <div className="h-[1px] w-16 bg-cyan-900/50" />
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === 0}
                className="w-full sm:w-auto px-5 py-2.5 rounded border border-slate-700 bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 text-xs font-mono tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ELŐZŐ FEJEZET</span>
              </button>

              <div className="text-xs font-mono text-slate-400 text-center">
                <span>{currentChapterIndex + 1}. fejezet / </span>
                <span className="text-cyan-400">{BOOK_CHAPTERS.length}</span>
              </div>

              {isLastChapter ? (
                <button
                  onClick={triggerEndingSequence}
                  className="w-full sm:w-auto px-6 py-2.5 rounded border border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-xs font-mono tracking-widest uppercase font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:scale-105 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <span>BEFEJEZÉS FELTÁRÁSA</span>
                </button>
              ) : (
                <button
                  onClick={handleNextChapter}
                  className="w-full sm:w-auto px-6 py-2.5 rounded border border-cyan-500/70 bg-cyan-950/50 hover:bg-cyan-900/70 text-cyan-200 text-xs font-mono tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                >
                  <span>KÖVETKEZŐ FEJEZET</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </article>
      </div>

      {/* 3. TABLE OF CONTENTS DRAWER */}
      {isTocOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md h-full flex flex-col ${themeStyle.drawer} border-r shadow-2xl overflow-hidden`}
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-cyan-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="font-cinzel font-bold text-base sm:text-lg text-slate-100">
                  TARTALOMJEGYZÉK
                </h3>
              </div>
              <button
                onClick={() => setIsTocOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick stats */}
            <div className="px-5 py-2.5 bg-cyan-950/30 border-b border-cyan-950/60 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{BOOK_CHAPTERS.length} fejezet & rész</span>
              <span className="text-cyan-400">{totalPercentage}% kész</span>
            </div>

            {/* Chapters list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
              {BOOK_CHAPTERS.map((ch, idx) => {
                const isActive = idx === currentChapterIndex;
                const isRead = idx < currentChapterIndex;

                return (
                  <button
                    key={ch.id}
                    onClick={() => goToChapter(idx)}
                    className={`w-full text-left p-3 rounded text-xs transition-all flex items-start justify-between gap-3 border ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                        : isRead
                        ? 'border-transparent bg-slate-900/30 text-slate-300 hover:bg-slate-900/70 hover:border-slate-800'
                        : 'border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="font-mono text-[10px] text-cyan-500/70 font-semibold">
                        {ch.partTitle || `#${idx + 1}`}
                      </div>
                      <div className="font-cinzel font-medium text-slate-100 truncate">
                        {ch.title}
                      </div>
                      {ch.subtitle && (
                        <div className="text-[11px] text-slate-400 truncate italic">
                          {ch.subtitle}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 font-mono text-[10px]">
                      {isActive ? (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-bold">
                          OLVASOD
                        </span>
                      ) : isRead ? (
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <span className="text-slate-600">{idx + 1}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1" onClick={() => setIsTocOpen(false)} />
        </div>
      )}

      {/* 4. FULL-TEXT SEARCH MODAL */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className={`w-full max-w-2xl rounded-lg border ${themeStyle.border} ${themeStyle.drawer} shadow-2xl flex flex-col max-h-[88vh] overflow-hidden`}
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-cyan-950/80 flex items-center gap-3">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    navigateToSearchResult(searchResults[0], 0);
                  }
                }}
                placeholder="Keresés kulcsszóra (pl. Viktor, Spirál, Lena, 82, radar, kód)..."
                className="w-full bg-transparent border-none text-slate-100 text-sm sm:text-base placeholder-slate-500 focus:outline-none font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Keresőmező törlése"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-2.5 py-1 text-xs font-mono border border-slate-700 rounded text-slate-400 hover:text-white shrink-0"
              >
                BEZÁR
              </button>
            </div>

            {/* Quick Sci-Fi Keyword Chips */}
            <div className="px-4 py-2.5 bg-cyan-950/30 border-b border-cyan-950/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-mono text-cyan-400/80 uppercase shrink-0 mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Gyors kulcsszavak:
              </span>
              {POPULAR_SEARCH_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setSearchQuery(kw)}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full border transition-all shrink-0 ${
                    searchQuery.toLowerCase() === kw.toLowerCase()
                      ? 'border-cyan-400 bg-cyan-500/25 text-cyan-100 font-semibold shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-800'
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>

            {/* Results count header */}
            <div className="px-5 py-2 bg-cyan-950/20 border-b border-cyan-950/40 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>
                {searchQuery
                  ? `${searchResults.length} találat a teljes könyv 42 fejezetében`
                  : 'Írj be legalább 2 karaktert, vagy válassz egy kulcsszót fent!'}
              </span>
              <span className="text-[10px] text-cyan-400/80 hidden sm:inline">
                Kattints a találatra az azonnali helyreugráshoz ↵
              </span>
            </div>

            {/* Results list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
              {searchResults.length === 0 && searchQuery.length >= 2 ? (
                <div className="py-14 text-center text-slate-500 font-mono text-xs space-y-2">
                  <Search className="w-8 h-8 mx-auto opacity-30 text-cyan-400" />
                  <p>Nem található találat a(z) „{searchQuery}” kifejezésre a könyvben.</p>
                  <p className="text-[11px] text-slate-600">Próbáld meg egy másik szereplő nevével vagy kódszóval!</p>
                </div>
              ) : (
                searchResults.map((res, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigateToSearchResult(res, idx)}
                    className="w-full text-left p-3.5 rounded border border-cyan-950/60 bg-cyan-950/20 hover:bg-cyan-950/50 hover:border-cyan-500 transition-all space-y-1.5 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-semibold text-cyan-200 group-hover:text-cyan-300">
                          {res.chapterTitle}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 shrink-0">
                          {res.paragraphIndex + 1}. bekezdés
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 font-mono shrink-0 ml-2 flex items-center gap-1">
                        <span>Ugrás</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      {renderHighlightedText(res.text, searchQuery || activeSearchKeyword)}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. BOOKMARKS DRAWER */}
      {isBookmarksOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="flex-1" onClick={() => setIsBookmarksOpen(false)} />

          <div
            className={`w-full max-w-md h-full flex flex-col ${themeStyle.drawer} border-l shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-cyan-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookmarkIcon className="w-4 h-4 text-cyan-400" />
                <h3 className="font-cinzel font-bold text-base sm:text-lg text-slate-100">
                  KÖNYVJELZŐK
                </h3>
              </div>
              <button
                onClick={() => setIsBookmarksOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Add Current Location */}
            <div className="p-4 border-b border-cyan-950/60 bg-cyan-950/20">
              <button
                onClick={() => addBookmark(0)}
                className="w-full py-2.5 px-4 rounded border border-cyan-400/80 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <BookmarkIcon className="w-3.5 h-3.5 text-cyan-300" />
                <span>AKTUÁLIS HELY KÖNYVJELZŐZÉSE</span>
              </button>
            </div>

            {/* Bookmarks List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
              {bookmarks.length === 0 ? (
                <div className="py-16 text-center text-slate-500 font-mono text-xs space-y-2">
                  <BookmarkIcon className="w-8 h-8 mx-auto opacity-30 text-cyan-400" />
                  <p>Még nincsenek elmentett könyvjelzőid.</p>
                  <p className="text-[11px] text-slate-600">
                    Olvasás közben bármikor megjelölheted a fontos sorokat!
                  </p>
                </div>
              ) : (
                bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    onClick={() => goToChapter(bm.chapterIndex)}
                    className="p-3.5 rounded border border-cyan-950/80 bg-[#060b16] hover:border-cyan-700 hover:bg-cyan-950/30 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-300 font-bold truncate max-w-[220px]">
                        {bm.chapterTitle}
                      </span>
                      <button
                        onClick={(e) => removeBookmark(bm.id, e)}
                        title="Könyvjelző törlése"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 italic font-light line-clamp-2">
                      „{bm.snippet}”
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                      <span>{bm.createdAt}</span>
                      <span className="text-cyan-400/80">{bm.percentage}% állapot</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. READING SETTINGS PANEL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-lg border ${themeStyle.border} ${themeStyle.drawer} shadow-2xl p-6 space-y-6`}
          >
            {/* Title */}
            <div className="flex items-center justify-between border-b border-cyan-950/80 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="font-cinzel font-bold text-lg text-slate-100">
                  OLVASÁSI BEÁLLÍTÁSOK
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Theme Picker */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Színtéma
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  onClick={() => setSettings((s) => ({ ...s, theme: 'night' }))}
                  className={`p-3 rounded border text-center transition-all ${
                    settings.theme === 'night'
                      ? 'border-cyan-400 bg-[#060b18] text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                      : 'border-slate-800 bg-[#040812] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold">ÉJSZAKAI</div>
                  <div className="text-[10px] text-cyan-500/70">Mélykék Sci-fi</div>
                </button>

                <button
                  onClick={() => setSettings((s) => ({ ...s, theme: 'paper' }))}
                  className={`p-3 rounded border text-center transition-all ${
                    settings.theme === 'paper'
                      ? 'border-[#d4a373] bg-[#241f1a] text-[#f4efe8] shadow-[0_0_12px_rgba(212,163,115,0.25)]'
                      : 'border-stone-800 bg-[#181512] text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="font-bold">PAPÍR</div>
                  <div className="text-[10px] text-stone-400">Meleg szépia</div>
                </button>

                <button
                  onClick={() => setSettings((s) => ({ ...s, theme: 'dark' }))}
                  className={`p-3 rounded border text-center transition-all ${
                    settings.theme === 'dark'
                      ? 'border-zinc-500 bg-[#18181b] text-zinc-100 shadow-[0_0_12px_rgba(255,255,255,0.1)]'
                      : 'border-zinc-800 bg-[#0a0a0b] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-bold">SÖTÉT</div>
                  <div className="text-[10px] text-zinc-500">Minimalista OLED</div>
                </button>
              </div>
            </div>

            {/* 2. Font Family Picker */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Betűtípus
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setSettings((s) => ({ ...s, fontFamily: 'serif' }))}
                  className={`p-2.5 rounded border font-serif text-center transition-all ${
                    settings.fontFamily === 'serif'
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400'
                  }`}
                >
                  Klasszikus (Serif)
                </button>

                <button
                  onClick={() => setSettings((s) => ({ ...s, fontFamily: 'sans' }))}
                  className={`p-2.5 rounded border font-sans text-center transition-all ${
                    settings.fontFamily === 'sans'
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400'
                  }`}
                >
                  Modern (Sans)
                </button>

                <button
                  onClick={() => setSettings((s) => ({ ...s, fontFamily: 'mono' }))}
                  className={`p-2.5 rounded border font-mono text-center transition-all ${
                    settings.fontFamily === 'mono'
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400'
                  }`}
                >
                  Archív (Mono)
                </button>
              </div>
            </div>

            {/* 3. Font Size Stepper */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="uppercase tracking-wider text-slate-300">Betűméret</span>
                <span className="text-cyan-400">{settings.fontSize}px</span>
              </div>
              <div className="flex items-center gap-2">
                {[14, 16, 18, 20, 24].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSettings((s) => ({ ...s, fontSize: size }))}
                    className={`flex-1 py-2 rounded font-mono text-xs border transition-all ${
                      settings.fontSize === size
                        ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 font-bold'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Line Spacing */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Sorköz
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  onClick={() => setSettings((s) => ({ ...s, lineHeight: 'normal' }))}
                  className={`p-2 rounded border text-center transition-all ${
                    settings.lineHeight === 'normal'
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400'
                  }`}
                >
                  Kompakt
                </button>

                <button
                  onClick={() => setSettings((s) => ({ ...s, lineHeight: 'comfortable' }))}
                  className={`p-2 rounded border text-center transition-all ${
                    settings.lineHeight === 'comfortable'
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400'
                  }`}
                >
                  Kényelmes
                </button>

                <button
                  onClick={() => setSettings((s) => ({ ...s, lineHeight: 'large' }))}
                  className={`p-2 rounded border text-center transition-all ${
                    settings.lineHeight === 'large'
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400'
                  }`}
                >
                  Tágas
                </button>
              </div>
            </div>

            {/* Bottom confirmation */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  showToast('Beállítások alkalmazva');
                }}
                className="px-6 py-2 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-mono text-xs tracking-wider uppercase font-semibold hover:bg-cyan-500/30"
              >
                KÉSZ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. WORLD LORE CROSS-REFERENCE DRAWER ("Világ Dosszié") */}
      {isWorldOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="flex-1" onClick={() => setIsWorldOpen(false)} />

          <div
            className={`w-full max-w-lg h-full flex flex-col ${themeStyle.drawer} border-l shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-cyan-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h3 className="font-cinzel font-bold text-base sm:text-lg text-slate-100">
                  VILÁG DOSSZIÉ
                </h3>
              </div>
              <button
                onClick={() => setIsWorldOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-2.5 bg-cyan-950/20 border-b border-cyan-950/60 text-xs font-mono text-slate-400">
              Keresd vissza a regény szereplőit és őrzőit az olvasási pozíció elvesztése nélkül!
            </div>

            {/* Sub-tabs: Karakterek / Őrzők / Helyszínek */}
            <div className="flex border-b border-cyan-950/60 font-mono text-xs bg-slate-950/50">
              <button
                onClick={() => setWorldTab('characters')}
                className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                  worldTab === 'characters'
                    ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                SZEREPLŐK
              </button>
              <button
                onClick={() => setWorldTab('guardians')}
                className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                  worldTab === 'guardians'
                    ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                10 ŐRZŐ
              </button>
              <button
                onClick={() => setWorldTab('locations')}
                className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                  worldTab === 'locations'
                    ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                HELYSZÍNEK & KÓDOK
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {worldTab === 'characters' && (
                <div className="space-y-3">
                  {CHARACTERS_DATA.map((char) => (
                    <div
                      key={char.id}
                      className="p-3.5 rounded border border-cyan-950/80 bg-[#060b16] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-cinzel font-bold text-sm text-cyan-200">
                          {char.name}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-900/60 text-cyan-400">
                          {char.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-light leading-relaxed">
                        {char.shortDesc || char.fullBio}
                      </p>
                      {char.quotes && char.quotes.length > 0 && (
                        <blockquote className="text-[11px] font-serif italic text-cyan-300/80 border-l-2 border-cyan-500/50 pl-2 py-0.5">
                          „{char.quotes[0]}”
                        </blockquote>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {worldTab === 'guardians' && (
                <div className="space-y-3">
                  {GUARDIANS_DATA.map((g) => (
                    <div
                      key={g.id}
                      className="p-3.5 rounded border border-cyan-950/80 bg-[#060b16] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-cinzel font-bold text-sm text-cyan-200">
                          {g.number}. {g.name}
                        </h4>
                        <span className="text-[10px] font-mono text-cyan-400">
                          {g.domain}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-light leading-relaxed">
                        {g.description}
                      </p>
                      {g.quote && (
                        <div className="text-[10px] font-mono text-slate-400 italic">
                          „{g.quote}”
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {worldTab === 'locations' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded border border-cyan-950/80 bg-[#060b16] space-y-1.5">
                    <h4 className="font-cinzel font-bold text-sm text-cyan-200">
                      82°16’S — 36°01’E Koordináta
                    </h4>
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      Az antarktiszi jégsapka mélyén, 3200 méter mélységben fekvő georadar anomália. Két 300 méteres mértani struktúra, ahol a rádióhullámok és a telemetria elhajlik.
                    </p>
                  </div>

                  <div className="p-3.5 rounded border border-cyan-950/80 bg-[#060b16] space-y-1.5">
                    <h4 className="font-cinzel font-bold text-sm text-cyan-200">
                      A Vörös Porszoba
                    </h4>
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      Egy zárt kamra a spirál mélyén, ahol a levegő finom, lebegő vöröses mikrokristályokkal van telítve. Az emberi tudat itt nem a külső világot látja, hanem saját elfojtott emlékeit.
                    </p>
                  </div>

                  <div className="p-3.5 rounded border border-cyan-950/80 bg-[#060b16] space-y-1.5">
                    <h4 className="font-cinzel font-bold text-sm text-cyan-200">
                      A Törés Városa & Kódváros
                    </h4>
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      A spirál nem térbeli struktúra: egy folyamatosan változó geometriájú tudati város, melyet a belépők elméje és döntései formálnak.
                    </p>
                  </div>

                  <div className="p-3.5 rounded border border-cyan-950/80 bg-[#060b16] space-y-1.5">
                    <h4 className="font-cinzel font-bold text-sm text-cyan-200">
                      50 MHz Rejtett Rádiófrekvencia
                    </h4>
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      A fagyos déli sarki csendben felvett periodikus morze és rezonáns pulzálás, amely a spirál szívének lélegzését közvetíti.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. CINEMATIC ENDING SEQUENCE (Requirement 53) */}
      {endingStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#020409] text-center overflow-hidden select-none animate-fade-in">
          {/* Subtle background ambient pulse */}
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-80" />

          {/* Step 1: "VÉGE" */}
          {endingStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-6xl sm:text-8xl md:text-9xl font-cinzel font-black tracking-widest text-slate-100 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                VÉGE
              </div>
              <div className="text-cyan-500/70 font-mono text-sm tracking-widest uppercase animate-pulse">
                A Spirál Lehellete – Csurik Konrád
              </div>
            </div>
          )}

          {/* Step 2: "VAGY MÉGSEM?" */}
          {endingStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-4xl sm:text-7xl md:text-8xl font-cinzel font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-cyan-300 to-slate-200 drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
                VAGY MÉGSEM?
              </div>
              <div className="text-slate-400 font-mono text-xs sm:text-sm tracking-widest">
                Valami megmozdult az utolsó lap mögött...
              </div>
            </div>
          )}

          {/* Step 3: "A Spirál figyel." */}
          {endingStep === 3 && (
            <div className="space-y-8 animate-fade-in">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full border border-cyan-400/60 flex items-center justify-center bg-cyan-950/40 shadow-[0_0_50px_rgba(56,189,248,0.5)] animate-spin-slow">
                <span className="text-5xl sm:text-6xl text-cyan-300">🌀</span>
              </div>
              <div className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-bold text-cyan-200 tracking-wider drop-shadow-[0_0_25px_rgba(56,189,248,0.6)]">
                A SPIRÁL FIGYEL.
              </div>
              <p className="text-slate-300 font-mono text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                „Ez nem a vége. Csak az utolsó oldal, amit még nem kell megírni.”
              </p>
            </div>
          )}

          {/* Step 4: Resolution & World Portal Navigation */}
          {endingStep === 4 && (
            <div className="max-w-xl mx-auto space-y-8 animate-fade-in relative z-20">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/50 bg-cyan-950/40 font-mono text-xs text-cyan-300 tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>KÖNYV TELJESÍTVE</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-slate-100">
                  ÁTLÉPTED A KÜSZÖBÖT
                </h2>
                <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
                  Befejezted <span className="text-cyan-300 font-medium">A Spirál Lehellete</span> teljes történetét. Most, hogy a könyv szövege a részeddé vált, tárd fel az Archívum titkos aktáit és oszd meg elméletedet a többi olvasóval!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setEndingStep(0);
                    onClose();
                    if (onNavigateToSection) onNavigateToSection('archive');
                  }}
                  className="p-3.5 rounded border border-cyan-400 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-200 font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                >
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>ARCHÍV-82 FELOLDÁSA</span>
                </button>

                <button
                  onClick={() => {
                    setEndingStep(0);
                    onClose();
                    if (onNavigateToSection) onNavigateToSection('mysteries');
                  }}
                  className="p-3.5 rounded border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>OLVASÓI ELMÉLETEK</span>
                </button>

                <button
                  onClick={() => {
                    setEndingStep(0);
                    onClose();
                  }}
                  className="p-3.5 rounded border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>VISSZA A VILÁGBA</span>
                </button>

                <button
                  onClick={() => {
                    setEndingStep(0);
                    goToChapter(0);
                  }}
                  className="p-3.5 rounded border border-cyan-950 bg-[#060b18] hover:border-cyan-800 text-cyan-400 font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>ÚJRAOLVASÁS AZ ELEJÉTŐL</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 9. FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded border border-cyan-500/60 bg-[#060d1c]/95 text-cyan-200 text-xs font-mono tracking-wider shadow-2xl backdrop-blur-md flex items-center gap-2 animate-slide-up">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
