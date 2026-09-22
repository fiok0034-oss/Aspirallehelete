import React, { useState } from 'react';
import { Clock, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const FractureCity: React.FC = () => {
  const [distortionLevel, setDistortionLevel] = useState(1);
  const [isScanning, setIsScanning] = useState(false);

  const anomalies = [
    {
      label: 'IDŐMÉRŐ-ANOMÁLIA',
      time: '14:89:12',
      desc: 'A számlapok mutatói egymással szemben, változó sebességgel forognak.',
    },
    {
      label: 'FALI FELIRATOK',
      time: '2041.11.04 // 1997.02.18',
      desc: 'Még meg sem történt napok meteorológiai feljegyzései vésve a gránitba.',
    },
    {
      label: 'KÖZLEKEDŐ FOLYOSÓK',
      time: 'Δ = +34.2 ms',
      desc: 'Az ajtók három másodperccel azelőtt nyílnak ki, hogy a kéz feléjük nyúlna.',
    },
    {
      label: 'REZGÉSHULLÁM',
      time: '0.000 Hz',
      desc: 'A csend sűrűbb, mint a víz: elnyeli a lépések visszhangját.',
    },
  ];

  const handleScan = () => {
    setIsScanning(true);
    audioEngine.playSonarPing();
    setDistortionLevel((prev) => (prev % 3) + 1);
    setTimeout(() => setIsScanning(false), 800);
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#03060E] border-t border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-indigo-900/60 bg-indigo-950/20 text-indigo-300 font-mono text-xs tracking-widest uppercase">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>NEM-FIZIKAI STRUKTÚRA // ANOMÁLIA-ZÓNA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            A TÖRÉS VÁROSA
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Ahol az építészet nem téglából és betonból áll, hanem egymásra csúszott időszeletekből.
            Az ajtók megnyílnak az érintés előtt, és a falakon jövőbeli expedíciók dátumai vibrálnak.
          </p>

          {/* Time Distortion Alert Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/40 bg-rose-950/30 text-rose-300 font-mono text-xs animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>⚠ IDŐTORZULÁS ÉSZLELVE (SZINT: {distortionLevel})</span>
          </div>
        </div>

        {/* 4 Anomalies Bento Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300 ${
            isScanning ? 'animate-glitch opacity-80' : ''
          }`}
        >
          {anomalies.map((item, idx) => (
            <div
              key={item.label}
              className="p-6 rounded border border-indigo-950/80 bg-[#050A18] hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block">
                  {item.label}
                </span>
                <div className="text-2xl font-mono font-bold text-slate-100 tracking-wider">
                  {item.time}
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed">{item.desc}</p>
              </div>
              <div className="text-[10px] font-mono text-indigo-500/70 border-t border-indigo-950 pt-2 flex items-center justify-between">
                <span>ZÓNA-0{idx + 1}</span>
                <span>TÖRT TÉR</span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Scanner Trigger Button */}
        <div className="text-center pt-2">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="px-6 py-3 rounded border border-indigo-500/60 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-200 text-xs font-mono tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)] flex items-center justify-center gap-2 mx-auto"
          >
            <Zap className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'SZKENNELÉS FOLYAMATBAN...' : 'IDŐTORZULÁS ÚJRAMÉRÉSE'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
