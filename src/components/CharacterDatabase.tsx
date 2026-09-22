import React, { useState } from 'react';
import { Character, SpoilerMode } from '../types';
import { CHARACTERS_DATA } from '../data/loreData';
import { Users, ShieldAlert, Sparkles, Orbit, ChevronRight, X, Quote, Fingerprint } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface CharacterDatabaseProps {
  spoilerMode: SpoilerMode;
}

export const CharacterDatabase: React.FC<CharacterDatabaseProps> = ({ spoilerMode }) => {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [unlockedChars, setUnlockedChars] = useState<Record<string, boolean>>({});

  const handleOpenDossier = (char: Character) => {
    audioEngine.playSonarPing();
    setSelectedChar(char);
  };

  const handleUnlockSpoiler = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUnlockedChars((prev) => ({ ...prev, [id]: true }));
    audioEngine.playSonarPing();
  };

  return (
    <section id="characters" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#03060C] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Users className="w-3.5 h-3.5" />
            <span>KUTATÓK & ENTITÁSOK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            KARAKTER-ADATBÁZIS
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Ismerd meg az Antarktisz mélyére behatoló kutatókat és az ARCHÍV-82/Δ rendszerhez
            kapcsolódó sokdimenziós jelenléteket.
          </p>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHARACTERS_DATA.map((char) => {
            const isEntity = char.category === 'entity';
            const isLocked =
              spoilerMode === 'spoiler-free' && char.isSpoiler && !unlockedChars[char.id];

            return (
              <div
                key={char.id}
                onClick={() => handleOpenDossier(char)}
                className={`group relative p-6 sm:p-7 rounded border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isEntity
                    ? 'border-cyan-500/50 bg-gradient-to-b from-[#081528] to-[#040a14] md:col-span-2 lg:col-span-3 shadow-[0_0_30px_rgba(56,189,248,0.15)]'
                    : 'border-slate-800 bg-[#050A14] hover:border-cyan-500/40 hover:bg-[#071120]'
                }`}
              >
                <div className="space-y-4">
                  {/* Badge & Code */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span
                      className={`px-2.5 py-0.5 rounded uppercase font-semibold text-[10px] tracking-wider border ${
                        isEntity
                          ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                          : 'border-slate-700 bg-slate-900 text-slate-300'
                      }`}
                    >
                      {char.badge}
                    </span>
                    <span className="text-slate-500">{char.codeName}</span>
                  </div>

                  {/* Name & Role */}
                  <div>
                    <h3
                      className={`font-cinzel font-bold text-slate-100 group-hover:text-cyan-300 transition-colors ${
                        isEntity ? 'text-2xl sm:text-3xl' : 'text-xl'
                      }`}
                    >
                      {char.name}
                    </h3>
                    <p className="text-xs font-mono text-cyan-400/80 tracking-wider">
                      {char.role} {char.age && `• ${char.age} ÉVES`}
                    </p>
                  </div>

                  {/* Summary / Spoiler Guard */}
                  {isLocked ? (
                    <div className="p-3.5 rounded border border-rose-950/80 bg-rose-950/20 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>⚠ SPOILER: KÉSŐBBI KARAKTERLORE</span>
                      </div>
                      <p className="text-[11px] text-rose-300/70">
                        A karakter valódi identitása és szerepe a regény későbbi szakaszaiban derül ki.
                      </p>
                      <button
                        onClick={(e) => handleUnlockSpoiler(char.id, e)}
                        className="py-1 px-3 rounded bg-rose-900/40 hover:bg-rose-900/70 text-rose-200 text-[10px] font-mono tracking-wider uppercase"
                      >
                        DOSSZIÉ FELOLDÁSA
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-light">
                      {char.shortDesc}
                    </p>
                  )}

                  {/* Entity extra highlight */}
                  {isEntity && !isLocked && (
                    <div className="p-3 rounded border border-cyan-900/40 bg-cyan-950/20 font-mono text-xs text-cyan-300/80 space-y-1">
                      <div className="text-[10px] text-cyan-500 uppercase tracking-widest">
                        NEM-FIZIKAI, TÖBB-DIMENZIÓS TUDAT-ENTITÁS
                      </div>
                      <p className="text-xs text-slate-300">
                        Feltételezett nevei: Az Első Gondolat • Végtelen • Δ-Én • Időcsomó • Őrző
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>SZEMÉLYI DOSSZIÉ</span>
                  </span>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    TELJES ADATLAP <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Single Character Dossier Modal */}
        {selectedChar && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-3xl w-full rounded border border-cyan-800/80 bg-[#050A14] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(2,132,199,0.3)]">
              {/* Top Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <Fingerprint className="w-4 h-4" />
                    <span>SZEMÉLYI AKTANYILVÁNTARTÁS // {selectedChar.codeName}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-white">
                    {selectedChar.name}
                  </h3>
                  <p className="text-xs font-mono text-cyan-300">{selectedChar.role}</p>
                </div>
                <button
                  onClick={() => setSelectedChar(null)}
                  className="p-1.5 rounded border border-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                {selectedChar.keyAttributes.map((attr) => (
                  <div key={attr.label} className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">{attr.label}</span>
                    <span className="text-slate-200 font-semibold">{attr.value}</span>
                  </div>
                ))}
              </div>

              {/* Full Bio */}
              <div className="space-y-3 text-sm text-slate-300 font-light leading-relaxed">
                <h4 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
                  RÉSZLETES HÁTTÉRTÖRTÉNET & SZEREP
                </h4>
                <p>{selectedChar.fullBio}</p>

                {selectedChar.classifiedData && (
                  <div className="p-3.5 rounded border border-cyan-950 bg-cyan-950/20 font-mono text-xs text-cyan-300/90 space-y-1">
                    <span className="text-[10px] text-cyan-400 block font-bold uppercase tracking-widest">
                      [CLASSIFIED DATA / ARCHÍV-82]
                    </span>
                    <p>{selectedChar.classifiedData}</p>
                  </div>
                )}
              </div>

              {/* Quotes */}
              {selectedChar.quotes.length > 0 && (
                <div className="space-y-2 border-t border-slate-900 pt-4">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-cyan-400" />
                    <span>IDÉZETEK A REGÉNYBŐL</span>
                  </div>
                  {selectedChar.quotes.map((q, idx) => (
                    <blockquote
                      key={idx}
                      className="border-l-2 border-cyan-500 pl-4 py-1 text-cyan-200 italic font-cinzel text-sm sm:text-base"
                    >
                      {q}
                    </blockquote>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedChar(null)}
                  className="px-6 py-2 rounded border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-200 text-xs font-mono uppercase"
                >
                  AKTÁZÁS & BEZÁRÁS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
