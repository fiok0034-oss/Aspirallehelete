import React, { useState } from 'react';
import { TimelineItem, SpoilerMode } from '../types';
import { TIMELINE_ITEMS } from '../data/loreData';
import { Clock, ShieldAlert, ChevronRight, X, Compass, AlertTriangle, Layers, Eye, Brain } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { trackDiscovery } from '../utils/discoveryStorage';

interface StoryTimelineProps {
  spoilerMode: SpoilerMode;
  onUnlockFullUniverse: () => void;
}

type TimelineLayer = 'KRONOLÓGIA' | 'EMLÉKEZET' | 'VALÓSÁG';

// Anomaly divergence lookup: steps where memory or official log contradicts real events
const ANOMALY_STEPS = [4, 6, 8, 12, 15, 18, 21, 24, 28];

export const StoryTimeline: React.FC<StoryTimelineProps> = ({
  spoilerMode,
  onUnlockFullUniverse,
}) => {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [unlockedItems, setUnlockedItems] = useState<Record<string, boolean>>({});
  const [filterPhase, setFilterPhase] = useState<'all' | 'early' | 'mid' | 'end'>('all');
  const [activeLayer, setActiveLayer] = useState<TimelineLayer>('KRONOLÓGIA');

  const handleItemClick = (item: TimelineItem) => {
    audioEngine.playSonarPing();
    setSelectedItem(item);
    trackDiscovery.secretFound(`timeline_step_${item.step}`);
  };

  const handleUnlockSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUnlockedItems((prev) => ({ ...prev, [id]: true }));
    audioEngine.playSonarPing();
  };

  const handleSwitchLayer = (layer: TimelineLayer) => {
    audioEngine.playSonarPing();
    setActiveLayer(layer);
    trackDiscovery.secretFound(`timeline_layer_${layer}`);
  };

  const filteredItems = TIMELINE_ITEMS.filter((item) => {
    if (filterPhase === 'early') return item.step <= 10;
    if (filterPhase === 'mid') return item.step > 10 && item.step <= 20;
    if (filterPhase === 'end') return item.step > 20;
    return true;
  });

  const getLayerInterpretation = (item: TimelineItem, layer: TimelineLayer) => {
    const hasAnomaly = ANOMALY_STEPS.includes(item.step);

    if (layer === 'KRONOLÓGIA') {
      return {
        label: 'HIVATALOS KRONOLÓGIA',
        subtitle: 'Mi történt a hivatalos expedíciós jegyzőkönyv szerint?',
        text: item.summary,
      };
    }
    if (layer === 'EMLÉKEZET') {
      return {
        label: 'SZUBJEKTÍV EMLÉKEZET',
        subtitle: 'Ki mire emlékszik a mélységben?',
        text: hasAnomaly
          ? `A megfigyelők beszámolói eltérnek az órák állásától. Viktor naplójában a napok sorrendje felcserélődött, Lena pedig olyan emlékekről számol be, amelyek látszólag a jövőben játszódtak le.`
          : `A résztvevők emlékezete megegyezik a feljegyzésekkel, de az időérzékelésük lelassult.`,
      };
    }
    // VALÓSÁG
    return {
      label: 'TÉNYLEGES VALÓSÁG (A SPIRÁL SZERINT)',
      subtitle: 'Mi történt valójában a nem-lineáris téridőben?',
      text: hasAnomaly
        ? `A fizikai téridő itt összeroppant. Nem egymást követő pillanatok léteztek, hanem a megfigyelő tudata által generált párhuzamos valóságrétegek, amelyekben Viktor egyszerre tűnt el és maradt jelen.`
        : item.fullDetail,
    };
  };

  return (
    <section id="timeline" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#040810] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>KRONOLÓGIA & 3-RÉTEGŰ TÖRTÉNETI TÉRKÉP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            INTERAKTÍV IDŐVONAL
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            A történet nem csupán egymást követő események sora. Válts a három réteg között, és fedezd fel a hivatalos jegyzőkönyv, az emberi emlékezet és a Spirál tényleges valósága közötti eltéréseket!
          </p>

          {/* 75. Három külön réteg kapcsoló: KRONOLÓGIA, EMLÉKEZET, VALÓSÁG */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => handleSwitchLayer('KRONOLÓGIA')}
              className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-xs uppercase tracking-wider transition-all border ${
                activeLayer === 'KRONOLÓGIA'
                  ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 shadow-[0_0_15px_rgba(56,189,248,0.3)] font-bold'
                  : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. KRONOLÓGIA (MI TÖRTÉNT?)</span>
            </button>

            <button
              onClick={() => handleSwitchLayer('EMLÉKEZET')}
              className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-xs uppercase tracking-wider transition-all border ${
                activeLayer === 'EMLÉKEZET'
                  ? 'border-indigo-400 bg-indigo-950/70 text-indigo-200 shadow-[0_0_15px_rgba(129,140,248,0.3)] font-bold'
                  : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>2. EMLÉKEZET (KI MIRE EMLÉKSZIK?)</span>
            </button>

            <button
              onClick={() => handleSwitchLayer('VALÓSÁG')}
              className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-xs uppercase tracking-wider transition-all border ${
                activeLayer === 'VALÓSÁG'
                  ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)] font-bold'
                  : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. VALÓSÁG (A SPIRÁL SZERINT)</span>
            </button>
          </div>

          {/* Phase Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'all', label: 'MIND A 28 ÁLLOMÁS' },
              { id: 'early', label: '1–10. FÁZIS: AZ EXPEDÍCIÓ' },
              { id: 'mid', label: '11–20. FÁZIS: A SPIRÁLOK' },
              { id: 'end', label: '21–28. FÁZIS: A VÁROSOK ÉS A VÉG' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterPhase(tab.id as any)}
                className={`px-3 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all border ${
                  filterPhase === tab.id
                    ? 'border-slate-600 bg-slate-800 text-white'
                    : 'border-slate-800/80 bg-slate-900/30 text-slate-500 hover:text-slate-300'
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
            const hasAnomaly = ANOMALY_STEPS.includes(item.step);
            const interp = getLayerInterpretation(item, activeLayer);

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
                  {/* Step badge, date, and anomaly flag */}
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-400 font-bold">
                      #{item.step < 10 ? `0${item.step}` : item.step}
                    </span>
                    <span className="text-slate-500">{item.location}</span>
                  </div>

                  {/* 75. ⚠️ KRONOLÓGIAI ELTÉRÉS Badge */}
                  {hasAnomaly && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/60 text-amber-300 text-[10px] font-mono font-bold tracking-wider">
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>⚠ KRONOLÓGIAI ELTÉRÉS</span>
                    </div>
                  )}

                  {/* Title */}
                  <div>
                    <h4 className="font-cinzel font-bold text-lg text-slate-100 group-hover:text-cyan-200 transition-colors">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="text-xs font-mono text-cyan-400/80 mt-0.5">{item.subtitle}</p>
                    )}
                  </div>

                  {/* Active Layer Dynamic Excerpt */}
                  <div className="text-xs text-slate-300 font-light leading-relaxed line-clamp-3">
                    {interp.text}
                  </div>
                </div>

                {/* Footer bar */}
                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>{item.date || 'Expedíciós napló'}</span>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                    <span>Vizsgálat</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Single Item Modal Detail */}
        {selectedItem && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
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
                  title="Bezárás"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Anomaly banner if divergent */}
              {ANOMALY_STEPS.includes(selectedItem.step) && (
                <div className="p-3.5 rounded bg-amber-950/30 border border-amber-500/60 text-amber-200 text-xs font-mono flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>⚠ KRONOLÓGIAI ELTÉRÉS ÉSZLELVE:</strong> A fizikai események és a megfigyelők emlékezete nem vágnak egybe. A Spirál mélységi zónájában az idő linearitása felbomlott.
                  </div>
                </div>
              )}

              {/* 3-Layer Comparative Matrix in Modal */}
              <div className="space-y-3 p-4 rounded bg-black/50 border border-cyan-950">
                <div className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                  RÉTEGEK ÖSSZEHASONLÍTÁSA (3 NÉZŐPONT):
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                    <span className="font-mono text-cyan-300 font-bold block mb-1">
                      1. KRONOLÓGIA (MI TÖRTÉNT?):
                    </span>
                    <p className="text-slate-300 leading-relaxed">{selectedItem.summary}</p>
                  </div>

                  <div className="p-2.5 rounded bg-indigo-950/30 border border-indigo-900/60">
                    <span className="font-mono text-indigo-300 font-bold block mb-1">
                      2. EMLÉKEZET (KI MIRE EMLÉKSZIK?):
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {getLayerInterpretation(selectedItem, 'EMLÉKEZET').text}
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-900/60">
                    <span className="font-mono text-emerald-300 font-bold block mb-1">
                      3. VALÓSÁG (A SPIRÁL TÖRVÉNYEI SZERINT):
                    </span>
                    <p className="text-slate-300 leading-relaxed">{selectedItem.fullDetail}</p>
                  </div>
                </div>
              </div>

              {selectedItem.quote && (
                <blockquote className="border-l-2 border-cyan-500 pl-4 py-1.5 text-cyan-200 italic font-cinzel text-base bg-black/30">
                  {selectedItem.quote}
                </blockquote>
              )}

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
