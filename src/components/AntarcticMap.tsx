import React, { useState } from 'react';
import { Compass, Radio, Layers, AlertCircle, ArrowDown, ChevronRight, X } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface AntarcticMapProps {
  onDiveComplete?: () => void;
}

export const AntarcticMap: React.FC<AntarcticMapProps> = ({ onDiveComplete }) => {
  const [isHotspotActive, setIsHotspotActive] = useState(false);
  const [isSubIceViewOpen, setIsSubIceViewOpen] = useState(false);
  const [radarScanning, setRadarScanning] = useState(false);

  const handleHotspotClick = () => {
    setIsHotspotActive(true);
    setRadarScanning(true);
    audioEngine.playSonarPing();
    setTimeout(() => setRadarScanning(false), 3000);
  };

  const handleDiveIntoIce = () => {
    audioEngine.playSonarPing();
    setIsSubIceViewOpen(true);
    if (onDiveComplete) {
      onDiveComplete();
    }
  };

  return (
    <section id="map" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#02050A] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>KARTOGRÁFIA & POLÁRIS TELEMETRIA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            INTERAKTÍV ANTARKTISZ-TÉRKÉP
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            A 82°16’S, 36°01’E koordináta a Föld egyik leginkább megközelíthetetlen sarki platóján rejtőzik.
            Kattints a pulzáló fókuszpontra a georadar-anomália vizsgálatához!
          </p>
        </div>

        {/* Map Display Container */}
        <div className="relative rounded border border-cyan-950/80 bg-[#040813] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {/* Radar Grid overlay */}
          <div className="relative w-full h-[450px] sm:h-[550px] flex items-center justify-center p-4">
            {/* SVG Stylized Antarctic Continent Map */}
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full max-w-4xl object-contain opacity-75 drop-shadow-[0_0_20px_rgba(14,116,144,0.15)]"
            >
              <defs>
                {/* Radar sweep gradient */}
                <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="70%" stopColor="#0369a1" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Polar Grid Lines */}
              <circle cx="400" cy="300" r="260" fill="none" stroke="#0f172a" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="400" cy="300" r="190" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="400" cy="300" r="110" fill="none" stroke="#0e7490" strokeWidth="1" strokeOpacity="0.4" />
              <circle cx="400" cy="300" r="30" fill="none" stroke="#0284c7" strokeWidth="1" strokeOpacity="0.5" />

              <line x1="400" y1="20" x2="400" y2="580" stroke="#0f172a" strokeWidth="1" strokeDasharray="2 4" />
              <line x1="80" y1="300" x2="720" y2="300" stroke="#0f172a" strokeWidth="1" strokeDasharray="2 4" />

              {/* Antarctic Stylized Coastline Vector */}
              <path
                d="M380,90 C450,85 520,110 590,160 C660,210 690,290 680,360 C670,430 610,490 530,520 C450,550 370,540 300,510 C230,480 180,430 150,370 C120,310 130,230 180,170 C230,110 310,95 380,90 Z"
                fill="#070e1b"
                stroke="#1e3a5f"
                strokeWidth="2"
              />

              {/* Ross Ice Shelf Bay & Peninsula detail */}
              <path
                d="M360,450 C380,480 430,470 450,440 C430,410 390,420 360,450 Z"
                fill="#040812"
                stroke="#0369a1"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              <path
                d="M200,160 C180,130 160,90 170,60 C180,80 210,120 220,150 Z"
                fill="#070e1b"
                stroke="#1e3a5f"
                strokeWidth="1.5"
              />

              {/* South Pole Marker */}
              <circle cx="400" cy="300" r="3" fill="#64748b" />
              <text x="410" y="304" fill="#475569" fontSize="10" fontFamily="monospace">
                90°S DÉLI SARK
              </text>

              {/* Active Hotspot: 82°16'S, 36°01'E */}
              <g
                transform="translate(455, 275)"
                className="cursor-pointer group"
                onClick={handleHotspotClick}
              >
                {/* Pulsing Radar Rings */}
                <circle
                  cx="0"
                  cy="0"
                  r="32"
                  fill="url(#radarGlow)"
                  className={`${radarScanning ? 'animate-ping' : ''}`}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="18"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  className="animate-spin"
                  style={{ animationDuration: '8s' }}
                />
                <circle cx="0" cy="0" r="5" fill="#38bdf8" className="shadow-[0_0_12px_#38bdf8]" />

                {/* Target label */}
                <text
                  x="15"
                  y="-8"
                  fill="#38bdf8"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="tracking-wider"
                >
                  82°16’S / 36°01’E [ANOMÁLIA]
                </text>
                <text
                  x="15"
                  y="6"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  3 200m JÉG ALATT
                </text>
              </g>

              {/* McMurdo Base reference */}
              <g transform="translate(340, 430)">
                <rect x="-3" y="-3" width="6" height="6" fill="#334155" />
                <text x="8" y="3" fill="#64748b" fontSize="9" fontFamily="monospace">
                  MCMURDO ÁLLOMÁS (REF-01)
                </text>
              </g>

              {/* Vostok Station reference */}
              <g transform="translate(480, 360)">
                <rect x="-3" y="-3" width="6" height="6" fill="#334155" />
                <text x="8" y="3" fill="#64748b" fontSize="9" fontFamily="monospace">
                  VOSTOK ÁLLOMÁS (REF-02)
                </text>
              </g>
            </svg>

            {/* Coordinates HUD Top Right */}
            <div className="absolute top-4 right-4 bg-[#030712]/90 border border-slate-800 p-3 rounded font-mono text-[11px] text-slate-400 space-y-1 pointer-events-none">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                <span>SZATELIT-VÉTEL: AKTÍV</span>
              </div>
              <div>SZÉLESSÉG: 82°16’44.2” S</div>
              <div>HOSSZÚSÁG: 36°01’18.9” E</div>
              <div>MAGASSÁG: +3 488 m (felszín)</div>
              <div>MÉLYSÉGI ANOMÁLIA: -3 220 m</div>
            </div>

            {/* Radar scanner sweep indicator */}
            {radarScanning && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[300px] h-[300px] rounded-full border border-cyan-500/30 animate-ping opacity-30" />
              </div>
            )}
          </div>

          {/* Action Bar / Hotspot Info Card */}
          <div className="border-t border-slate-800 bg-[#050B16] p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h4 className="text-base sm:text-lg font-cinzel font-bold text-slate-100">
                  FÓKUSZPONT: 82°16’S — 36°01’E
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-800 text-cyan-300">
                  GEORADAR-1997
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                {isHotspotActive
                  ? 'Frekvencia: 50 MHz. Észlelve: Két 300 méteres párhuzamos fal és mikro-hőanomália.'
                  : 'Kattints a sarki térkép pontjára vagy az alábbi gombra a mélyfúrási rétegek feltárásához!'}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleHotspotClick}
                className="flex-1 sm:flex-none px-4 py-2 rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-mono tracking-wider transition-all"
              >
                RADAR PING
              </button>

              <button
                onClick={handleDiveIntoIce}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded border border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 hover:text-white text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)]"
              >
                <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>LEMERÜLÉS A JÉG ALÁ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Ice Deep Cross Section Modal / View */}
        {isSubIceViewOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-4xl w-full rounded border border-cyan-800/80 bg-[#050A14] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(2,132,199,0.3)]">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <Layers className="w-4 h-4" />
                    <span>ARCHÍV-82 / FÖLDALATTI METSZET</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
                    A JÉG ALATTI KOMPLEXUM (3 200 MÉTER)
                  </h3>
                </div>
                <button
                  onClick={() => setIsSubIceViewOpen(false)}
                  className="p-1.5 rounded border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-ice cross section diagram */}
              <div className="p-4 rounded border border-slate-800 bg-[#03060C] space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300">
                  <div className="p-3 rounded border border-slate-900 bg-slate-950/60">
                    <span className="text-slate-500 block text-[10px]">FELSZÍNI VASTAGSÁG</span>
                    <span className="text-base text-cyan-300 font-bold">3 220 m</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Örök fagy, jégkristály rétegek</span>
                  </div>
                  <div className="p-3 rounded border border-slate-900 bg-slate-950/60">
                    <span className="text-slate-500 block text-[10px]">HŐMÉRSÉKLET-UGRÁS</span>
                    <span className="text-base text-rose-300 font-bold">-68°C → -4°C</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Termikus stabilitás odalent</span>
                  </div>
                  <div className="p-3 rounded border border-slate-900 bg-slate-950/60">
                    <span className="text-slate-500 block text-[10px]">STRUKTÚRA HOSSZA</span>
                    <span className="text-base text-cyan-300 font-bold">2 × 300 m</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Párhuzamos csarnokfolyosók</span>
                  </div>
                </div>

                {/* Sub-Ice Illustrated Cross Section */}
                <div className="h-44 sm:h-52 w-full rounded border border-cyan-950 bg-gradient-to-b from-[#0e2439] via-[#05111d] to-[#02060b] relative overflow-hidden flex flex-col justify-between p-4">
                  {/* Surface Level */}
                  <div className="flex justify-between items-center text-[10px] text-cyan-200/80 border-b border-cyan-700/30 pb-1">
                    <span>FELSZÍN: 82°16’S — -68°C HÓVIHAR</span>
                    <span>TÚLÉLŐKAPSZULA AKNA</span>
                  </div>

                  {/* Borehole line */}
                  <div className="absolute left-1/2 top-6 bottom-16 w-0.5 border-l border-dashed border-cyan-400/50" />

                  {/* Subterranean Complex Base */}
                  <div className="relative z-10 p-3 rounded border border-cyan-500/40 bg-slate-950/90 space-y-1">
                    <div className="text-cyan-300 font-bold text-xs flex items-center justify-between">
                      <span>KRIPTO-CSARNOK I. & II. (MÉLYSÉG: -3 200m)</span>
                      <span className="text-rose-400 text-[10px] animate-pulse">REZNÁLÓ FREKVENCIA</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      A falak elnyelik a fényt. Mikroszkopikus rovások vibrálnak az ismeretlen ötvözetben.
                      Viktor H. itt vesztette el a kapcsolatot a felszíni rádióállomással.
                    </p>
                  </div>
                </div>
              </div>

              {/* Explanatory Excerpt */}
              <div className="space-y-2 text-sm text-slate-300 font-light leading-relaxed">
                <p>
                  Viktor a mélységbe érve döbbent rá, hogy a két 300 méteres csarnok nem egyszerűen eltemetett rom.
                  A mennyezetről finom, alacsony frekvenciás moduláció szólt, amely az emberi hallásküszöb alatt
                  közvetlenül az idegrendszerre hatott.
                </p>
                <blockquote className="border-l-2 border-cyan-500 pl-4 py-1 text-cyan-200 italic font-cinzel">
                  „A jég alatt nem egy másik világ kezdődött. Hanem a mi világunk alapzata, amiről elfelejtették elmondani, hogy mire épült.”
                </blockquote>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setIsSubIceViewOpen(false)}
                  className="px-5 py-2 rounded border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-mono uppercase"
                >
                  BEZÁRÁS
                </button>
                <a
                  href="#archive"
                  onClick={() => setIsSubIceViewOpen(false)}
                  className="px-5 py-2 rounded border border-cyan-500 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-xs font-mono uppercase font-semibold flex items-center gap-1.5"
                >
                  <span>DOSSZIÉK MEGTEKINTÉSE (ARCHÍV-82)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
