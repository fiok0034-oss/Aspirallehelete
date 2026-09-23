import React from 'react';
import { BookOpen, Search, Compass, ArrowRight } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface EntrySelectorProps {
  onSelectReader: () => void;
  onSelectResearcher: () => void;
  onSelectExplorer: () => void;
}

export const EntrySelector: React.FC<EntrySelectorProps> = ({
  onSelectReader,
  onSelectResearcher,
  onSelectExplorer,
}) => {
  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-[#030712]/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-400/80 uppercase">
            NAVIGÁCIÓS FÓKUSZ // VÁLASSZ KIINDULÓPONTOT
          </span>
          <h3 className="text-lg sm:text-xl font-cinzel font-semibold text-slate-200">
            HOGYAN LÉPSZ BE A SPIRÁL VILÁGÁBA?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. OLVASÓ */}
          <button
            onClick={() => {
              audioEngine.playSonarPing();
              onSelectReader();
            }}
            className="group p-5 rounded border border-cyan-950/80 bg-[#050B18]/70 hover:border-cyan-500/60 hover:bg-[#071328] transition-all text-left space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded bg-cyan-950 border border-cyan-900 text-cyan-400 group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                BELÉPÉS <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div>
              <h4 className="font-cinzel font-bold text-slate-100 text-base group-hover:text-cyan-300 transition-colors">
                📖 OLVASÓ
              </h4>
              <p className="text-xs text-slate-400 font-mono italic pt-1">
                „A történettel kezdem.”
              </p>
              <p className="text-[11px] text-slate-500 pt-1.5 leading-relaxed">
                Közvetlen ugrás a regény fejezeteihez és a digitális olvasó felülethez.
              </p>
            </div>
          </button>

          {/* 2. KUTATÓ */}
          <button
            onClick={() => {
              audioEngine.playSonarPing();
              onSelectResearcher();
            }}
            className="group p-5 rounded border border-cyan-950/80 bg-[#050B18]/70 hover:border-cyan-500/60 hover:bg-[#071328] transition-all text-left space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded bg-cyan-950 border border-cyan-900 text-teal-400 group-hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-teal-500 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                BELÉPÉS <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div>
              <h4 className="font-cinzel font-bold text-slate-100 text-base group-hover:text-teal-300 transition-colors">
                🔬 KUTATÓ
              </h4>
              <p className="text-xs text-slate-400 font-mono italic pt-1">
                „A rejtélyt akarom megfejteni.”
              </p>
              <p className="text-[11px] text-slate-500 pt-1.5 leading-relaxed">
                ARCHÍV-82 terminálparancsok, dossziék és titkos távközlési adatok.
              </p>
            </div>
          </button>

          {/* 3. FELFEDEZŐ */}
          <button
            onClick={() => {
              audioEngine.playSonarPing();
              onSelectExplorer();
            }}
            className="group p-5 rounded border border-cyan-950/80 bg-[#050B18]/70 hover:border-cyan-500/60 hover:bg-[#071328] transition-all text-left space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded bg-cyan-950 border border-cyan-900 text-sky-400 group-hover:text-white transition-colors">
                <Compass className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-sky-500 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                BELÉPÉS <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div>
              <h4 className="font-cinzel font-bold text-slate-100 text-base group-hover:text-sky-300 transition-colors">
                🌀 FELFEDEZŐ
              </h4>
              <p className="text-xs text-slate-400 font-mono italic pt-1">
                „Meg akarom ismerni a világot.”
              </p>
              <p className="text-[11px] text-slate-500 pt-1.5 leading-relaxed">
                Antarktisz 3D földgömb, jég alatti térkép és a rezonáns Spirál.
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
