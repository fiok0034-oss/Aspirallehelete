import React, { useState } from 'react';
import {
  Compass,
  Layers,
  Lock,
  Unlock,
  Eye,
  Radio,
  RotateCw,
  Sun,
  Zap,
  Info,
  X,
  Sparkles,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { trackDiscovery, getDiscoveryState } from '../utils/discoveryStorage';

interface ArchaeologicalPoint {
  id: string;
  name: string;
  category: string;
  coordinates: string;
  depth: string;
  status: 'ANALYZED' | 'LOCKED' | 'PARTIAL';
  shortDesc: string;
  fullDesc: string;
  bookReference: string;
  icon: string;
  x: number; // percentage in subterranean map
  y: number;
  canExamine3D?: boolean;
}

const EXCAVATION_POINTS: ArchaeologicalPoint[] = [
  {
    id: 'point-1',
    name: 'Ősi fal',
    category: 'Megalitikus struktúra',
    coordinates: '82°16’22”S, 36°01’04”E',
    depth: '-3 240 m',
    status: 'ANALYZED',
    shortDesc: 'Nem kő és nem fém. A felület elnyeli a fényszóró sugarát, miközben hideg tapintású.',
    fullDesc:
      'A monolitikus falszakasz nem mutat illesztési réseket. A kristályos szerkezet mikroszkopikus szinten fraktálszerűen ismétlődik. A fúrófejek nem hagytak rajta karcolást sem, miközben a radioaktív izotópos kormeghatározás mérési hibát jelez: a minta időben ingadozó atomi bomlást mutat.',
    bookReference: 'Fejezet 3: „A fal nem visszaverte a fényt, hanem elnyelte azt, mintha a sötétség anyaggá sűrűsödött volna.”',
    icon: '🏛️',
    x: 22,
    y: 35,
  },
  {
    id: 'point-2',
    name: 'Ismeretlen ajtó',
    category: 'Átjáró / Küszöb',
    coordinates: '82°16’30”S, 36°01’18”E',
    depth: '-3 280 m',
    status: 'ANALYZED',
    shortDesc: 'Kilincs és zsanér nélküli, zárt geometriai kapu. Csak bizonyos tudati fókuszra reagál.',
    fullDesc:
      'A küszöb két oldalán finom vájatok futnak, amelyek nem mechanikus zárat alkotnak, hanem rezonanciakamrát. A kapu felülete enyhén vibrál az emberi szívveréshez hasonló ritmusban, ha valaki 2 méteren belülre lép.',
    bookReference: 'Fejezet 7: „Nem volt rajta kulcslyuk. A kapu a szándékot mérte fel, mielőtt engedett volna a nyomásnak.”',
    icon: '🚪',
    x: 45,
    y: 28,
  },
  {
    id: 'point-3',
    name: 'Spiráljel',
    category: 'Epigrafika / Piktogram',
    coordinates: '82°16’15”S, 36°01’25”E',
    depth: '-3 210 m',
    status: 'ANALYZED',
    shortDesc: 'Önvilágító, logaritmikus spirálvésés a mennyezeten. Halvány ciánkék foszforeszkálás.',
    fullDesc:
      'A jel Fibonacci-arányokat követ, de a 9. kanyarulatnál egy nem-euklideszi szögtörés található. A foszforeszkálás nem kémiai oxidáció: a levegő elzárása után is pontosan 0.04 Hz-es frekvencián pulzál.',
    bookReference: 'Fejezet 1: „A spirál nem forma volt, hanem egy mozdulat, ami a kőbe fagyott.”',
    icon: '🌀',
    x: 65,
    y: 42,
  },
  {
    id: 'point-4',
    name: 'Elhagyott berendezés',
    category: 'Felszíni expedíciós roncs',
    coordinates: '82°16’05”S, 36°00’50”E',
    depth: '-3 190 m',
    status: 'ANALYZED',
    shortDesc: '1997-es szovjet/amerikai mélyfúró állomás maradványai. A műszerek kijelzői beégtek.',
    fullDesc:
      'A fúrótorony acélszerkezete ridegtörést szenvedett, de a törésfelületek tükörsimák, mintha az idő állt volna meg a fémben. A naplófüzetek lapjai üresek, a tinta feloszlott a papír rostjai között.',
    bookReference: 'Fejezet 4: „A gépek úgy maradtak itt, mintha a személyzet nem elmenekült volna, hanem egyszerűen megszűnt volna létezni.”',
    icon: '⚙️',
    x: 18,
    y: 62,
  },
  {
    id: 'point-5',
    name: 'Csontok / Szerves maradványok',
    category: 'Biológiai anomália',
    coordinates: '82°16’42”S, 36°01’35”E',
    depth: '-3 320 m',
    status: 'LOCKED',
    shortDesc: '🔒 Még nincs elegendő adat. (Oldd fel a fejezetek olvasásával vagy az Archív-82 aktáival)',
    fullDesc:
      'A feltárt csontmaradványok nem mutatnak sejtpusztulást. A csontvelő mintái nem emberiek, de a belső szerkezetük ismerős emlős anatómiára emlékeztet. A bomlás helyett a szerves anyag lassan szilikáttá alakul át a mélységi mező hatására.',
    bookReference: 'Fejezet 14: „Nem halottak voltak. Csak egy másik idősebességben léteztek.”',
    icon: '🦴',
    x: 78,
    y: 68,
  },
  {
    id: 'point-6',
    name: 'Energiaforrás',
    category: 'Kvantum-rezonátor',
    coordinates: '82°16’35”S, 36°01’00”E',
    depth: '-3 400 m',
    status: 'ANALYZED',
    shortDesc: 'Nullponti hőmérsékleti anomália. A környezet melegebb (-4°C), mint a felette lévő jég.',
    fullDesc:
      'A detektorok semmilyen ismert elektromágneses sugárzást nem fognak, mégis folyamatos hőkibocsátást mérnek. A forrás közvetlen közelében a gravitációs gyorsulás értéke 9.81 helyett 9.42 m/s²-re csökken.',
    bookReference: 'Fejezet 9: „A meleg nem kályhából jött. Maga a tér lélegzett fel.”',
    icon: '⚡',
    x: 52,
    y: 72,
  },
  {
    id: 'point-7',
    name: 'Alagút / Aknarendszer',
    category: 'Járatrendszer',
    coordinates: '82°16’10”S, 36°01’45”E',
    depth: '-3 260 m',
    status: 'ANALYZED',
    shortDesc: 'Olvasztás nyomai nélküli jégalagút. A jégfalak kristálytiszták, mint a csiszolt üveg.',
    fullDesc:
      'A folyosó 4 méter átmérőjű, tökéletes henger. Nincsenek fúrási vájatok vagy olvadékvíz-elvezetők. A járat lejtése pontosan 8.2 fokban tart a Déli Sark mélypontja felé.',
    bookReference: 'Fejezet 2: „A jég nem engedett, hanem megnyílt előtte. Mint egy befagyott lehelet, ami utat vágott magának.”',
    icon: '🕳️',
    x: 82,
    y: 25,
  },
  {
    id: 'point-8',
    name: 'Ismeretlen szerkezet',
    category: 'Régészeti lelet / Artefaktum-82',
    coordinates: '82°16’28”S, 36°01’10”E',
    depth: '-3 350 m',
    status: 'ANALYZED',
    shortDesc: 'Koncentrikus gyűrűkből álló, lebegő magú szerkezet. 3D vizsgálat elérhető!',
    fullDesc:
      'A komplexum központi lelete. Három függetlenül elforduló gyűrű veszi körül az alig 15 centiméteres fekete magot. A mag nem érintkezik semmivel, a mágneses mező nélkül is stabilan a geometriai középpontban lebeg.',
    bookReference: 'Fejezet 11: „Nem gép volt, és nem szobor. Egy kérdés volt, amit valaki fémbe és csendbe öntött.”',
    icon: '🔮',
    x: 50,
    y: 50,
    canExamine3D: true,
  },
  {
    id: 'point-9',
    name: 'Rádióforrás',
    category: 'Telemetriai adóállomás',
    coordinates: '82°16’02”S, 36°01’12”E',
    depth: '-3 180 m',
    status: 'ANALYZED',
    shortDesc: '50.82 MHz-es modulálatlan sáv. A jel 8 percenként 3 másodperces szünetet tart.',
    fullDesc:
      'A jelkódolás nem bináris: prímszámok intervallumait közvetíti, amelyek egybevágnak Viktor eltűnésének másodperceivel. A forrás nem tartalmaz akkumulátort vagy vezetéket.',
    bookReference: 'Fejezet 5: „A rádió akkor is szólt, amikor az elemeket már régen kivettük belőle.”',
    icon: '📡',
    x: 35,
    y: 18,
  },
];

export const SubIceWorld: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<ArchaeologicalPoint>(EXCAVATION_POINTS[7]); // Ismeretlen szerkezet
  const [isExamining3D, setIsExamining3D] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'ANYAG' | 'KOR' | 'GEOMETRIA' | 'ENERGIA' | 'EREDET'>('ANYAG');
  const [lightMode, setLightMode] = useState<'WHITE' | 'UV' | 'INFRA'>('WHITE');
  const [artifactRotation, setArtifactRotation] = useState(0);
  const [artifactZoom, setArtifactZoom] = useState(1);

  // Check if locked items can be opened
  const discovery = getDiscoveryState();
  const isUnlockedByProgress = discovery.chaptersRead.length >= 3 || discovery.archivesOpened.length >= 2;

  const handleSelectPoint = (point: ArchaeologicalPoint) => {
    audioEngine.playSonarPing();
    if (point.status === 'LOCKED' && isUnlockedByProgress) {
      // Auto-unlock with progress
      setSelectedPoint({ ...point, status: 'ANALYZED' });
    } else {
      setSelectedPoint(point);
    }
    trackDiscovery.secretFound(`sub_ice_${point.id}`);
  };

  const handleOpen3DScanner = () => {
    audioEngine.playDeepChime();
    setIsExamining3D(true);
    trackDiscovery.secretFound('archaeology_scanner_used');
  };

  return (
    <section id="sub-ice" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#01040a] border-t border-cyan-950/80">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-500/50 bg-cyan-950/30 text-cyan-300 font-mono text-xs tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>MÉLYSÉGI FELTÁRÁS // -3 200 MÉTER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
            A JÉG ALATTI VILÁG
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Digitális régészeti kutatótér a sarki jégpáncél mélyén. Kattints a feltárási pontokra a leletek elemzéséhez és a virtuális tárgyvizsgálathoz!
          </p>
        </div>

        {/* Main 2-Column Exploration Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Top: Interactive Cavern Archaeological Map (7 cols) */}
          <div className="lg:col-span-7 rounded border border-cyan-950/80 bg-[#020712] p-4 sm:p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Cavern HUD Status */}
            <div className="flex items-center justify-between pb-4 border-b border-cyan-950/60 font-mono text-xs text-slate-400">
              <span className="text-cyan-400 font-bold">AKTÍV KRIPTO-CSARNOK I.</span>
              <span>FELTÁRT OBJEKTUMOK: {EXCAVATION_POINTS.length} / 9</span>
            </div>

            {/* Tactical Sub-Ice Map Canvas */}
            <div className="relative w-full h-[400px] sm:h-[480px] my-4 rounded border border-cyan-900/40 bg-gradient-to-b from-[#030919] via-[#020613] to-[#010309] overflow-hidden">
              {/* Cavern Ice Fracture Art Background */}
              <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L35,45 L15,100" stroke="#0ea5e9" strokeWidth="0.3" fill="none" strokeDasharray="1 1" />
                <path d="M100,0 L65,35 L85,100" stroke="#0ea5e9" strokeWidth="0.3" fill="none" strokeDasharray="1 1" />
                <circle cx="50" cy="50" r="28" stroke="#38bdf8" strokeWidth="0.4" fill="none" strokeDasharray="2 3" />
                <circle cx="50" cy="50" r="42" stroke="#0369a1" strokeWidth="0.2" fill="none" />
              </svg>

              {/* Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e74900f_1px,transparent_1px),linear-gradient(to_bottom,#0e74900f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

              {/* Archaeological Nodes */}
              {EXCAVATION_POINTS.map((point) => {
                const isSelected = selectedPoint.id === point.id;
                const isLocked = point.status === 'LOCKED' && !isUnlockedByProgress;

                return (
                  <button
                    key={point.id}
                    onClick={() => handleSelectPoint(point)}
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 group z-10 ${
                      isSelected
                        ? 'bg-cyan-500 text-black ring-4 ring-cyan-400/40 scale-125 shadow-[0_0_20px_rgba(56,189,248,0.8)]'
                        : isLocked
                        ? 'bg-slate-900/90 text-slate-500 border border-slate-700 hover:border-slate-500'
                        : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/60 hover:bg-cyan-900/90 hover:border-cyan-300 hover:scale-110 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                    }`}
                    title={point.name}
                  >
                    <span className="text-base select-none">{point.icon}</span>

                    {/* Ping ripple for active/selected */}
                    {isSelected && (
                      <span className="absolute inset-0 rounded-full border border-cyan-300 animate-ping pointer-events-none" />
                    )}

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap px-2.5 py-1 rounded bg-black/90 border border-cyan-500/60 text-[11px] font-mono text-cyan-200 z-30 shadow-lg pointer-events-none">
                      {point.name} [{point.depth}]
                    </div>
                  </button>
                );
              })}

              {/* Depth meter along left edge */}
              <div className="absolute top-3 left-3 bottom-3 flex flex-col justify-between font-mono text-[9px] text-cyan-600/70 pointer-events-none select-none">
                <span>-3 180 m</span>
                <span>-3 240 m</span>
                <span>-3 300 m</span>
                <span>-3 400 m</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1">
              <span>RÁCS: 32m // REZONANCIA: STABIL</span>
              <span>KATTINTS A LELETEKRE AZ ELEMZÉSHEZ</span>
            </div>
          </div>

          {/* Right: Selected Artifact Analytical Dossier (5 cols) */}
          <div className="lg:col-span-5 rounded border border-cyan-950/90 bg-[#030917] p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-cyan-950/80 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                  {selectedPoint.category}
                </span>
                <h3 className="font-cinzel text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                  <span>{selectedPoint.icon}</span>
                  <span>{selectedPoint.name}</span>
                </h3>
              </div>

              <div className="text-right font-mono text-xs text-slate-400">
                <div className="text-cyan-300 font-bold">{selectedPoint.depth}</div>
                <div className="text-[10px] text-slate-500">{selectedPoint.coordinates}</div>
              </div>
            </div>

            {/* Locked check */}
            {selectedPoint.status === 'LOCKED' && !isUnlockedByProgress ? (
              <div className="p-6 rounded border border-amber-500/40 bg-amber-950/20 text-center space-y-3 font-mono">
                <Lock className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
                <div className="text-amber-300 font-bold text-sm">
                  MÉG NINCS ELEGENDŐ ADAT
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A lelet elemzéséhez mélyebb megfigyelés szükséges. Olvass tovább a fejezetekben (3. fejezettől), vagy nyiss meg több dokumentumot az Archív-82-ben!
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Short Overview */}
                <div className="p-3.5 rounded bg-cyan-950/30 border border-cyan-900/50 text-cyan-100 text-sm leading-relaxed">
                  {selectedPoint.shortDesc}
                </div>

                {/* Analytical Description */}
                <div className="space-y-2">
                  <span className="font-mono text-xs text-slate-400 tracking-wider uppercase">
                    Részletes régészeti feljegyzés:
                  </span>
                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {selectedPoint.fullDesc}
                  </p>
                </div>

                {/* Book excerpt */}
                <div className="p-3 rounded border-l-2 border-cyan-400 bg-black/40 font-serif italic text-xs sm:text-sm text-slate-300">
                  {selectedPoint.bookReference}
                </div>

                {/* 3D Examination Button for Ismeretlen szerkezet */}
                {selectedPoint.canExamine3D && (
                  <button
                    onClick={handleOpen3DScanner}
                    className="w-full py-3.5 px-4 rounded border-2 border-cyan-400 bg-gradient-to-r from-cyan-950/90 to-blue-950/90 hover:from-cyan-900 hover:to-blue-900 text-cyan-200 hover:text-white font-mono text-xs tracking-widest uppercase font-bold shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:shadow-[0_0_35px_rgba(56,189,248,0.6)] transition-all flex items-center justify-center gap-2 group"
                  >
                    <Eye className="w-4 h-4 text-cyan-300 group-hover:scale-125 transition-transform" />
                    <span>🔬 RÉGÉSZETI VIZSGÁLAT INDÍTÁSA (3D)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 65. DIGITÁLIS RÉGÉSZET SCANNER MODAL */}
      {isExamining3D && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div className="w-full max-w-4xl bg-[#030917] rounded border-2 border-cyan-500/80 shadow-[0_0_60px_rgba(56,189,248,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Scanner Header */}
            <div className="p-4 border-b border-cyan-950/90 bg-[#020612] flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin [animation-duration:15s]" />
                <span className="font-bold text-cyan-200">DIGITÁLIS RÉGÉSZETI VIZSGÁLAT</span>
                <span className="text-slate-500">| ARTEFAKTUM-82</span>
              </div>
              <button
                onClick={() => setIsExamining3D(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                title="Bezárás"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scanner Body: 3D Visualization + Analytical Layers */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
              {/* 3D Artifact Interactive Viewer (7 cols) */}
              <div className="md:col-span-7 bg-black p-6 flex flex-col items-center justify-center relative min-h-[350px]">
                {/* Visual Artifact Representation (Animated Rings + Core) */}
                <div
                  className="relative flex items-center justify-center transition-transform duration-300 cursor-grab active:cursor-grabbing"
                  style={{
                    transform: `rotate(${artifactRotation}deg) scale(${artifactZoom})`,
                    filter:
                      lightMode === 'UV'
                        ? 'hue-rotate(200deg) brightness(1.3) contrast(1.2)'
                        : lightMode === 'INFRA'
                        ? 'hue-rotate(320deg) brightness(1.1) saturate(2)'
                        : 'none',
                  }}
                  onClick={() => setArtifactRotation((r) => r + 45)}
                >
                  {/* Outer Ring */}
                  <div className="w-48 h-48 rounded-full border-2 border-dashed border-cyan-400/80 animate-spin [animation-duration:20s]" />
                  {/* Middle Ring */}
                  <div className="absolute w-36 h-36 rounded-full border-2 border-dotted border-sky-300/70 animate-spin [animation-duration:12s] [animation-direction:reverse]" />
                  {/* Inner Ring */}
                  <div className="absolute w-24 h-24 rounded-full border-2 border-cyan-200/90 animate-spin [animation-duration:8s]" />
                  {/* Floating Black Void Core */}
                  <div className="absolute w-12 h-12 rounded-full bg-black border-2 border-white shadow-[0_0_25px_rgba(255,255,255,0.9)] flex items-center justify-center">
                    <span className="text-[9px] font-mono text-cyan-300 font-bold">Δ-82</span>
                  </div>
                </div>

                {/* Light Mode Indicator */}
                <div className="absolute top-4 left-4 font-mono text-[10px] text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-900/60">
                  MEGVILÁGÍTÁS: {lightMode}
                </div>

                {/* Scanner Controls Toolbar */}
                <div className="absolute bottom-4 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-full border border-cyan-900/60">
                  <button
                    onClick={() => setArtifactRotation((r) => r + 45)}
                    className="p-1 text-cyan-300 hover:text-white"
                    title="Forgatás"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setArtifactZoom((z) => Math.min(1.6, z + 0.15))}
                    className="px-2 font-mono text-xs text-cyan-300 hover:text-white"
                    title="Nagyítás"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setArtifactZoom((z) => Math.max(0.7, z - 0.15))}
                    className="px-2 font-mono text-xs text-cyan-300 hover:text-white"
                    title="Kicsinyítés"
                  >
                    -
                  </button>
                  <div className="h-4 w-px bg-slate-700" />
                  <button
                    onClick={() => setLightMode('WHITE')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      lightMode === 'WHITE' ? 'bg-cyan-500 text-black' : 'text-slate-400'
                    }`}
                  >
                    FEHÉR
                  </button>
                  <button
                    onClick={() => setLightMode('UV')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      lightMode === 'UV' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    UV
                  </button>
                  <button
                    onClick={() => setLightMode('INFRA')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      lightMode === 'INFRA' ? 'bg-rose-700 text-white' : 'text-slate-400'
                    }`}
                  >
                    INFRA
                  </button>
                </div>
              </div>

              {/* Analytical Layers Breakdown (5 cols) */}
              <div className="md:col-span-5 p-6 bg-[#030816] space-y-6 border-t md:border-t-0 md:border-l border-cyan-950/80">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
                    ANALITIKUS RÉTEGEK
                  </span>
                  <h4 className="font-cinzel text-lg font-bold text-white">
                    ISMERETLEN SZERKEZET
                  </h4>
                </div>

                {/* Layer Switch Buttons */}
                <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                  {(['ANYAG', 'KOR', 'GEOMETRIA', 'ENERGIA', 'EREDET'] as const).map((layer) => (
                    <button
                      key={layer}
                      onClick={() => setActiveLayer(layer)}
                      className={`p-2 rounded text-left transition-colors ${
                        activeLayer === layer
                          ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                          : 'bg-slate-900/80 text-slate-300 border border-cyan-950 hover:border-cyan-800'
                      }`}
                    >
                      {layer}
                    </button>
                  ))}
                </div>

                {/* Layer Detail Card */}
                <div className="p-4 rounded bg-black/50 border border-cyan-900/60 space-y-2">
                  <div className="font-mono text-xs text-cyan-300 uppercase tracking-wider font-bold">
                    RÉTEG ELEMZÉS: {activeLayer}
                  </div>

                  {activeLayer === 'ANYAG' && (
                    <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                      <p>
                        <strong className="text-white">Összetétel:</strong> Kristályos szilikát-titán ismeretlen arányú ötvözete. A molekuláris kötések sűrűsége háromszorosa a gyémánténak.
                      </p>
                      <p className="text-slate-400">
                        A mag anyaga nem azonosítható földi spektrometriával; a fénysugarat elhajlítja.
                      </p>
                    </div>
                  )}

                  {activeLayer === 'KOR' && (
                    <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                      <p>
                        <strong className="text-white">Becsült kor:</strong> {'>'} 450 000 év.
                      </p>
                      <p className="text-slate-400">
                        A radiometrikus datálás instabil: a felezési idő nem felel meg a standard fizikai konstansoknak, jelezve, hogy az artefaktum egy időbeli anomália zónájában formálódott.
                      </p>
                    </div>
                  )}

                  {activeLayer === 'GEOMETRIA' && (
                    <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                      <p>
                        <strong className="text-white">Struktúra:</strong> Három koncentrikus torziós gyűrű, nem-euklideszi szögtörésekkel.
                      </p>
                      <p className="text-slate-400">
                        A gyűrűk felülete logaritmikus spirálokat tartalmaz, amelyek a megfigyelő szögétől függően látszólag elmozdulnak.
                      </p>
                    </div>
                  )}

                  {activeLayer === 'ENERGIA' && (
                    <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                      <p>
                        <strong className="text-white">Kibocsátás:</strong> 0.04 Hz szub-kvantum oszcilláció.
                      </p>
                      <p className="text-slate-400">
                        Nincs mérhető hőmérséklet-emelkedés a magban, a gravitációs mező mégis 4%-os helyi fluktuációt mutat.
                      </p>
                    </div>
                  )}

                  {activeLayer === 'EREDET' && (
                    <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                      <div className="inline-block px-2 py-0.5 rounded bg-rose-950/80 border border-rose-600 text-rose-300 font-mono text-[11px] font-bold">
                        ISMERETLEN
                      </div>
                      <p className="text-slate-300">
                        A könyv hivatalos kronológiájában a szerkezet készítői nincsenek közvetlenül megnevezve. A szöveg csak „Őrzők”-ként és az „Időn Túli Város” építészeiként utal rájuk.
                      </p>
                    </div>
                  )}
                </div>

                <div className="font-mono text-[11px] text-slate-500 text-center">
                  CSURIK KONRÁD // A SPIRÁL LEHELETE DIGITÁLIS ARCHÍVUM
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
