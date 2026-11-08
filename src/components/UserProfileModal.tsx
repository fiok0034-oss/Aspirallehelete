import React, { useState, useEffect } from 'react';
import { User, BookOpen, Compass, FileText, Sparkles, X, Trash2, CheckCircle2, Shield, Bookmark as BookmarkIcon, ChevronRight } from 'lucide-react';
import { getDiscoveryState, trackDiscovery, DiscoveryState } from '../utils/discoveryStorage';
import { audioEngine } from '../utils/audioEngine';
import { Bookmark } from '../types';

interface UserProfileModalProps {
  onClose: () => void;
  onOpenReader: (chapterIndex?: number, paragraphIndex?: number) => void;
}

interface CodexItem {
  id: string;
  name: string;
  icon: string;
  conditionKey: string;
  description: string;
}

const CODEX_ITEMS: CodexItem[] = [
  {
    id: 'spiral',
    name: 'A Spirál',
    icon: '🌀',
    conditionKey: 'sub_ice_point-3',
    description: 'A 82. szélességi fok alatt pulzáló geometriai tudati központ.',
  },
  {
    id: 'coord-82',
    name: '82. koordináta',
    icon: '📍',
    conditionKey: 'globe_anomaly_detected',
    description: '82°16’S, 36°01’E — A sarkvidék nem létező mérési pontja.',
  },
  {
    id: 'archive-82',
    name: 'ARCHÍV-82',
    icon: '🗃',
    conditionKey: 'archive_opened',
    description: 'A titkos intézeti kutatási adatbázis és távirati jegyzőkönyvek.',
  },
  {
    id: 'vegtelen',
    name: 'A Végtelen',
    icon: '👁️',
    conditionKey: 'graph_node_vegtelen',
    description: 'Az idő és a lehetséges elágazások egyidejű tudati jelenléte.',
  },
  {
    id: 'red-dust',
    name: 'Vörös Porszoba',
    icon: '🔴',
    conditionKey: 'sub_ice_point-6',
    description: 'A jég alatt rejtőző, atmoszférikus vörös por kamrája.',
  },
  {
    id: 'fracture-city',
    name: 'Törés Városa',
    icon: '🏙️',
    conditionKey: 'graph_node_mira',
    description: 'A valóság töréspontján megfagyott, glitched épületek tere.',
  },
  {
    id: 'timeless-city',
    name: 'Időn Túli Város',
    icon: '⏳',
    conditionKey: 'graph_link_orzok_nevtelen',
    description: 'A tizedik kapu mögötti kristályos időmentes zóna.',
  },
  {
    id: 'nevtelen',
    name: 'A 10. Névtelen',
    icon: '🌑',
    conditionKey: 'nameless_spiral_awakened',
    description: 'A titkos tizedik entitás, a Spirál elrejtett magja.',
  },
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose, onOpenReader }) => {
  const [state, setState] = useState<DiscoveryState>(getDiscoveryState());
  const [confirmReset, setConfirmReset] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const raw = localStorage.getItem('spiral_reader_bookmarks');
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return [];
  });

  useEffect(() => {
    const handleUpdate = () => setState(getDiscoveryState());
    const handleBookmarkUpdate = () => {
      try {
        const raw = localStorage.getItem('spiral_reader_bookmarks');
        if (raw) setBookmarks(JSON.parse(raw));
        else setBookmarks([]);
      } catch {
        // ignore
      }
    };
    window.addEventListener('spiral_discovery_update', handleUpdate);
    window.addEventListener('spiral_bookmarks_update', handleBookmarkUpdate);
    return () => {
      window.removeEventListener('spiral_discovery_update', handleUpdate);
      window.removeEventListener('spiral_bookmarks_update', handleBookmarkUpdate);
    };
  }, []);

  const handleDeleteBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    try {
      localStorage.setItem('spiral_reader_bookmarks', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('spiral_bookmarks_update'));
    } catch {
      // ignore
    }
    audioEngine.playSonarPing();
  };

  const totalChapters = 42;
  const chaptersReadCount = state.chaptersRead.length;
  const chapterPercentage = Math.min(100, Math.round((chaptersReadCount / totalChapters) * 100));

  const totalArchives = 24;
  const discoveredArchivesCount = Math.max(state.archivesOpened.length, 3);

  const totalMysteries = 8;
  const discoveredMysteriesCount = Math.max(state.mysteriesViewed.length, 2);

  const totalSecrets = 12;
  const discoveredSecretsCount = state.secretsFound.length;

  const handleReset = () => {
    trackDiscovery.resetAll();
    setState(getDiscoveryState());
    setConfirmReset(false);
    audioEngine.playSonarPing();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Személyes olvasói útvonal"
      className="fixed inset-0 z-[95] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none"
    >
      <div className="w-full max-w-2xl bg-[#030917] rounded border border-cyan-500/80 shadow-[0_0_50px_rgba(56,189,248,0.4)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-950/90 bg-[#020612] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-cyan-950/60 border border-cyan-500/60 text-cyan-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
                SZEMÉLYES FELFEDEZÉSI NAPLÓ
              </div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide">
                AZ ÚTVONALAD
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            title="Bezárás"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Privacy Notice: Non-competitive, 100% private */}
          <div className="p-3 rounded bg-cyan-950/20 border border-cyan-900/50 flex items-start gap-2.5 font-mono text-xs text-slate-300">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Ez a te privát felfedezési naplód. Az adatok kizárólag a böngésződben tárolódnak, nem kerülnek megosztásra és nincsenek rangsorolva más olvasókhoz képest.
            </span>
          </div>

          {/* Progress Overview Grid */}
          <div className="space-y-4">
            {/* Chapters Read Progress Bar */}
            <div className="p-4 rounded bg-black/50 border border-cyan-950/90 space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Olvasott fejezetek:</span>
                </span>
                <span className="text-cyan-300 font-bold">
                  {chaptersReadCount} / {totalChapters} ({chapterPercentage}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-sky-300 transition-all duration-500 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
                  style={{ width: `${chapterPercentage}%` }}
                />
              </div>
            </div>

            {/* Metric counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
              <div className="p-3 rounded bg-black/40 border border-cyan-950/80 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">Archívumok</div>
                <div className="text-xl font-bold text-cyan-300">{discoveredArchivesCount}</div>
                <div className="text-[9px] text-slate-500">24 aktából</div>
              </div>
              <div className="p-3 rounded bg-black/40 border border-cyan-950/80 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">Rejtélyek</div>
                <div className="text-xl font-bold text-cyan-300">{discoveredMysteriesCount}</div>
                <div className="text-[9px] text-slate-500">8 rejtélyből</div>
              </div>
              <div className="p-3 rounded bg-black/40 border border-cyan-950/80 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">Helyszínek</div>
                <div className="text-xl font-bold text-cyan-300">
                  {Math.min(6, state.sitesVisited.length + 2)}
                </div>
                <div className="text-[9px] text-slate-500">6 pontból</div>
              </div>
              <div className="p-3 rounded bg-black/40 border border-cyan-950/80 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">Megtalált titkok</div>
                <div className="text-xl font-bold text-cyan-300">{discoveredSecretsCount}</div>
                <div className="text-[9px] text-slate-500">titkos nyomból</div>
              </div>
            </div>
          </div>

          {/* 72. „MIT FEDEZTÉL FEL?” — Codex Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MEGSZERZETT ADATOK & KÓDEX</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                {state.discoveredNamelessSpiral ? '8 / 8 FELTÁRVA' : 'FELFEDEZÉS FOLYAMATBAN'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CODEX_ITEMS.map((item) => {
                const isDiscovered =
                  state.secretsFound.includes(item.conditionKey) ||
                  state.sitesVisited.includes(item.conditionKey) ||
                  (item.id === 'spiral') ||
                  (item.id === 'archive-82' && state.archivesOpened.length > 0) ||
                  (item.id === 'coord-82' && state.sitesVisited.length > 0) ||
                  (item.id === 'nevtelen' && state.discoveredNamelessSpiral);

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded border transition-all ${
                      isDiscovered
                        ? 'border-cyan-500/50 bg-cyan-950/20 text-slate-200'
                        : 'border-slate-800/80 bg-slate-900/30 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base select-none">
                        {isDiscovered ? item.icon : '❓'}
                      </span>
                      <div className="font-mono text-xs font-bold">
                        {isDiscovered ? item.name : '???'}
                      </div>
                    </div>
                    <p className="text-[11px] font-light mt-1 text-slate-400">
                      {isDiscovered ? item.description : 'Még nem fedezted fel ezt az anomáliát.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 73. MENTETT KÖNYVJELZŐK ÉS BEKEZDÉSEK (Clickable return links) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
                <BookmarkIcon className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                <span>MENTETT KÖNYVJELZŐK & BEKEZDÉSEK</span>
              </h4>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                {bookmarks.length} elmentve
              </span>
            </div>

            {bookmarks.length === 0 ? (
              <div className="p-4 rounded border border-cyan-950/70 bg-black/40 text-center font-mono text-xs text-slate-500 space-y-1.5">
                <BookmarkIcon className="w-6 h-6 mx-auto opacity-30 text-cyan-400" />
                <p>Még nem mentettél el bekezdést az olvasóból.</p>
                <p className="text-[11px] text-slate-600">
                  A könyvolvasóban bármelyik bekezdés jobb felső sarkában a „Mentés” gombra kattintva elmentheted a kedvenc soraidat!
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin pr-1">
                {bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    onClick={() => {
                      audioEngine.playSonarPing();
                      onClose();
                      onOpenReader(bm.chapterIndex, bm.paragraphIndex);
                    }}
                    className="p-3 rounded border border-cyan-950/80 bg-[#040916] hover:bg-cyan-950/40 hover:border-cyan-400/80 transition-all cursor-pointer group text-left shadow-[0_0_12px_rgba(0,0,0,0.6)] hover:shadow-[0_0_18px_rgba(56,189,248,0.25)] relative"
                    title={`Kattints az ugráshoz: ${bm.chapterTitle} (${bm.paragraphIndex + 1}. bekezdés)`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-cinzel text-xs font-bold text-cyan-200 group-hover:text-cyan-300">
                            {bm.chapterTitle}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/90 border border-cyan-800 text-cyan-400">
                            {bm.paragraphIndex + 1}. bekezdés
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {bm.createdAt}
                          </span>
                        </div>

                        {bm.note && (
                          <div className="text-[11px] font-mono text-amber-300/90 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/40 flex items-center gap-1">
                            <span>📝 Jegyzet:</span>
                            <span className="italic truncate">{bm.note}</span>
                          </div>
                        )}

                        <p className="text-xs text-slate-300 font-light italic leading-relaxed line-clamp-2 pt-0.5">
                          „{bm.snippet}”
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          onClick={(e) => handleDeleteBookmark(bm.id, e)}
                          title="Könyvjelző törlése"
                          className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-all opacity-70 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <span className="text-[10px] font-mono text-cyan-400 group-hover:text-white px-2 py-1 rounded bg-cyan-950/90 border border-cyan-800 group-hover:border-cyan-400 flex items-center gap-1 transition-all shadow-[0_0_8px_rgba(56,189,248,0.2)]">
                          <span>Ugrás</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer: Continue Reading or Reset Local Data */}
          <div className="pt-4 border-t border-cyan-950/70 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenReader();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_15px_rgba(56,189,248,0.5)]"
            >
              📖 FOLYTATÁS AZ OLVASÓBAN
            </button>

            {confirmReset ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-rose-400">Biztosan törlöd?</span>
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1 rounded bg-rose-600 text-white font-mono text-[10px] font-bold"
                >
                  IGEN, TÖRLÉS
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px]"
                >
                  MÉGSE
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="text-slate-500 hover:text-rose-400 font-mono text-[11px] flex items-center gap-1 transition-colors"
                title="Helyi olvasási adatok visszaállítása"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Helyi adatok törlése</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
