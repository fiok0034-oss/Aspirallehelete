import React, { useEffect, useRef, useState } from 'react';
import { SpiralState } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { Eye, Sparkles, RefreshCw, Cpu, Activity, Scan, AlertCircle } from 'lucide-react';
import { trackDiscovery } from '../utils/discoveryStorage';

interface SpiralExperienceProps {
  onUnlockFragment?: (fragId: string) => void;
}

export const SpiralExperience: React.FC<SpiralExperienceProps> = ({ onUnlockFragment }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentState, setCurrentState] = useState<SpiralState>('FIGYEL');
  const [isHovered, setIsHovered] = useState(false);
  const mousePos = useRef({ x: 0, y: 0, active: false });
  const hoverTimer = useRef<number | null>(null);

  // 9. Whisper state
  const [whisper, setWhisper] = useState<string | null>(null);
  const [visitCount, setVisitCount] = useState<number>(0);

  // 11. Spiral Scanning State
  const [scanStatus, setScanStatus] = useState<'IDLE' | 'SCANNING' | 'COMPLETE'>('IDLE');
  const [scanSteps, setScanSteps] = useState<string[]>([]);

  const states: SpiralState[] = ['FIGYEL', 'EMLÉKEZIK', 'VÁLASZOL', 'ÁTÍR', 'LÉLEGZIK'];

  const stateDescriptions: Record<SpiralState, { title: string; quote: string; color: string }> = {
    FIGYEL: {
      title: 'A Spirál figyel',
      quote: '„A struktúra érzékeli a megfigyelő szándékát.”',
      color: 'text-cyan-400',
    },
    EMLÉKEZIK: {
      title: 'A Spirál emlékezik',
      quote: '„Minden valaha megfogalmazott emberi gondolat beíródott a geometriába.”',
      color: 'text-sky-400',
    },
    VÁLASZOL: {
      title: 'A Spirál válaszol',
      quote: '„Nem szavakkal felel, hanem a gravitáció és a fény elhajlásával.”',
      color: 'text-teal-300',
    },
    ÁTÍR: {
      title: 'A Spirál átír',
      quote: '„A kőzetek sűrűsége megváltozik az elme határozottságának arányában.”',
      color: 'text-indigo-300',
    },
    LÉLEGZIK: {
      title: 'A SPIRÁL LÉLEGZIK',
      quote: '„Nem mechanikus zaj ez: egy kozmikus tüdő, amely valóságvariációkat teremt.”',
      color: 'text-rose-400',
    },
  };

  const handleStateChange = (nextState: SpiralState) => {
    setCurrentState(nextState);
    audioEngine.playSonarPing();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 550);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.min(600, Math.max(450, window.innerHeight * 0.6));
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes along logarithmic spiral arms
    const totalArms = 3;
    const pointsPerArm = 90;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.fillStyle = 'rgba(3, 7, 14, 0.28)'; // motion blur trail
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Interaction intensity based on current state
      let speedMult = 1;
      let breathIntensity = 0.08;
      let strokeColor = 'rgba(56, 189, 248, ';
      let pointColor = '#38bdf8';

      if (currentState === 'FIGYEL') {
        speedMult = 0.8;
        breathIntensity = 0.05;
        strokeColor = 'rgba(56, 189, 248, ';
        pointColor = '#38bdf8';
      } else if (currentState === 'EMLÉKEZIK') {
        speedMult = 1.1;
        breathIntensity = 0.1;
        strokeColor = 'rgba(14, 165, 233, ';
        pointColor = '#0ea5e9';
      } else if (currentState === 'VÁLASZOL') {
        speedMult = 1.4;
        breathIntensity = 0.15;
        strokeColor = 'rgba(45, 212, 191, ';
        pointColor = '#2dd4bf';
      } else if (currentState === 'ÁTÍR') {
        speedMult = 1.8;
        breathIntensity = 0.22;
        strokeColor = 'rgba(129, 140, 248, ';
        pointColor = '#818cf8';
      } else if (currentState === 'LÉLEGZIK') {
        speedMult = 2.4;
        breathIntensity = 0.35;
        strokeColor = 'rgba(244, 63, 94, ';
        pointColor = '#f43f5e';
      }

      const breath = Math.sin(time * speedMult) * breathIntensity;

      // Mouse displacement
      let offsetX = 0;
      let offsetY = 0;
      if (mousePos.current.active) {
        offsetX = (mousePos.current.x - centerX) * 0.08;
        offsetY = (mousePos.current.y - centerY) * 0.08;
      }

      ctx.save();
      ctx.translate(centerX + offsetX, centerY + offsetY);

      // Central core singularity glow
      const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 80 * (1 + breath));
      coreGrad.addColorStop(0, `${strokeColor}0.85)`);
      coreGrad.addColorStop(0.3, `${strokeColor}0.35)`);
      coreGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 80 * (1 + breath), 0, Math.PI * 2);
      ctx.fill();

      // Draw spiral arms
      for (let a = 0; a < totalArms; a++) {
        const armBaseAngle = (a * 2 * Math.PI) / totalArms;
        ctx.beginPath();

        for (let i = 0; i < pointsPerArm; i++) {
          const t = i / pointsPerArm;
          // Logarithmic spiral math: r = a * exp(b * theta)
          const angle = armBaseAngle + t * 4.5 * Math.PI + time * 0.3 * (a % 2 === 0 ? 1 : 0.9);
          const r = (12 + Math.pow(t, 1.4) * (width * 0.42)) * (1 + breath);

          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          // Sporadic glowing node points along the spiral
          if (i % 8 === 0) {
            ctx.save();
            ctx.fillStyle = pointColor;
            ctx.shadowColor = pointColor;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(x, y, 1.5 + (1 - t) * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        ctx.strokeStyle = `${strokeColor}${0.45 - a * 0.08})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentState]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
    if (!isHovered) {
      setIsHovered(true);
      if (!hoverTimer.current) {
        hoverTimer.current = window.setTimeout(() => {
          const whispers = [
            '«„EMLÉKSZEL?”»',
            '«„A SPIRÁL ÉRZI A TEKINTETED.”»',
            '«„ÚJRA ITT VAGY.”»',
          ];
          const selected = whispers[visitCount % whispers.length];
          setWhisper(selected);
          setVisitCount((v) => v + 1);
          audioEngine.playSonarPing();
        }, 2200);
      }
    }
  };

  const handleMouseLeave = () => {
    mousePos.current.active = false;
    setIsHovered(false);
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  // 11. Spiral Scanning Simulation
  const handleScanSpiral = () => {
    if (scanStatus === 'SCANNING') return;
    setScanStatus('SCANNING');
    setScanSteps(['SCANNING...']);
    audioEngine.playSonarPing();

    setTimeout(() => {
      setScanSteps((prev) => [...prev, 'GEOMETRY: UNKNOWN']);
    }, 800);

    setTimeout(() => {
      setScanSteps((prev) => [...prev, 'DIMENSIONAL SIGNATURE: DETECTED']);
    }, 1800);

    setTimeout(() => {
      setScanSteps((prev) => [...prev, 'TEMPORAL DRIFT: 0.003']);
    }, 2800);

    setTimeout(() => {
      setScanSteps((prev) => [...prev, 'COGNITIVE RESPONSE: ACTIVE']);
    }, 3800);

    setTimeout(() => {
      setScanSteps((prev) => [...prev, '«„A rendszer észlelte a megfigyelőt.”»']);
      setScanStatus('COMPLETE');
      audioEngine.playDeepChime();
      trackDiscovery.secretFound('spiral_scan_completed');
    }, 4800);
  };

  return (
    <section id="spiral" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#03060C] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Activity className="w-3.5 h-3.5" />
            <span>INTERAKTÍV TUDAT-SZIMULÁCIÓ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            A SPIRÁL INTERAKCIÓ
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Mozgasd a kurzort a vásznon vagy válts a tudati állapotok között! A Spirál azonnal reagál a
            megfigyelő jelenlétére.
          </p>
        </div>

        {/* Interactive Spiral Canvas Container */}
        <div className="relative rounded border border-cyan-950/80 bg-[#02050B] overflow-hidden shadow-[0_0_60px_rgba(3,105,161,0.15)] flex flex-col items-center">
          {/* Top Status Header */}
          <div className="w-full border-b border-slate-800/80 bg-[#040813]/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-slate-300">AKTÍV ÁLLAPOT:</span>
              <span className={`font-bold tracking-widest uppercase ${stateDescriptions[currentState].color}`}>
                {currentState}
              </span>
            </div>
            <div className="text-slate-500 italic text-[11px] sm:text-right">
              {isHovered ? '«A Spirál figyel.»' : 'Mozgasd a kurzort a vásznon'}
            </div>
          </div>

          {/* Canvas */}
          <div className="relative w-full flex justify-center items-center cursor-crosshair">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full block"
            />

            {/* Central Floating Overlay Message */}
            <div className="absolute pointer-events-none text-center space-y-2 px-4">
              <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-cyan-400/80 drop-shadow">
                {stateDescriptions[currentState].title}
              </p>
              <p className="text-base sm:text-xl font-cinzel text-slate-100 italic drop-shadow max-w-md mx-auto">
                {stateDescriptions[currentState].quote}
              </p>
            </div>

            {/* 9. Secret Proximity Whisper */}
            {whisper && (
              <div className="absolute bottom-6 px-4 py-2 rounded border border-cyan-400/60 bg-black/90 text-cyan-200 font-cinzel text-sm sm:text-base tracking-widest animate-pulse shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                {whisper}
              </div>
            )}
          </div>

          {/* 11. Scan Spiral Control & Diagnostic Console */}
          <div className="w-full border-t border-cyan-950/80 bg-[#02050E] p-4 flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleScanSpiral}
                disabled={scanStatus === 'SCANNING'}
                className="flex items-center gap-2 px-4 py-2 rounded border border-cyan-500 bg-cyan-950/70 text-cyan-200 hover:bg-cyan-900 font-mono text-xs font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)] disabled:opacity-50"
              >
                <Scan className="w-4 h-4 text-cyan-400" />
                <span>{scanStatus === 'SCANNING' ? 'SZKENNELÉS FOLYAMATBAN...' : 'SCAN SPIRAL // DIAGNOSZTIKA'}</span>
              </button>

              {/* Secret clickable glyph */}
              <button
                onClick={() => {
                  audioEngine.playSonarPing();
                  trackDiscovery.fragmentFound('FRAG_04');
                  if (onUnlockFragment) onUnlockFragment('FRAG_04');
                }}
                title="ARCHÍV-82 / FRAGMENT 04"
                className="px-2 py-1 text-[10px] font-mono border border-cyan-900/40 text-cyan-700 hover:text-cyan-300 hover:border-cyan-500 transition-colors"
              >
                Δ–82
              </button>
            </div>

            {/* Diagnostic readout steps */}
            {scanSteps.length > 0 && (
              <div className="w-full max-w-xl p-3 rounded bg-black/80 border border-cyan-950 font-mono text-[11px] space-y-1 text-left">
                {scanSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={
                      idx === scanSteps.length - 1 && scanStatus === 'COMPLETE'
                        ? 'text-cyan-300 font-bold font-cinzel text-xs pt-1'
                        : 'text-slate-400'
                    }
                  >
                    {step}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* State Stepper Buttons */}
          <div className="w-full border-t border-slate-800 bg-[#040812] p-4 sm:p-6">
            <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              {states.map((st, idx) => {
                const isActive = st === currentState;
                return (
                  <button
                    key={st}
                    onClick={() => handleStateChange(st)}
                    className={`px-3 sm:px-4 py-2 rounded text-xs font-mono tracking-widest uppercase transition-all duration-200 border flex items-center gap-1.5 ${
                      isActive
                        ? st === 'LÉLEGZIK'
                          ? 'border-rose-500 bg-rose-950/40 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                          : 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500">0{idx + 1}</span>
                    <span>{st}</span>
                  </button>
                );
              })}
            </div>
            <div className="text-center pt-3 text-[11px] font-mono text-slate-500">
              Kattints a fázisokra a Spirál rezonanciájának és lélegzetének megváltoztatásához
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
