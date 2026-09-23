export interface LoreFragment {
  id: string;
  number: string;
  title: string;
  type: 'KOORDINÁTA' | 'DOKUMENTUM' | 'KARAKTER' | 'HANGJEL' | 'SZIMBÓLUM' | 'TELEMETRIA';
  quote: string;
  source: string;
  classification: string;
  details: string;
}

export const LORE_FRAGMENTS: LoreFragment[] = [
  {
    id: 'FRAG_01',
    number: 'FRAGMENT 01',
    title: 'A Radarelnyelő Pont',
    type: 'KOORDINÁTA',
    quote: '„82°16’S, 36°01’E — A pont, amely a műholdakon nem ver vissza radarhullámot, csak elnyeli azokat.”',
    source: 'McMurdo SAR Műholdarchívum // 1997-B',
    classification: 'RESTRICTED',
    details: 'A jégpáncél vastagsága itt 3800 méter. A reflexiós profil negatív fázist mutat, mintha a mélyben nem tömör anyag, hanem egy térgörbület helyezkedne el.',
  },
  {
    id: 'FRAG_02',
    number: 'FRAGMENT 02',
    title: 'Viktor Naplója: Az Első Hasadás',
    type: 'DOKUMENTUM',
    quote: '„A jég nem olvadt meg. A jég megnyílt előttünk, mintha emlékezne ránk. A sziklák melegebbek voltak, mint a kezünk.”',
    source: 'Viktor személyes expedíciós füzete // 03. oldal',
    classification: 'CLASSIFIED',
    details: 'A fúrás helyén talált kristályszerkezet nem földi kőzetre jellemző hexagonális hálót, hanem aranyarányú logaritmikus görbét követett.',
  },
  {
    id: 'FRAG_03',
    number: 'FRAGMENT 03',
    title: 'Lena Koponyarezonanciája',
    type: 'TELEMETRIA',
    quote: '„A gravitációs lencsehatás nem kifelé görbül a mélyben, hanem a koponyánk belseje felé. A gondolataink fizikai súlyt kaptak.”',
    source: 'Biológiai Telemetria // Lena bioszenzor adatsor',
    classification: 'TOP SECRET',
    details: 'Az EEG felvételek 4.8 Hz-es théta hullámokat regisztráltak miközben a pulzusszám 42-re esett vissza. A megfigyelő tudata tágulást érzékelt.',
  },
  {
    id: 'FRAG_04',
    number: 'FRAGMENT 04',
    title: 'A Kilenc Hangja',
    type: 'HANGJEL',
    quote: '„A 9 Őrző nevei nincsenek kőbe vésve. Csak a frekvenciájuk létezik, amellyel a jég alatti bazaltot mikroszkopikusan rezegtetik.”',
    source: 'Akusztikai Spektrogram // Mélyfúrási mikrofon',
    classification: 'RESTRICTED',
    details: 'A kilenc frekvencia harmonikus arányban áll egymással, de a tízedik akkord hiányzik. Az a csend pontja.',
  },
  {
    id: 'FRAG_05',
    number: 'FRAGMENT 05',
    title: 'Mira Dossziéja: Apa Kérdése',
    type: 'KARAKTER',
    quote: '„Azt mondta, a Spirál nem egy eltemetett építmény. A Spirál a válasz egy olyan kérdésre, amit az emberiség még nem tett fel.”',
    source: 'Mira kutatói feljegyzései // Dosszié Δ–82',
    classification: 'CLASSIFIED',
    details: 'Mira apjának utolsó rádióüzenete nem koordinátákat tartalmazott, hanem egyetlen nevet, amelyet a rendszer cenzúrázott.',
  },
  {
    id: 'FRAG_06',
    number: 'FRAGMENT 06',
    title: 'A Törés Városa',
    type: 'DOKUMENTUM',
    quote: '„Nem ókori romok ezek. Egy eljövendő város geometriai vetülete, amelyet a múltba vetett egy időhasadás.”',
    source: 'Régészeti Rétegjelentés // Törés-4',
    classification: 'TOP SECRET',
    details: 'Az épületek bazaltból és hideg fényből állnak. Nincsenek lépcsők vagy ajtók, csupán a tér sűrűségének helyi változásai.',
  },
  {
    id: 'FRAG_07',
    number: 'FRAGMENT 07',
    title: 'Levente Tükörképe',
    type: 'KARAKTER',
    quote: '„Amikor a tükörbe nézek a vörös porszobában, nem a saját arcomat látom, hanem a tizedik spirál üres helyét.”',
    source: 'Pszichoanalitikai Log // Levente dosszié',
    classification: 'CLASSIFIED',
    details: 'Identitása folyamatos fluktuációt mutat. A memóriaintegritás 71%-ra zuhant a harmadik leereszkedés után.',
  },
  {
    id: 'FRAG_08',
    number: 'FRAGMENT 08',
    title: 'A 82.1 MHz Rádióanomália',
    type: 'HANGJEL',
    quote: '„A sarki rádiósugárzás nem kozmikus zaj. Egy végtelenített, visszafelé modulált beszédhang, amely a megérkezésünket jósolta meg.”',
    source: 'Poláris Rádióvevő Archívum // 082.1 MHz',
    classification: 'RESTRICTED',
    details: 'A jel még most is fogható a megfelelő frekvenciára hangolt rádiószkennerrel.',
  },
  {
    id: 'FRAG_09',
    number: 'FRAGMENT 09',
    title: 'A Vörös Por Törvénye',
    type: 'SZIMBÓLUM',
    quote: '„Az a hely, ahol a gravitáció és a bűntudat fizikai részecskékké sűrűsödik össze. A por nem száll le soha.”',
    source: 'Zárt Kamra Protokoll // Zóna 09',
    classification: 'TOP SECRET',
    details: 'A vörös por nem ásványi eredetű: szerves és kristályos nanostruktúrák keveréke, amely reagál a látogató szemmozgására.',
  },
  {
    id: 'FRAG_10',
    number: 'FRAGMENT 10',
    title: 'A Névtelen és a Tizedik',
    type: 'SZIMBÓLUM',
    quote: '„A tizedik spirál nem hiányzik a sorból. A tizedik spirál maga a megfigyelő, aki az első kilencet felfedezi.”',
    source: 'ARCHÍV-0 // Zéró Bejegyzés',
    classification: 'VOID',
    details: 'Aki eléri a tizedik fragmentet, az befejezte a megfigyelői ciklust és megnyitotta a rendszer legbelső archívumát.',
  },
];
