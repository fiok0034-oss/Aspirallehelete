import React from 'react';
import { Feather, BookOpen, Gamepad2, Sparkles, ExternalLink, Shield } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface AuthorSectionProps {
  onOpenReader?: () => void;
}

export const AuthorSection: React.FC<AuthorSectionProps> = ({ onOpenReader }) => {
  const handleOpenReaderClick = () => {
    audioEngine.playSonarPing();
    if (onOpenReader) {
      onOpenReader();
    } else {
      const readerBtn = document.querySelector('[data-reader-trigger]') as HTMLButtonElement | null;
      if (readerBtn) readerBtn.click();
    }
  };

  return (
    <section id="author" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#02050B] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Author Presentation */}
        <div className="rounded border border-cyan-950/80 bg-[#040814] p-8 sm:p-12 shadow-[0_0_40px_rgba(0,0,0,0.8)] grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
              <Feather className="w-3.5 h-3.5 text-cyan-400" />
              <span>A SZERZŐ</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
                CSURIK KONRÁD
              </h2>
              <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">
                Író • Világépítő • Filozófiai Sci-Fi Alkotó
              </p>
            </div>

            <div className="space-y-4 text-slate-300 font-light text-base leading-relaxed">
              <p>
                Csurik Konrád a kortárs magyar sci-fi és misztikus spekulatív fikció új hangja. Műveiben
                az Antarktisz fagyos elszigeteltsége, a geofizika rideg műszeradatai és a transzcendens tudatelmélet
                olyan organikus egységet alkotnak, amely elutasítja a sablonos műfaji kliséket.
              </p>
              <blockquote className="border-l-2 border-cyan-500 pl-4 py-2 text-cyan-200 italic font-cinzel text-lg bg-cyan-950/20 rounded-r">
                „Nem egyszerű történetet akartam írni, hanem egy olyan világot felépíteni, amelyben az olvasó
                maga is kénytelen feltenni a kérdést: hol ér véget a megfigyelés, és hol kezdődik a valóság
                megváltoztatása?”
              </blockquote>
            </div>

            {/* Author Badges */}
            <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs text-slate-400">
              <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
                #AntarktiszFelfedezés
              </span>
              <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
                #KozmikusTudat
              </span>
              <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
                #Időtorzulás
              </span>
              <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
                #Archív82
              </span>
            </div>
          </div>

          {/* Stylized Author Monogram / Insignia Box */}
          <div className="rounded border border-cyan-900/60 bg-gradient-to-b from-[#071322] to-[#030811] p-8 text-center flex flex-col items-center justify-center space-y-4 h-full min-h-[300px]">
            <div className="w-24 h-24 rounded-full border-2 border-cyan-400/40 flex items-center justify-center font-cinzel text-4xl text-cyan-300 shadow-[0_0_25px_rgba(56,189,248,0.2)]">
              CK
            </div>
            <div className="space-y-1">
              <div className="font-cinzel text-slate-200 font-bold text-lg">CSURIK KONRÁD</div>
              <div className="font-mono text-xs text-cyan-400/70">ARCHÍV-82 ALAPÍTÓ KREATÍV IGAZGATÓ</div>
            </div>
            <p className="text-xs text-slate-400 italic">
              „A jég alatt nem a sötétség az úr, hanem a figyelem.”
            </p>
          </div>
        </div>

        {/* Free Digital Reading & Universe Manifesto Banner */}
        <div className="rounded border border-cyan-500/40 bg-gradient-to-br from-[#051022] via-[#040816] to-[#02050e] p-8 sm:p-12 shadow-[0_0_50px_rgba(56,189,248,0.15)] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/40 bg-cyan-950/40 text-cyan-300 font-mono text-xs tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>100% INGYENES & SZABADON ELÉRHETŐ UNIVERZUM</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-cinzel font-bold text-white tracking-wide">
                A REGÉNY KÖZVETLENÜL ÉS INGYENESEN OLVASHATÓ
              </h3>

              <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed">
                A Spirál Lehelete egy nyílt digitális irodalmi és filozófiai élmény. Nincsenek fizetési falak,
                nincs regisztrációs kötelezettség: a teljes regény 42 fejezete, az antarktiszi georadar-térkép,
                a pszichológiai reláció-hálózat és az Archív-82 összes titkos dokumentuma azonnal hozzáférhető.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-cyan-200">
                <div className="p-3 rounded bg-black/40 border border-cyan-950 flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>42 fejezet teljes szöveggel</span>
                </div>
                <div className="p-3 rounded bg-black/40 border border-cyan-950 flex items-center gap-2.5">
                  <Gamepad2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Interaktív döntésalapú játék</span>
                </div>
                <div className="p-3 rounded bg-black/40 border border-cyan-950 flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Hirdetés- és díjmentes élmény</span>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-col w-full sm:w-auto shrink-0 gap-3">
              <button
                onClick={handleOpenReaderClick}
                className="w-full sm:w-72 py-4 px-6 rounded bg-gradient-to-r from-cyan-500/25 via-cyan-400/35 to-sky-400/25 hover:from-cyan-500/40 hover:via-cyan-400/50 hover:to-sky-400/40 border-2 border-cyan-400 text-white font-mono text-sm tracking-widest uppercase font-bold transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <BookOpen className="w-4 h-4 text-cyan-300" />
                <span>OLVASÁS INDÍTÁSA</span>
              </button>

              <a
                href="https://aspiralleheleteinteractivebookgame.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioEngine.playSonarPing()}
                className="w-full sm:w-72 py-3.5 px-6 rounded bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 hover:text-white font-mono text-xs tracking-widest uppercase font-semibold transition-all duration-200 flex items-center justify-center gap-2.5"
              >
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                <span>INTERAKTÍV JÁTÉK</span>
                <ExternalLink className="w-3 h-3 text-cyan-400/70" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Backward-compatibility export
export const AuthorAndEditions = AuthorSection;
