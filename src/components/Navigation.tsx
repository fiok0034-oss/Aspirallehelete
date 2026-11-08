import React, { useState, useEffect } from 'react';
import { SpoilerMode } from '../types';
import {
  Volume2,
  VolumeX,
  ShieldAlert,
  ShieldCheck,
  Menu,
  X,
  Compass,
  Terminal,
  BookOpen,
  Gamepad2,
  ExternalLink,
  User,
  Sparkles,
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface NavigationProps {
  spoilerMode: SpoilerMode;
  setSpoilerMode?: (mode: SpoilerMode) => void;
  onToggleSpoilerMode?: (mode: SpoilerMode) => void;
  isAudioActive?: boolean;
  onToggleAudio?: () => void;
  onOpenTerminalQuick?: () => void;
  onOpenReader?: () => void;
  onOpenProfile?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  spoilerMode,
  setSpoilerMode,
  onToggleSpoilerMode,
  isAudioActive: externalAudioActive,
  onToggleAudio: externalToggleAudio,
  onOpenTerminalQuick,
  onOpenReader,
  onOpenProfile,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [internalAudioActive, setInternalAudioActive] = useState(false);

  const isAudioActive = externalAudioActive !== undefined ? externalAudioActive : internalAudioActive;

  const handleToggleAudio = () => {
    if (externalToggleAudio) {
      externalToggleAudio();
    } else {
      const active = (window as any).__audio_active || false;
      if (!active) {
        import('../utils/audioEngine').then(({ audioEngine }) => {
          audioEngine.start();
          (window as any).__audio_active = true;
          setInternalAudioActive(true);
        });
      } else {
        import('../utils/audioEngine').then(({ audioEngine }) => {
          audioEngine.stop();
          (window as any).__audio_active = false;
          setInternalAudioActive(false);
        });
      }
    }
  };

  const handleSpoilerChange = (newMode: SpoilerMode) => {
    if (setSpoilerMode) setSpoilerMode(newMode);
    if (onToggleSpoilerMode) onToggleSpoilerMode(newMode);
  };

  const navLinks = [
    { name: 'Kezdőlap', href: '#hero' },
    { name: 'A történet', href: '#story' },
    { name: 'Idővonal', href: '#timeline' },
    { name: 'Karakterek', href: '#characters' },
    { name: 'Fejezetek', href: '#chapters' },
    { name: 'ARCHÍV-82', href: '#archive' },
    { name: 'A Spirál', href: '#spiral' },
    { name: 'Térkép', href: '#map' },
    { name: 'Rejtélyek', href: '#mysteries' },
    { name: 'A szerző', href: '#author' },
  ];

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [menuOpen]);

  return (
    <>
      {/* ============================================================== */}
      {/* 1. SINGLE-ROW PERMANENT HEADER (MOBILE, TABLET & DESKTOP ALIKE)*/}
      {/* Contained items: 1. LOGO | 2. ÚTVONALAD | 3. SPOILER | 4. MENU */}
      {/* ============================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#03060B]/95 backdrop-blur-md border-b border-cyan-950/70 shadow-[0_4px_25px_rgba(0,0,0,0.8)] select-none">
        <div className="max-w-7xl mx-auto h-full px-2.5 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-3">
          {/* 1. A SPIRÁL LEHELETE LOGÓ */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#hero');
            }}
            className="flex items-center gap-2 sm:gap-3 group text-left shrink min-w-0"
            title="A Spirál Lehelete – Kezdőlap"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-cyan-500/40 flex items-center justify-center bg-cyan-950/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(56,189,248,0.4)] transition-all shrink-0">
              <span className="text-cyan-400 text-xs sm:text-sm font-bold select-none group-hover:scale-110 transition-transform">
                🌀
              </span>
            </div>
            <div className="min-w-0 truncate">
              <div className="text-[11px] xs:text-xs sm:text-sm md:text-base font-cinzel font-bold tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                A SPIRÁL LEHELETE
              </div>
              <div className="text-[8px] sm:text-[10px] font-mono tracking-widest text-cyan-400/80 truncate flex items-center gap-1">
                <span>82°16’S</span>
                <span className="text-slate-600">/</span>
                <span>36°01’E</span>
              </div>
            </div>
          </a>

          {/* RIGHT ACTIONS: ÚTVONALAD + SPOILERMENTES MÓD + HAMBURGER MENÜ */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            {/* 2. ÚTVONALAD GOMB (MINDIG KÖZVETLENÜL LÁTHATÓ ÉS ELÉRHETŐ) */}
            <button
              onClick={() => {
                if (onOpenProfile) {
                  audioEngine.playSonarPing();
                  onOpenProfile();
                }
              }}
              title="Személyes olvasói útvonal és feloldott rejtélyek"
              className="px-2 sm:px-3 py-1.5 rounded border border-cyan-800/80 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 hover:text-white hover:border-cyan-400 font-mono text-[10px] sm:text-xs tracking-wider flex items-center gap-1 sm:gap-1.5 transition-all shadow-[0_0_10px_rgba(56,189,248,0.15)] whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden xs:inline font-semibold">ÚTVONALAD</span>
            </button>

            {/* 3. SPOILERMENTES MÓD GOMB (A PAJZS IKON MINDIG LÁTHATÓ) */}
            <button
              onClick={() =>
                handleSpoilerChange(
                  spoilerMode === 'spoiler-free' ? 'full-universe' : 'spoiler-free'
                )
              }
              title={
                spoilerMode === 'full-universe'
                  ? 'Teljes univerzum mód aktív (minden spoiler látható)'
                  : 'Spoilermentes szűrő aktív (kattints a váltáshoz)'
              }
              className={`px-2 sm:px-3 py-1.5 rounded border font-mono text-[10px] sm:text-xs tracking-wider flex items-center gap-1 sm:gap-1.5 transition-all whitespace-nowrap ${
                spoilerMode === 'full-universe'
                  ? 'border-rose-500/70 bg-rose-950/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                  : 'border-cyan-900/80 bg-cyan-950/30 text-cyan-300 hover:border-cyan-600'
              }`}
            >
              {spoilerMode === 'full-universe' ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="font-semibold hidden sm:inline">TELJES UNIVERZUM</span>
                  <span className="font-semibold sm:hidden">TELJES</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-semibold hidden sm:inline">SPOILERMENTES</span>
                  <span className="font-semibold sm:hidden">SPOILER</span>
                </>
              )}
            </button>

            {/* 4. HAMBURGER MENÜ GOMB (JOBB OLDALON) */}
            <button
              onClick={() => {
                audioEngine.playSonarPing();
                setMenuOpen(!menuOpen);
              }}
              className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded border transition-all duration-200 shrink-0 ${
                menuOpen
                  ? 'border-cyan-400 bg-cyan-950/90 text-cyan-200 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                  : 'border-cyan-900/70 bg-slate-900/80 text-cyan-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(56,189,248,0.25)]'
              }`}
              aria-label={menuOpen ? 'Navigációs menü bezárása' : 'Navigációs menü megnyitása'}
              aria-expanded={menuOpen}
              title="Teljes navigációs menü megnyitása"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. HAMBURGER MENÜ – AZ ÖSSZES TÖBBI FUNKCIÓVAL ÉS LINKKEL      */}
      {/* ============================================================== */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          {/* Backdrop (tap to close) */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setMenuOpen(false)}
          />

          {/* Sliding Flyout Drawer */}
          <div className="relative z-10 w-full max-w-sm sm:max-w-md h-full bg-[#03060C]/98 border-l border-cyan-900/80 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col animate-slide-left overflow-hidden">
            {/* Drawer Top Header */}
            <div className="h-16 px-5 border-b border-cyan-950 flex items-center justify-between shrink-0 bg-[#040814]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full border border-cyan-500/50 flex items-center justify-center bg-cyan-950/40 text-xs">
                  🌀
                </div>
                <div>
                  <div className="font-cinzel text-xs font-bold tracking-wider text-slate-100">
                    ARCHÍV-82 NAVIGÁCIÓ
                  </div>
                  <div className="font-mono text-[9px] text-cyan-400/70">
                    ÖSSZES FUNKCIÓ ÉS TÉMAKÖR
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
                aria-label="Menü bezárása"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Drawer Body */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 overscroll-contain scrollbar-thin">
              {/* PRIMARY EXPERIENCE CTAs: OLVASÁS & INTERAKTÍV JÁTÉK */}
              <div className="space-y-2.5">
                <div className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>KÖNYV & ÉLMÉNYEK</span>
                </div>

                {/* OLVASÁS */}
                {onOpenReader && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      audioEngine.playSonarPing();
                      onOpenReader();
                    }}
                    className="w-full p-3.5 rounded border border-cyan-400 bg-gradient-to-r from-cyan-500/25 via-cyan-400/35 to-sky-400/25 hover:from-cyan-500/40 hover:via-cyan-400/50 hover:to-sky-400/40 text-white font-mono text-xs tracking-wider flex items-center justify-between shadow-[0_0_20px_rgba(56,189,248,0.35)] font-bold transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-400 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-cyan-300" />
                      </div>
                      <div>
                        <div className="font-bold text-white">OLVASD EL A KÖNYVET</div>
                        <div className="text-[10px] text-cyan-200/80 font-normal">
                          Teljes regény • 42 fejezet
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-300 text-cyan-200 uppercase">
                      OLVASÓ
                    </span>
                  </button>
                )}

                {/* INTERAKTÍV JÁTÉK */}
                <a
                  href="https://aspiralleheleteinteractivebookgame.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setMenuOpen(false);
                    audioEngine.playSonarPing();
                  }}
                  className="w-full p-3.5 rounded border border-cyan-400/80 bg-gradient-to-r from-cyan-950/90 via-blue-950/80 to-slate-900/90 hover:from-cyan-900/95 hover:via-blue-900/90 hover:to-slate-800/95 text-cyan-100 hover:text-white font-mono text-xs tracking-wider flex items-center justify-between shadow-[0_0_15px_rgba(56,189,248,0.2)] font-bold transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Gamepad2 className="w-4 h-4 text-cyan-300" />
                    </div>
                    <div>
                      <div className="font-bold">INTERAKTÍV KÖNYV JÁTÉK</div>
                      <div className="text-[10px] text-cyan-300/70 font-normal">
                        Döntésalapú játék az Antarktiszon
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* CORE TOOLS: FELHASZNÁLÓI PROFIL, ARCHÍV-82, HANGVEZÉRLÉS */}
              <div className="space-y-2.5">
                <div className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>RENDSZER ÉS IRÁNYÍTÁS</span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {/* FELHASZNÁLÓI PROFIL */}
                  {onOpenProfile && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        audioEngine.playSonarPing();
                        onOpenProfile();
                      }}
                      className="w-full p-3 rounded border border-cyan-800/80 bg-[#050C1A] hover:bg-cyan-950/50 hover:border-cyan-400 text-cyan-200 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-semibold">FELHASZNÁLÓI PROFIL</span>
                      </div>
                      <span className="text-[10px] text-slate-400">STATISZTIKA & HALADÁS</span>
                    </button>
                  )}

                  {/* ARCHÍV-82 TERMINÁL */}
                  {onOpenTerminalQuick && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        audioEngine.playSonarPing();
                        onOpenTerminalQuick();
                      }}
                      className="w-full p-3 rounded border border-slate-800 bg-[#050C1A] hover:border-cyan-700 hover:bg-cyan-950/40 text-slate-200 hover:text-cyan-200 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-semibold">ARCHÍV-82 DOSSZIÉK</span>
                      </div>
                      <span className="text-[10px] text-slate-400">ÉLŐ TERMINÁL</span>
                    </button>
                  )}

                  {/* HANG KI/BE (Működik a menüből, állapota megmarad!) */}
                  <button
                    onClick={handleToggleAudio}
                    className={`w-full p-3 rounded border flex items-center justify-between transition-all ${
                      isAudioActive
                        ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                        : 'border-slate-800 bg-[#050C1A] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isAudioActive ? (
                        <Volume2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <VolumeX className="w-4 h-4 shrink-0" />
                      )}
                      <span className="font-semibold">ATMOSZFÉRA HANGVEZÉRLÉS</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isAudioActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isAudioActive ? 'BEKAPCSOLVA' : 'KIKAPCSOLVA'}
                    </span>
                  </button>
                </div>
              </div>

              {/* UNIVERSE SECTIONS: ALL 10 SECTION LINKS */}
              <div className="space-y-2.5 pt-2 border-t border-cyan-950/80">
                <div className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-cyan-400" />
                  <span>UNIVERZUM FEJEZETEK ÉS TÉMAKÖRÖK</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(link.href);
                      }}
                      className="px-3 py-2.5 rounded border border-slate-800/80 bg-slate-950/60 hover:border-cyan-500/60 hover:bg-cyan-950/30 text-slate-300 hover:text-cyan-200 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-between"
                    >
                      <span className="truncate">{link.name}</span>
                      <span className="text-[10px] text-cyan-500/60">→</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Bottom Footer */}
            <div className="p-4 border-t border-cyan-950/80 bg-[#040814] flex flex-col gap-1.5 shrink-0 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Compass className="w-3.5 h-3.5" /> 82°16’S — 36°01’E
                </span>
                <span className="text-slate-500">Archív-82 Univerzum</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                Csurik Konrád: A Spirál Lehelete
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
