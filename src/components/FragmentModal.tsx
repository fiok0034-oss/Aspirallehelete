import React from 'react';
import { LoreFragment, LORE_FRAGMENTS } from '../data/fragmentsData';
import { FileText, X, Sparkles, Shield, Radio, CheckCircle, Terminal } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface FragmentModalProps {
  fragment: LoreFragment;
  allFoundIds: string[];
  onClose: () => void;
  onSelectFragment: (f: LoreFragment) => void;
  onOpenZeroRoom?: () => void;
}

export const FragmentModal: React.FC<FragmentModalProps> = ({
  fragment,
  allFoundIds,
  onClose,
  onSelectFragment,
  onOpenZeroRoom,
}) => {
  const isAllCollected = allFoundIds.length >= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded border border-cyan-500/60 bg-[#040814] shadow-[0_0_60px_rgba(56,189,248,0.25)] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-cyan-900/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <div>
              <span className="text-[11px] font-mono tracking-widest text-cyan-400 block uppercase">
                ACCESSING HIDDEN DATA...
              </span>
              <h2 className="text-lg sm:text-xl font-mono font-bold text-white tracking-wider flex items-center gap-2">
                <span>ARCHÍV-82 // {fragment.number}</span>
                <span className="text-xs px-2 py-0.5 rounded border border-cyan-800 bg-cyan-950 text-cyan-300">
                  {fragment.classification}
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              audioEngine.playSonarPing();
              onClose();
            }}
            className="p-1.5 rounded border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box */}
        <div className="p-5 rounded border border-cyan-950 bg-[#060c1c] space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300/80">
            <span>TÍPUS: {fragment.type}</span>
            <span>FORRÁS: {fragment.source}</span>
          </div>

          <h3 className="text-xl font-cinzel font-semibold text-slate-100">
            {fragment.title}
          </h3>

          <blockquote className="border-l-2 border-cyan-400 pl-4 py-2 my-2 text-cyan-100/90 font-mono text-sm sm:text-base italic bg-cyan-950/20 rounded-r">
            {fragment.quote}
          </blockquote>

          <p className="text-sm text-slate-300/90 font-mono leading-relaxed">
            {fragment.details}
          </p>
        </div>

        {/* 10-Fragment Progress Tracker */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              MEGSZERZETT TÖREDÉKEK: <strong className="text-cyan-300">{allFoundIds.length} / 10</strong>
            </span>
            {isAllCollected ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> ÚJ ADAT FELFEDEZVE!
              </span>
            ) : (
              <span className="text-slate-500">Kutasd tovább a weboldalt a többiért</span>
            )}
          </div>

          {/* 10 Small Indicator Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {LORE_FRAGMENTS.map((frag, idx) => {
              const isFound = allFoundIds.includes(frag.id);
              const isCurrent = frag.id === fragment.id;

              return (
                <button
                  key={frag.id}
                  disabled={!isFound}
                  onClick={() => {
                    audioEngine.playSonarPing();
                    onSelectFragment(frag);
                  }}
                  title={isFound ? frag.title : 'Ismeretlen fragment (még nem találtad meg)'}
                  className={`h-9 rounded text-[10px] font-mono flex flex-col items-center justify-center transition-all ${
                    isCurrent
                      ? 'border border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                      : isFound
                      ? 'border border-cyan-900 bg-cyan-950/40 text-cyan-300 hover:border-cyan-700'
                      : 'border border-slate-900 bg-slate-950/60 text-slate-700 cursor-not-allowed'
                  }`}
                >
                  <span>{idx + 1}</span>
                  <span className="text-[8px] opacity-75">{isFound ? 'OK' : '???'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* All Collected Reward */}
        {isAllCollected && onOpenZeroRoom && (
          <div className="p-4 rounded border border-emerald-500/60 bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
            <div className="text-xs font-mono text-emerald-300">
              <strong>MINDEN TÖREDÉK MEGTALÁLVA!</strong>
              <p className="text-slate-400">Az ARCHÍV-0 (Zéró Kamra) zárolása feloldódott.</p>
            </div>
            <button
              onClick={() => {
                audioEngine.playDeepChime();
                onClose();
                onOpenZeroRoom();
              }}
              className="px-4 py-2 rounded border border-emerald-400 bg-emerald-500/20 text-emerald-200 font-mono text-xs font-bold hover:bg-emerald-500/40 transition-all uppercase"
            >
              Belépés az Archív-0-ba
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="text-center pt-2">
          <p className="text-[10px] font-mono text-slate-500">
            A fragmentek a weboldal sötét rétegeiben rejtőznek: koordináták, hibás dátumok és Δ–82 jelek alatt.
          </p>
        </div>
      </div>
    </div>
  );
};
