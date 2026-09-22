import React, { useState } from 'react';
import { Compass, ArrowRight, Eye } from 'lucide-react';

interface StoryIntroProps {
  onProceedToStory: () => void;
}

export const StoryIntro: React.FC<StoryIntroProps> = ({ onProceedToStory }) => {
  const [activeStep, setActiveStep] = useState(0);

  const narrativeLines = [
    {
      lead: '„A jeges szél nem emlékezett a nyarakra.”',
      sub: 'A felszíni hőmérséklet -68°C. A hóvihar hangja minden emberi szót elnyel.',
    },
    {
      lead: 'Viktor H. nem turistaként érkezett az Antarktiszra.',
      sub: 'Egykori topográfus volt, akit a hivatalos kartográfia merev határai feszélyeztek.',
    },
    {
      lead: 'Egy régi georadarfelvétel nyomát követte.',
      sub: '1997-es katonai felvétel. Több kilométernyi jégtakaró alatt két párhuzamos, 300 méteres struktúra rajzolódott ki.',
    },
    {
      lead: 'A jég alatt valami volt.',
      sub: 'Nem barlang. Nem gleccserkarc. Nem természetes geológiai repedés.',
    },
    {
      lead: 'Valami, aminek nem kellett volna ott lennie.',
      sub: 'A falak elnyelték a fényszóró sugarát, miközben mikroszkopikus spirális rovások vibráltak.',
    },
    {
      lead: '„Ahol már semmi sem igazán térkép.”',
      sub: 'Mert a Spirál nem helyszín. A Spirál a tudat, az idő és a valóság kapcsolódási pontja.',
    },
  ];

  return (
    <section
      id="intro"
      className="relative min-h-[85vh] w-full bg-[#020408] border-y border-slate-900 flex flex-col justify-center items-center px-4 py-20 overflow-hidden"
    >
      {/* Background dark grid and cold light haze */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,24,44,0.35)_0,transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />

      <div className="max-w-3xl mx-auto w-full text-center space-y-10 z-10">
        {/* Category Header */}
        <div className="flex items-center justify-center gap-2 text-cyan-400/80 font-mono text-xs uppercase tracking-widest">
          <Eye className="w-3.5 h-3.5" />
          <span>INTRO — A KÜSZÖBÖN</span>
        </div>

        {/* Narrative Card */}
        <div className="min-h-[180px] sm:min-h-[220px] flex flex-col justify-center items-center space-y-4 px-4">
          <p className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-medium text-slate-100 leading-snug tracking-wide transition-all duration-500 animate-glitch">
            {narrativeLines[activeStep].lead}
          </p>
          <p className="text-sm sm:text-base text-cyan-300/70 font-mono max-w-xl mx-auto transition-opacity duration-500">
            {narrativeLines[activeStep].sub}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {narrativeLines.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                idx === activeStep
                  ? 'w-8 bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                  : 'w-2 bg-slate-800 hover:bg-slate-700'
              }`}
              aria-label={`Ugrás a(z) ${idx + 1}. sorhoz`}
            />
          ))}
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center gap-4 pt-4 font-mono text-xs">
          {activeStep < narrativeLines.length - 1 ? (
            <button
              onClick={() => setActiveStep((prev) => Math.min(narrativeLines.length - 1, prev + 1))}
              className="px-6 py-2.5 rounded border border-cyan-900/60 bg-cyan-950/20 hover:bg-cyan-900/30 text-cyan-300 hover:text-cyan-100 flex items-center gap-2 tracking-wider transition-all"
            >
              <span>KÖVETKEZŐ GONDOLAT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onProceedToStory}
              className="px-6 py-2.5 rounded border border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 hover:text-white flex items-center gap-2 tracking-wider transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>A TÖRTÉNET KIBONTAKOZÁSA</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
