import React from 'react';
import { Compass, Box, Orbit, Cpu, Sparkles } from 'lucide-react';

interface StoryOverviewProps {
  onExploreTimeline: () => void;
  onExploreSpiral: () => void;
}

export const StoryOverview: React.FC<StoryOverviewProps> = ({
  onExploreTimeline,
  onExploreSpiral,
}) => {
  const pillars = [
    {
      id: 'pillar-viktor',
      icon: Compass,
      title: 'Viktor H.',
      subtitle: 'A volt topográfus',
      text: 'A 29 éves szakember egy 1997-es, archivált antarktiszi georadar-felvételen olyan párhuzamos, 300 méteres struktúrákat vesz észre, amelyek nem természeti képződmények. Titokban saját túlélőkapszulát visz, és elszakad az expedíciótól.',
    },
    {
      id: 'pillar-coord',
      icon: Box,
      title: 'A 82. szélességi kör',
      subtitle: '82°16’S — 36°01’E',
      text: 'Egy koordináta a kontinens legkönyörtelenebb, fagyos pontján. A jég vastagsága több mint 3 kilométer. A jég alatt nem egyszerű régészeti kőlelet fekszik, hanem egy ismeretlen eredetű, hidegen pulzáló komplexum.',
    },
    {
      id: 'pillar-world',
      icon: Cpu,
      title: 'A jég alatti világ',
      subtitle: 'A mesterséges rendszer',
      text: 'A falak elnyelik a fényszóró sugarát, míg mikroszkopikus rovások vibrálnak a peremeken. A termek nem fizikai szabályok, hanem a belépő elme szándékai és stabilitása szerint alakulnak át.',
    },
    {
      id: 'pillar-vegtelen',
      icon: Orbit,
      title: 'A Végtelen',
      subtitle: 'Többdimenziós tudat-entitás',
      text: 'Nem szörny, és nem idegen hódító. Az ARCHÍV-82/Δ entitás a tudat, energia, geometria, emlék és idő magasabb dimenziós szintézise, amely fokozatosan teszi próbára a megfigyelő emberi mivoltát.',
    },
    {
      id: 'pillar-spiral',
      icon: Sparkles,
      title: 'A Spirál',
      subtitle: 'Az univerzum geometriája',
      text: 'Nem pusztán egy forma vagy szimbólum. A Spirál az emlékek, az idő, a tudat és a valóság élő kapcsolódási pontja. Ahol az ember már nem csak felfedezi a világot, hanem formálja is azt.',
    },
  ];

  return (
    <section id="story" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#04070D]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            A KÖNYV VILÁGA
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            A TÖRTÉNET ALAPJAI
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg leading-relaxed">
            Az Antarktisz fagyos platója alatt nem pusztán régészeti leletek várakoznak. A felfedezés
            fokozatosan alakul át földalatti rejtélyből ősi időanomáliává, alternatív valóságokká és a tudat végső próbájává.
          </p>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-6 sm:p-8 rounded border border-slate-800/80 bg-[#060B14]/80 hover:border-cyan-500/40 hover:bg-[#08101E]/90 transition-all duration-300 group flex flex-col justify-between ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded border border-slate-700 bg-slate-900/70 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:text-cyan-300 group-hover:shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-cinzel font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-mono text-cyan-400/70 tracking-wider uppercase">
                      {item.subtitle}
                    </p>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    {item.text}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-600 group-hover:text-cyan-500/70">
                  <span>PONTOZÁS: 0{idx + 1}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">ARCHÍV-82</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Central Philosophical Quote Banner */}
        <div className="relative p-8 sm:p-12 rounded border border-cyan-900/40 bg-gradient-to-r from-cyan-950/20 via-[#060D1A] to-cyan-950/20 text-center space-y-4 overflow-hidden">
          <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
            A REGÉNY KÖZPONTI KÉRDÉSE
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-cinzel text-slate-100 italic max-w-3xl mx-auto leading-relaxed">
            «Mi történik akkor, amikor az ember már nem csak felfedezi a valóságot, hanem képes
            alakítani azt a tudatával?»
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreTimeline}
              className="px-6 py-2.5 rounded border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-200 text-xs font-mono tracking-wider uppercase transition-all"
            >
              IDŐVONAL ÁTTEKINTÉSE (28 FÁZIS)
            </button>
            <button
              onClick={onExploreSpiral}
              className="px-6 py-2.5 rounded border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-mono tracking-wider uppercase transition-all"
            >
              A SPIRÁL INTERAKCIÓ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
