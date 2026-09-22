import React, { useState } from 'react';
import { TimelineItem, SpoilerMode } from '../types';
import { TIMELINE_ITEMS } from '../data/loreData';
import { Clock, ShieldAlert, ChevronRight, X, Compass, Tag, Eye } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface StoryTimelineProps {
  spoilerMode: SpoilerMode;
  onUnlockFullUniverse: () => void;
}

export const StoryTimeline: React.FC<StoryTimelineProps> = ({
  spoilerMode,
  onUnlockFullUniverse,
}) => {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [unlockedItems, setUnlockedItems] = useState<Record<string, boolean>>({});
  const [filterPhase, setFilterPhase] = useState<'all' | 'early' | 'mid' | 'end'>('all');

  const handleItemClick = (item: TimelineItem) => {
    audioEngine.playSonarPing();
    setSelectedItem(item);
  };

  const handleUnlockSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUnlockedItems((prev) => ({ ...prev, [id]: true }));
    audioEngine.playSonarPing();
  };

  const filteredItems = TIMELINE_ITEMS.filter((item) => {
    if (filterPhase === 'early') return item.step <= 10;
    if (filterPhase === 'mid') return item.step > 10 && item.step <= 20;
    if (filterPhase === 'end') return item.step > 20;
    return true;
  });

  return (
    <section id="timeline" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#040810] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>KRONOLÓGIA & ANOMÁLIÁK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            INTERAKTÍV TÖRTÉNETI IDŐVONAL
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            A 28 állomás a Viktor által megtalált 1997-es radarnyomtól egészen a megíratlan utolsó oldalig
            kíséri végig az antarktiszi jég alatt megnyíló eseményeket.
          </p>

          {/* Phase Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'MIND A 28 ÁLLOMÁS' },
              { id: 'early', label: '1–10. FÁZIS: AZ EXPEDÍCIÓ' },
              { id: 'mid', label: '11–20. FÁZIS: A SPIRÁLOK' },
              { id: 'end', label: '21–28. FÁZIS: A VÁROSOK ÉS A VÉG' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterPhase(tab.id as any)}
                className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all border ${
                  filterPhase === tab.id
                    ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200 shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isLocked =
              spoilerMode === 'spoiler-free' && item.isSpoiler && !unlockedItems[item.id];

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`group relative p-5 rounded border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isLocked
                    ? 'border-rose-950/70 bg-[#080509]/80 hover:border-rose-800/80'
                    : 'border-slate-800/80 bg-[#050B14]/80 hover:border-cyan-500/50 hover:bg-[#071120]'
                }`}
              >
                <div className="space-y-3">
                  {/* Step badge & date */}
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-400 font-bold">
                      #{item.step < 10 ? `0${item.step}` : item.step}
                    </span>
                    <span className="text-slate-500">{item.location}</span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-base font-cinzel font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs font-mono text-cyan-400/70 tracking-wider">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Summary or Spoiler Guard */}
                  {isLocked ? (
                    <div className="p-3 rounded border border-rose-900/40 bg-rose-950/20 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400 font-semibold">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>⚠ SPOILER FIGYELMEZTETÉS</span>
                      </div>
                      <p className="text-[11px] text-rose-300/70 leading-tight">
                        Ez a pont a történet későbbi fordulatát fedi fel.
                      </p>
                      <button
                        onClick={(e) => handleUnlockSingle(item.id, e)}
                        className="w-full py-1 rounded bg-rose-900/40 hover:bg-rose-900/70 text-rose-200 text-[10px] font-mono tracking-wider uppercase transition-colors"
                      >
                        SPOILER MEGJELENÍTÉSE
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-3">
                      {item.summary}
                    </p>
                  )}
                </div>

                {/* Footer tags */}
                <div className="pt-3 mt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {item.atmosphere[0]}
                  </span>
                  <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    RÉSZLETEK <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Single Item Modal Detail */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-2xl w-full rounded border border-cyan-800/80 bg-[#050A14] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(2,132,199,0.3)]">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>TÖRTÉNETI ÁLLOMÁS #{selectedItem.step} / 28</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
                    {selectedItem.title}
                  </h3>
                  {selectedItem.subtitle && (
                    <p className="text-xs font-mono text-cyan-300">{selectedItem.subtitle}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded border border-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Meta information tags */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs text-slate-300">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">HELYSZÍN</span>
                  <span className="text-cyan-300 font-semibold">{selectedItem.location}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">IDŐSZAK</span>
                  <span className="text-slate-200">{selectedItem.date || 'Kronológia szerint'}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 block">HANGULAT</span>
                  <span className="text-slate-300">{selectedItem.atmosphere.join(', ')}</span>
                </div>
              </div>

              {/* Full Detailed Description */}
              <div className="space-y-3 text-sm text-slate-300 font-light leading-relaxed">
                <p className="text-slate-200 font-medium">{selectedItem.summary}</p>
                <p className="text-slate-400">{selectedItem.fullDetail}</p>

                {selectedItem.quote && (
                  <blockquote className="border-l-2 border-cyan-500 pl-4 py-1.5 text-cyan-200 italic font-cinzel text-base">
                    {selectedItem.quote}
                  </blockquote>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-2 rounded border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-200 text-xs font-mono uppercase"
                >
                  BEZÁRÁS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
