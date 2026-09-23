import React, { useState } from 'react';
import { Radio, Volume2, Lock, Play, Pause, KeyRound, CheckCircle, RefreshCw, Sparkles, X } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { trackDiscovery } from '../utils/discoveryStorage';

interface AudioTrack {
  id: string;
  name: string;
  duration: string;
  frequency: string;
  origin: string;
  locked: boolean;
  unlockedHint?: string;
  description: string;
}

const AUDIO_FILES: AudioTrack[] = [
  {
    id: 'SIGNAL_01',
    name: 'SIGNAL_01 // 82. Szélességi Moraj',
    duration: '0:42',
    frequency: '082.1 MHz',
    origin: 'Poláris Mélyfúrási Szenzor',
    locked: false,
    description: 'A 3800 méter vastag jégpáncél alól regisztrált 55 Hz-es folyamatos mikroszeizmikus rezonancia.',
  },
  {
    id: 'SIGNAL_02',
    name: 'SIGNAL_02 // Gravitációs Lencse Pulzus',
    duration: '1:15',
    frequency: '144.0 MHz',
    origin: 'SAR Műhold Intercept',
    locked: false,
    description: 'Periodikus frekvenciacsúcsok, amelyek a Föld forgási sebességétől független állandóságot mutatnak.',
  },
  {
    id: 'RADIO_82',
    name: 'RADIO_82 // Visszafelé Modulált Adás',
    duration: '0:58',
    frequency: '820.0 MHz',
    origin: 'Amundsen-Scott Radarvevő',
    locked: false,
    description: 'Beszédhangszerű fonémák, amelyeket időben visszafelé játszva Viktor és Lena neve hallható.',
  },
  {
    id: 'UNKNOWN_VOICE',
    name: 'UNKNOWN_VOICE // Az Őrzők Csendje',
    duration: '2:04',
    frequency: '009.0 MHz',
    origin: 'ARCHÍV-82 / Zóna 09',
    locked: true,
    unlockedHint: 'Oldd fel a 10. Spirál vagy az Archív-0 rejtélyét a megnyitáshoz',
    description: 'Harmonikus kristályhangok, amelyek a megfigyelő szívritmusához igazodnak.',
  },
  {
    id: 'STATIC',
    name: 'STATIC // Kozmikus Háttérzaj Δ–82',
    duration: '0:35',
    frequency: '500.0 MHz',
    origin: 'Mélyűri Radarantenna',
    locked: false,
    description: 'A 2.7 Kelvin fokos mikrohullámú háttérsugárzás helyi anomáliája a Déli Pólus felett.',
  },
];

interface AudioArchiveAndCipherProps {
  onUnlockFragment?: (fragId: string) => void;
  onClose?: () => void;
}

export const AudioArchiveAndCipher: React.FC<AudioArchiveAndCipherProps> = ({
  onUnlockFragment,
  onClose,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<number>(104.5);
  const [cipherInput, setCipherInput] = useState<string>('');
  const [cipherStatus, setCipherStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [cipherDecodedMsg, setCipherDecodedMsg] = useState<string | null>(null);

  // Target secret frequency: 082.1 MHz
  const isSignalFound = Math.abs(frequency - 82.1) < 0.4;

  const handlePlayAudio = (track: AudioTrack) => {
    if (track.locked) return;

    if (playingId === track.id) {
      setPlayingId(null);
      audioEngine.stop();
    } else {
      setPlayingId(track.id);
      audioEngine.start();
      audioEngine.playSonarPing();
      trackDiscovery.secretFound(`audio_${track.id}`);
    }
  };

  const handleCipherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cipherInput.trim().toUpperCase();

    // Solutions: SPIRAL, 82, DELTA, VIKTOR, DELTA-82, Δ-82
    if (clean === 'SPIRAL' || clean === '82' || clean === 'DELTA' || clean === 'DELTA-82' || clean === 'VIKTOR') {
      setCipherStatus('SUCCESS');
      setCipherDecodedMsg('„A JELEK NEM KÍVÜLRŐL ÉRKEZNEK. A JELEKET TE HOZOD LÉTRE A MEGFICSKÁLT KRONOLÓGIÁVAL.”');
      trackDiscovery.cipherSolved('cipher_delta_82');
      trackDiscovery.fragmentFound('FRAG_08');
      audioEngine.playDeepChime();
      if (onUnlockFragment) onUnlockFragment('FRAG_08');
    } else {
      setCipherStatus('ERROR');
      audioEngine.playSonarPing();
      setTimeout(() => setCipherStatus('IDLE'), 2500);
    }
  };

  return (
    <section id="audio-archive" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#03060E] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>AKUSZTIKUS TELEMETRIA & RÁDIÓVEVŐ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            HANGARCHÍVUM & RÁDIÓFREKVENCIA
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Hallgasd meg a jég mélyéről rögzített hangmintákat, vagy forgasd a frekvenciakeresőt
            a sarki rádiósugárzás titkos 82.1 MHz-es adásának befogásához!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Audio Tracks (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest border-b border-cyan-950 pb-2 flex items-center justify-between">
              <span>RÖGZÍTETT HANGMINTÁK // AUDIO ARCHIVE</span>
              <span className="text-slate-500 font-normal">5 CSATORNA</span>
            </h3>

            <div className="space-y-3">
              {AUDIO_FILES.map((track) => {
                const isPlaying = playingId === track.id;

                return (
                  <div
                    key={track.id}
                    className={`p-4 rounded border transition-all ${
                      isPlaying
                        ? 'border-cyan-500/80 bg-cyan-950/30 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                        : track.locked
                        ? 'border-slate-900 bg-slate-950/40 opacity-60'
                        : 'border-slate-800/80 bg-[#050B18] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          disabled={track.locked}
                          onClick={() => handlePlayAudio(track)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                            track.locked
                              ? 'border-slate-800 text-slate-600 bg-slate-900'
                              : isPlaying
                              ? 'border-cyan-400 bg-cyan-500 text-slate-950 shadow-[0_0_15px_#38bdf8]'
                              : 'border-cyan-800 bg-cyan-950 text-cyan-300 hover:scale-105'
                          }`}
                        >
                          {track.locked ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>

                        <div>
                          <h4 className="font-mono text-xs sm:text-sm font-semibold text-slate-100 flex items-center gap-2">
                            <span>{track.name}</span>
                            {isPlaying && (
                              <span className="flex gap-0.5 items-end h-3">
                                <span className="w-0.5 h-3 bg-cyan-400 animate-pulse" />
                                <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-75" />
                                <span className="w-0.5 h-3.5 bg-cyan-400 animate-pulse delay-150" />
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {track.origin} • {track.frequency}
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs text-slate-500">
                        {track.duration}
                      </div>
                    </div>

                    <p className="mt-2 text-xs font-mono text-slate-400 pl-12">
                      {track.locked ? track.unlockedHint : track.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Radio Tuner & Cipher Decryptor (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 31. Radio Frequency Tuner */}
            <div className="p-6 rounded border border-cyan-950 bg-[#050C1D] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-5">
              <div className="flex items-center justify-between border-b border-cyan-950/80 pb-3">
                <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>SZÉLESSÁVÚ RÁDIÓHANGOLÓ</span>
                </span>
                <span className="font-mono text-[10px] text-slate-500">000.0 - 999.9 MHz</span>
              </div>

              {/* Digital Display */}
              <div className="p-4 rounded bg-black/80 border border-cyan-900/60 text-center font-mono">
                <div className="text-3xl sm:text-4xl font-bold tracking-widest text-cyan-300">
                  {frequency.toFixed(1)} <span className="text-sm font-normal text-cyan-500">MHz</span>
                </div>

                <div className="mt-2 text-xs font-mono">
                  {isSignalFound ? (
                    <div className="p-2 rounded bg-cyan-950/80 border border-cyan-400 text-cyan-200 font-bold animate-pulse flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>SIGNAL FOUND: ARCHÍV-82 SUGÁRZÁS!</span>
                    </div>
                  ) : (
                    <span className="text-slate-600">STATIC NOISE // JELRE VÁRAKOZÁS...</span>
                  )}
                </div>
              </div>

              {/* Range Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="999.9"
                  step="0.1"
                  value={frequency}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setFrequency(val);
                    if (Math.abs(val - 82.1) < 0.4) {
                      audioEngine.playSonarPing();
                      trackDiscovery.secretFound('frequency_82_1_found');
                      trackDiscovery.fragmentFound('FRAG_08');
                    }
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-900 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>000.0</span>
                  <span className="text-cyan-600">82.1 (ANOMÁLIA)</span>
                  <span>999.9</span>
                </div>
              </div>

              {isSignalFound && (
                <div className="p-3 rounded border border-cyan-800/80 bg-cyan-950/40 text-xs font-mono text-cyan-200/90 leading-relaxed animate-fade-in">
                  «A sarki rádiósugárzás nem kozmikus zaj. Egy végtelenített, visszafelé modulált beszédhang, amely a megérkezésünket jósolta meg.»
                  <div className="mt-2 text-[10px] text-cyan-400 font-bold">
                    ✓ 08. LORE TÖREDÉK HOZZÁADVA A KUTATÁSI NAPLÓHOZ!
                  </div>
                </div>
              )}
            </div>

            {/* 32. Morse / Cipher Decryptor */}
            <div className="p-6 rounded border border-cyan-950 bg-[#050C1D] shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-950/80 pb-3">
                <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Δ–82 CIPHER DEKÓDER</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">MORZE & KULCSSZÓ</span>
              </div>

              <div className="p-3 rounded bg-black/60 border border-slate-900 font-mono text-xs text-slate-400 space-y-1">
                <div>KÓD ÜZENET: <span className="text-cyan-300 font-bold tracking-widest">... .--. .. .-. .- .-..</span></div>
                <div className="text-[10px] text-slate-500">TIPP: A spirál latin vagy magyar neve, vagy a 82-es delta kód.</div>
              </div>

              <form onSubmit={handleCipherSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Írd be a megfejtést (pl. SPIRAL)..."
                  value={cipherInput}
                  onChange={(e) => setCipherInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-black/80 border border-slate-800 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 font-mono text-xs transition-colors"
                >
                  DEKÓDOLÁS
                </button>
              </form>

              {cipherStatus === 'SUCCESS' && cipherDecodedMsg && (
                <div className="p-3 rounded border border-emerald-500/70 bg-emerald-950/30 text-xs font-mono text-emerald-200 space-y-1 animate-fade-in">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> DEKÓDOLÁS SIKERES!
                  </div>
                  <p className="text-[11px] text-slate-300">{cipherDecodedMsg}</p>
                </div>
              )}

              {cipherStatus === 'ERROR' && (
                <div className="text-xs font-mono text-rose-400 animate-pulse">
                  ⚠ HIBÁS KULCS. A szignál torzult maradt.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
