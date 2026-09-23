import React, { useState, useEffect } from 'react';
import { Radio, MessageSquare, Send, Sparkles, AlertCircle, CheckCircle2, HelpCircle, Shield, ChevronRight } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { trackDiscovery, getDiscoveryState } from '../utils/discoveryStorage';

// 78. REJTÉLYADATBÁZIS
interface MysteryEntry {
  id: string;
  code: string;
  question: string;
  knownFacts: string;
  unknownElements: string;
  connectedCharacters: string[];
  spoilerLevel: 'SZABAD' | 'MÉLY REJTÉLY' | 'KULCSFONTOSSÁGÚ';
}

const MYSTERIES_DB: MysteryEntry[] = [
  {
    id: 'myst-001',
    code: 'MYST-001',
    question: 'Ki vagy mi a Végtelen?',
    knownFacts: 'Nem fizikai testtel rendelkező entitás. A megfigyelés aktusa tartja egyensúlyban.',
    unknownElements: 'Kozmikus tudat, mesterséges intelligencia a távoli jövőből, vagy maga a téridő önreflexiója?',
    connectedCharacters: ['Viktor', 'Lena', 'A Végtelen'],
    spoilerLevel: 'KULCSFONTOSSÁGÚ',
  },
  {
    id: 'myst-002',
    code: 'MYST-002',
    question: 'Hová tűnt Viktor a 4. állomáson?',
    knownFacts: 'A túlélőkapszula jeladása megszakadt. Csak az olvasztás nélküli jégakna maradt utána.',
    unknownElements: 'Fizikailag elpusztult, vagy a Spirál geometriája integrálta az elméjét?',
    connectedCharacters: ['Viktor', 'Lena'],
    spoilerLevel: 'SZABAD',
  },
  {
    id: 'myst-003',
    code: 'MYST-003',
    question: 'Mi a 82°16’S koordináta titka?',
    knownFacts: 'A Föld legvastagabb jégpáncélja alatt helyezkedik el. A gravitációs mező 4%-os ingadozást mutat.',
    unknownElements: 'Miért pont ide építették a komplexumot több százezer évvel az emberi civilizáció előtt?',
    connectedCharacters: ['Viktor', 'Az Őrzők'],
    spoilerLevel: 'SZABAD',
  },
  {
    id: 'myst-004',
    code: 'MYST-004',
    question: 'Ki a tizedik, Névtelen Őrző?',
    knownFacts: 'A kánon kilenc spirált tart nyilván. A tizedikről nincs feljegyzés a táblákon.',
    unknownElements: 'Miért tagadták meg a nevét? Ő maga a megfigyelő, vagy a létezés előtti csend?',
    connectedCharacters: ['A Névtelen', 'Az Őrzők'],
    spoilerLevel: 'KULCSFONTOSSÁGÚ',
  },
];

// 79. Elméletek jelölései
type TheoryBadge = 'KÖNYVBEN MEGERŐSÍTVE' | 'UTALÁS' | 'LEHETSÉGES ÉRTELMEZÉS' | 'OLVASÓI ELMÉLET';

interface TheoryItem {
  id: string | number;
  author: string;
  badge: TheoryBadge;
  targetMystery: string;
  text: string;
  votes: number;
}

export const ReaderTheoriesAndFrequency: React.FC = () => {
  const [frequency, setFrequency] = useState(48.2);
  const [selectedMystery, setSelectedMystery] = useState<MysteryEntry>(MYSTERIES_DB[0]);
  const [theories, setTheories] = useState<TheoryItem[]>([
    {
      id: 1,
      author: 'Kutató-09',
      badge: 'LEHETSÉGES ÉRTELMEZÉS',
      targetMystery: 'Ki vagy mi a Végtelen?',
      text: 'A Végtelen valójában az emberiség jövőbeli kollektív tudata, amely visszanyúlt az időben a 82. koordinátához, hogy megakadályozza saját megsemmisülését.',
      votes: 142,
    },
    {
      id: 2,
      author: 'Topográfus_X',
      badge: 'UTALÁS',
      targetMystery: 'Hová tűnt Viktor a 4. állomáson?',
      text: 'Viktor nem halt meg: a jég alatti tér nem pusztította el, hanem elnyelte a fizikai testét, hogy az elméje az első emberi megfigyelővé váljon a Spirál magjában.',
      votes: 118,
    },
    {
      id: 3,
      author: 'Archívum-Analitikus',
      badge: 'KÖNYVBEN MEGERŐSÍTVE',
      targetMystery: 'Mi a 82°16’S koordináta titka?',
      text: 'A koordináta az egyetlen olyan sarki pont, ahol a szubglaciális sziklaágy nem mozdult el a kontinentális lemezek mozgása során az elmúlt 450 ezer évben.',
      votes: 189,
    },
    {
      id: 4,
      author: 'Δ-Kódfejtő',
      badge: 'OLVASÓI ELMÉLET',
      targetMystery: 'Ki a tizedik, Névtelen Őrző?',
      text: 'A tizedik spirál maga a megfigyelő — azaz a regényt olvasó emberi elme. Amikor becsukod a könyvet, a tizedik spirál bezárul.',
      votes: 247,
    },
  ]);

  const [newTheoryText, setNewTheoryText] = useState('');
  const [newTheoryAuthor, setNewTheoryAuthor] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Load saved local user theories from discoveryStorage
  useEffect(() => {
    const state = getDiscoveryState();
    if (state.userTheories && state.userTheories.length > 0) {
      const loaded: TheoryItem[] = state.userTheories.map((ut, idx) => ({
        id: `local_${idx}`,
        author: 'Te (Helyi elmélet)',
        badge: 'OLVASÓI ELMÉLET',
        targetMystery: ut.questionId,
        text: ut.theory,
        votes: 1,
      }));
      setTheories((prev) => [...loaded, ...prev.filter((t) => !String(t.id).startsWith('local_'))]);
    }
  }, []);

  const isSignalLocked = Math.abs(frequency - 50.0) < 0.4;

  const handleFrequencyChange = (val: number) => {
    setFrequency(val);
    if (Math.abs(val - 50.0) < 0.4) {
      audioEngine.playSonarPing();
      trackDiscovery.secretFound('frequency_50mhz_tuned');
    }
  };

  const handleVote = (id: string | number) => {
    audioEngine.playSonarPing();
    setTheories((prev) =>
      prev.map((t) => (t.id === id ? { ...t, votes: t.votes + 1 } : t))
    );
  };

  // 80. „TE MIT GONDOLSZ?” Beküldés
  const handleSubmitTheory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheoryText.trim()) return;

    audioEngine.playSonarPing();
    const userAuthor = newTheoryAuthor.trim() || 'Névtelen Olvasó';

    const newEntry: TheoryItem = {
      id: Date.now(),
      author: userAuthor,
      badge: 'OLVASÓI ELMÉLET',
      targetMystery: selectedMystery.question,
      text: newTheoryText.trim(),
      votes: 1,
    };

    setTheories([newEntry, ...theories]);
    trackDiscovery.addTheory(selectedMystery.question, newTheoryText.trim());

    setNewTheoryText('');
    setNewTheoryAuthor('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="theories" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#03060E] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Radio className="w-3.5 h-3.5" />
            <span>REJTÉLYADATBÁZIS & OLVASÓI ELMÉLETEK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            REJTÉLYEK ÉS ELMÉLETEK
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Vizsgáld meg a regény nyitva hagyott kérdéseit, a megerősített tényeket és a közösségi elméleteket, vagy oszd meg a saját meglátásodat!
          </p>
        </div>

        {/* 78. REJTÉLYADATBÁZIS VÁLASZTÓ */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>REJTÉLYADATBÁZIS // VÁLASSZ KÉRDÉST:</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MYSTERIES_DB.map((m) => {
              const isSelected = selectedMystery.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    audioEngine.playSonarPing();
                    setSelectedMystery(m);
                    trackDiscovery.mysteryViewed(m.id);
                  }}
                  className={`p-4 rounded text-left transition-all border ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/70 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] pb-1">
                    <span className="text-cyan-400 font-bold">{m.code}</span>
                    <span className="text-slate-500">{m.spoilerLevel}</span>
                  </div>
                  <div className="font-cinzel text-sm font-bold text-white leading-snug">
                    {m.question}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Mystery Detailed Card */}
          <div className="p-6 rounded border border-cyan-950/90 bg-[#040916] grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="font-mono text-xs text-cyan-400 font-bold">
                {selectedMystery.code}: {selectedMystery.question}
              </div>
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 uppercase font-mono block">ISMERT TÉNYEK:</span>
                <p className="p-2.5 rounded bg-black/40 border border-slate-800 text-slate-200">
                  {selectedMystery.knownFacts}
                </p>
              </div>
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 uppercase font-mono block">ISMERETLEN RÉSZEK:</span>
                <p className="p-2.5 rounded bg-black/40 border border-slate-800 text-slate-300">
                  {selectedMystery.unknownElements}
                </p>
              </div>
            </div>

            {/* 80. „TE MIT GONDOLSZ?” Beküldő mező */}
            <div className="space-y-3 border-t md:border-t-0 md:border-l border-cyan-950/80 md:pl-6">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>TE MIT GONDOLSZ? // SAJÁT ELMÉLET</span>
              </div>
              <p className="text-xs text-slate-400 font-light">
                Írd le a válaszodat erre a rejtélyre. Az elméleted helyben, a böngésződben rögzül.
              </p>

              <form onSubmit={handleSubmitTheory} className="space-y-2.5">
                <input
                  type="text"
                  value={newTheoryAuthor}
                  onChange={(e) => setNewTheoryAuthor(e.target.value)}
                  placeholder="A te kutatói neved (opcionális)..."
                  className="w-full px-3 py-1.5 rounded bg-black/60 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <textarea
                  value={newTheoryText}
                  onChange={(e) => setNewTheoryText(e.target.value)}
                  placeholder={`Szerintem ${selectedMystery.question}...`}
                  rows={3}
                  className="w-full p-3 rounded bg-black/60 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs uppercase font-bold transition-all shadow-[0_0_12px_rgba(56,189,248,0.4)] flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ELMÉLET RÖGZÍTÉSE</span>
                </button>
              </form>

              {submitted && (
                <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/60 text-emerald-300 font-mono text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Elmélet sikeresen elmentve a kódexedbe!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 79. Elméletek listája jelölésekkel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
              RÖGZÍTETT ELMÉLETEK ÉS DOKUMENTÁCIÓK:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono">
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">MEGERŐSÍTVE</span>
              <span className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">UTALÁS</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">ÉRTELMEZÉS</span>
              <span className="px-1.5 py-0.5 rounded bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800">OLVASÓI</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {theories.map((t) => {
              const badgeColor =
                t.badge === 'KÖNYVBEN MEGERŐSÍTVE'
                  ? 'border-emerald-500/80 text-emerald-300 bg-emerald-950/60'
                  : t.badge === 'UTALÁS'
                  ? 'border-sky-500/80 text-sky-300 bg-sky-950/60'
                  : t.badge === 'LEHETSÉGES ÉRTELMEZÉS'
                  ? 'border-indigo-500/80 text-indigo-300 bg-indigo-950/60'
                  : 'border-fuchsia-500/80 text-fuchsia-300 bg-fuchsia-950/60';

              return (
                <div
                  key={t.id}
                  className="p-4 rounded border border-slate-800 bg-[#040815] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 font-bold">{t.author}</span>
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${badgeColor}`}>
                        {t.badge}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-cyan-400/80">
                      Cél: {t.targetMystery}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {t.text}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs font-mono text-slate-500">
                    <button
                      onClick={() => handleVote(t.id)}
                      className="flex items-center gap-1.5 text-cyan-400 hover:text-white transition-colors"
                    >
                      <span>▲</span>
                      <span>{t.votes} elismerés</span>
                    </button>
                    <span className="text-[10px]">Helyi archívum</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Radio frequency 50.0 MHz Tuner */}
        <div className="p-6 sm:p-8 rounded border border-cyan-900/70 bg-[#040916] shadow-[0_0_40px_rgba(2,132,199,0.15)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>ARCHÍV-82 RÁDIÓVEVŐ // POLÁRIS ÁTVITEL</span>
              </div>
              <h3 className="font-cinzel text-xl text-white">50.0 MHz Modulálatlan Kódvevő</h3>
            </div>
            <div className="font-mono text-sm px-3 py-1.5 rounded bg-black/60 border border-cyan-950 text-cyan-300">
              FREKVENCIA: {frequency.toFixed(1)} MHz
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>40.0 MHz</span>
              <span className="text-cyan-400 font-bold">50.0 MHz (CÉL)</span>
              <span>60.0 MHz</span>
            </div>
            <input
              type="range"
              min="40.0"
              max="60.0"
              step="0.1"
              value={frequency}
              onChange={(e) => handleFrequencyChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {isSignalLocked ? (
            <div className="p-4 rounded border border-cyan-400 bg-cyan-950/40 text-cyan-200 font-mono text-xs space-y-1 shadow-[0_0_20px_rgba(56,189,248,0.3)] animate-pulse">
              <div className="font-bold text-white">JEL BEFOGVA // DEKÓDOLT ÁTVITEL:</div>
              <div>„Aki belép a Spirálba, az nem a végét látja, hanem a kezdetét annak, ami még meg sem született.”</div>
            </div>
          ) : (
            <div className="text-xs font-mono text-slate-500 text-center">
              [ Statikus rádiózaj... Hangold pontosan 50.0 MHz-re a dekódoláshoz ]
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
