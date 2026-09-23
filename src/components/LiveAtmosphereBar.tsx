import React, { useState, useEffect } from 'react';
import { Radio, Eye, Sparkles, Volume2, VolumeX, Shield, User, Activity, AlertCircle, Compass } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { getDiscoveryState, saveDiscoveryState, calculateDiscoveryLevel, DiscoveryLevel, trackDiscovery } from '../utils/discoveryStorage';

interface LiveAtmosphereBarProps {
  onOpenSignalDecoder: () => void;
  onOpenDetectiveBoard: () => void;
}

export const LiveAtmosphereBar: React.FC<LiveAtmosphereBarProps> = ({
  onOpenSignalDecoder,
  onOpenDetectiveBoard,
}) => {
  const [signalStrength, setSignalStrength] = useState<number>(3);
  const [signalStatus, setSignalStatus] = useState<'IDLE' | 'DETECTED' | 'LOST'>('IDLE');
  const [signalMsg, setSignalMsg] = useState<string>('82°16’S // 03%');
  const [discoveryLevel, setDiscoveryLevel] = useState<DiscoveryLevel>('OBSERVING');
  const [detectiveActive, setDetectiveActive] = useState(false);
  const [atmosphereOn, setAtmosphereOn] = useState(true);
  const [callsign, setCallsign] = useState('');
  const [isEditingCallsign, setIsEditingCallsign] = useState(false);
  const [tempCallsign, setTempCallsign] = useState('');

  // Synchronize with discovery state
  useEffect(() => {
    const update = () => {
      const state = getDiscoveryState();
      setDiscoveryLevel(calculateDiscoveryLevel(state));
      setDetectiveActive(state.detectiveMode);
      setAtmosphereOn(state.atmosphereEnabled);
      setCallsign(state.operatorCallsign || '');
    };
    update();
    window.addEventListener('spiral_discovery_update', update);
    return () => window.removeEventListener('spiral_discovery_update', update);
  }, []);

  // 1 & 6. Periodic living signal fluctuations («SIGNAL DETECTED» ... «SIGNAL LOST»)
  useEffect(() => {
    const interval = setInterval(() => {
      const roll = Math.random();
      if (roll > 0.65) {
        // Surge
        const newStrength = Math.floor(12 + Math.random() * 75);
        setSignalStrength(newStrength);
        setSignalStatus('DETECTED');
        setSignalMsg(`82°16’S // ${newStrength}% JEL`);

        // If audio is active, play a subtle ping
        if (audioEngine.getActive()) {
          audioEngine.playSonarPing();
        }

        setTimeout(() => {
          setSignalStatus('LOST');
          setSignalMsg('SIGNAL LOST');
          setTimeout(() => {
            setSignalStatus('IDLE');
            setSignalStrength(Math.floor(2 + Math.random() * 6));
            setSignalMsg(`82°16’S // ${Math.floor(2 + Math.random() * 6)}%`);
          }, 3500);
        }, 4500);
      }
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleAtmosphere = () => {
    const next = trackDiscovery.toggleAtmosphere();
    if (!next) {
      audioEngine.stop();
    } else {
      audioEngine.start();
    }
  };

  const handleToggleDetective = () => {
    audioEngine.playSonarPing();
    const next = trackDiscovery.toggleDetectiveMode();
    setDetectiveActive(next);
  };

  const handleSaveCallsign = (e: React.FormEvent) => {
    e.preventDefault();
    trackDiscovery.setCallsign(tempCallsign);
    setIsEditingCallsign(false);
    audioEngine.playSonarPing();
  };

  return (
    <div className="fixed top-16 right-4 sm:right-6 z-40 flex items-center gap-2 pointer-events-auto">
      {/* Callsign Badge / Operator input */}
      <div className="hidden lg:flex items-center">
        {isEditingCallsign ? (
          <form onSubmit={handleSaveCallsign} className="flex items-center gap-1 bg-[#050B18] border border-cyan-800 rounded px-2 py-1 text-xs font-mono">
            <input
              type="text"
              placeholder="OPERÁTOR NÉV"
              value={tempCallsign}
              onChange={(e) => setTempCallsign(e.target.value)}
              className="bg-transparent text-cyan-200 outline-none w-24 text-[11px]"
              autoFocus
            />
            <button type="submit" className="text-cyan-400 hover:text-white text-[10px]">
              MENTÉS
            </button>
          </form>
        ) : (
          <button
            onClick={() => {
              setTempCallsign(callsign);
              setIsEditingCallsign(true);
            }}
            title="Kutatói azonosító megadása (csak lokálisan tárolva)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-800 bg-[#040814]/90 text-slate-400 hover:text-cyan-300 hover:border-cyan-800 font-mono text-[10px] tracking-wider transition-colors"
          >
            <User className="w-3 h-3 text-cyan-500" />
            <span>{callsign ? `OP: ${callsign.toUpperCase()}` : '+ AZONOSÍTÓ'}</span>
          </button>
        )}
      </div>

      {/* Discovery Level Badge */}
      <div
        title="Felfedezési állapotod az archívumban"
        className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded border border-cyan-950 bg-[#050C1C]/90 text-xs font-mono"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <span className="text-[10px] text-slate-400 tracking-wider">SZINT:</span>
        <span
          className={`text-[10px] font-bold tracking-widest ${
            discoveryLevel === 'AWAKENED'
              ? 'text-rose-400 animate-pulse'
              : discoveryLevel === 'CONNECTED'
              ? 'text-cyan-300'
              : discoveryLevel === 'SEARCHING'
              ? 'text-teal-300'
              : 'text-slate-400'
          }`}
        >
          {discoveryLevel}
        </span>
      </div>

      {/* Detective Mode Toggle */}
      <button
        onClick={handleToggleDetective}
        title={detectiveActive ? 'Nyomozói réteg aktív (részletek megjelenítve)' : 'Nyomozói réteg bekapcsolása'}
        className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[10px] font-mono tracking-wider transition-all ${
          detectiveActive
            ? 'border-amber-500 bg-amber-950/60 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
            : 'border-slate-800 bg-[#050C1C]/80 text-slate-400 hover:text-white hover:border-slate-700'
        }`}
      >
        <Shield className="w-3 h-3" />
        <span className="hidden sm:inline">NYOMOZÓ</span>
      </button>

      {/* Atmosphere Audio/FX Toggle */}
      <button
        onClick={handleToggleAtmosphere}
        title={atmosphereOn ? 'Atmoszféra (hang & effektek) kikapcsolása' : 'Atmoszféra bekapcsolása'}
        className={`p-1.5 rounded border text-[10px] font-mono transition-all ${
          atmosphereOn
            ? 'border-cyan-800 bg-cyan-950/50 text-cyan-300'
            : 'border-slate-800 bg-slate-950 text-slate-500'
        }`}
      >
        {atmosphereOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
      </button>

      {/* 6. Living Signal Corner Pill */}
      <button
        onClick={() => {
          audioEngine.playSonarPing();
          onOpenSignalDecoder();
        }}
        className={`flex items-center gap-2 px-2.5 py-1 rounded border font-mono text-[10px] tracking-wider transition-all cursor-pointer ${
          signalStatus === 'DETECTED'
            ? 'border-cyan-400 bg-cyan-950/90 text-cyan-200 shadow-[0_0_15px_rgba(56,189,248,0.5)] animate-pulse'
            : signalStatus === 'LOST'
            ? 'border-rose-900 bg-rose-950/80 text-rose-300'
            : 'border-cyan-950 bg-[#040814]/90 text-slate-400 hover:border-cyan-800 hover:text-cyan-300'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            signalStatus === 'DETECTED'
              ? 'bg-cyan-400 animate-ping'
              : signalStatus === 'LOST'
              ? 'bg-rose-500'
              : 'bg-cyan-600'
          }`}
        />
        <span className="font-bold">◉ SIGNAL</span>
        <span className="text-[9px] opacity-75">{signalMsg}</span>
      </button>
    </div>
  );
};
