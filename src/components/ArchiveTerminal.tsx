import React, { useState } from 'react';
import { ArchiveDocument, ArchiveCategory, SpoilerMode } from '../types';
import { ARCHIVE_DOCUMENTS } from '../data/loreData';
import { Terminal, FileText, Lock, Unlock, Search, X, AlertOctagon, Filter, Eye } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface ArchiveTerminalProps {
  spoilerMode: SpoilerMode;
}

export const ArchiveTerminal: React.FC<ArchiveTerminalProps> = ({ spoilerMode }) => {
  const [selectedDoc, setSelectedDoc] = useState<ArchiveDocument | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ÖSSZES');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);

  const categories = [
    'ÖSSZES',
    'Georadarfelvételek',
    'Rádiójelek',
    'Műholdképek',
    'Δ–82',
    'Ismeretlen szimbólumok',
    'Időanomáliák',
    'Vörös Porszoba',
    'Törés',
  ];

  const handleOpenDoc = (doc: ArchiveDocument) => {
    setIsGlitching(true);
    audioEngine.playSonarPing();
    setTimeout(() => {
      setSelectedDoc(doc);
      setIsGlitching(false);
    }, 280);
  };

  const filteredDocs = ARCHIVE_DOCUMENTS.filter((doc) => {
    const matchesCat = activeCategory === 'ÖSSZES' || doc.category === activeCategory;
    const matchesQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <section id="archive" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#02050A] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Terminal className="w-3.5 h-3.5" />
            <span>KATONAI & TUDOMÁNYOS ADATBÁZIS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            INTERAKTÍV „ARCHÍV-82” TERMINÁL
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Hozzáférés a McMurdo és a Genfi Kutatóintézet zárt archívumához. Vizsgáld meg a feloldott
            dossziékat, radarvázlatokat és a rejtélyes Δ–82 kódkészletet!
          </p>
        </div>

        {/* Terminal Window Box */}
        <div className="rounded border border-cyan-950/90 bg-[#030712] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)]">
          {/* Terminal Titlebar */}
          <div className="bg-[#050A18] border-b border-cyan-900/50 p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="font-bold tracking-wider">TERMINAL // ARCHÍV-82 SECURE_NODE v4.19</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-[11px]">
              <span>BIZTONSÁGI SZINT: KORLÁTOZOTT</span>
              <span className="text-cyan-400/80">KAPCSOLAT: ÉLŐ</span>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="p-4 border-b border-slate-800 bg-[#040814] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono text-xs">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keresés aktaszám, cím vagy kulcsszó alapján..."
                className="w-full pl-9 pr-4 py-2 rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-xs"
              />
            </div>

            {/* Quick status */}
            <div className="text-slate-500 text-[11px] flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-cyan-500" />
              <span>TALÁLATOK: {filteredDocs.length} DOSSZIÉ</span>
            </div>
          </div>

          {/* Category Pills Bar */}
          <div className="p-3 bg-[#03060F] border-b border-slate-900 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-all border ${
                  activeCategory === cat
                    ? 'border-cyan-500/70 bg-cyan-950/60 text-cyan-200'
                    : 'border-slate-800/80 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Document Dossier Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[300px]">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleOpenDoc(doc)}
                className="group p-4 rounded border border-slate-800/80 bg-[#050A14] hover:border-cyan-500/50 hover:bg-[#071222] transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-cyan-400 font-bold">{doc.docNumber}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded border uppercase text-[9px] ${
                        doc.classification === 'TOP SECRET'
                          ? 'border-rose-900/60 bg-rose-950/40 text-rose-300'
                          : 'border-amber-900/60 bg-amber-950/40 text-amber-300'
                      }`}
                    >
                      {doc.classification}
                    </span>
                  </div>

                  <h3 className="text-sm font-cinzel font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 font-light leading-relaxed">
                    {doc.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>{doc.date}</span>
                  <span className="text-cyan-400 group-hover:underline">MEGNYITÁS →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Glitch Overlay during file open */}
        {isGlitching && (
          <div className="fixed inset-0 z-50 bg-cyan-950/40 backdrop-blur-sm flex items-center justify-center pointer-events-none animate-glitch">
            <div className="font-mono text-cyan-300 text-sm tracking-widest bg-black/80 p-4 border border-cyan-500">
              DECRYPTING ARCHÍV-82 PAYLOAD...
            </div>
          </div>
        )}

        {/* Dossier Detail Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-3xl w-full rounded border border-cyan-800 bg-[#040915] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(2,132,199,0.3)] font-mono text-xs">
              {/* Top Banner */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 text-[10px] font-bold">
                      {selectedDoc.classification}
                    </span>
                    <span className="text-cyan-400 font-bold">{selectedDoc.docNumber}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
                    {selectedDoc.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 flex flex-wrap gap-3">
                    <span>HELYSZÍN: {selectedDoc.location}</span>
                    <span>DÁTUM: {selectedDoc.date}</span>
                    <span>KATEGÓRIA: {selectedDoc.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 rounded border border-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status HUD Header */}
              <div className="p-3 rounded border border-cyan-950 bg-cyan-950/20 text-[11px] text-cyan-300 space-y-1">
                <div>ARCHÍV-82/Δ STATUS: VERIFIED</div>
                <div>SIGNAL: DETECTED // FREQUENCY 50MHz</div>
                <div>LOCATION: 82°16’S / 36°01’E</div>
              </div>

              {/* Summary */}
              <div className="space-y-2 text-slate-300 font-sans text-sm leading-relaxed">
                <div className="font-mono text-xs text-slate-500 uppercase tracking-wider">ÖSSZEFOGLALÓ</div>
                <p>{selectedDoc.summary}</p>
              </div>

              {/* Transcript / Content */}
              <div className="space-y-2 border-t border-slate-800 pt-4">
                <div className="text-slate-500 uppercase tracking-wider text-[11px]">
                  RÖGZÍTETT TELEMETRIA ÉS ÁTIRAT
                </div>
                <div className="p-4 rounded border border-slate-800 bg-slate-950 space-y-1.5 text-slate-300 leading-relaxed">
                  {selectedDoc.transcript.map((line, idx) => (
                    <div key={idx} className="font-mono text-[11px]">
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-slate-800 pt-4 text-[11px]">
                {Object.entries(selectedDoc.metadata).map(([key, val]) => (
                  <div key={key} className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">{key}</span>
                    <span className="text-slate-200">{val}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-6 py-2 rounded border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-200 text-xs font-mono uppercase"
                >
                  DOSSZIÉ ZÁRÁSA
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
