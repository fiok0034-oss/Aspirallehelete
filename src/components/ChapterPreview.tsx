import React, { useState } from 'react';
import { CHAPTERS_DATA } from '../data/loreData';
import { BookOpen, ChevronLeft, ChevronRight, Quote, Compass, Eye, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface ChapterPreviewProps {
  onOpenReader?: (chapterIndex?: number) => void;
}

export const ChapterPreview: React.FC<ChapterPreviewProps> = ({ onOpenReader }) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const chapter = CHAPTERS_DATA[activeChapterIndex];

  const handlePrev = () => {
    if (activeChapterIndex > 0) {
      audioEngine.playSonarPing();
      setActiveChapterIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (activeChapterIndex < CHAPTERS_DATA.length - 1) {
      audioEngine.playSonarPing();
      setActiveChapterIndex((prev) => prev + 1);
    }
  };

  const handleSelectChapter = (idx: number) => {
    audioEngine.playSonarPing();
    setActiveChapterIndex(idx);
  };

  return (
    <section id="chapters" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#040810] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>KÖNYVFEJEZETEK & KIVONATOK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            FEJEZETBETEKINTŐ
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Tekints bele a 28 fejezet hivatalos kivonataiba, hangulati leírásaiba és a regény kulcsmondataiba!
          </p>
        </div>

        {/* Quick Chapter Selector Strip */}
        <div className="p-3 rounded border border-slate-800 bg-[#050B16] overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          {CHAPTERS_DATA.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => handleSelectChapter(idx)}
              className={`px-3 py-1.5 rounded font-mono text-xs whitespace-nowrap transition-all border ${
                idx === activeChapterIndex
                  ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              {ch.romanPart || `#${idx + 1}`}
            </button>
          ))}
        </div>

        {/* Main Chapter Reader Presentation Card */}
        <div className="rounded border border-cyan-900/60 bg-[#050C1A] p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          {/* Subtle background insignia */}
          <div className="absolute right-6 bottom-6 opacity-5 font-cinzel text-9xl text-cyan-200 select-none pointer-events-none">
            {activeChapterIndex + 1}
          </div>

          <div className="space-y-6 relative z-10">
            {/* Top metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded bg-cyan-950/70 border border-cyan-800 text-cyan-300 font-bold uppercase tracking-widest">
                {chapter.romanPart} ({activeChapterIndex + 1} / {CHAPTERS_DATA.length})
              </span>
              <span className="text-slate-400">HELYSZÍN: {chapter.location}</span>
            </div>

            {/* Chapter Titles */}
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-4xl font-cinzel font-bold text-slate-100">
                {chapter.title}
              </h3>
              <p className="text-sm font-mono text-cyan-400/80 tracking-wider">
                {chapter.subtitle}
              </p>
            </div>

            {/* Quote Block / Mystery Link */}
            <blockquote className="border-l-2 border-cyan-500 pl-4 py-2 text-cyan-200 italic font-cinzel text-base sm:text-lg bg-cyan-950/15 rounded-r">
              „{chapter.summary}”
            </blockquote>

            {/* Deep Description & Characters */}
            <div className="space-y-3 text-slate-300 text-sm sm:text-base font-light leading-relaxed max-w-4xl">
              <p>{chapter.deepDescription}</p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-slate-400">
                <span className="px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800">
                  HANGULAT: {chapter.mood}
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800">
                  SZEREPLŐK: {chapter.keyCharacters.join(', ')}
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800 text-cyan-400/80">
                  REJTÉLY: {chapter.relatedMystery}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Navigation Controls */}
          <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={activeChapterIndex === 0}
                className="px-4 py-2 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ELŐZŐ FEJEZET</span>
              </button>

              <button
                onClick={handleNext}
                disabled={activeChapterIndex === CHAPTERS_DATA.length - 1}
                className="px-4 py-2 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all"
              >
                <span>KÖVETKEZŐ FEJEZET</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {onOpenReader && (
                <button
                  onClick={() => {
                    audioEngine.playSonarPing();
                    // Match chapter index in reader (bookData)
                    onOpenReader(activeChapterIndex);
                  }}
                  className="px-4 py-2 rounded border border-cyan-400 bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-200 text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(56,189,248,0.25)] font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
                  <span>TELJES FEJEZET OLVASÁSA</span>
                </button>
              )}
            </div>

            <div className="text-xs font-mono text-slate-500">
              KÖVETKEZŐ: {activeChapterIndex + 1} / {CHAPTERS_DATA.length} LAPOZVA
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
