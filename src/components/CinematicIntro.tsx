import React, { useState, useEffect } from 'react';
import { BookOpen, Compass, FileText, X, Volume2, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { trackDiscovery } from '../utils/discoveryStorage';

interface CinematicIntroProps {
  onEnterReader: () => void;
  onEnterUniverse: () => void;
  onEnterArchive: () => void;
  onClose: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onEnterReader,
  onEnterUniverse,
  onEnterArchive,
  onClose,
}) => {
  const [step, setStep] = useState<number>(0);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    // Stage sequence
    const t1 = setTimeout(() => setStep(1), 700); // 82°16'S
    const t2 = setTimeout(() => setStep(2), 2200); // 36°01'E
    const t3 = setTimeout(() => setStep(3), 3900); // "A koordináták léteznek."
    const t4 = setTimeout(() => setStep(4), 5700); // "A helynek azonban nem kellene."
    const t5 = setTimeout(() => {
      setStep(5); // The Spiral awakens + 3 portals appear
      trackDiscovery.secretFound('cinematic_prologue_witnessed');
    }, 7800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleStartSound = async () => {
    const started = await audioEngine.start('antarctica');
    if (started) {
      setAudioStarted(true);
      audioEngine.playSonarPing();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="A Spirál Lehelete – Belépés a világba"
      className="fixed inset-0 z-[100] bg-[#020409] flex flex-col items-center justify-center p-6 select-none overflow-hidden transition-opacity duration-1000"
    >
      {/* Background Star / Deep Void Canvas */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-[#030712] to-[#010204]" />

      {/* Subtle Scanlines & Atmospheric Noise */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_51%)] bg-[length:100%_4px] pointer-events-none opacity-25" />

      {/* Sound & Skip Controls at Top */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <button
          onClick={handleStartSound}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono tracking-wider transition-all ${
            audioStarted
              ? 'border-cyan-500/80 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-200 hover:border-slate-700'
          }`}
          title="Atmoszférikus hangélmény aktiválása"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{audioStarted ? 'HANG: AKTÍV' : '🔊 HANG BEKAPCSOLÁSA'}</span>
        </button>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 text-xs font-mono tracking-wider transition-colors"
          title="Ugrás a weboldalra (ESC)"
        >
          <span>ÁTUGRÁS</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Narrative Cinema Text Container */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {/* Step 1 & 2: Coordinates */}
        <div className="min-h-[90px] flex flex-col items-center justify-center space-y-2">
          {step >= 1 && (
            <div className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_25px_rgba(56,189,248,0.7)] animate-fade-in">
              82°16’S
            </div>
          )}
          {step >= 2 && (
            <div className="font-mono text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.25em] text-slate-300 drop-shadow-[0_0_15px_rgba(148,163,184,0.4)] animate-fade-in">
              36°01’E
            </div>
          )}
        </div>

        {/* Step 3 & 4: Mystery Statements */}
        <div className="min-h-[100px] flex flex-col items-center justify-center space-y-3 font-cinzel">
          {step >= 3 && (
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-slate-200 tracking-wider animate-fade-in">
              „A koordináták léteznek.”
            </p>
          )}
          {step >= 4 && (
            <p className="text-lg sm:text-xl md:text-2xl font-light text-cyan-400/90 tracking-wide animate-fade-in delay-200">
              „A helynek azonban nem kellene.”
            </p>
          )}
        </div>

        {/* Step 5: The Glowing Spiral & The Three Portals */}
        {step >= 5 && (
          <div className="space-y-8 animate-fade-in">
            {/* Lassan megjelenő Spirál szimbólum */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping [animation-duration:4s]" />
              <div className="absolute inset-2 rounded-full border border-cyan-400/30 animate-pulse [animation-duration:3s]" />
              <svg viewBox="0 0 100 100" className="w-28 h-28 text-cyan-400 drop-shadow-[0_0_30px_rgba(56,189,248,0.8)] animate-spin [animation-duration:40s]">
                <path
                  d="M50,50 A5,5 0 0,1 55,50 A10,10 0 0,1 45,50 A15,15 0 0,1 60,50 A20,20 0 0,1 40,50 A25,25 0 0,1 65,50 A30,30 0 0,1 35,50 A35,35 0 0,1 70,50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="text-center space-y-1">
              <span className="font-mono text-xs text-cyan-400/80 tracking-[0.3em] uppercase">
                A küszöb nyitva áll
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl text-slate-100 tracking-widest uppercase">
                Válassz belépési pontot:
              </h3>
            </div>

            {/* A három lehetőség: OLVASNI, FELFEDEZNI, ARCHÍV-82 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-xl mx-auto pt-2">
              {/* 1. OLVASNI */}
              <button
                onClick={() => {
                  audioEngine.playSonarPing();
                  onEnterReader();
                }}
                className="group p-4 rounded border border-cyan-500/60 bg-gradient-to-b from-cyan-950/40 to-black hover:from-cyan-900/60 hover:to-cyan-950/60 hover:border-cyan-300 text-left transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between pb-2">
                  <span className="font-mono text-[10px] text-cyan-400 tracking-wider">01 // KÖNYV</span>
                  <BookOpen className="w-4 h-4 text-cyan-300 group-hover:scale-125 transition-transform" />
                </div>
                <div className="font-cinzel text-lg font-bold text-white tracking-wider flex items-center gap-1.5">
                  <span>📖</span>
                  <span>OLVASNI</span>
                </div>
                <p className="text-xs text-slate-400 font-light mt-1">
                  Belépés közvetlenül a regény 42 fejezetébe.
                </p>
              </button>

              {/* 2. FELFEDEZNI */}
              <button
                onClick={() => {
                  audioEngine.playSonarPing();
                  onEnterUniverse();
                }}
                className="group p-4 rounded border border-sky-500/60 bg-gradient-to-b from-sky-950/40 to-black hover:from-sky-900/60 hover:to-sky-950/60 hover:border-sky-300 text-left transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.2)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between pb-2">
                  <span className="font-mono text-[10px] text-sky-400 tracking-wider">02 // VILÁG</span>
                  <Compass className="w-4 h-4 text-sky-300 group-hover:scale-125 transition-transform" />
                </div>
                <div className="font-cinzel text-lg font-bold text-white tracking-wider flex items-center gap-1.5">
                  <span>🌀</span>
                  <span>FELFEDEZNI</span>
                </div>
                <p className="text-xs text-slate-400 font-light mt-1">
                  Antarktisz, jég alatti tér és a Spirál világa.
                </p>
              </button>

              {/* 3. ARCHÍV-82 */}
              <button
                onClick={() => {
                  audioEngine.playSonarPing();
                  onEnterArchive();
                }}
                className="group p-4 rounded border border-emerald-500/60 bg-gradient-to-b from-emerald-950/40 to-black hover:from-emerald-900/60 hover:to-emerald-950/60 hover:border-emerald-300 text-left transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between pb-2">
                  <span className="font-mono text-[10px] text-emerald-400 tracking-wider">03 // TITKOK</span>
                  <FileText className="w-4 h-4 text-emerald-300 group-hover:scale-125 transition-transform" />
                </div>
                <div className="font-cinzel text-lg font-bold text-white tracking-wider flex items-center gap-1.5">
                  <span>🗃</span>
                  <span>ARCHÍV-82</span>
                </div>
                <p className="text-xs text-slate-400 font-light mt-1">
                  Titkosított jegyzőkönyvek és VOID akták.
                </p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Subtitle / Identity */}
      <div className="absolute bottom-6 font-mono text-[11px] text-slate-600 tracking-widest uppercase">
        CSURIK KONRÁD // A SPIRÁL LEHELETE // A 82. SZÉLESSÉGI KÓD
      </div>
    </div>
  );
};
