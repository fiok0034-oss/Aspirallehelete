import React, { useState, useEffect } from 'react';
import { Sparkles, X, Compass, Shield } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { trackDiscovery } from '../utils/discoveryStorage';

interface NamelessSpiralModalProps {
  onClose: () => void;
}

export const NamelessSpiralModal: React.FC<NamelessSpiralModalProps> = ({ onClose }) => {
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    trackDiscovery.unlockNamelessSpiral();
    trackDiscovery.secretFound('nameless_spiral_awakened');
    audioEngine.setZone('timeless');
    audioEngine.playDeepChime();

    const t1 = setTimeout(() => setPhase(1), 1200); // „Kilenc spirált kerestél.”
    const t2 = setTimeout(() => setPhase(2), 3400); // „Miért?”
    const t3 = setTimeout(() => setPhase(3), 5600); // The 10th Spiral manifests
    const t4 = setTimeout(() => setPhase(4), 7800); // NÉVTELEN + final whisper

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="A Tizedik Spirál – Névtelen"
      className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-6 select-none overflow-hidden"
    >
      {/* Background Star / Deep Void Canvas */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-950/30 via-black to-black opacity-70" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-colors z-30"
        title="Bezárás"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main Container */}
      <div className="relative z-10 max-w-xl mx-auto text-center space-y-8">
        {/* The mysterious "10" indicator */}
        <div className="w-16 h-16 mx-auto rounded-full border border-cyan-400/80 bg-cyan-950/40 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.7)] animate-pulse">
          <span className="font-mono text-2xl font-bold text-cyan-200">10</span>
        </div>

        {/* Text Sequence */}
        <div className="min-h-[140px] flex flex-col items-center justify-center space-y-4">
          {phase >= 1 && (
            <p className="font-cinzel text-2xl sm:text-3xl text-slate-100 tracking-wider animate-fade-in font-light">
              „Kilenc spirált kerestél.”
            </p>
          )}

          {phase >= 2 && (
            <p className="font-cinzel text-xl sm:text-2xl text-cyan-300 tracking-widest animate-fade-in delay-200">
              „Miért?”
            </p>
          )}
        </div>

        {/* Phase 3 & 4: The 10th Spiral manifestation & Nameless entity */}
        {phase >= 3 && (
          <div className="space-y-6 animate-fade-in">
            {/* 10th Spiral Graphic */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-sky-400/30 animate-ping [animation-duration:5s]" />
              <div className="absolute inset-4 rounded-full border border-cyan-300/40 animate-spin [animation-duration:25s]" />
              <svg viewBox="0 0 100 100" className="w-36 h-36 text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.9)] animate-spin [animation-duration:60s]">
                <path
                  d="M50,50 A4,4 0 0,1 54,50 A8,8 0 0,1 46,50 A12,12 0 0,1 58,50 A16,16 0 0,1 42,50 A20,20 0 0,1 62,50 A24,24 0 0,1 38,50 A28,28 0 0,1 66,50 A32,32 0 0,1 34,50 A36,36 0 0,1 70,50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {phase >= 4 && (
              <div className="space-y-3 animate-fade-in">
                <div className="font-mono text-xs text-cyan-400 tracking-[0.3em] uppercase">
                  A TIZEDIK ENTITÁS
                </div>
                <h3 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-[0.2em]">
                  NÉVTELEN
                </h3>
                <div className="space-y-1 text-slate-300 font-cinzel text-lg sm:text-xl font-light italic">
                  <p>„Talán nem hiányzott.”</p>
                  <p className="text-cyan-200">„Talán csak még nem láttad.”</p>
                </div>
                <p className="font-mono text-xs text-slate-500 pt-3">
                  Megtaláltad a titkos tizedik elvet. A kódexedben a bejegyzés aktiválódott.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded border border-cyan-400/80 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-200 hover:text-white font-mono text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)]"
          >
            VISSZATÉRÉS AZ UNIVERZUMBA
          </button>
        </div>
      </div>
    </div>
  );
};
