import React, { useEffect, useRef, useState } from 'react';
import { Compass, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, ArrowDown, Radio } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { trackDiscovery } from '../utils/discoveryStorage';

interface InteractiveGlobeProps {
  onDiveUnderIce: () => void;
}

export const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({ onDiveUnderIce }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState({ x: 1.1, y: -0.6 }); // Rotated towards Antarctica by default
  const [zoom, setZoom] = useState(1.1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [anomalyTargeted, setAnomalyTargeted] = useState(false);
  const [isDiving, setIsDiving] = useState(false);

  // Target coordinates: 82°16'S, 36°01'E
  // In radians:
  const targetLat = (-82.26 * Math.PI) / 180;
  const targetLon = (36.01 * Math.PI) / 180;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let pulseAngle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const radius = (Math.min(width, height) * 0.38) * zoom;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Deep space glow behind sphere
      const bgGlow = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.3);
      bgGlow.addColorStop(0, 'rgba(8, 30, 58, 0.45)');
      bgGlow.addColorStop(0.7, 'rgba(3, 10, 24, 0.2)');
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Sphere base
      const sphereGrad = ctx.createRadialGradient(
        cx - radius * 0.3,
        cy - radius * 0.3,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      sphereGrad.addColorStop(0, '#06162d');
      sphereGrad.addColorStop(0.7, '#020b17');
      sphereGrad.addColorStop(1, '#01050a');

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#0ea5e9';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Project spherical coordinates
      const project = (lat: number, lon: number) => {
        // Rotate lon around Y axis, then lat around X axis
        const cosLat = Math.cos(lat);
        const sinLat = Math.sin(lat);

        const x0 = cosLat * Math.cos(lon + rotation.y);
        const y0 = sinLat;
        const z0 = -cosLat * Math.sin(lon + rotation.y);

        // Tilt with rotation.x
        const y1 = y0 * Math.cos(rotation.x) - z0 * Math.sin(rotation.x);
        const z1 = y0 * Math.sin(rotation.x) + z0 * Math.cos(rotation.x);
        const x1 = x0;

        return {
          x: cx + x1 * radius,
          y: cy + y1 * radius,
          visible: z1 > 0,
        };
      };

      // Draw latitude lines (parallels)
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      const parallels = [-80, -60, -40, -20, 0, 20, 40, 60, 80];
      parallels.forEach((pLat) => {
        ctx.beginPath();
        const radLat = (pLat * Math.PI) / 180;
        let started = false;
        for (let l = 0; l <= 360; l += 5) {
          const radLon = (l * Math.PI) / 180;
          const p = project(radLat, radLon);
          if (p.visible) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      });

      // Draw longitude lines (meridians)
      for (let l = 0; l < 360; l += 30) {
        ctx.beginPath();
        const radLon = (l * Math.PI) / 180;
        let started = false;
        for (let p = -90; p <= 90; p += 5) {
          const radLat = (p * Math.PI) / 180;
          const proj = project(radLat, radLon);
          if (proj.visible) {
            if (!started) {
              ctx.moveTo(proj.x, proj.y);
              started = true;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Draw stylized Antarctic continent polygon at the South Pole
      ctx.beginPath();
      ctx.fillStyle = 'rgba(186, 230, 253, 0.12)';
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
      ctx.lineWidth = 1.2;

      const antarcticContour = [
        [-65, 0],
        [-68, 30],
        [-72, 60],
        [-70, 90],
        [-68, 120],
        [-74, 150],
        [-78, 170],
        [-84, -170],
        [-80, -140],
        [-75, -110],
        [-70, -80],
        [-63, -60],
        [-70, -40],
        [-65, 0],
      ];

      let contourStarted = false;
      antarcticContour.forEach(([latDeg, lonDeg]) => {
        const p = project((latDeg * Math.PI) / 180, (lonDeg * Math.PI) / 180);
        if (p.visible) {
          if (!contourStarted) {
            ctx.moveTo(p.x, p.y);
            contourStarted = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Project target: 82°16'S / 36°01'E
      const target = project(targetLat, targetLon);
      pulseAngle += 0.05;

      if (target.visible) {
        const pulseR = 8 + Math.sin(pulseAngle) * 5;

        // Outer pulsing anomaly wave
        ctx.beginPath();
        ctx.arc(target.x, target.y, pulseR * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(target.x, target.y, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Core beacon dot
        ctx.beginPath();
        ctx.arc(target.x, target.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label line
        ctx.beginPath();
        ctx.moveTo(target.x, target.y);
        ctx.lineTo(target.x + 35, target.y - 25);
        ctx.lineTo(target.x + 100, target.y - 25);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('82°16’S / 36°01’E', target.x + 40, target.y - 30);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Δ-82 ANOMÁLIA', target.x + 40, target.y - 14);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [rotation, zoom]);

  // Touch and mouse rotation handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotation((prev) => ({
      x: Math.max(-1.5, Math.min(1.5, prev.x + dy * 0.005)),
      y: prev.y + dx * 0.005,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Canvas click detection for anomaly
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.38 * zoom;

    // Calculate target coords
    const cosLat = Math.cos(targetLat);
    const sinLat = Math.sin(targetLat);
    const x0 = cosLat * Math.cos(targetLon + rotation.y);
    const y0 = sinLat;
    const z0 = -cosLat * Math.sin(targetLon + rotation.y);
    const y1 = y0 * Math.cos(rotation.x) - z0 * Math.sin(rotation.x);
    const z1 = y0 * Math.sin(rotation.x) + z0 * Math.cos(rotation.x);

    if (z1 > 0) {
      const tx = cx + x0 * radius;
      const ty = cy + y1 * radius;
      const dist = Math.hypot(clickX - tx, clickY - ty);

      if (dist < 40) {
        audioEngine.playSonarPing();
        setAnomalyTargeted(true);
        trackDiscovery.secretFound('globe_anomaly_detected');
      }
    }
  };

  const handleExecuteDive = () => {
    setIsDiving(true);
    audioEngine.playDeepChime();
    audioEngine.setZone('sub-ice');
    trackDiscovery.siteVisited('sub_ice_excavation');

    setTimeout(() => {
      setIsDiving(false);
      onDiveUnderIce();
    }, 1800);
  };

  const resetToAntarctica = () => {
    setRotation({ x: 1.1, y: -0.6 });
    setZoom(1.1);
    audioEngine.playSonarPing();
  };

  return (
    <div className="relative rounded border border-cyan-950/80 bg-[#020713] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] p-4 sm:p-6">
      {/* Globe Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cyan-950/60 font-mono text-xs">
        <div className="flex items-center gap-2 text-cyan-300">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin [animation-duration:20s]" />
          <span className="font-bold tracking-wider">3D POLÁRIS GLOBE MODELL</span>
          <span className="text-slate-500 hidden sm:inline">| Huzd az egérrel a forgatáshoz</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom((z) => Math.min(2.0, z + 0.2))}
            className="p-1.5 rounded border border-cyan-900/60 bg-cyan-950/40 text-cyan-300 hover:text-white hover:border-cyan-500"
            title="Nagyítás"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.2))}
            className="p-1.5 rounded border border-cyan-900/60 bg-cyan-950/40 text-cyan-300 hover:text-white hover:border-cyan-500"
            title="Kicsinyítés"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetToAntarctica}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-cyan-900/60 bg-cyan-950/40 text-cyan-300 hover:text-white hover:border-cyan-500"
            title="Vissza a 82°16’S fókuszponthoz"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">ANTARKTISZ FÓKUSZ</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-[450px] sm:h-[550px] flex items-center justify-center cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full max-w-3xl object-contain select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
        />

        {/* Ice Dive Camera Penetration Animation Overlay */}
        {isDiving && (
          <div className="absolute inset-0 z-40 bg-gradient-to-b from-cyan-100 via-sky-300 to-[#02050b] flex flex-col items-center justify-center animate-ping [animation-duration:1.5s]">
            <div className="text-center font-mono space-y-2 p-6 rounded bg-black/80 border border-cyan-400">
              <div className="text-cyan-300 text-xl font-bold tracking-widest uppercase">
                ÁTHATOLÁS A JÉGRÉTEGEN...
              </div>
              <div className="text-xs text-slate-300">
                MÉLYSÉG: -3 200 MÉTER // HŐMÉRSÉKLET: -4°C
              </div>
            </div>
          </div>
        )}

        {/* Telemetry Corner Overlay */}
        <div className="absolute top-4 left-4 font-mono text-[11px] text-slate-400 bg-black/60 p-3 rounded border border-cyan-950/80 backdrop-blur-sm pointer-events-none hidden sm:block">
          <div className="text-cyan-400 font-bold">FÖLDFELÜLETI TELEMETRIA</div>
          <div>ROT_X: {rotation.x.toFixed(2)} rad</div>
          <div>ROT_Y: {rotation.y.toFixed(2)} rad</div>
          <div>ZOOM: {(zoom * 100).toFixed(0)}%</div>
          <div className="text-cyan-300/80 mt-1">CÉLPONT: 82°16’S / 36°01’E</div>
        </div>
      </div>

      {/* Anomaly Detection Banner & "Lemerülés a jég alá" Button */}
      {anomalyTargeted && (
        <div className="mt-4 p-4 rounded border-2 border-cyan-400/90 bg-gradient-to-r from-cyan-950/90 via-blue-950/90 to-slate-900/90 shadow-[0_0_30px_rgba(56,189,248,0.4)] animate-slide-up flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-300 animate-pulse">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-cyan-300 tracking-widest uppercase flex items-center gap-2">
                <span>⚠️ ANOMÁLIA ÉSZLELVE</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-900/80 text-[10px] text-cyan-200">
                  Δ-82 AKTÍV
                </span>
              </div>
              <p className="text-sm text-slate-200 mt-0.5 font-light">
                A 82°16’S, 36°01’E koordinátán 3 200 méter jég alatt egy ismeretlen geometriájú szerkezet pulzál.
              </p>
            </div>
          </div>

          <button
            onClick={handleExecuteDive}
            disabled={isDiving}
            className="w-full md:w-auto px-6 py-3.5 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-sm tracking-widest uppercase font-bold transition-all shadow-[0_0_20px_rgba(56,189,248,0.6)] hover:shadow-[0_0_35px_rgba(56,189,248,0.9)] flex items-center justify-center gap-2 shrink-0 group"
          >
            <span>LEMERÜLÉS A JÉG ALÁ</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Prompt to click beacon */}
      {!anomalyTargeted && (
        <div className="mt-3 text-center">
          <button
            onClick={() => {
              setAnomalyTargeted(true);
              audioEngine.playSonarPing();
            }}
            className="text-xs font-mono text-cyan-400/80 hover:text-cyan-300 tracking-wider underline underline-offset-4"
          >
            [ Kattints ide vagy a glóbuszon pulzáló jelre az anomália azonosításához ]
          </button>
        </div>
      )}
    </div>
  );
};
