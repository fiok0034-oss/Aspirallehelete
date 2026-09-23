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
import { InteractiveGlobe } from './components/InteractiveGlobe';
import { SubIceWorld } from './components/SubIceWorld';
import { SpiralExperience } from './components/SpiralExperience';
import { StoryTimeline } from './components/StoryTimeline';
import { CharacterDatabase } from './components/CharacterDatabase';
import { PsychologicalMap } from './components/PsychologicalMap';
import { GuardianDatabase } from './components/GuardianDatabase';
import { NineSpiralsMap } from './components/NineSpiralsMap';
import { ArchiveTerminal } from './components/ArchiveTerminal';
import { RedDustRoom } from './components/RedDustRoom';
import { FractureCity } from './components/FractureCity';
import { ChapterPreview } from './components/ChapterPreview';
import { BehindTheScenes } from './components/BehindTheScenes';
import { AuthorAndEditions } from './components/AuthorAndEditions';
import { ReaderTheoriesAndFrequency } from './components/ReaderTheoriesAndFrequency';
import { Footer } from './components/Footer';
import { BookReader } from './components/BookReader';
import { CinematicIntro } from './components/CinematicIntro';
import { UserProfileModal } from './components/UserProfileModal';
import { NamelessSpiralModal } from './components/NamelessSpiralModal';
import { BOOK_CHAPTERS } from './data/bookData';
import { BookOpen, Sparkles, X, Compass, Globe } from 'lucide-react';
import { getDiscoveryState, trackDiscovery } from './utils/discoveryStorage';
import { audioEngine } from './utils/audioEngine';

export default function App() {
  const [spoilerMode, setSpoilerMode] = useState<SpoilerMode>('spoiler-free');
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [readerChapterIndex, setReaderChapterIndex] = useState(0);
  const [savedProgress, setSavedProgress] = useState<{ chapterIndex: number; percentage: number } | null>(null);
  const [showResumeBanner, setShowResumeBanner] = useState(true);

  // 62. Cinematic intro visibility
  const [introDismissed, setIntroDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('spiral_intro_seen') === 'true';
    } catch {
      return false;
    }
  });

  // Modal dialog states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNamelessOpen, setIsNamelessOpen] = useState(false);
  const [hasSecret10Ready, setHasSecret10Ready] = useState(false);

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

  // Check if user is eligible for the 10th Nameless Spiral event
  useEffect(() => {
    const checkStatus = () => {
      const state = getDiscoveryState();
      if (
        state.secretsFound.length >= 3 ||
        state.chaptersRead.length >= 2 ||
        state.archivesOpened.length >= 3
      ) {
        setHasSecret10Ready(true);
      }
    };
    checkStatus();
    window.addEventListener('spiral_discovery_update', checkStatus);
    return () => window.removeEventListener('spiral_discovery_update', checkStatus);
  }, []);

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

  const handleDismissIntro = (targetSection?: string) => {
    try {
      sessionStorage.setItem('spiral_intro_seen', 'true');
    } catch {
      // ignore
    }
    setIntroDismissed(true);

    if (targetSection) {
      setTimeout(() => {
        scrollTo(targetSection);
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* 62. Cinematic Intro Modal Overlay (First load) */}
      {!introDismissed && (
        <CinematicIntro
          onEnterReader={() => {
            handleDismissIntro();
            handleOpenReader(0);
          }}
          onEnterUniverse={() => {
            handleDismissIntro('hero');
          }}
          onEnterArchive={() => {
            handleDismissIntro('archive');
          }}
          onClose={() => {
            handleDismissIntro();
          }}
        />
      )}

      {/* Top Main Navigation */}
      <Navigation
        spoilerMode={spoilerMode}
        onToggleSpoilerMode={(mode) => setSpoilerMode(mode)}
        onOpenReader={() => handleOpenReader()}
        onOpenTerminalQuick={() => scrollTo('archive')}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Experience Flow */}
      <main>
        {/* 1. Cinematic Hero Section */}
        <Hero
          onEnterStory={() => scrollTo('intro')}
          onExploreMysteries={() => scrollTo('story')}
          onNavigateToCoordinates={() => scrollTo('antarctic-globe')}
          onOpenReader={() => handleOpenReader()}
        />

        {/* 2. Story Intro / The Threshold */}
        <StoryIntro onProceedToStory={() => scrollTo('story')} />

        {/* 3. Story Overview / Five Pillars & Philosophy */}
        <StoryOverview
          onExploreTimeline={() => scrollTo('timeline')}
          onExploreSpiral={() => scrollTo('spiral')}
        />

        {/* 63. Interactive Antarctic 3D/2.5D Globe */}
        <InteractiveGlobe onDiveUnderIce={() => scrollTo('sub-ice')} />

        {/* 64 & 65. The Sub-Ice Subterranean World & Digital Archaeology Scanner */}
        <SubIceWorld />

        {/* 4. Topographical & Station Radar Map */}
        <AntarcticMap onDiveComplete={() => scrollTo('spiral')} />

        {/* 5. The Interactive Spiral Consciousness */}
        <SpiralExperience />

        {/* 6. 3-Layer Story Timeline (Kronológia / Emlékezet / Valóság) */}
        <StoryTimeline
          spoilerMode={spoilerMode}
          onUnlockFullUniverse={() => setSpoilerMode('full-universe')}
        />

        {/* 7. Character Dossiers */}
        <CharacterDatabase spoilerMode={spoilerMode} />

        {/* 76 & 77. Psychological Relationship Graph */}
        <PsychologicalMap />

        {/* 8. Guardians Database */}
        <GuardianDatabase spoilerMode={spoilerMode} />

        {/* 9. Nine Spirals Constellation Map */}
        <NineSpiralsMap />

        {/* 10. Atmospheric Chamber: The Red Dust Room */}
        <RedDustRoom />

        {/* 11. The Fracture City */}
        <FractureCity />

        {/* 66–68 & 70. Archive-82 Live Terminal with VOID files & Spiral Reactions */}
        <ArchiveTerminal spoilerMode={spoilerMode} />

        {/* 82 & 83. Behind the Scenes & Author Notes */}
        <BehindTheScenes />

        {/* 13. Official Chapter Previews & Excerpts (42 Chapters) */}
        <ChapterPreview onOpenReader={(idx) => handleOpenReader(idx)} />

        {/* 14. Author Profile (Csurik Konrád) & Book Editions */}
        <AuthorAndEditions />

        {/* 78–80. Mysteries Database & Reader Theories with Local Submission */}
        <ReaderTheoriesAndFrequency />
      </main>

      {/* 100. Rare Endgame "10" Floating Orb */}
      {hasSecret10Ready && !isNamelessOpen && (
        <button
          onClick={() => {
            audioEngine.playSonarPing();
            setIsNamelessOpen(true);
          }}
          title="Tizedik Rejtély"
          className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full border border-cyan-400 bg-[#040916]/90 flex items-center justify-center text-cyan-200 font-mono font-bold text-sm shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:scale-110 hover:border-white transition-all animate-pulse"
        >
          10
        </button>
      )}

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

      {/* 71 & 72. User Profile Modal */}
      {isProfileOpen && (
        <UserProfileModal
          onClose={() => setIsProfileOpen(false)}
          onOpenReader={() => {
            setIsProfileOpen(false);
            handleOpenReader();
          }}
        />
      )}

      {/* 100. The Nameless 10th Spiral Modal */}
      {isNamelessOpen && (
        <NamelessSpiralModal onClose={() => setIsNamelessOpen(false)} />
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
