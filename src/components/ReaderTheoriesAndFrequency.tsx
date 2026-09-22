import React, { useState } from 'react';
import { Radio, MessageSquare, Send, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const ReaderTheoriesAndFrequency: React.FC = () => {
  const [frequency, setFrequency] = useState(48.2);
  const [theories, setTheories] = useState([
    {
      id: 1,
      author: 'Kutató-09',
      text: 'A Végtelen valójában az emberiség jövőbeli kollektív tudata, amely visszanyúlt az időben, hogy megakadályozza saját megsemmisülését.',
      votes: 142,
    },
    {
      id: 2,
      author: 'Topográfus_X',
      text: 'Kassarah és Ir-Haya ugyanaz a tudat két ellentétes fázisban: az emlékezés és a felejtés szükségszerű pulzálása.',
      votes: 98,
    },
    {
      id: 3,
      author: 'Archívum-Analitikus',
      text: 'A 82. szélességi kód nem földrajzi koordináta, hanem egy többdimenziós rezgési állandó, ami a jégkristályok rácsszerkezetét torzítja.',
      votes: 167,
    },
    {
      id: 4,
      author: 'Δ-Kódfejtő',
      text: 'A tizedik spirál maga a megfigyelő — azaz a regényt olvasó emberi tudat. Ezért nincs neve.',
      votes: 215,
    },
  ]);

  const [newTheoryText, setNewTheoryText] = useState('');
  const [newTheoryAuthor, setNewTheoryAuthor] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isSignalLocked = Math.abs(frequency - 50.0) < 0.4;

  const handleFrequencyChange = (val: number) => {
    setFrequency(val);
    if (Math.abs(val - 50.0) < 0.4) {
      audioEngine.playSonarPing();
    }
  };

  const handleVote = (id: number) => {
    audioEngine.playSonarPing();
    setTheories((prev) =>
      prev.map((t) => (t.id === id ? { ...t, votes: t.votes + 1 } : t))
    );
  };

  const handleSubmitTheory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheoryText.trim()) return;

    audioEngine.playSonarPing();
    setTheories([
      {
        id: Date.now(),
        author: newTheoryAuthor.trim() || 'Névtelen Megfigyelő',
        text: newTheoryText.trim(),
        votes: 1,
      },
      ...theories,
    ]);

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
            <span>KÖZÖSSÉGI TUDAT & HANGOLÓ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            OLVASÓI ELMÉLETEK & TITKOS FREKVENCIA
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Hangold be az 50.0 MHz-es alacsony frekvenciájú adást a titkosított üzenet dekódolásához,
            vagy oszd meg a saját elméletedet a Spirál természetéről!
          </p>
        </div>

        {/* Secret Radio Frequency Tuner Box */}
        <div className="p-6 sm:p-8 rounded border border-cyan-900/70 bg-[#040916] shadow-[0_0_40px_rgba(2,132,199,0.15)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>ARCHÍV-82 RÁDIÓVEVŐ // POLÁRIS ÁTVITEL</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Célfrekvencia: 50.00 MHz (VLF Subglacial Wave)
              </p>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-cyan-300">
              {frequency.toFixed(1)} <span className="text-sm font-normal text-slate-500">MHz</span>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="40.0"
              max="60.0"
              step="0.1"
              value={frequency}
              onChange={(e) => handleFrequencyChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-900 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>40.0 MHz (Zaj)</span>
              <span className="text-cyan-400 font-bold">50.0 MHz (ANOMÁLIA)</span>
              <span>60.0 MHz (Hóvihar)</span>
            </div>
          </div>

          {/* Decoded Audio Output Message */}
          <div
            className={`p-4 rounded border transition-all duration-500 font-mono text-xs ${
              isSignalLocked
                ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_20px_rgba(56,189,248,0.3)] animate-pulse'
                : 'border-slate-800 bg-slate-950/60 text-slate-600'
            }`}
          >
            {isSignalLocked ? (
              <div className="space-y-1">
                <div className="text-cyan-400 font-bold text-[11px] uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>JEL BEMÉRVE — TISZTA ÁTVITEL:</span>
                </div>
                <p className="text-sm sm:text-base font-cinzel italic text-white">
                  «„Ne keresd az utolsó oldalt. Az már benned íródik.”»
                </p>
                <div className="text-[10px] text-cyan-400/70 pt-1">
                  FORRÁS: ARCHÍV-82/Δ // MÉLYSÉG: -3 200m
                </div>
              </div>
            ) : (
              <div className="text-center py-2 italic text-slate-500">
                [STATIKUS RÁDIÓZAJ] — Mozgasd a csúszkát 50.0 MHz-re a rezonancia eléréséhez...
              </div>
            )}
          </div>
        </div>

        {/* Theories Board and Submission */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submission Form */}
          <div className="p-6 rounded border border-slate-800 bg-[#050A15] space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>ÚJ ELMÉLET BENYÚJTÁSA</span>
            </div>
            <p className="text-slate-400 font-sans text-xs">
              Milyen magyarázatot látsz a 82. szélességi kódra és a Végtelen természetére?
            </p>

            {submitted && (
              <div className="p-3 rounded border border-cyan-800 bg-cyan-950/40 text-cyan-300 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Elméleted rögzítve az archívumban!</span>
              </div>
            )}

            <form onSubmit={handleSubmitTheory} className="space-y-3 font-sans">
              <div>
                <label className="text-[10px] font-mono text-slate-500 block uppercase mb-1">
                  Azonosító / Név
                </label>
                <input
                  type="text"
                  value={newTheoryAuthor}
                  onChange={(e) => setNewTheoryAuthor(e.target.value)}
                  placeholder="Pl. Kutató-82"
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 block uppercase mb-1">
                  A Te Elméleted
                </label>
                <textarea
                  required
                  rows={4}
                  value={newTheoryText}
                  onChange={(e) => setNewTheoryText(e.target.value)}
                  placeholder="Fejtsd ki a gondolatodat a Spirálról vagy az Őrzőkről..."
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-200 text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>KÖZZÉTÉTEL</span>
              </button>
            </form>
          </div>

          {/* Theory Cards List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
              <span>LEGFRISEBB OLVASÓI HIPOTÉZISEK</span>
              <span>{theories.length} DOKUMENTÁLT FELVETÉS</span>
            </div>

            <div className="space-y-3">
              {theories.map((theory) => (
                <div
                  key={theory.id}
                  className="p-5 rounded border border-slate-800/80 bg-[#050B16] space-y-3 hover:border-cyan-500/40 transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold">{theory.author}</span>
                    <button
                      onClick={() => handleVote(theory.id)}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-all"
                    >
                      <span>▲ REZONANCIA:</span>
                      <span className="font-bold text-cyan-400">{theory.votes}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                    „{theory.text}”
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
