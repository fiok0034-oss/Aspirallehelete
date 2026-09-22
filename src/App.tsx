/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SpoilerMode } from './types';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { StoryIntro } from './components/StoryIntro';
import { StoryOverview } from './components/StoryOverview';
import { AntarcticMap } from './components/AntarcticMap';
import { SpiralExperience } from './components/SpiralExperience';
import { StoryTimeline } from './components/StoryTimeline';
import { CharacterDatabase } from './components/CharacterDatabase';
import { GuardianDatabase } from './components/GuardianDatabase';
import { NineSpiralsMap } from './components/NineSpiralsMap';
import { ArchiveTerminal } from './components/ArchiveTerminal';
import { RedDustRoom } from './components/RedDustRoom';
import { FractureCity } from './components/FractureCity';
import { ChapterPreview } from './components/ChapterPreview';
import { AuthorAndEditions } from './components/AuthorAndEditions';
import { ReaderTheoriesAndFrequency } from './components/ReaderTheoriesAndFrequency';
import { Footer } from './components/Footer';
import { BookReader } from './components/BookReader';
import { BOOK_CHAPTERS } from './data/bookData';
import { BookOpen, Sparkles, X } from 'lucide-react';

export default function App() {
  const [spoilerMode, setSpoilerMode] = useState<SpoilerMode>('spoiler-free');
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [readerChapterIndex, setReaderChapterIndex] = useState(0);
  const [savedProgress, setSavedProgress] = useState<{ chapterIndex: number; percentage: number } | null>(null);
  const [showResumeBanner, setShowResumeBanner] = useState(true);

  // Load saved progress from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('spiral_reader_progress');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.chapterIndex === 'number') {
          setSavedProgress({ chapterIndex: parsed.chapterIndex, percentage: parsed.percentage || 0 });
        }
      }
    } catch {
      // ignore
    }
  }, [isReaderOpen]);

  const handleOpenReader = (chapterIdx?: number) => {
    if (typeof chapterIdx === 'number') {
      setReaderChapterIndex(chapterIdx);
    } else if (savedProgress && savedProgress.chapterIndex > 0) {
      setReaderChapterIndex(savedProgress.chapterIndex);
    } else {
      setReaderChapterIndex(0);
    }
    setIsReaderOpen(true);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Top Main Navigation */}
      <Navigation
        spoilerMode={spoilerMode}
        onToggleSpoilerMode={(mode) => setSpoilerMode(mode)}
        onOpenReader={() => handleOpenReader()}
        onOpenTerminalQuick={() => scrollTo('archive')}
      />

      {/* Main Experience Flow */}
      <main>
        {/* 1. Cinematic Hero Section with Breathing Spiral & Night Sky */}
        <Hero
          onEnterStory={() => scrollTo('intro')}
          onExploreMysteries={() => scrollTo('story')}
          onNavigateToCoordinates={() => scrollTo('map')}
          onOpenReader={() => handleOpenReader()}
        />

        {/* 2. Story Intro / The Threshold */}
        <StoryIntro onProceedToStory={() => scrollTo('story')} />

        {/* 3. Story Overview / Five Pillars & Philosophy */}
        <StoryOverview
          onExploreTimeline={() => scrollTo('timeline')}
          onExploreSpiral={() => scrollTo('spiral')}
        />

        {/* 4. Interactive Antarctic Map with Hotspot & Sub-Ice Inspection */}
        <AntarcticMap onDiveComplete={() => scrollTo('spiral')} />

        {/* 5. The Interactive Spiral Consciousness */}
        <SpiralExperience />

        {/* 6. 28-Phase Story Timeline */}
        <StoryTimeline
          spoilerMode={spoilerMode}
          onUnlockFullUniverse={() => setSpoilerMode('full-universe')}
        />

        {/* 7. Character Dossiers & The Infinite Entity */}
        <CharacterDatabase spoilerMode={spoilerMode} />

        {/* 8. Guardians Database & The 10th Nameless Guardian */}
        <GuardianDatabase spoilerMode={spoilerMode} />

        {/* 9. Nine Spirals Constellation Map & Hidden 10th Node */}
        <NineSpiralsMap />

        {/* 10. Atmospheric Chamber: The Red Dust Room */}
        <RedDustRoom />

        {/* 11. The Fracture City: Glitched Architecture & Time Anomaly */}
        <FractureCity />

        {/* 12. Interactive Classified Archive-82 Terminal */}
        <ArchiveTerminal spoilerMode={spoilerMode} />

        {/* 13. Official Chapter Previews & Excerpts (28 Chapters) */}
        <ChapterPreview onOpenReader={(idx) => handleOpenReader(idx)} />

        {/* 14. Author Profile (Csurik Konrád) & Book Editions Preorder */}
        <AuthorAndEditions />

        {/* 15. Community Theories & Secret 50 MHz Transmission Decoder */}
        <ReaderTheoriesAndFrequency />
      </main>

      {/* Floating Resume Reading Quick Access Pill */}
      {savedProgress && savedProgress.chapterIndex > 0 && showResumeBanner && !isReaderOpen && (
        <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 p-2 sm:p-2.5 rounded-full border border-cyan-400/80 bg-[#050c1b]/95 text-xs font-mono backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.3)] animate-slide-up">
          <button
            onClick={() => handleOpenReader(savedProgress.chapterIndex)}
            className="flex items-center gap-2 text-cyan-200 hover:text-white px-2"
          >
            <BookOpen className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>
              Folytatás: <strong className="text-white">{BOOK_CHAPTERS[savedProgress.chapterIndex]?.title.substring(0, 24)}...</strong>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[10px] text-cyan-300">
              {savedProgress.percentage}%
            </span>
          </button>
          <button
            onClick={() => setShowResumeBanner(false)}
            className="p-1 rounded-full text-slate-500 hover:text-slate-300 transition-colors"
            title="Elrejtés"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Full-Screen Online Book Reader Modal */}
      {isReaderOpen && (
        <BookReader
          initialChapterIndex={readerChapterIndex}
          spoilerMode={spoilerMode}
          onClose={() => setIsReaderOpen(false)}
          onNavigateToSection={(sectionId) => {
            setIsReaderOpen(false);
            scrollTo(sectionId);
          }}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

