import React, { useState, useEffect, useRef } from 'react';
import { ArchiveDocument, ArchiveCategory, SpoilerMode } from '../types';
import { ARCHIVE_DOCUMENTS } from '../data/loreData';
import { Terminal, FileText, Lock, Unlock, Search, X, AlertOctagon, Filter, Eye, Sparkles, Shield, AlertTriangle } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { trackDiscovery } from '../utils/discoveryStorage';

interface ArchiveTerminalProps {
  spoilerMode: SpoilerMode;
  onOpenZeroRoom?: () => void;
  onOpenInfinite?: () => void;
}

// 67. Minősítési szintek & VOID dokumentumok
export type SecurityClassification = 'PUBLIC' | 'RESTRICTED' | 'CLASSIFIED' | 'TOP SECRET' | 'UNKNOWN' | 'VOID';

interface ExtendedArchiveDoc extends ArchiveDocument {
  secTier: SecurityClassification;
  customCategory: 'SZEMÉLYEK' | 'HELYSZÍNEK' | 'ENTITÁSOK' | 'OBJEKTUMOK' | 'DOKUMENTUMOK' | 'ANOMÁLIÁK' | 'KOORDINÁTÁK';
}

const VOID_DOCS: ExtendedArchiveDoc[] = [
  {
    id: 'void-001',
    docNumber: 'ARCHÍV-82 / VOID-001',
    title: 'A Nem Létező Esemény',
    category: 'Időanomáliák',
    customCategory: 'ANOMÁLIÁK',
    secTier: 'VOID',
    classification: 'TOP SECRET',
    date: 'NEM RÖGZÍTETT DÁTUM',
    location: '82°16’S — Ismeretlen zóna',
    summary: 'A fájl létezik, de a hozzá tartozó esemény nem található a kronológiában.',
    transcript: [
      '[00:00:00] RENDSZER: A fájl bejegyzése automatikusan generálódott.',
      '[00:00:14] KUTATÓINTÉZET: Nincs jegyzőkönyvezett küldetés a megadott időbélyeghez.',
      '[00:00:32] RADAR: A jég alatt három személy tartózkodott. Egyikük neve sem szerepel a személyi állományban.',
      '[00:01:05] VÉGSŐ BEJEGYZÉS: „Aki ezt olvassa, az maga idézte elő az eseményt a megfigyeléssel.”',
    ],
    metadata: {
      'STÁTUSZ': 'VOID / IDŐN KÍVÜLI',
      'KRONOLÓGIA': 'NINCS KAPCSOLAT',
      'REZONANCIA': '0.00 Hz',
    },
    isSpoiler: true,
  },
  {
    id: 'void-002',
    docNumber: 'ARCHÍV-82 / VOID-002',
    title: 'A Megfigyelő Fúziója',
    category: 'Végtelen',
    customCategory: 'ENTITÁSOK',
    secTier: 'VOID',
    classification: 'TOP SECRET',
    date: 'FOLYAMATOS',
    location: 'Tudati koordináta',
    summary: 'A megfigyelő tudata átvette a megfigyelt helyszín koordinátáit.',
    transcript: [
      '[TELEMETRIA] A szenzorok nem a jégpáncélt mérik, hanem a terminál előtt ülő személy idegrendszeri aktivitását.',
      '[01:12] „A Spirál nem ott van lent. A Spirál a tekintetedben van, amivel lefelé nézel.”',
      '[01:45] BIZTONSÁGI ZÁR FELOLDVA.',
    ],
    metadata: {
      'STÁTUSZ': 'VOID / TUDATI ANOMÁLIA',
      'MEGFIGYELŐ': 'AKTÍV LÁTOGATÓ',
    },
    isSpoiler: true,
  },
];

export const ArchiveTerminal: React.FC<ArchiveTerminalProps> = ({
  spoilerMode,
  onOpenZeroRoom,
  onOpenInfinite,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<ExtendedArchiveDoc | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ÖSSZES');
  const [activeTier, setActiveTier] = useState<string>('ÖSSZES');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  const [spiralWhisper, setSpiralWhisper] = useState<string | null>(null);
  const docVisitCounts = useRef<Record<string, number>>({});

  // 4 & 5. Interactive Terminal Shell
  const [commandInput, setCommandInput] = useState('');
  const [showShell, setShowShell] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'ARCHÍV-82 SYSTEM STATUS: ONLINE',
    'SECURITY LEVEL: RESTRICTED',
    'KNOWN SIGNALS: 9',
    'UNKNOWN SIGNALS: 1',
    'ACCESS: PARTIAL',
    'TYPE COMMAND VAGY VÁLASSZ AZ ALÁBBI GOMBOKBÓL:',
  ]);

  const handleRunCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toUpperCase();
    if (!cmd) return;
    audioEngine.playSonarPing();

    const newLogs = [...terminalLogs, `> ${cmd}`];

    if (cmd === 'SCAN') {
      newLogs.push('SCANNING SUB-ICE NETWORK... 9 SATELLITE NODES DETECTED. 1 UNKNOWN SINGULARITY AT 82°16’S.');
      setActiveCategory('ANOMÁLIÁK');
    } else if (cmd === 'SIGNALS') {
      newLogs.push('KNOWN SIGNALS: 9 (STABLE 55 Hz). UNKNOWN SIGNALS: 1 (FLUX FREQUENCY: 082.1 MHz).');
    } else if (cmd === 'PERSONNEL') {
      newLogs.push('PERSONNEL DOSSIERS: VIKTOR [EXPEDITION LEADER], LENA [NEUROLOGY], MIRA [Δ–82 ARCHIVE], LEVENTE [ANOMALY].');
      setActiveCategory('SZEMÉLYEK');
    } else if (cmd === 'LOCATION') {
      newLogs.push('LOCATION: 82°16’S, 36°01’E — ICE THICKNESS: 3800 METERS. GEOTHERMAL VOID DETECTED.');
      setActiveCategory('KOORDINÁTÁK');
    } else if (cmd === 'SPIRAL') {
      newLogs.push('SPIRAL SIGNATURE: ACTIVE. CONSCIOUSNESS RESONANCE: 99.4%. COGNITIVE DRIFT: DETECTED.');
      setActiveCategory('OBJEKTUMOK');
    } else if (cmd === 'Δ–82' || cmd === 'DELTA-82' || cmd === 'DELTA 82') {
      newLogs.push('DELTA-82 PROTOCOL: SYSTEM ROOT IDENTIFIER. 10 LORE FRAGMENTS LINKED TO THE BASALT CAVITY.');
      trackDiscovery.secretFound('terminal_delta_82');
    } else if (cmd === 'WHO') {
      newLogs.push('OBSERVER IDENTIFIED: OPERATOR. A RENDSZER ÉSZLELTE A MEGFIGYELŐT.');
    } else if (cmd === 'INFINITE') {
      newLogs.push('CONNECTING TO THE INFINITE PRESENCE...');
      if (onOpenInfinite) {
        setTimeout(onOpenInfinite, 500);
      }
    } else if (cmd === 'ZERO' || cmd === 'ARCHIVE ZERO' || cmd === 'ARCHÍV-0') {
      newLogs.push('REDIRECTING TO ARCHÍV-0 (ZERO ROOM)...');
      if (onOpenZeroRoom) {
        setTimeout(onOpenZeroRoom, 500);
      }
    } else if (cmd === 'VIKTOR' || cmd === 'LENA' || cmd === 'MIRA' || cmd === 'LEVENTE') {
      newLogs.push(`DOSSIER ACCESS GRANTED: ${cmd}. KAPCSOLÓDÓ AKTA BETÖLTVE.`);
      setActiveCategory('SZEMÉLYEK');
    } else if (cmd === 'GUARDIANS' || cmd === 'ŐRZŐK') {
      newLogs.push('THE NINE GUARDIANS FREQUENCIES: 9 KNOWN HARMONICS. 10TH NODE IS EMPTY / NAMELESS.');
      setActiveCategory('ENTITÁSOK');
    } else if (cmd === 'HELP') {
      newLogs.push('AVAILABLE COMMANDS: SCAN, SIGNALS, PERSONNEL, LOCATION, SPIRAL, Δ–82, WHO, INFINITE, VIKTOR, LENA, MIRA, LEVENTE, GUARDIANS, ZERO, CLEAR');
    } else if (cmd === 'CLEAR') {
      setTerminalLogs(['ARCHÍV-82 ONLINE // TERMINAL CLEARED.']);
      setCommandInput('');
      return;
    } else {
      newLogs.push('ACCESS DENIED');
      newLogs.push('REASON: YOU ARE LOOKING TOO EARLY.');
    }

    setTerminalLogs(newLogs.slice(-12));
    setCommandInput('');
  };

  // 66. Kategóriák felosztása
  const categories = [
    'ÖSSZES',
    'SZEMÉLYEK',
    'HELYSZÍNEK',
    'ENTITÁSOK',
    'OBJEKTUMOK',
    'DOKUMENTUMOK',
    'ANOMÁLIÁK',
    'KOORDINÁTÁK',
  ];

  const tiers: SecurityClassification[] = [
    'PUBLIC',
    'RESTRICTED',
    'CLASSIFIED',
    'TOP SECRET',
    'UNKNOWN',
    'VOID',
  ];

  // Map legacy docs into extended docs with categories and tiers
  const allDocs: ExtendedArchiveDoc[] = [
    ...ARCHIVE_DOCUMENTS.map((doc, idx): ExtendedArchiveDoc => {
      let customCategory: ExtendedArchiveDoc['customCategory'] = 'DOKUMENTUMOK';
      let secTier: SecurityClassification = 'CLASSIFIED';

      if (doc.category === 'Georadarfelvételek' || doc.category === 'Műholdképek') {
        customCategory = 'KOORDINÁTÁK';
        secTier = 'RESTRICTED';
      } else if (doc.category === 'Eltűnt személyek') {
        customCategory = 'SZEMÉLYEK';
        secTier = 'TOP SECRET';
      } else if (doc.category === 'Végtelen' || doc.category === 'Őrzők') {
        customCategory = 'ENTITÁSOK';
        secTier = 'TOP SECRET';
      } else if (doc.category === 'Időanomáliák' || doc.category === 'Törés') {
        customCategory = 'ANOMÁLIÁK';
        secTier = 'UNKNOWN';
      } else if (doc.category === 'Spirálok' || doc.category === 'Ismeretlen szimbólumok') {
        customCategory = 'OBJEKTUMOK';
        secTier = 'CLASSIFIED';
      }

      if (idx === 0) secTier = 'PUBLIC';

      return {
        ...doc,
        secTier,
        customCategory,
      };
    }),
    ...VOID_DOCS,
  ];

  // 70. „A SPIRÁL FIGYEL” rendszer
  useEffect(() => {
    // Ha sokáig böngészi: „Még mindig keresed?”
    const timer = setTimeout(() => {
      setSpiralWhisper('„Még mindig keresed?”');
    }, 45000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenDoc = (doc: ExtendedArchiveDoc) => {
    setIsGlitching(true);
    audioEngine.playSonarPing();

    // Track repeated visits
    const count = (docVisitCounts.current[doc.id] || 0) + 1;
    docVisitCounts.current[doc.id] = count;

    if (count > 2) {
      setSpiralWhisper('„Ezt már egyszer láttad.”');
    }

    trackDiscovery.archiveOpened(doc.id);

    setTimeout(() => {
      setSelectedDoc(doc);
      setIsGlitching(false);
    }, 280);
  };

  const filteredDocs = allDocs.filter((doc) => {
    const matchesCat = activeCategory === 'ÖSSZES' || doc.customCategory === activeCategory;
    const matchesTier = activeTier === 'ÖSSZES' || doc.secTier === activeTier;
    const matchesQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesTier && matchesQuery;
  });

  return (
    <section id="archive" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#02050A] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Terminal className="w-3.5 h-3.5" />
            <span>KATONAI & TUDOMÁNYOS ÉLŐ ADATBÁZIS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            ARCHÍV-82 TERMINÁL
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Hozzáférés a McMurdo és a Genfi Kutatóintézet titkosított anyagaihoz. Vizsgáld meg a feloldott aktákat, az anomália-jelentéseket és a zárolt VOID dokumentumokat!
          </p>
        </div>

        {/* 70. „A SPIRÁL FIGYEL” Rejtett reakció banner */}
        {spiralWhisper && (
          <div className="max-w-xl mx-auto p-3 rounded border border-cyan-400/80 bg-[#030919]/90 backdrop-blur-sm text-center font-cinzel text-cyan-200 text-sm tracking-widest animate-pulse flex items-center justify-between">
            <span className="mx-auto">{spiralWhisper}</span>
            <button
              onClick={() => setSpiralWhisper(null)}
              className="text-slate-500 hover:text-slate-300 text-xs font-mono ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Terminal Window Box */}
        <div className="rounded border border-cyan-950/90 bg-[#030712] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)]">
          {/* Terminal Titlebar */}
          <div className="bg-[#050A18] border-b border-cyan-900/50 p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="font-bold tracking-wider">TERMINAL // ARCHÍV-82 SECURE_NODE v4.82</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-[11px]">
              <button
                onClick={() => setShowShell(!showShell)}
                className="text-cyan-400 hover:text-white underline text-[10px]"
              >
                {showShell ? 'PARANCSSOR ELREJTÉSE' : 'PARANCSSOR MEGJELENÍTÉSE'}
              </button>
              <span>MINŐSÍTÉSI FILTER: {activeTier}</span>
              <span className="text-cyan-400/80">KAPCSOLAT: ÉLŐ // Δ-82</span>
            </div>
          </div>

          {/* 4 & 5. Interactive Command Shell Box */}
          {showShell && (
            <div className="p-4 bg-black/80 border-b border-cyan-950 font-mono text-xs space-y-3">
              {/* Output Log Screen */}
              <div className="p-3 rounded bg-[#02050D] border border-cyan-950/80 text-cyan-300/90 space-y-1 max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed">
                {terminalLogs.map((log, i) => (
                  <div key={i} className={log.startsWith('>') ? 'text-amber-300 font-bold' : log.includes('ACCESS DENIED') ? 'text-rose-400' : 'text-cyan-300/90'}>
                    {log}
                  </div>
                ))}
              </div>

              {/* Command Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunCommand(commandInput);
                }}
                className="flex items-center gap-2"
              >
                <span className="text-cyan-400 font-bold">ARCHÍV-82 &gt;</span>
                <input
                  type="text"
                  placeholder="Írj be egy parancsot (pl. SCAN, SIGNALS, Δ–82, WHO, INFINITE, ZERO)..."
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  className="flex-1 bg-black/60 border border-slate-800 rounded px-3 py-1.5 text-cyan-200 outline-none focus:border-cyan-500 text-xs"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 text-xs font-bold transition-colors"
                >
                  FUTTATÁS
                </button>
              </form>

              {/* Quick Command Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 uppercase">PARANCSOK:</span>
                {['SCAN', 'SIGNALS', 'PERSONNEL', 'LOCATION', 'SPIRAL', 'Δ–82', 'WHO', 'CLEAR'].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => handleRunCommand(cmd)}
                    className="px-2 py-0.5 rounded border border-slate-800 bg-[#040816] text-[10px] text-slate-300 hover:border-cyan-600 hover:text-cyan-200 transition-colors"
                  >
                    "{cmd}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search & Category Filter Bar */}
          <div className="p-4 border-b border-slate-800 bg-[#040814] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono text-xs">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keresés aktaszám, személy, helyszín vagy kulcsszó alapján..."
                className="w-full pl-9 pr-4 py-2 rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-xs"
              />
            </div>

            {/* Quick status */}
            <div className="text-slate-500 text-[11px] flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-cyan-500" />
              <span>TALÁLATOK: {filteredDocs.length} DOSSZIÉ</span>
            </div>
          </div>

          {/* 66. Kategóriák sáv */}
          <div className="p-2.5 bg-[#03060F] border-b border-slate-900 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-all border ${
                  activeCategory === cat
                    ? 'border-cyan-500/80 bg-cyan-950/70 text-cyan-200 font-bold'
                    : 'border-slate-800/80 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 67. Minősítési szintek szűrő sáv */}
          <div className="px-3 py-2 bg-[#02040c] border-b border-cyan-950/60 overflow-x-auto flex items-center gap-2 text-[10px] font-mono">
            <span className="text-slate-500 uppercase">MINŐSÍTÉS:</span>
            <button
              onClick={() => setActiveTier('ÖSSZES')}
              className={`px-2 py-0.5 rounded ${
                activeTier === 'ÖSSZES' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'
              }`}
            >
              ÖSSZES
            </button>
            {tiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  activeTier === tier
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                    : 'border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {tier === 'VOID' ? '⚡ VOID' : tier}
              </button>
            ))}
          </div>

          {/* Document Dossier Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[300px]">
            {filteredDocs.map((doc) => {
              const isVoid = doc.secTier === 'VOID';

              return (
                <div
                  key={doc.id}
                  onClick={() => handleOpenDoc(doc)}
                  className={`group p-4 rounded border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isVoid
                      ? 'border-fuchsia-500/80 bg-[#120419] hover:border-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.2)]'
                      : 'border-slate-800/80 bg-[#050B14]/80 hover:border-cyan-500/60 hover:bg-[#071120]'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Badge & Classification */}
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-cyan-400/90 font-bold">{doc.docNumber}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${
                          isVoid
                            ? 'border-fuchsia-400 bg-fuchsia-950 text-fuchsia-300'
                            : doc.secTier === 'TOP SECRET'
                            ? 'border-rose-700 bg-rose-950/60 text-rose-300'
                            : doc.secTier === 'UNKNOWN'
                            ? 'border-amber-700 bg-amber-950/60 text-amber-300'
                            : 'border-cyan-800 bg-cyan-950 text-cyan-300'
                        }`}
                      >
                        {doc.secTier}
                      </span>
                    </div>

                    <h4 className="font-cinzel text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {doc.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 font-light">
                      {doc.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{doc.customCategory}</span>
                    <span className="text-cyan-400 group-hover:underline">Megnyitás →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Single Document Modal Reader */}
        {selectedDoc && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="max-w-2xl w-full rounded border border-cyan-800/80 bg-[#030814] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(2,132,199,0.4)]">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-cyan-950/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-cyan-400 font-bold">{selectedDoc.docNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 text-[10px]">
                      {selectedDoc.secTier}
                    </span>
                  </div>
                  <h3 className="font-cinzel text-2xl font-bold text-white">
                    {selectedDoc.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    {selectedDoc.location} // {selectedDoc.date}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Summary */}
              <div className="p-3.5 rounded bg-cyan-950/30 border border-cyan-900/50 text-cyan-100 text-sm leading-relaxed">
                {selectedDoc.summary}
              </div>

              {/* Transcript */}
              <div className="space-y-2">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                  Lehallgatási és vizsgálati jegyzőkönyv:
                </span>
                <div className="p-4 rounded bg-black/70 border border-cyan-950 font-mono text-xs text-slate-300 space-y-2">
                  {selectedDoc.transcript.map((line, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata tags */}
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-400 border-t border-cyan-950/80 pt-4">
                {Object.entries(selectedDoc.metadata).map(([key, val]) => (
                  <div key={key} className="p-2 rounded bg-slate-900/50 border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">{key}</span>
                    <span className="text-slate-200">{val}</span>
                  </div>
                ))}
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-6 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs uppercase font-bold"
                >
                  DOSSZIÉ BEZÁRÁSA
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
