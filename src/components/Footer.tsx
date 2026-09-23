import React from 'react';
import { Compass, ChevronUp, Radio, Heart } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    audioEngine.playSonarPing();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#020307] border-t border-slate-900 py-16 px-4 sm:px-6 lg:px-8 text-slate-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-cinzel font-bold text-slate-100 tracking-wider">
                A SPIRÁL LEHELETE
              </h3>
              <p className="text-cyan-400 font-semibold tracking-widest text-[11px] uppercase">
                A 82. SZÉLESSÉGI KÓD
              </p>
            </div>
            <p className="text-slate-400 text-xs font-sans max-w-md leading-relaxed">
              Csurik Konrád filozófiai és sci-fi regényének hivatalos univerzum-weboldala.
              Felfedezés, rejtett technológiák, időanomáliák és a többdimenziós emberi tudat próbája.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#050A14] border border-cyan-900/60 text-cyan-300">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>KOORDINÁTA: 82°16’S — 36°01’E</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              NAVIGÁCIÓ
            </div>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <a href="#hero" className="hover:text-cyan-300 transition-colors">
                  Kezdőlap
                </a>
              </li>
              <li>
                <a href="#story" className="hover:text-cyan-300 transition-colors">
                  A Történetről
                </a>
              </li>
              <li>
                <a href="#map" className="hover:text-cyan-300 transition-colors">
                  Antarktisz-Térkép
                </a>
              </li>
              <li>
                <a href="#spiral" className="hover:text-cyan-300 transition-colors">
                  A Spirál
                </a>
              </li>
              <li>
                <a href="#timeline" className="hover:text-cyan-300 transition-colors">
                  Idővonal (28 Fázis)
                </a>
              </li>
              <li>
                <a href="#archive" className="hover:text-cyan-300 transition-colors">
                  Archív-82 Dossziék
                </a>
              </li>
            </ul>
          </div>

          {/* Lore & Editions */}
          <div className="space-y-3">
            <div className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              UNIVERZUM
            </div>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <a href="#characters" className="hover:text-cyan-300 transition-colors">
                  Karakterek & Entitások
                </a>
              </li>
              <li>
                <a href="#guardians" className="hover:text-cyan-300 transition-colors">
                  Az Őrzők Adatbázisa
                </a>
              </li>
              <li>
                <a href="#chapters" className="hover:text-cyan-300 transition-colors">
                  Fejezetbetekintő
                </a>
              </li>
              <li>
                <a href="#author" className="hover:text-cyan-300 transition-colors">
                  A Szerzőről
                </a>
              </li>
              <li>
                <a href="#editions" className="hover:text-cyan-300 transition-colors">
                  Könyv Megrendelése
                </a>
              </li>
              <li>
                <a href="#theories" className="hover:text-cyan-300 transition-colors">
                  Olvasói Elméletek
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Csurik Konrád — Minden jog fenntartva. Archív-82 Univerzum.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-4 py-2 rounded border border-slate-800 bg-slate-950 hover:border-cyan-500/50 hover:text-cyan-300 transition-all text-slate-400"
          >
            <span>VISSZA A TETEJÉRE</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
