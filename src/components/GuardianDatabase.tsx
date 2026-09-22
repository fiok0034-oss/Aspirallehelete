import React, { useState } from 'react';
import { Guardian, SpoilerMode } from '../types';
import { GUARDIANS_DATA } from '../data/loreData';
import { Shield, Sparkles, Orbit, Eye, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface GuardianDatabaseProps {
  spoilerMode: SpoilerMode;
}

export const GuardianDatabase: React.FC<GuardianDatabaseProps> = ({ spoilerMode }) => {
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [unlockedGuardians, setUnlockedGuardians] = useState<Record<string, boolean>>({});

  const handleGuardianClick = (g: Guardian) => {
    audioEngine.playSonarPing();
    setSelectedGuardian(g);
  };

  const handleUnlockSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUnlockedGuardians((prev) => ({ ...prev, [id]: true }));
    audioEngine.playSonarPing();
  };

  return (
    <section id="guardians" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#040812] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>A VALÓSÁG PILÉREI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            AZ ŐRZŐK ADATBÁZISA
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            A könyv szerint kilenc ismert spirál és őrző tartja fenn a rendszer stabilitását. De a mélységben
            egy elhallgatott igazság várja a felfedezőt:
          </p>
          <div className="p-4 rounded border border-cyan-500/30 bg-[#051120] font-cinzel text-cyan-200 text-lg sm:text-xl italic shadow-[0_0_20px_rgba(56,189,248,0.15)]">
            «A Spirál nem kilenc. Mindig tíz volt.»
          </div>
        </div>

        {/* Guardians Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUARDIANS_DATA.map((guardian) => {
            const isNameless = guardian.isNameless;
            const isLocked =
              spoilerMode === 'spoiler-free' && guardian.isSpoiler && !unlockedGuardians[guardian.id];

            return (
              <div
                key={guardian.id}
                onClick={() => handleGuardianClick(guardian)}
                className={`group relative p-6 rounded border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isNameless
                    ? 'border-rose-500/50 bg-gradient-to-b from-[#180812] to-[#0a0307] md:col-span-2 lg:col-span-3 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
                    : 'border-slate-800 bg-[#060C18] hover:border-cyan-500/40 hover:bg-[#081324]'
                }`}
              >
                <div className="space-y-4">
                  {/* Guardian Badge */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] tracking-wider uppercase font-semibold border ${
                        isNameless
                          ? 'border-rose-500 bg-rose-950/60 text-rose-200'
                          : 'border-slate-700 bg-slate-900 text-cyan-400'
                      }`}
                    >
                      {guardian.designation}
                    </span>
                    <span className="text-slate-500">#{guardian.number < 10 ? `0${guardian.number}` : guardian.number} SPIRÁL</span>
                  </div>

                  {/* Title & Domain */}
                  <div>
                    <h3
                      className={`font-cinzel font-bold text-slate-100 group-hover:text-cyan-300 transition-colors ${
                        isNameless ? 'text-2xl sm:text-3xl text-rose-100' : 'text-xl'
                      }`}
                    >
                      {guardian.name}
                    </h3>
                    <p className="text-xs font-mono text-cyan-400/80 tracking-wider">
                      {guardian.domain}
                    </p>
                  </div>

                  {/* Summary or Spoiler warning */}
                  {isLocked ? (
                    <div className="p-3 rounded border border-rose-950/70 bg-rose-950/20 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>ŐRZŐ KÉSŐBBI LELEPLEZÉSE</span>
                      </div>
                      <p className="text-[11px] text-rose-300/70">
                        Ez az őrző a történet későbbi fejezeteiben fedi fel kilétét.
                      </p>
                      <button
                        onClick={(e) => handleUnlockSingle(guardian.id, e)}
                        className="py-1 px-3 rounded bg-rose-900/40 hover:bg-rose-900/70 text-rose-200 text-[10px] font-mono tracking-wider uppercase"
                      >
                        MUTASD AZ ŐRZŐT
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      {guardian.description}
                    </p>
                  )}
                </div>

                {/* Footer quote preview */}
                <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span className="truncate max-w-[200px] italic text-[11px] text-slate-400">
                    {guardian.quote}
                  </span>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    DOSSZIÉ <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Single Guardian Modal Detail */}
        {selectedGuardian && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-2xl w-full rounded border border-cyan-800/80 bg-[#050A14] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(2,132,199,0.3)]">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <Shield className="w-4 h-4" />
                    <span>{selectedGuardian.designation} // ARCHÍV-82 LORE</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-white">
                    {selectedGuardian.name}
                  </h3>
                  <p className="text-xs font-mono text-cyan-300">{selectedGuardian.domain}</p>
                </div>
                <button
                  onClick={() => setSelectedGuardian(null)}
                  className="p-1.5 rounded border border-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <div className="space-y-4 text-sm text-slate-300 font-light leading-relaxed">
                <p className="text-base text-slate-200">{selectedGuardian.description}</p>

                <div className="p-4 rounded border border-cyan-900/60 bg-cyan-950/20 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                    AZ ŐRZŐ MONDÁSA
                  </span>
                  <blockquote className="border-l-2 border-cyan-500 pl-4 py-1 text-cyan-200 italic font-cinzel text-base">
                    {selectedGuardian.quote}
                  </blockquote>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedGuardian(null)}
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
