import React, { useState } from 'react';
import { Compass, Users, GitCommit, Heart, ShieldAlert, Sparkles, X, ChevronRight, BookOpen } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { trackDiscovery } from '../utils/discoveryStorage';

interface GraphNode {
  id: string;
  name: string;
  role: string;
  type: 'character' | 'entity' | 'location' | 'object';
  x: number; // % in SVG canvas
  y: number;
  icon: string;
  summary: string;
  quote: string;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
  type: 'találkozás' | 'tudás' | 'emlék' | 'időbeli kapcsolat' | 'rezonancia';
  detail: string;
  quote: string;
}

const GRAPH_NODES: GraphNode[] = [
  {
    id: 'viktor',
    name: 'Viktor',
    role: 'Topográfus / Az első átlépő',
    type: 'character',
    x: 28,
    y: 35,
    icon: '🧭',
    summary: 'A 29 éves topográfus, aki az 1997-es georadar anomáliát követve leereszkedett a 82. szélességi fok alá.',
    quote: '„Nem a kőzet formálódott ilyenné. Valaki ezt így akarta hagyni.”',
  },
  {
    id: 'lena',
    name: 'Lena',
    role: 'Mentőexpedíció vezetője / Kutató',
    type: 'character',
    x: 48,
    y: 20,
    icon: '🔬',
    summary: 'Három évvel később Viktor nyomába eredve szembesül a nem-lineáris idővel és a Tudat Kapuival.',
    quote: '„Aki egyszer látta a georadar valódi rétegeit, nem tud többé a jégre sima vízként tekinteni.”',
  },
  {
    id: 'vegtelen',
    name: 'A Végtelen',
    role: 'Kollektív tudat / Téridőn túli entitás',
    type: 'entity',
    x: 72,
    y: 28,
    icon: '👁️',
    summary: 'Nem isten és nem idegen lény: a megszilárdult idő és a lehetséges elágazások összessége.',
    quote: '„A végtelen nem egy távolság. Egyetlen pillanat, amiben minden lehetséges történés egyszerre van jelen.”',
  },
  {
    id: 'spiral',
    name: 'A Spirál',
    role: 'Önmagát újrarajzoló geometriai mag',
    type: 'object',
    x: 50,
    y: 50,
    icon: '🌀',
    summary: 'A 82. koordináta mélyén lüktető, kilenc ágú struktúra, amely a megfigyelő szándékát alakítja valósággá.',
    quote: '„A spirál nem forma volt, hanem egy mozdulat, ami a kőbe fagyott.”',
  },
  {
    id: 'mira',
    name: 'Mira',
    role: 'A Törés Városának lakója / Időhasadék túlélő',
    type: 'character',
    x: 25,
    y: 68,
    icon: '🏙️',
    summary: 'A valóság töréspontján rekedt túlélő, aki ismeri a vörös por és a fáziseltolódás mechanikáját.',
    quote: '„Az idő itt nem múlik. Csak darabokra hullik, és újra összeáll más sorrendben.”',
  },
  {
    id: 'levente',
    name: 'Levente',
    role: 'Az Őrzők közvetítője',
    type: 'character',
    x: 45,
    y: 80,
    icon: '🗝️',
    summary: 'Egy alak, akinek emlékei egyszerre származnak a múltból és egy olyan jövőből, ami még nem következett be.',
    quote: '„Nem az a kérdés, hogy hol vagyunk. Hanem az, hogy mikor engeded el azt, amit valóságnak hittél.”',
  },
  {
    id: 'orzok',
    name: 'Az Őrzők',
    role: 'Kilenc kozmikus elv / Szellemi kapuőrök',
    type: 'entity',
    x: 75,
    y: 70,
    icon: '🛡️',
    summary: 'A kilenc szférát fenntartó entitások, akik felügyelik a Spirál egyensúlyát.',
    quote: '„Kilencen vagyunk, mert a tizedik a csend maga.”',
  },
  {
    id: 'nevtelen',
    name: 'A Névtelen',
    role: 'A 10. Spirál / Elrejtett igazság',
    type: 'entity',
    x: 88,
    y: 48,
    icon: '🌑',
    summary: 'A titkos tizedik entitás, akit a hivatalos kánon kihagyott, de a valóság mélyén mindig jelen van.',
    quote: '„Talán nem hiányzott. Talán csak még nem láttad.”',
  },
];

const GRAPH_LINKS: GraphLink[] = [
  {
    source: 'viktor',
    target: 'lena',
    label: 'Közös múlt & Mentés',
    type: 'találkozás',
    detail: 'Viktor hagyott nyomokat a mérőműszerekben, amelyeket kizárólag Lena tudott megfejteni. Lena nemcsak kollégaként kereste őt, hanem mint az egyetlen embert, aki látta a sarki anomália kezdetét.',
    quote: '„Lena tudta: ha Viktor elindult, nem a halálba ment, hanem valami felé, amit nem lehetett szavakkal hátrahagyni.”',
  },
  {
    source: 'viktor',
    target: 'spiral',
    label: 'Közvetlen fúzió',
    type: 'rezonancia',
    detail: 'Viktor belépése a Rezonátor Kamrába megváltoztatta a Spirál ritmusát. Viktor elméje az első emberi tudat, amelyet a Spirál integrált a saját geometriájába.',
    quote: '„A hang nem odakintről szólt. Belülről feszítette szét a csendet.”',
  },
  {
    source: 'lena',
    target: 'vegtelen',
    label: 'Tudati megértés',
    type: 'tudás',
    detail: 'Lena nem fizikai fegyverekkel, hanem a megfigyelői elv felismerésével került kapcsolatba a Végtelennel. Rájött, hogy a Végtelen nem pusztítani akar, hanem a megfigyelés aktusával tartja fenn a létezést.',
    quote: '„A megfigyelő és a megfigyelt egyetlen pontban olvad össze.”',
  },
  {
    source: 'spiral',
    target: 'orzok',
    label: 'Strukturális felügyelet',
    type: 'időbeli kapcsolat',
    detail: 'A kilenc Őrző a Spirál kilenc kanyarulatának perszonifikációja. Mindegyik őrzi az emberi tudat egy-egy alapelvét: a csendet, a memóriát, a törést és a fényváltást.',
    quote: '„Minden kapunak megvan a maga őre, de a kapu és az őr ugyanabból az anyagból készült.”',
  },
  {
    source: 'mira',
    target: 'viktor',
    label: 'Időbeli visszhang',
    type: 'emlék',
    detail: 'Mira a Törés Városában látja Viktor árnyékát sétálni az elhagyott utcákon, évtizedekkel azelőtt, hogy Viktor egyáltalán megszületett volna a normál világban.',
    quote: '„Láttam a lábnyomait a porban. Frissek voltak, pedig a hó ezer éve nem esett errefelé.”',
  },
  {
    source: 'mira',
    target: 'levente',
    label: 'Túlélési szövetség',
    type: 'találkozás',
    detail: 'Együtt keresik a kiutat a Törésből, de Levente tudja, hogy a Törés nem egy fizikai hely, hanem a valóság szövetének felbomlása.',
    quote: '„Ha kapaszkodsz az emlékeidbe, itt ragadsz. Ha elengeded őket, te magad válsz a töréssé.”',
  },
  {
    source: 'levente',
    target: 'orzok',
    label: 'Közvetítői fogadalom',
    type: 'tudás',
    detail: 'Levente nem ellensége az Őrzőknek: ő az az ember, aki átlépte a küszöböt, mégsem vesztette el az emberi beszéd képességét.',
    quote: '„A közvetítőnek nem az a dolga, hogy győzzön. Hanem hogy a szavakat lefordítsa csenddé.”',
  },
  {
    source: 'orzok',
    target: 'nevtelen',
    label: 'A hiányzó tizedik',
    type: 'rezonancia',
    detail: 'A kilenc Őrző nem beszél a Tizedikről. A Névtelen a Spirál láthatatlan tengelye: az a pont, ahol a mozgás megszűnik és a tiszta jelenlét megmarad.',
    quote: '„A kilenc a keringés. A tíz a megérkezés.”',
  },
  {
    source: 'vegtelen',
    target: 'spiral',
    label: 'Téridő forrás',
    type: 'időbeli kapcsolat',
    detail: 'A Végtelen maga a Spirál forráskódja. A Spirál a fizikai világba vetülő árnyéka annak a dimenziónak, ahol az idő nem létezik.',
    quote: '„Ahol a jég véget ér, ott kezdődik a Spirál. Ahol a Spirál véget ér, ott a Végtelen lélegzik.”',
  },
];

export const PsychologicalMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(GRAPH_NODES[0]);
  const [selectedLink, setSelectedLink] = useState<GraphLink | null>(null);

  const handleNodeClick = (node: GraphNode) => {
    audioEngine.playSonarPing();
    setSelectedNode(node);
    setSelectedLink(null);
    trackDiscovery.secretFound(`graph_node_${node.id}`);
  };

  const handleLinkClick = (link: GraphLink) => {
    audioEngine.playSonarPing();
    setSelectedLink(link);
    setSelectedNode(null);
    trackDiscovery.secretFound(`graph_link_${link.source}_${link.target}`);
  };

  const getNode = (id: string) => GRAPH_NODES.find((n) => n.id === id);

  return (
    <section id="psych-map" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#02050e] border-t border-cyan-950/80">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-500/50 bg-cyan-950/30 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>KAPCSOLATI HÁLÓ & TUDATI TÉRKÉP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            KI KIVEL VAN KAPCSOLATBAN?
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Interaktív univerzum-gráf. Kattints a csomópontokra a karakterek és entitások vizsgálatához, vagy az összekötő vonalakra a kapcsolatok és közös pillanatok feltárásához!
          </p>
        </div>

        {/* 2-Column Graph Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Graph Visual Canvas (7 cols) */}
          <div className="lg:col-span-7 rounded border border-cyan-950/80 bg-[#030816] p-4 sm:p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-950/60 font-mono text-xs text-slate-400">
              <span className="text-cyan-400 font-bold">PSZICHOLÓGIAI REZONANCIA-GRÁF</span>
              <span>CSOMÓPONTOK: 8 // KAPCSOLATOK: 9</span>
            </div>

            {/* SVG Interactive Network */}
            <div className="relative w-full h-[450px] sm:h-[520px] my-4 rounded border border-cyan-950/60 bg-[#01040a] overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background ambient circular rings */}
                <circle cx="50" cy="50" r="44" stroke="#0e7490" strokeWidth="0.2" fill="none" strokeDasharray="2 3" opacity="0.4" />
                <circle cx="50" cy="50" r="30" stroke="#0e7490" strokeWidth="0.25" fill="none" strokeDasharray="1 2" opacity="0.5" />
                <circle cx="50" cy="50" r="16" stroke="#38bdf8" strokeWidth="0.3" fill="none" opacity="0.3" />

                {/* Connection Lines */}
                {GRAPH_LINKS.map((link, idx) => {
                  const s = getNode(link.source);
                  const t = getNode(link.target);
                  if (!s || !t) return null;

                  const isLinkSelected =
                    selectedLink?.source === link.source && selectedLink?.target === link.target;
                  const isNodeHighlighted =
                    selectedNode && (selectedNode.id === link.source || selectedNode.id === link.target);

                  return (
                    <g key={idx} className="cursor-pointer" onClick={() => handleLinkClick(link)}>
                      {/* Invisible wider hit-area */}
                      <line
                        x1={`${s.x}`}
                        y1={`${s.y}`}
                        x2={`${t.x}`}
                        y2={`${t.y}`}
                        stroke="transparent"
                        strokeWidth="5"
                      />
                      {/* Visible connection line */}
                      <line
                        x1={`${s.x}`}
                        y1={`${s.y}`}
                        x2={`${t.x}`}
                        y2={`${t.y}`}
                        stroke={isLinkSelected ? '#38bdf8' : isNodeHighlighted ? '#06b6d4' : '#1e293b'}
                        strokeWidth={isLinkSelected ? '1.5' : isNodeHighlighted ? '1.0' : '0.6'}
                        strokeDasharray={link.type === 'időbeli kapcsolat' ? '1 1' : 'none'}
                        className="transition-all duration-300 hover:stroke-cyan-300"
                      />
                      {/* Midpoint marker for link interaction */}
                      <circle
                        cx={`${(s.x + t.x) / 2}`}
                        cy={`${(s.y + t.y) / 2}`}
                        r={isLinkSelected ? '1.5' : '1'}
                        fill={isLinkSelected ? '#38bdf8' : '#0e7490'}
                        className="hover:scale-150 transition-transform"
                      />
                    </g>
                  );
                })}

                {/* Nodes */}
                {GRAPH_NODES.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isConnected =
                    selectedLink && (selectedLink.source === node.id || selectedLink.target === node.id);

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer group"
                      onClick={() => handleNodeClick(node)}
                    >
                      {/* Selection Aura */}
                      {isSelected && (
                        <circle
                          cx={`${node.x}`}
                          cy={`${node.y}`}
                          r="5.5"
                          fill="rgba(56,189,248,0.25)"
                          stroke="#38bdf8"
                          strokeWidth="0.5"
                          className="animate-pulse"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={`${node.x}`}
                        cy={`${node.y}`}
                        r="3.5"
                        fill={isSelected ? '#38bdf8' : isConnected ? '#06b6d4' : '#031024'}
                        stroke={isSelected ? '#ffffff' : '#0284c7'}
                        strokeWidth="0.8"
                        className="group-hover:scale-125 transition-transform"
                      />

                      {/* Node Label Text */}
                      <text
                        x={`${node.x}`}
                        y={`${node.y + 6.5}`}
                        textAnchor="middle"
                        fontSize="2.4"
                        fontFamily="monospace"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        fill={isSelected ? '#ffffff' : '#94a3b8'}
                        className="pointer-events-none select-none"
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1">
              <span>KATTINTS A VONALAKRA A KAPCSOLATOKHOZ</span>
              <span>CSOMÓPONTOK: ENTITÁSOK & KARAKTEREK</span>
            </div>
          </div>

          {/* Right: Inspection Card (5 cols) */}
          <div className="lg:col-span-5 rounded border border-cyan-950/90 bg-[#030917] p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] min-h-[460px] flex flex-col justify-between">
            {/* When a NODE is selected */}
            {selectedNode && (
              <div className="space-y-5">
                <div className="flex items-start justify-between border-b border-cyan-950/80 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                      {selectedNode.type}
                    </span>
                    <h3 className="font-cinzel text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                      <span>{selectedNode.icon}</span>
                      <span>{selectedNode.name}</span>
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-slate-500 border border-slate-800 px-2 py-1 rounded">
                    {selectedNode.role.split('/')[0]}
                  </span>
                </div>

                <div className="p-3.5 rounded bg-cyan-950/30 border border-cyan-900/50 text-cyan-100 text-sm leading-relaxed">
                  {selectedNode.summary}
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                    Karakter idézet a regényből:
                  </span>
                  <blockquote className="p-3 rounded border-l-2 border-cyan-400 bg-black/40 font-serif italic text-sm text-slate-300">
                    {selectedNode.quote}
                  </blockquote>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                    Kapcsolódó szálak:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {GRAPH_LINKS.filter(
                      (l) => l.source === selectedNode.id || l.target === selectedNode.id
                    ).map((link, i) => {
                      const otherId = link.source === selectedNode.id ? link.target : link.source;
                      const other = getNode(otherId);
                      return (
                        <button
                          key={i}
                          onClick={() => handleLinkClick(link)}
                          className="px-2.5 py-1 rounded bg-slate-900/90 border border-cyan-950 hover:border-cyan-400 text-xs font-mono text-cyan-300 hover:text-white transition-colors"
                        >
                          → {other?.name} ({link.label})
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* When a LINK is selected */}
            {selectedLink && (
              <div className="space-y-5">
                <div className="flex items-start justify-between border-b border-cyan-950/80 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                      KAPCSOLAT TÍPUSA: {selectedLink.type.toUpperCase()}
                    </span>
                    <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
                      {getNode(selectedLink.source)?.name} ↔ {getNode(selectedLink.target)?.name}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-cyan-400 border border-cyan-900 bg-cyan-950/40 px-2 py-1 rounded">
                    {selectedLink.label}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                    Pszichológiai és narratív kapcsolat elemzése:
                  </span>
                  <p className="p-3.5 rounded bg-cyan-950/30 border border-cyan-900/50 text-cyan-100 text-sm leading-relaxed">
                    {selectedLink.detail}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                    Regényrészlet:
                  </span>
                  <blockquote className="p-3 rounded border-l-2 border-cyan-400 bg-black/40 font-serif italic text-sm text-slate-300">
                    {selectedLink.quote}
                  </blockquote>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-cyan-950/60 font-mono text-[11px] text-slate-500 text-center">
              A 82. SZÉLESSÉGI KÓD // PSZICHOLÓGIAI DOKUMENTÁCIÓ
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
