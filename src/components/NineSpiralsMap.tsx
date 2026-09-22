import React, { useState } from 'react';
import { Orbit, Sparkles, Eye, Info } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface SpiralNode {
  id: number;
  name: string;
  guardian: string;
  x: number;
  y: number;
  domain: string;
  isCenter?: boolean;
  isTenth?: boolean;
}

export const NineSpiralsMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<SpiralNode | null>(null);
  const [isTenthRevealed, setIsTenthRevealed] = useState(false);

  // Geometric coordinates in 600x600 coordinate space
  // Nodes 1-8 around the perimeter, 9 at the center, 10 emerges outside or transcends
  const nodes: SpiralNode[] = [
    { id: 1, name: '1. Spirál', guardian: 'Oren-Tahl', x: 300, y: 100, domain: 'Geometria & Váz' },
    { id: 2, name: '2. Spirál', guardian: 'Kassarah', x: 440, y: 160, domain: 'Döntés & Akarat' },
    { id: 3, name: '3. Spirál', guardian: 'Ir-Haya', x: 500, y: 300, domain: 'Felejtés & Könyörület' },
    { id: 4, name: '4. Spirál', guardian: 'Sael-Mar', x: 440, y: 440, domain: 'Hangfrekvencia' },
    { id: 5, name: '5. Spirál', guardian: 'Zhen-Vael', x: 300, y: 500, domain: 'Fénytörés & Időkapuk' },
    { id: 6, name: '6. Spirál', guardian: 'Kael-Moras', x: 160, y: 440, domain: 'Vörös Por & Megőrzés' },
    { id: 7, name: '7. Spirál', guardian: 'Mor-Deyan', x: 100, y: 300, domain: 'Kollektív Emlékezet' },
    { id: 8, name: '8. Spirál', guardian: 'Taris-Nol', x: 160, y: 160, domain: 'Törés & Paradoxonok' },
    {
      id: 9,
      name: 'A Középpont (9. Spirál)',
      guardian: 'Vel-Kora',
      x: 300,
      y: 300,
      domain: 'A Határvonal & A Visszanéző Tudat',
      isCenter: true,
    },
    {
      id: 10,
      name: 'A Tizedik Spirál',
      guardian: 'A NÉVTELEN',
      x: 300,
      y: 300,
      domain: 'A Megfigyelő Tudata / A Jövő Lapjai',
      isTenth: true,
    },
  ];

  const handleNodeClick = (node: SpiralNode) => {
    audioEngine.playSonarPing();
    setSelectedNode(node);
  };

  const handleRevealTenth = () => {
    audioEngine.playSonarPing();
    setIsTenthRevealed(true);
    setSelectedNode(nodes[9]); // 10th node
  };

  return (
    <section id="spirals-map" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#02050A] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Orbit className="w-3.5 h-3.5" />
            <span>KOZMIKUS / TUDATI REZONANCIA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            A KILENC SPIRÁL TÉRKÉPE
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            A bolygó alatt húzódó harmonikus csomópontok geometriai hálózata. Kattints a csomópontokra a
            kapcsolódások felderítéséhez!
          </p>

          {/* Central quote badge */}
          <div className="p-3 rounded border border-cyan-900/50 bg-[#040C18] text-cyan-200 font-cinzel italic text-base sm:text-lg">
            «A kezdet vagy a vég. Attól függ, merre nézed.»
          </div>
        </div>

        {/* Interactive Constellation SVG Display */}
        <div className="relative rounded border border-cyan-950/80 bg-[#040813] overflow-hidden shadow-[0_0_50px_rgba(2,132,199,0.15)] flex flex-col items-center p-4 sm:p-8">
          <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
            <svg viewBox="0 0 600 600" className="w-full h-full">
              {/* Background ambient circular orbits */}
              <circle cx="300" cy="300" r="200" fill="none" stroke="#0e2439" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="300" cy="300" r="140" fill="none" stroke="#071929" strokeWidth="1" />
              <circle cx="300" cy="300" r="70" fill="none" stroke="#0c324f" strokeWidth="1" strokeDasharray="4 2" />

              {/* Connecting light lines between 1-8 nodes */}
              {nodes.slice(0, 8).map((node, i) => {
                const nextNode = nodes[(i + 1) % 8];
                return (
                  <line
                    key={`perimeter-${i}`}
                    x1={node.x}
                    y1={node.y}
                    x2={nextNode.x}
                    y2={nextNode.y}
                    stroke="rgba(56, 189, 248, 0.18)"
                    strokeWidth="1.2"
                  />
                );
              })}

              {/* Star chords connecting opposite and staggered nodes */}
              {nodes.slice(0, 8).map((node, i) => {
                const chordNode = nodes[(i + 3) % 8];
                return (
                  <line
                    key={`chord-${i}`}
                    x1={node.x}
                    y1={node.y}
                    x2={chordNode.x}
                    y2={chordNode.y}
                    stroke="rgba(14, 116, 144, 0.1)"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                  />
                );
              })}

              {/* Lines from perimeter to center (Node 9) */}
              {nodes.slice(0, 8).map((node, i) => (
                <line
                  key={`center-line-${i}`}
                  x1={node.x}
                  y1={node.y}
                  x2={300}
                  y2={300}
                  stroke="rgba(56, 189, 248, 0.25)"
                  strokeWidth="1.5"
                />
              ))}

              {/* Perimeter Nodes 1-8 */}
              {nodes.slice(0, 8).map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer group"
                    onClick={() => handleNodeClick(node)}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? 18 : 12}
                      fill={isSelected ? '#0369a1' : '#04101e'}
                      stroke={isSelected ? '#38bdf8' : '#0284c7'}
                      strokeWidth="2"
                      className="transition-all duration-300 group-hover:scale-125"
                    />
                    <circle cx="0" cy="0" r="4" fill={isSelected ? '#e0f2fe' : '#38bdf8'} />
                    <text
                      x="0"
                      y={node.y > 300 ? 28 : -22}
                      textAnchor="middle"
                      fill={isSelected ? '#38bdf8' : '#94a3b8'}
                      fontSize="10"
                      fontFamily="monospace"
                      className="font-bold tracking-wider"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}

              {/* Center Node 9 (The Core) */}
              <g
                transform="translate(300, 300)"
                className="cursor-pointer group"
                onClick={() => handleNodeClick(nodes[8])}
              >
                <circle
                  cx="0"
                  cy="0"
                  r={selectedNode?.id === 9 ? 34 : 26}
                  fill="#06192d"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  className="animate-pulse-slow"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="14"
                  fill="#0284c7"
                  stroke="#e0f2fe"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="45"
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  KÖZÉPPONT // VEL-KORA
                </text>
              </g>

              {/* The 10th Nameless Node (Transcendent Halo) */}
              {isTenthRevealed && (
                <g
                  transform="translate(300, 300)"
                  className="cursor-pointer animate-glitch"
                  onClick={() => handleNodeClick(nodes[9])}
                >
                  <circle
                    cx="0"
                    cy="0"
                    r="55"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="animate-spin"
                    style={{ animationDuration: '12s' }}
                  />
                  <text
                    x="0"
                    y="-42"
                    textAnchor="middle"
                    fill="#f43f5e"
                    fontSize="12"
                    fontFamily="Cinzel, serif"
                    fontWeight="bold"
                  >
                    🌀 NÉVTELEN (A 10. SPIRÁL)
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Reveal 10th Node Button */}
          {!isTenthRevealed && (
            <div className="pt-4 text-center">
              <button
                onClick={handleRevealTenth}
                className="px-6 py-2.5 rounded border border-rose-500/60 bg-rose-950/30 hover:bg-rose-900/50 text-rose-200 text-xs font-mono tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse"
              >
                A 10. SPIRÁL FELTÁRÁSA («NÉVTELEN»)
              </button>
            </div>
          )}

          {/* Selected Node Details Card */}
          {selectedNode && (
            <div className="w-full max-w-xl mt-6 p-4 rounded border border-cyan-800/60 bg-[#050C17] space-y-2 font-mono text-xs text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-cyan-400 font-bold text-sm font-cinzel">
                  {selectedNode.name}
                </span>
                <span className="text-slate-500">ŐRZŐ: {selectedNode.guardian}</span>
              </div>
              <p className="text-slate-300">
                <span className="text-slate-500">TARTOMÁNY:</span> {selectedNode.domain}
              </p>
              {selectedNode.isCenter && (
                <p className="text-cyan-300/90 italic pt-1">
                  „A középpont nem egy hely. A középpont az a lencse, amelyen át a Végtelen visszanéz rátok.”
                </p>
              )}
              {selectedNode.isTenth && (
                <p className="text-rose-300 italic pt-1">
                  „A Spirál nem kilenc. Mindig tíz volt. A tizedik maga a kérdés és a választás.”
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
