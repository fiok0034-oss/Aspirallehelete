import React, { useState } from 'react';
import { Feather, Book, ShieldCheck, Headphones, Check, ShoppingBag, X, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const AuthorAndEditions: React.FC = () => {
  const [selectedEdition, setSelectedEdition] = useState<string | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const editions = [
    {
      id: 'standard',
      title: 'KEMÉNYTÁBLÁS PRÉMIUM KIADÁS',
      price: '6 490 Ft',
      badge: 'Bestseller Várományos',
      features: [
        'Dombornyomott, UV-lakkozott Spirál borító',
        'Fekete poláris élfestés',
        'Kihajtható melléklet: 1997-es antarktiszi georadar-térkép',
        '448 oldal prémium törtfehér papíron',
        'Ajándék ARCHÍV-82 könyvjelző koordinátákkal',
      ],
      popular: false,
    },
    {
      id: 'collector',
      title: 'LIMITÁLT «ARCHÍV-82» GYŰJTŐI DOBOZ',
      price: '14 900 Ft',
      badge: 'Limitált (300 sorszámozott pld.)',
      features: [
        'Sorszámozott, dedikált keménytáblás könyv',
        'Fekete fém díszdoboz gravírozott koordinátákkal',
        'Gravírozott acél koordináta-dögcédula (82°16’S / 36°01’E)',
        '12 db felbontatlan, pecsételt katonai kihallgatási aktamásolat',
        'Digitális hozzáférés a regény hivatalos ambient zenei anyagához',
      ],
      popular: true,
    },
    {
      id: 'digital',
      title: 'DIGITÁLIS CSOMAG (E-BOOK & HANGOSKÖNYV)',
      price: '4 990 Ft',
      badge: 'Azonnali letöltés',
      features: [
        'EPUB, MOBI és illusztrált PDF formátumok',
        'Teljes hangoskönyv professzionális színészi narrációval',
        'Mozihatású zenei effektek és sub-basszus drone-ok',
        'DRM-mentes használat minden e-olvasón és telefonon',
      ],
      popular: false,
    },
  ];

  const handleOrderClick = (title: string) => {
    audioEngine.playSonarPing();
    setSelectedEdition(title);
    setOrderModalOpen(true);
    setOrderSuccess(false);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playSonarPing();
    setOrderSuccess(true);
  };

  return (
    <section id="author" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#02050B] border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Author Presentation */}
        <div className="rounded border border-cyan-950/80 bg-[#040814] p-8 sm:p-12 shadow-[0_0_40px_rgba(0,0,0,0.8)] grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
              <Feather className="w-3.5 h-3.5" />
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

        {/* Book Editions Section */}
        <div id="editions" className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/60 bg-cyan-950/20 text-cyan-300 font-mono text-xs tracking-widest uppercase">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>HIVATALOS KIADÁSOK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-100 tracking-wide">
              RENDELD MEG A REGÉNYT
            </h2>
            <p className="text-slate-400 font-light text-base sm:text-lg">
              Válaszd a számodra leginkább testhezálló kiadást, és merülj el az antarktiszi jég alatt fekvő
              titokzatos Spirál univerzumban!
            </p>
          </div>

          {/* Editions Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {editions.map((ed) => (
              <div
                key={ed.id}
                className={`p-6 sm:p-8 rounded border flex flex-col justify-between transition-all duration-300 relative ${
                  ed.popular
                    ? 'border-cyan-400 bg-[#061224] shadow-[0_0_35px_rgba(56,189,248,0.25)]'
                    : 'border-slate-800 bg-[#040814] hover:border-slate-700'
                }`}
              >
                {ed.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-mono font-bold text-[10px] uppercase tracking-wider">
                    AJÁNLOTT KIADÁS
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-cyan-400 tracking-wider block">
                      {ed.badge}
                    </span>
                    <h3 className="text-xl font-cinzel font-bold text-white leading-snug">
                      {ed.title}
                    </h3>
                    <div className="text-3xl font-mono font-bold text-slate-100 pt-2">
                      {ed.price}
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 text-xs text-slate-300 font-light">
                    {ed.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handleOrderClick(ed.title)}
                    className={`w-full py-3 rounded font-mono text-xs tracking-widest uppercase font-semibold transition-all duration-200 border ${
                      ed.popular
                        ? 'border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 hover:text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                        : 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white'
                    }`}
                  >
                    MEGRENDELÉS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Modal */}
        {orderModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-md w-full rounded border border-cyan-800 bg-[#050A15] p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(2,132,199,0.3)] font-mono text-xs">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-cyan-400 uppercase">ARCHÍV-82 / RENDELÉSI PANEL</span>
                  <h3 className="text-lg font-cinzel font-bold text-white">{selectedEdition}</h3>
                </div>
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="p-1 rounded border border-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {orderSuccess ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-cinzel font-bold text-white">
                    RENDELÉS RÖGZÍTVE
                  </h4>
                  <p className="text-slate-400 text-xs font-sans leading-relaxed">
                    Köszönjük a rendelést! Az ARCHÍV-82 expediáló állomás visszaigazoló üzenetet küldött,
                    és a könyvcsomagod hamarosan útnak indul a megadott címre.
                  </p>
                  <button
                    onClick={() => setOrderModalOpen(false)}
                    className="mt-4 px-6 py-2 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-mono text-xs uppercase"
                  >
                    RENDBEN
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmOrder} className="space-y-4 font-sans text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 uppercase">Teljes Név</label>
                    <input
                      required
                      type="text"
                      placeholder="Pl. Dr. Kovács Péter"
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 uppercase">E-mail cím</label>
                    <input
                      required
                      type="email"
                      placeholder="nev@pelda.hu"
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 uppercase">Szállítási cím</label>
                    <input
                      required
                      type="text"
                      placeholder="Irányítószám, Város, Utca, Házszám"
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                    >
                      RENDELÉS VÉGLEGESÍTÉSE
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
