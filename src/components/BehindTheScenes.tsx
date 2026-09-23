import React, { useState } from 'react';
import { Feather, FileText, Compass, BookOpen, Layers, Lightbulb, Sparkles, MapPin } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { trackDiscovery } from '../utils/discoveryStorage';

interface AuthorArchiveTab {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  content: string[];
  quote: string;
  dateTag: string;
}

const AUTHOR_ARCHIVES: AuthorArchiveTab[] = [
  {
    id: 'conception',
    title: 'A 82. szélességi fok születése',
    subtitle: 'Hogyan vált egy valós térképfehér folt regénnyé?',
    icon: '📍',
    dateTag: '2023 // ELSŐ VÁZLATOK',
    content: [
      'A kiindulópont nem egy klasszikus űropera volt, hanem a Föld legkevésbé feltérképezett területe: az Antarktisz 82. déli szélességi és 36. keleti hosszúsági köre. Ez a sarki fennsík egy olyan pont, ahol a jégréteg vastagsága meghaladja a 3 200 métert, s a mélyben rejtőző sziklaágy évmilliók óta nem érintkezett napfénnyel.',
      'A kérdés egyszerű volt: mi van akkor, ha a jég alatt nem egy eltemetett természeti hegyvonulat rejtőzik, hanem egy olyan mesterséges geometria, amely dacol a lineáris idő múlásával?',
      'Az első jegyzetek topográfiai napló formájában születtek meg, ahol a narrátor nem hős vagy megmentő, hanem egy térképész, akinek a műszerei fokozatosan elveszítik az értelmüket.',
    ],
    quote: '„Nem a kőzet formálódott ilyenné. Valaki ezt így akarta hagyni.”',
  },
  {
    id: 'viktor-evolution',
    title: 'Viktor karaktere és az elengedés lélektana',
    subtitle: 'Az elméleti topográfustól a küszöb átlépőjéig',
    icon: '🧭',
    dateTag: '2024 // KARAKTERVÁZLATOK',
    content: [
      'Viktor figurája az emberi megismerési vágy és a törékenység határán egyensúlyoz. Nem kalandor, hanem mérnök. Olyan ember, aki hisz a számokban, a koordinátákban és az euklideszi koordináta-rendszerekben.',
      'A történet legfontosabb íve nem az, hogy mit talál a jég alatt, hanem az, ahogyan kénytelen elengedni a racionális kontroll illúzióját. A jég alatti térben a térbeli távolság másodlagossá válik: a tudat és a megfigyelés aktusa kezdi formálni a folyosókat.',
      'A 4. fejezet („Viktor eltűnése”) szándékosan korán következik be: nem a hiánya jelenti a cselekmény végét, hanem az ő nyoma indítja el Lena és a többiek belső utazását.',
    ],
    quote: '„A hang nem odakintről szólt. Belülről feszítette szét a csendet.”',
  },
  {
    id: 'guardians-philosophy',
    title: 'A Kilenc Őrző és a Tizedik Csendje',
    subtitle: 'Világépítési struktúra és kozmológiai modell',
    icon: '🛡️',
    dateTag: '2024 // KOZMOLÓGIA',
    content: [
      'A Spirál kilenc kanyarulata nem pusztán építészeti elem, hanem kilenc állapot: csend, emlékezet, rezonancia, tükröződés, fáziseltolódás, küszöb, törés, lüktetés és beteljesülés.',
      'A kilenc Őrző nem mitológiai istenekként funkcionál, hanem olyan elvekként, amelyek a megfigyelő szándékát mérik fel. Ha valaki erőszakkal vagy birtoklási vággyal közelít, a kapuk rideg kővé válnak.',
      'A 10. Spirál („A Névtelen”) gondolata már a regény első vázlatainál megszületett: a befejezettség illúzióját csak a hiány tudja feloldani. A kilenc a mozgás, de a tíz a jelenlét.',
    ],
    quote: '„Kilencen vagyunk, mert a tizedik a csend maga.”',
  },
  {
    id: 'excised-drafts',
    title: 'Kihúzott fejezetek és alternatív irányok',
    subtitle: 'Mi maradt a vágóasztalon?',
    icon: '✂️',
    dateTag: '2025 // KÉZIRAT LEZÁRÁSA',
    content: [
      'A korai változatokban létezett egy hosszabb katonai vizsgálati szál, amely a felszíni állomások közötti geopolitikai feszültséget részletezte. Ezt tudatosan redukáltuk: a regény lényege nem a katonai konfliktus, hanem a metafizikai és emberi magány a sarkvidéki éjszakában.',
      'Egy másik elvetett ötlet a Törés Városának klasszikus posztapokaliptikus ábrázolása volt. Végül a Törés nem romváros lett, hanem a megfagyott idő és a vörös por metamorfózisa: ahol az épületek és az emlékek egyszerre léteznek múltként és lehetséges jövőként.',
    ],
    quote: '„A jég alatt nem csak a múlt rejtőzik.”',
  },
];

export const BehindTheScenes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthorArchiveTab>(AUTHOR_ARCHIVES[0]);

  const handleSelectTab = (tab: AuthorArchiveTab) => {
    audioEngine.playSonarPing();
    setActiveTab(tab);
    trackDiscovery.secretFound(`author_archive_${tab.id}`);
  };

  return (
    <section id="kulisszak" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#01040a] border-t border-cyan-950/80">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-500/50 bg-cyan-950/30 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Feather className="w-3.5 h-3.5 text-cyan-400" />
            <span>KULISSZÁK MÖGÖTT // CSURIK KONRÁD JEGYZETEI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            A SPIRÁL SZÜLETÉSE
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Valódi szerzői háttérjegyzetek, korai koncepciók, kihúzott jelenetek és a 82. szélességi kód világépítési folyamata.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AUTHOR_ARCHIVES.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab)}
              className={`p-4 rounded text-left transition-all duration-300 border ${
                activeTab.id === tab.id
                  ? 'border-cyan-400 bg-cyan-950/70 shadow-[0_0_20px_rgba(56,189,248,0.3)] scale-[1.02]'
                  : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-2 font-mono text-[10px] text-cyan-400">
                <span>{tab.dateTag}</span>
                <span className="text-base">{tab.icon}</span>
              </div>
              <div className="font-cinzel text-sm font-bold text-white tracking-wide line-clamp-1">
                {tab.title}
              </div>
              <p className="text-xs text-slate-400 font-light mt-1 line-clamp-2">
                {tab.subtitle}
              </p>
            </button>
          ))}
        </div>

        {/* Main Note Dossier Card */}
        <div className="rounded border border-cyan-950/90 bg-[#020715] p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950/80 pb-4">
            <div className="space-y-1">
              <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
                {activeTab.dateTag} // DOKUMENTUM: ✍ A SZERZŐ JEGYZETE
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {activeTab.title}
              </h3>
              <p className="text-sm text-slate-400 font-light">
                {activeTab.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyan-950/40 border border-cyan-900/60 font-mono text-xs text-cyan-300 self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>EREDETI ALKOTÓI HÁTTÉR</span>
            </div>
          </div>

          {/* Paragraphs */}
          <div className="space-y-4 text-slate-300 font-light text-sm sm:text-base leading-relaxed">
            {activeTab.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="p-4 rounded border-l-4 border-cyan-400 bg-black/50 font-serif italic text-base sm:text-lg text-cyan-200">
            {activeTab.quote}
          </blockquote>

          <div className="pt-4 border-t border-cyan-950/60 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-slate-500">
            <span>SZERZŐ: CSURIK KONRÁD // A SPIRÁL LEHELETE</span>
            <span>KÉZIRAT ARCHÍVUM // 2024–2026</span>
          </div>
        </div>
      </div>
    </section>
  );
};
