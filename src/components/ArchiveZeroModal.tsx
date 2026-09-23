import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { trackDiscovery } from '../utils/discoveryStorage';

interface ArchiveZeroModalProps {
  onClose: () => void;
}

export const ArchiveZeroModal: React.FC<ArchiveZeroModalProps> = ({ onClose }) => {
  const [phase, setPhase] = useState<'404' | 'TRANSITION' | 'ZERO_ROOM'>('404');
  const [subText, setSubText] = useState('A keresett fájl nem található a szerveren.');

  useEffect(() => {
    trackDiscovery.unlockZeroRoom();
    trackDiscovery.secretFound('archive_zero');

    // 404 -> Transition after 2.5s
    const t1 = setTimeout(() => {
      setPhase('TRANSITION');
      setSubText('„Nem ezt az oldalt kerested.”');
      audioEngine.playSonarPing();
    }, 2400);

    // Transition -> "Vagy mégis?" after 4.5s
    const t2 = setTimeout(() => {
      setSubText('„Vagy mégis?”');
    }, 4500);

    // Final Zero Room reveal after 6.2s
    const t3 = setTimeout(() => {
      setPhase('ZERO_ROOM');
      audioEngine.playDeepChime();
    }, 6200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-slate-200 select-none overflow-hidden animate-fade-in font-mono">
      {/* Absolute Close button in corner */}
      <button
        onClick={() => {
          audioEngine.playSonarPing();
          onClose();
        }}
        className="absolute top-6 right-6 z-50 p-2 text-slate-600 hover:text-cyan-400 transition-colors"
        title="Visszatérés"
      >
        <X className="w-6 h-6" />
      </button>

      {/* PHASE 1 & 2: Pseudo 404 Glitch Screen */}
      {phase !== 'ZERO_ROOM' && (
        <div className="text-center space-y-6 max-w-md px-6 animate-pulse">
          <div className="text-6xl sm:text-8xl font-bold tracking-widest text-slate-800 glitch-text">
            404
          </div>
          <div className="text-xs tracking-widest text-slate-500 uppercase border-y border-slate-900 py-2">
            HTTP_ERROR: RESOURCE_NOT_FOUND // 0x00000082
          </div>
          <p className="text-sm text-cyan-400 font-mono transition-all duration-700">
            {subText}
          </p>
        </div>
      )}

      {/* PHASE 3: Minimalist ARCHÍV-0 (Zéró Kamra) */}
      {phase === 'ZERO_ROOM' && (
        <div className="flex flex-col items-center justify-center space-y-12 px-6 text-center max-w-xl animate-fade-in">
          {/* Subtle Classification Tag */}
          <div className="text-[10px] tracking-[0.3em] text-cyan-600 uppercase border border-cyan-950 px-3 py-1 bg-black">
            ARCHÍV-0 // ZÉRÓ KAMRA
          </div>

          {/* Minimalist Breathing Pure Spiral Vector */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Ambient breathing glow behind */}
            <div className="absolute inset-0 rounded-full bg-cyan-900/10 blur-3xl animate-pulse" />

            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(56,189,248,0.3)] animate-spin-slow">
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
                strokeWidth="1.5"
                strokeLinecap="round"
                className="opacity-80"
              />
            </svg>
          </div>

          {/* Singular Narrative Sentence */}
          <blockquote className="text-lg sm:text-2xl font-cinzel text-slate-100 tracking-wider leading-relaxed">
            „Minden rendszernek van egy első emléke.”
          </blockquote>

          <div className="text-[11px] text-slate-600 tracking-widest pt-8 uppercase">
            A Spirál nem megkezdődött. Csak megfigyelted.
          </div>
        </div>
      )}
    </div>
  );
};
