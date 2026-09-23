import React, { useState } from 'react';
import { SpoilerMode } from '../types';
import { Volume2, VolumeX, ShieldAlert, ShieldCheck, Menu, X, Compass, Terminal, BookOpen, Gamepad2, ExternalLink, User } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#03060B]/85 backdrop-blur-md border-b border-cyan-950/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#hero');
          }}
          className="flex items-center gap-3 group text-left"
        >
          <div className="w-8 h-8 rounded-full border border-cyan-500/40 flex items-center justify-center bg-cyan-950/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all">
            <span className="text-cyan-400 text-sm font-bold select-none group-hover:scale-110 transition-transform">🌀</span>
          </div>
          <div>
            <div className="text-sm sm:text-base font-cinzel font-bold tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors">
              A SPIRÁL LEHELETE
            </div>
            <div className="text-[10px] font-mono tracking-widest text-cyan-400/70 flex items-center gap-1">
              <span>82°16’S</span>
              <span className="text-slate-600">/</span>
              <span>36°01’E</span>
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className="text-xs uppercase tracking-wider text-slate-400 hover:text-cyan-300 transition-colors hover:scale-105 transform duration-150"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions (Audio & Spoiler Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Prominent Reader CTA in Nav */}
          {onOpenReader && (
            <button
              onClick={() => {
                audioEngine.playSonarPing();
                onOpenReader();
              }}
              title="Online Könyvolvasó megnyitása"
              className="px-2.5 sm:px-3 py-1.5 rounded border border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-200 font-mono text-xs tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.25)] hover:shadow-[0_0_20px_rgba(56,189,248,0.45)] transition-all font-semibold"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
              <span>OLVASÁS</span>
            </button>
          )}

          {/* Interactive Game Link */}
          <a
            href="https://aspiralleheleteinteractivebookgame.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioEngine.playSonarPing()}
            title="🎮 Interaktív Könyv Játék megnyitása új lapon"
            className="px-2.5 sm:px-3 py-1.5 rounded border border-cyan-400/80 bg-gradient-to-r from-cyan-950/70 to-blue-950/70 hover:from-cyan-900/80 hover:to-blue-900/80 text-cyan-200 hover:text-white font-mono text-xs tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.25)] hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all font-semibold group"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-300 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline">INTERAKTÍV JÁTÉK</span>
            <span className="lg:hidden">JÁTÉK</span>
            <ExternalLink className="w-2.5 h-2.5 text-cyan-400/70 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* User Discovery Profile Button */}
          {onOpenProfile && (
            <button
              onClick={() => {
                audioEngine.playSonarPing();
                onOpenProfile();
              }}
              title="Személyes olvasói útvonal és megszerzett adatok"
              className="p-2 rounded border border-cyan-800/80 bg-cyan-950/30 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all text-xs flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline font-mono text-[11px]">ÚTVONALAD</span>
            </button>
          )}

          {/* Quick Terminal Icon */}
          {onOpenTerminalQuick && (
            <button
              onClick={onOpenTerminalQuick}
              title="ARCHÍV-82 Terminál Gyorselérés"
              className="p-2 rounded border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-800 transition-all text-xs flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono text-[11px]">ARCHÍV</span>
            </button>
          )}

          {/* Audio Engine Toggle */}
          <button
            onClick={handleToggleAudio}
            title={isAudioActive ? 'Atmoszféra hang elnémítása' : 'Atmoszféra hang bekapcsolása'}
            className={`p-2 rounded border text-xs font-mono flex items-center gap-1.5 transition-all ${
              isAudioActive
                ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAudioActive ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px] tracking-wider">
              {isAudioActive ? 'HANG BE' : 'HANG KI'}
            </span>
          </button>

          {/* Spoiler Mode Toggle */}
          <button
            onClick={() =>
              handleSpoilerChange(spoilerMode === 'spoiler-free' ? 'full-universe' : 'spoiler-free')
            }
            title="Spoiler-szűrő váltása"
            className={`px-2.5 py-1.5 rounded border text-xs font-mono flex items-center gap-1.5 transition-all ${
              spoilerMode === 'full-universe'
                ? 'border-rose-500/50 bg-rose-950/30 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                : 'border-cyan-900/60 bg-cyan-950/20 text-cyan-300 hover:border-cyan-700'
            }`}
          >
            {spoilerMode === 'full-universe' ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[10px] sm:text-xs tracking-wider">TELJES UNIVERZUM</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] sm:text-xs tracking-wider">SPOILERMENTES</span>
              </>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            aria-label="Menü megnyitása"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#050811]/95 border-b border-cyan-950/60 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl">
          {onOpenReader && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                audioEngine.playSonarPing();
                onOpenReader();
              }}
              className="w-full py-3 px-4 rounded border border-cyan-400 bg-cyan-500/20 text-cyan-200 font-mono text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.3)] font-bold"
            >
              <BookOpen className="w-4 h-4 text-cyan-300" />
              <span>📖 OLVASD EL A KÖNYVET (ONLINE OLVASÓ)</span>
            </button>
          )}

          {/* Interactive Game Mobile Link */}
          <a
            href="https://aspiralleheleteinteractivebookgame.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setMobileMenuOpen(false);
              audioEngine.playSonarPing();
            }}
            className="w-full py-3 px-4 rounded border border-cyan-400/80 bg-gradient-to-r from-cyan-950/80 to-blue-950/70 text-cyan-200 font-mono text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.25)] font-bold hover:border-cyan-300 transition-all"
          >
            <Gamepad2 className="w-4 h-4 text-cyan-300" />
            <span>🎮 INTERAKTÍV JÁTÉK (ÚJ LAPON)</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/30 rounded border border-transparent hover:border-cyan-900/40 transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-[11px] text-cyan-400">
              <Compass className="w-3.5 h-3.5" /> 82°16’S — 36°01’E
            </span>
            <span className="text-[11px] text-slate-500">Csurik Konrád</span>
          </div>
        </div>
      )}
    </header>
  );
};
