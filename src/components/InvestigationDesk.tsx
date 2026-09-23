import React, { useState } from 'react';
import { Search, Pin, Link2, FileText, CheckCircle, AlertTriangle, Shield, Layers, Eye, RefreshCw } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { trackDiscovery, getDiscoveryState } from '../utils/discoveryStorage';

interface CaseCard {
  id: string;
  code: string;
  title: string;
  clue: string;
  evidence: string;
  relatedIds: string[];
}

const CASES_DATA: CaseCard[] = [
  {
    id: 'CASE_01',
    code: 'CASE 01',
    title: 'A McMurdo 1997-es SAR Csend',
    clue: 'A radarhullámok teljes elnyelődése 82°16’S-nél.',
    evidence: 'SAR Reflexiós Profil #1997',
    relatedIds: ['CASE_02', 'CASE_05'],
  },
  {
    id: 'CASE_02',
    code: 'CASE 02',
    title: 'A Bazaltrezonancia',
    clue: '55 Hz-es állandó mikroszeizmikus hanghullám.',
    evidence: 'Szeizmográfiás Szalag #04',
    relatedIds: ['CASE_01', 'CASE_04'],
  },
  {
    id: 'CASE_03',
    code: 'CASE 03',
    title: 'Viktor Tudatvesztése',
    clue: 'A jég alatt a megfigyelő szívritmusa a Spirál pulzusához igazodik.',
    evidence: 'Viktor Bioszenzor EEG',
    relatedIds: ['CASE_06', 'CASE_07'],
  },
  {
    id: 'CASE_04',
    code: 'CASE 04',
    title: 'A 9 Őrző Frekvenciája',
    clue: 'Kilenc harmonikus hang, de a tizedik hiányzik.',
    evidence: 'Mélyfúrási Akusztika',
    relatedIds: ['CASE_02', 'CASE_10'],
  },
  {
    id: 'CASE_05',
    code: 'CASE 05',
    title: 'Δ–82 Rádióanomália',
    clue: '82.1 MHz-en visszafelé játszott fonémák és nevek.',
    evidence: 'Rádió Spektrogram',
    relatedIds: ['CASE_01', 'CASE_08'],
  },
  {
    id: 'CASE_06',
    code: 'CASE 06',
    title: 'A Törés Városa',
    clue: 'Eljövendő építmények vetülete a múlt kőzeteiben.',
    evidence: 'Régészeti Minta #4',
    relatedIds: ['CASE_03', 'CASE_09'],
  },
  {
    id: 'CASE_07',
    code: 'CASE 07',
    title: 'Levente Memóriaintegritása',
    clue: '71%-ra esett integritás és egy hiányzó arc a tükörben.',
    evidence: 'Pszichoanalitikai Karton',
    relatedIds: ['CASE_03', 'CASE_10'],
  },
  {
    id: 'CASE_08',
    code: 'CASE 08',
    title: 'Mira Apjának Rejtélye',
    clue: 'Cenzúrázott név az utolsó rádióüzenetben.',
    evidence: 'Dosszié Δ–82/M',
    relatedIds: ['CASE_05', 'CASE_09'],
  },
  {
    id: 'CASE_09',
    code: 'CASE 09',
    title: 'A Vörös Por Gravitációja',
    clue: 'Nem szálló ásvány, hanem tudatra reagáló nanostruktúra.',
    evidence: 'Petri-csésze minta #09',
    relatedIds: ['CASE_06', 'CASE_08'],
  },
  {
    id: 'CASE_10',
    code: 'CASE 10',
    title: 'A Névtelen Tizedik',
    clue: 'Maga a megfigyelő a tizedik hiányzó elem.',
    evidence: 'ARCHÍV-0 Log',
    relatedIds: ['CASE_04', 'CASE_07'],
  },
];

const DESK_ITEMS = [
  { id: 'item_viktor', name: 'VIKTOR REPORT', type: 'DOKUMENTUM' },
  { id: 'item_radar', name: 'RADAR IMAGE (82°16’S)', type: 'KARTOGRÁFIA' },
  { id: 'item_delta', name: 'Δ–82 JEL', type: 'SZIMBÓLUM' },
  { id: 'item_signal', name: 'SIGNAL (82.1 MHz)', type: 'RÁDIÓ' },
];

export const InvestigationDesk: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<CaseCard | null>(null);
  const [activeConnections, setActiveConnections] = useState<string[]>([]);
  const [deskSelected, setDeskSelected] = useState<string[]>([]);
  const [correlationStatus, setCorrelationStatus] = useState<string | null>(null);

  // Comparator states
  const [compareDocA, setCompareDocA] = useState('1997_SAR');
  const [compareDocB, setCompareDocB] = useState('UNKNOWN_SAR');

  const handleSelectCase = (c: CaseCard) => {
    audioEngine.playSonarPing();
    setSelectedCase(c);
    setActiveConnections(c.relatedIds);
    trackDiscovery.secretFound(`case_${c.id}`);
  };

  const handleToggleDeskItem = (id: string) => {
    audioEngine.playSonarPing();
    const next = deskSelected.includes(id)
      ? deskSelected.filter((i) => i !== id)
      : [...deskSelected, id];
    setDeskSelected(next);

    // If user selected all 4 items or specific combination:
    if (next.length === 4) {
      setCorrelationStatus('CORRELATION DETECTED: A fúrási helyszín, a tudati torzulás és a 10. spirál egybeesik.');
      trackDiscovery.secretFound('desk_full_correlation');
      audioEngine.playDeepChime();
    } else if (next.includes('item_viktor') && next.includes('item_radar')) {
      setCorrelationStatus('CORRELATION DETECTED: Viktor koordinátái pontosan lefedik a radarelnyelő zónát.');
    } else {
      setCorrelationStatus(null);
    }
  };

  return (
    <section id="investigation" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#02050B] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-amber-900/60 bg-amber-950/20 text-amber-300 font-mono text-xs tracking-widest uppercase">
            <Pin className="w-3.5 h-3.5" />
            <span>NYOMOZÓI TÁBLA & KUTATÓASZTAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            A 10 REJTÉLY // NYOMOZÓTÁBLA
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Kapcsold össze a kártyákat a piros fonal mintázatához, vagy kombinálj bizonyítékokat
            a kutatóasztalon korrelációk feltárásához.
          </p>
        </div>

        {/* 27 & 34. Pinned Cases Corkboard Simulation */}
        <div className="p-6 sm:p-8 rounded border border-amber-950/80 bg-[#060a16] shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6">
          <div className="flex items-center justify-between border-b border-amber-950 pb-3 font-mono text-xs text-amber-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>NYOMOZÓI FAL // FELTÁRT ESETEK (CASE 01 – 10)</span>
            </span>
            <span className="text-slate-500">Kattints egy kártyára a kapcsolatok megvilágításához</span>
          </div>

          {/* Grid of Case Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {CASES_DATA.map((c) => {
              const isSelected = selectedCase?.id === c.id;
              const isRelated = activeConnections.includes(c.id);

              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectCase(c)}
                  className={`p-4 rounded border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02]'
                      : isRelated
                      ? 'border-rose-500/80 bg-rose-950/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : 'border-slate-800 bg-[#040812] hover:border-slate-700'
                  }`}
                >
                  {/* Pin Graphic */}
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[10px] font-mono text-amber-400 font-bold">{c.code}</span>
                    <Pin
                      className={`w-3.5 h-3.5 ${
                        isSelected ? 'text-amber-400 fill-current' : isRelated ? 'text-rose-400 fill-current' : 'text-slate-600'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-cinzel font-bold text-xs text-slate-100">{c.title}</h4>
                    <p className="text-[10px] font-mono text-slate-400 line-clamp-2">{c.clue}</p>
                  </div>

                  <div className="pt-2 text-[9px] font-mono text-slate-500 border-t border-slate-900 mt-2">
                    {c.evidence}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Connection Notification */}
          {selectedCase && (
            <div className="p-4 rounded border border-rose-900/60 bg-rose-950/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-rose-200 animate-fade-in">
              <div>
                <strong>PATTERN DETECTED:</strong> {selectedCase.code} összekötve a következő ügyekkel: {selectedCase.relatedIds.join(', ')}
              </div>
              <span className="text-[10px] text-slate-400">
                A piros fonal a Spirálhoz és a gravitációs anomáliához vezet.
              </span>
            </div>
          )}
        </div>

        {/* 35. Digital Investigation Desk & 29. Document Comparator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Investigation Desk: Combination system (6 cols) */}
          <div className="lg:col-span-6 p-6 rounded border border-cyan-950 bg-[#040816] space-y-5">
            <h3 className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2 border-b border-cyan-950 pb-2">
              <Layers className="w-4 h-4" />
              <span>DIGITÁLIS KUTATÓASZTAL // BIZONYÍTÉK-KOMBINÁLÁS</span>
            </h3>

            <p className="text-xs font-mono text-slate-400">
              Válaszd ki az egymásra helyezni kívánt kutatási anyagokat a felületen:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {DESK_ITEMS.map((item) => {
                const isSelected = deskSelected.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleDeskItem(item.id)}
                    className={`p-3 rounded border text-left text-xs font-mono transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                        : 'border-slate-800 bg-[#060c1d] text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[9px] text-slate-500 uppercase">{item.type}</div>
                    <div className="font-bold text-slate-200 mt-0.5">{item.name}</div>
                  </button>
                );
              })}
            </div>

            {correlationStatus ? (
              <div className="p-3.5 rounded border border-emerald-500/70 bg-emerald-950/30 text-xs font-mono text-emerald-300 animate-fade-in flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{correlationStatus}</span>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-slate-500 text-center py-2">
                Kattints több elemre a korreláció teszteléséhez (pl. mind a 4 elem egyszerre).
              </div>
            )}
          </div>

          {/* 29. Side-by-Side Document Comparator (6 cols) */}
          <div className="lg:col-span-6 p-6 rounded border border-cyan-950 bg-[#040816] space-y-5">
            <h3 className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2 border-b border-cyan-950 pb-2">
              <FileText className="w-4 h-4" />
              <span>DOKUMENTUM-ÖSSZEHASONLÍTÓ // ANOMÁLIA ELEMZÉS</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              {/* Doc A */}
              <div className="p-3.5 rounded border border-slate-800 bg-black/60 space-y-2">
                <span className="text-[10px] text-cyan-400 font-bold">1997 HIVATALOS SAR PROTOKOLL</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  «A mérések normális jégrétegződést mutattak. Semmilyen anomália vagy föld alatti üreg nem található a 82. szélességi kör alatt.»
                </p>
                <div className="text-[9px] text-slate-500">KLASSZIFIKÁCIÓ: PUBLIC</div>
              </div>

              {/* Doc B */}
              <div className="p-3.5 rounded border border-rose-900/60 bg-rose-950/20 space-y-2">
                <span className="text-[10px] text-rose-400 font-bold">ISMERETLEN RADARKIVONAT (Δ–82)</span>
                <p className="text-[11px] text-rose-200 leading-relaxed">
                  «A hullámok 100%-ban elnyelődtek. 3800 méteren egy 9 ágú logaritmikus geometriai üreg található.»
                </p>
                <div className="text-[9px] text-rose-400">KLASSZIFIKÁCIÓ: CLASSIFIED</div>
              </div>
            </div>

            <div className="p-3 rounded border border-amber-900/50 bg-amber-950/20 text-xs font-mono text-amber-300/90 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>ANOMALY DETECTED:</strong> A hivatalos 1997-es jelentés szándékosan törölte a negatív fázisú radarreflexió adatait.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
