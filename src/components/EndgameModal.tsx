import React, { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface EndgameModalProps {
  onClose: () => void;
}

export const EndgameModal: React.FC<EndgameModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    audioEngine.playDeepChime();
    const t1 = setTimeout(() => setStep(1), 1000); // ARCHIVE: OPEN
    const t2 = setTimeout(() => setStep(2), 2000); // SIGNALS: CONNECTED
    const t3 = setTimeout(() => setStep(3), 3000); // MEMORIES: RESTORED
    const t4 = setTimeout(() => setStep(4), 4000); // SPIRALS: 10
    const t5 = setTimeout(() => setStep(5), 5000); // OBSERVER: DETECTED
    const t6 = setTimeout(() => setStep(6), 6500); // „MOST MÁR TE IS LÁTOD.”
    const t7 = setTimeout(() => setStep(7), 8000); // Pure Breathing Spiral

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-slate-100 select-none overflow-hidden animate-fade-in font-mono">
      <button
        onClick={() => {
          audioEngine.playSonarPing();
          onClose();
        }}
        className="absolute top-6 right-6 p-2 text-slate-600 hover:text-white transition-colors"
        title="Bezárás"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex flex-col items-center justify-center text-center max-w-lg px-6 space-y-8">
        {step < 6 && (
          <div className="space-y-4 border border-cyan-950/80 bg-[#02050c] p-8 rounded shadow-[0_0_50px_rgba(56,189,248,0.15)] w-full text-left font-mono text-sm sm:text-base">
            <div className="text-cyan-400 font-bold tracking-widest pb-3 border-b border-cyan-950 uppercase">
              SYSTEM STATUS // 10. PROTOKOLL
            </div>
            <div className="space-y-2 text-slate-300">
              <div className={`transition-opacity ${step >= 1 ? 'opacity-100 text-emerald-300' : 'opacity-20'}`}>
                ARCHIVE: <span className="font-bold">OPEN</span>
              </div>
              <div className={`transition-opacity ${step >= 2 ? 'opacity-100 text-cyan-300' : 'opacity-20'}`}>
                SIGNALS: <span className="font-bold">CONNECTED</span>
              </div>
              <div className={`transition-opacity ${step >= 3 ? 'opacity-100 text-teal-300' : 'opacity-20'}`}>
                MEMORIES: <span className="font-bold">RESTORED</span>
              </div>
              <div className={`transition-opacity ${step >= 4 ? 'opacity-100 text-indigo-300' : 'opacity-20'}`}>
                SPIRALS: <span className="font-bold">10 / 10</span>
              </div>
              <div className={`transition-opacity ${step >= 5 ? 'opacity-100 text-rose-400 font-bold' : 'opacity-20'}`}>
                OBSERVER: <span className="animate-pulse">DETECTED</span>
              </div>
            </div>
          </div>
        )}

        {step >= 6 && (
          <div className="space-y-10 animate-fade-in flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl font-cinzel font-bold text-white tracking-[0.25em] leading-relaxed">
              „MOST MÁR TE IS LÁTOD.”
            </h2>

            {/* Breathing Grand Spiral */}
            {step >= 7 && (
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center animate-fade-in">
                <div className="absolute inset-0 rounded-full bg-cyan-500/15 blur-3xl animate-pulse" />
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_20px_rgba(56,189,248,0.5)] animate-spin-slow">
                  <path
                    d="M 100 100 
                       m 0, -4 
                       a 4,4 0 0,1 4,4 
                       a 8,8 0 0,1 -8,8 
                       a 16,16 0 0,1 -16,-16 
                       a 28,28 0 0,1 28,-28 
                       a 44,44 0 0,1 44,44 
                       a 64,64 0 0,1 -64,64 
                       a 88,88 0 0,1 -88,-88"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="opacity-90"
                  />
                </svg>
              </div>
            )}

            <p className="text-[11px] font-mono text-slate-500 tracking-widest uppercase">
              A felfedezési ciklus bezárult. A regény lapjai és a jég mélye egyetlen valósággá vált.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
