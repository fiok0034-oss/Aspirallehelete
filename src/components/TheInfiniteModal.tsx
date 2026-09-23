import React, { useState, useEffect } from 'react';
import { X, Eye } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { trackDiscovery } from '../utils/discoveryStorage';

interface TheInfiniteModalProps {
  onClose: () => void;
}

export const TheInfiniteModal: React.FC<TheInfiniteModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [observationStatus, setObservationStatus] = useState<'ACTIVE' | 'ENDED' | null>(null);

  useEffect(() => {
    trackDiscovery.secretFound('the_infinite_observed');

    // Sequential revelations
    const t1 = setTimeout(() => setStep(1), 1200); // NEM SZERVEZET
    const t2 = setTimeout(() => setStep(2), 2600); // NEM GÉP
    const t3 = setTimeout(() => setStep(3), 4000); // NEM ISTEN
    const t4 = setTimeout(() => setStep(4), 5400); // NEM EMBER
    const t5 = setTimeout(() => setStep(5), 7000); // AKKOR MI?

    // Rare randomized "OBSERVATION ACTIVE"
    const tObs = setTimeout(() => {
      setObservationStatus('ACTIVE');
      audioEngine.playSonarPing();
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(tObs);
    };
  }, []);

  const handleClose = () => {
    setObservationStatus('ENDED');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#010206] text-slate-100 select-none overflow-hidden animate-fade-in font-mono">
      {/* Corner Status & Observation indicator */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono text-cyan-400">
        <Eye className="w-4 h-4 animate-pulse" />
        <span>ENTITÁS-DOKUMENTÁCIÓ: A VÉGTELEN</span>
        {observationStatus && (
          <span className="ml-3 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700 text-[10px] text-cyan-300 animate-pulse">
            OBSERVATION {observationStatus}
          </span>
        )}
      </div>

      <button
        onClick={handleClose}
        className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
        title="Bezárás"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Abstract Glowing Hyper-Geometry */}
      <div className="relative flex flex-col items-center justify-center space-y-12 max-w-xl px-6 text-center">
        {/* Rotating Sacred Polyhedron / Geometry Canvas */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-[90px] animate-pulse" />

          {/* Concentric rotating geometric shapes */}
          <div className="absolute inset-4 border border-cyan-400/30 rounded-full animate-spin-slow" />
          <div className="absolute inset-10 border border-teal-300/40 rotate-45 animate-reverse-spin" />
          <div className="absolute inset-16 border border-sky-400/50 rounded-full animate-pulse" />
          <div className="absolute inset-24 border border-cyan-200/60 rotate-12" />

          {/* Central Monolith Core */}
          <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_30px_#ffffff] animate-ping" />
        </div>

        {/* Narrative Revelations */}
        <div className="space-y-3 font-cinzel text-xl sm:text-2xl tracking-[0.2em] text-slate-300">
          <div className={`transition-opacity duration-700 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            «„NEM SZERVEZET.”»
          </div>
          <div className={`transition-opacity duration-700 ${step >= 2 ? 'opacity-100 text-cyan-200' : 'opacity-0'}`}>
            «„NEM GÉP.”»
          </div>
          <div className={`transition-opacity duration-700 ${step >= 3 ? 'opacity-100 text-teal-200' : 'opacity-0'}`}>
            «„NEM ISTEN.”»
          </div>
          <div className={`transition-opacity duration-700 ${step >= 4 ? 'opacity-100 text-sky-200' : 'opacity-0'}`}>
            «„NEM EMBER.”»
          </div>
        </div>

        {/* Unanswered Final Question */}
        {step >= 5 && (
          <div className="pt-6 border-t border-cyan-900/50 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white tracking-[0.3em]">
              „AKKOR MI?”
            </h2>
            <p className="text-xs font-mono text-slate-500 pt-3 tracking-widest uppercase">
              [A válasz nem szöveg formájában érkezik]
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
