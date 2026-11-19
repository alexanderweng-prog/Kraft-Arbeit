/* Lerninhalte: Module mit Stationen (Lernen, Film, Labor, Aufgaben). */
(function () {
  const merk = (t, b) => `<div class="merk"><b>${t}</b>${b}</div>`;
  const fbox = (f, s) => `<div class="formula-box">${f}${s ? `<small>${s}</small>` : ''}</div>`;

  const M = [];

  /* =============== Modul 1 =============== */
  M.push({
    id: 'm1', nr: 1, title: 'Was ist eine Kraft?', sub: 'Wirkungen von Kräften, Einheit Newton', min: 12,
    steps: [
      { k: 'lesson', title: 'Kräfte im Alltag', html: `
        <p>Du stösst, ziehst, drückst, hebst, wirfst und bremst – den ganzen Tag. In all diesen Situationen wirken <b>Kräfte</b>.</p>
        <p>Eine Kraft selbst kann man nicht sehen, nicht riechen und nicht hören. Man erkennt sie nur an dem, was sie bewirkt: Ein Volleyball fliegt plötzlich in eine andere Richtung, ein Trampolin biegt sich durch, ein Velo wird langsamer.</p>
        ${merk('Merke', 'Kräfte erkennt man an ihren <b>Wirkungen</b>. Das Formelzeichen der Kraft ist <b>F</b> (vom englischen <i>force</i>).')}
        <p>Im folgenden Film siehst du die vier wichtigsten Wirkungen von Kräften.</p>` },
      { k: 'film', film: 'f1' },
      { k: 'lesson', title: 'Wirkungen und Einheit', html: `
        <p>Eine Kraft kann …</p>
        <ul>
          <li>einen Körper <b>schneller</b> machen (Anspiel, Anfahren),</li>
          <li>einen Körper <b>langsamer</b> machen oder anhalten (Bremsen, Ball fangen),</li>
          <li>die <b>Bewegungsrichtung ändern</b> (Kurve fahren, Ball ablenken),</li>
          <li>einen Körper <b>verformen</b> – <b>elastisch</b> (er geht in die alte Form zurück, z. B. Feder, Gummiband) oder <b>plastisch</b> (er bleibt verformt, z. B. Knete, zerdrückte Dose).</li>
        </ul>
        ${merk('Merke', 'Die ersten drei Wirkungen fasst man zusammen: Eine Kraft ändert den <b>Bewegungszustand</b> eines Körpers. Die vierte Wirkung ist die <b>Verformung</b>.')}
        <p>Die Einheit der Kraft ist das <b>Newton (N)</b>, benannt nach Isaac Newton. Grössenvorstellungen:</p>
        <div class="table-wrap"><table class="data">
          <tr><th>Beispiel</th><th>Kraft (ungefähr)</th></tr>
          <tr><td style="text-align:left">Tafel Schokolade (100 g) liegt auf der Hand</td><td>1 N</td></tr>
          <tr><td style="text-align:left">1-Liter-Milchpackung</td><td>10 N</td></tr>
          <tr><td style="text-align:left">Schulsack (5 kg)</td><td>50 N</td></tr>
          <tr><td style="text-align:left">Jugendliche Person (60 kg) steht auf dem Boden</td><td>600 N</td></tr>
          <tr><td style="text-align:left">Kleinwagen (1000 kg)</td><td>10 000 N = 10 kN</td></tr>
        </table></div>
        <p class="tip">1 Kilonewton (kN) = 1000 N</p>` },
      { k: 'ex', ex: { id: 'm1-e1', type: 'sort', q: 'Welche Wirkung hat die Kraft hauptsächlich?', cats: ['Bewegungszustand ändert sich', 'Körper wird verformt'],
        items: [{ t: 'Ein Volleyball wird angespielt', c: 0 }, { t: 'Ein Trampolin biegt sich beim Sprung durch', c: 1 }, { t: 'Ein Velo bremst vor dem Rotlicht', c: 0 }, { t: 'Knete wird zu einer Kugel geformt', c: 1 },
          { t: 'Ein Auto fährt in eine Kurve', c: 0 }, { t: 'Eine Getränkedose wird zerdrückt', c: 1 }, { t: 'Ein Gummiband wird gedehnt', c: 1 }, { t: 'Ein Torhüter fängt den Ball', c: 0 }],
        explain: 'Schneller, langsamer oder Richtungsänderung bedeuten: Der Bewegungszustand ändert sich. Dehnen, Biegen, Zerdrücken sind Verformungen.' } },
      { k: 'ex', ex: { id: 'm1-e2', type: 'sort', q: 'Elastisch oder plastisch verformt?', cats: ['elastisch (geht zurück)', 'plastisch (bleibt verformt)'],
        items: [{ t: 'Gummiband', c: 0 }, { t: 'Knete', c: 1 }, { t: 'Feder im Kugelschreiber', c: 0 }, { t: 'Autoblech nach einem Unfall', c: 1 }, { t: 'Volleyball beim Aufprall', c: 0 },
          { t: 'zerknüllte Alufolie', c: 1 }, { t: 'Fussabdruck im Schnee', c: 1 }, { t: 'Trampolin', c: 0 }],
        explain: 'Elastische Körper nehmen nach der Krafteinwirkung ihre ursprüngliche Form wieder an. Plastische Körper bleiben verformt.' } },
      { k: 'ex', ex: { id: 'm1-e3', type: 'mc', q: 'In welcher Einheit misst man Kräfte?', options: ['Newton (N)', 'Kilogramm (kg)', 'Joule (J)', 'Meter pro Sekunde (m/s)'], correct: 0,
        explain: 'Kräfte misst man in Newton. Kilogramm ist die Einheit der Masse, Joule die Einheit der Arbeit.' } },
      { k: 'ex', ex: { id: 'm1-e4', type: 'cloze', text: 'Kräfte kann man nicht {sehen}. Man erkennt sie an ihren {Wirkungen}. Eine Kraft kann einen Körper {verformen} oder seinen {Bewegungszustand|Bewegung} ändern. Die Einheit der Kraft ist das {Newton}, abgekürzt {N}.',
        extra: ['Kilogramm', 'Joule', 'messen'], explain: 'Kräfte sind unsichtbar – aber ihre Wirkungen (Verformung, Änderung des Bewegungszustands) kann man beobachten.' } },
      { k: 'ex', ex: { id: 'm1-e5', type: 'tf', q: 'Richtig oder falsch?', items: [
        { t: 'Eine Kraft erkennt man immer daran, dass sich etwas bewegt.', a: false },
        { t: 'Wenn ein Auto mit gleichem Tempo durch eine Kurve fährt, wirkt eine Kraft.', a: true },
        { t: '1 kN sind 100 N.', a: false },
        { t: 'Ein Gummiband wird elastisch verformt.', a: true }],
        explain: 'Kräfte erkennt man auch an Verformungen, nicht nur an Bewegung. Eine Kurve ist eine Richtungsänderung, also wirkt eine Kraft. 1 kN = 1000 N.' } },
      { k: 'ex', ex: { id: 'm1-e6', type: 'match', q: 'Ordne jeder Situation die passende Kraft zu (ungefähre Werte).', pairs: [
        ['100-g-Schokolade auf der Hand', '1 N'], ['1-Liter-Milchpackung', '10 N'], ['Schulsack mit 5 kg', '50 N'], ['Person mit 60 kg', '600 N'], ['Kleinwagen mit 1000 kg', '10 kN']],
        explain: 'Faustregel: 100 g entsprechen etwa 1 N, 1 kg etwa 10 N.' } },
      { k: 'ex', ex: { id: 'm1-e7', type: 'mc', q: 'Ein Volleyball fliegt nach dem Aufschlag über das Netz und wird von der Gegnerin angenommen. Welche Wirkungen hat die Kraft ihrer Unterarme auf den Ball?', options: ['Der Ball wird kurz verformt und ändert seine Bewegungsrichtung.', 'Der Ball wird nur verformt.', 'Der Ball ändert nur seine Geschwindigkeit, verformt wird er nicht.', 'Es wirkt keine Kraft, weil der Ball nur abprallt.'], correct: 0,
        explain: 'Beim Baggern wird der Ball kurz eingedrückt (elastische Verformung) und fliegt danach in eine neue Richtung, meist auch mit anderer Geschwindigkeit.' } }
    ]
  });

  /* =============== Modul 2 =============== */
  M.push({
    id: 'm2', nr: 2, title: 'Kraftpfeile und Kraftarten', sub: 'Angriffspunkt, Richtung, Betrag, Massstab', min: 12,
    steps: [
      { k: 'lesson', title: 'Kräfte zeichnen', html: `
        <p>Weil man Kräfte nicht sehen kann, zeichnet man sie als <b>Pfeil</b>. Ein Kraftpfeil enthält drei Informationen:</p>
        <ol>
          <li><b>Angriffspunkt</b>: Dort beginnt der Pfeil – an der Stelle, wo die Kraft auf den Körper wirkt.</li>
          <li><b>Richtung</b>: Die Pfeilspitze zeigt, wohin die Kraft wirkt.</li>
          <li><b>Betrag</b>: Die Länge des Pfeils zeigt, wie gross die Kraft ist.</li>
        </ol>
        <p>Für die Länge braucht es einen <b>Massstab</b>, zum Beispiel <span class="mono">1 cm ≙ 10 N</span> (sprich: «1 Zentimeter entspricht 10 Newton»).</p>
        ${fbox('Länge = Kraft : Massstab', 'Beispiel: 40 N : 10 N/cm = 4 cm')}
        ${merk('Merke', 'Eine Kraft ist erst vollständig beschrieben, wenn Angriffspunkt, Richtung und Betrag bekannt sind.')}` },
      { k: 'film', film: 'f2' },
      { k: 'lesson', title: 'Kraftarten', html: `
        <div class="table-wrap"><table class="data">
          <tr><th>Kraftart</th><th>Beispiel</th><th>Art</th></tr>
          <tr><td style="text-align:left">Gewichtskraft F<sub>G</sub></td><td style="text-align:left">Ein Apfel fällt vom Baum</td><td style="text-align:left">Fernkraft</td></tr>
          <tr><td style="text-align:left">Muskelkraft</td><td style="text-align:left">Du hebst deinen Schulsack</td><td style="text-align:left">Kontaktkraft</td></tr>
          <tr><td style="text-align:left">Reibungskraft F<sub>R</sub></td><td style="text-align:left">Ein Schlitten wird langsamer</td><td style="text-align:left">Kontaktkraft</td></tr>
          <tr><td style="text-align:left">Federkraft</td><td style="text-align:left">Ein Trampolin schleudert dich hoch</td><td style="text-align:left">Kontaktkraft</td></tr>
          <tr><td style="text-align:left">Magnetkraft</td><td style="text-align:left">Ein Magnet zieht eine Büroklammer an</td><td style="text-align:left">Fernkraft</td></tr>
          <tr><td style="text-align:left">Elektrische Kraft</td><td style="text-align:left">Ein geriebener Ballon zieht Haare an</td><td style="text-align:left">Fernkraft</td></tr>
          <tr><td style="text-align:left">Auftriebskraft</td><td style="text-align:left">Ein Ball schwimmt im Wasser</td><td style="text-align:left">Kontaktkraft</td></tr>
        </table></div>
        ${merk('Kontakt- oder Fernkraft?', '<b>Kontaktkräfte</b> wirken nur bei Berührung. <b>Fernkräfte</b> (Gewichtskraft, Magnetkraft, elektrische Kraft) wirken auch über eine Distanz.')}
        <p class="tip">Die Gewichtskraft greift im Schwerpunkt eines Körpers an und zeigt immer senkrecht nach unten, zum Erdmittelpunkt.</p>` },
      { k: 'ex', ex: { id: 'm2-e1', type: 'arrow', q: 'Zeichne eine Kraft von <b>30 N nach rechts</b>.', scale: 10, len: 3, ang: 0,
        hint: 'Länge = 30 N : 10 N pro cm', explain: '30 N : 10 N/cm = 3 cm, Pfeil nach rechts.' } },
      { k: 'ex', ex: { id: 'm2-e2', type: 'arrow', q: 'Zeichne die <b>Gewichtskraft von 50 N</b> der Kiste.', scale: 20, len: 2.5, ang: 270,
        hint: 'Die Gewichtskraft zeigt immer nach unten. Länge = 50 N : 20 N pro cm', explain: '50 N : 20 N/cm = 2,5 cm, senkrecht nach unten.' } },
      { k: 'ex', ex: { id: 'm2-e3', type: 'arrow', q: 'Jemand zieht die Kiste mit <b>75 N schräg nach rechts oben</b>.', scale: 15, len: 5, ang: 45,
        hint: 'Länge = 75 N : 15 N pro cm', explain: '75 N : 15 N/cm = 5 cm, schräg nach rechts oben (45°).' } },
      { k: 'ex', ex: { id: 'm2-e4', type: 'num', q: 'Ein Kraftpfeil ist <b>4,5 cm</b> lang. Der Massstab ist 1 cm ≙ 20 N. Wie gross ist die Kraft?', answer: 90, unit: 'N', label: 'F',
        hint: 'Kraft = Länge · Massstab', explain: 'F = 4,5 cm · 20 N/cm = 90 N' } },
      { k: 'ex', ex: { id: 'm2-e5', type: 'num', q: 'Eine Kraft von <b>250 N</b> soll im Massstab 1 cm ≙ 50 N gezeichnet werden. Wie lang wird der Pfeil?', answer: 5, unit: 'cm', label: 'Länge',
        explain: '250 N : 50 N/cm = 5 cm' } },
      { k: 'ex', ex: { id: 'm2-e6', type: 'sort', q: 'Kontaktkraft oder Fernkraft?', cats: ['Kontaktkraft', 'Fernkraft'],
        items: [{ t: 'Gewichtskraft', c: 1 }, { t: 'Magnetkraft', c: 1 }, { t: 'Reibungskraft', c: 0 }, { t: 'Muskelkraft', c: 0 }, { t: 'Federkraft', c: 0 }, { t: 'Elektrische Kraft', c: 1 }, { t: 'Auftriebskraft', c: 0 }],
        explain: 'Gewichts-, Magnet- und elektrische Kraft wirken auch ohne Berührung.' } },
      { k: 'ex', ex: { id: 'm2-e7', type: 'match', q: 'Welche Kraftart wirkt hier vor allem?', pairs: [
        ['Eine FPV-Drohne fällt nach einem Absturz zu Boden', 'Gewichtskraft'], ['Ein Kühlschrankmagnet hält einen Zettel', 'Magnetkraft'], ['Die Velobremse stoppt das Rad', 'Reibungskraft'], ['Ein Bogen schiesst einen Pfeil ab', 'Federkraft'], ['Ein Holzstück wird im Wasser nach oben gedrückt', 'Auftriebskraft']],
        explain: 'Der gespannte Bogen wirkt wie eine Feder. Wasser drückt auf eingetauchte Körper nach oben: Auftrieb.' } },
      { k: 'ex', ex: { id: 'm2-e8', type: 'mc', q: 'Was kann man an einem Kraftpfeil <b>nicht</b> ablesen?', options: ['die Masse des Körpers', 'den Angriffspunkt', 'die Richtung der Kraft', 'den Betrag der Kraft'], correct: 0,
        explain: 'Der Pfeil zeigt Angriffspunkt, Richtung und Betrag. Die Masse des Körpers zeigt er nicht.' } }
    ]
  });

  /* =============== Modul 3 =============== */
  M.push({
    id: 'm3', nr: 3, title: 'Masse und Gewichtskraft', sub: 'F_G = m · g, Ortsfaktor, Planeten', min: 14,
    steps: [
      { k: 'lesson', title: 'Zwei verschiedene Grössen', html: `
        <p>Im Alltag sagt man «Ich wiege 55 Kilo». Physikalisch ist das ungenau, denn es gibt zwei verschiedene Grössen:</p>
        <div class="table-wrap"><table class="data">
          <tr><th></th><th>Masse m</th><th>Gewichtskraft F<sub>G</sub></th></tr>
          <tr><th>Was?</th><td style="text-align:left">wie viel Stoff ein Körper hat, wie «träge» er ist</td><td style="text-align:left">Kraft, mit der ein Körper von einem Himmelskörper angezogen wird</td></tr>
          <tr><th>Einheit</th><td>Kilogramm (kg)</td><td>Newton (N)</td></tr>
          <tr><th>Messgerät</th><td style="text-align:left">Balkenwaage</td><td style="text-align:left">Federkraftmesser</td></tr>
          <tr><th>Ortsabhängig?</th><td style="text-align:left">nein, überall gleich</td><td style="text-align:left">ja, z. B. auf dem Mond viel kleiner</td></tr>
        </table></div>
        ${merk('Merke', 'Die <b>Masse</b> bleibt überall gleich. Die <b>Gewichtskraft</b> hängt davon ab, wo sich der Körper befindet.')}` },
      { k: 'film', film: 'f3' },
      { k: 'lesson', title: 'Die Formel für die Gewichtskraft', html: `
        ${fbox('F<sub>G</sub> = m · g', 'F_G: Gewichtskraft in N · m: Masse in kg · g: Ortsfaktor in N/kg')}
        <p>Der <b>Ortsfaktor g</b> gibt an, mit wie viel Newton ein Himmelskörper an <b>jedem Kilogramm</b> zieht.</p>
        <div class="table-wrap"><table class="data">
          <tr><th>Ort</th><th>g in N/kg</th></tr>
          <tr><td style="text-align:left">Mond</td><td>1,62</td></tr><tr><td style="text-align:left">Mars</td><td>3,71</td></tr>
          <tr><td style="text-align:left">Venus</td><td>8,87</td></tr><tr><td style="text-align:left">Erde</td><td>9,81</td></tr>
          <tr><td style="text-align:left">Jupiter</td><td>24,79</td></tr>
        </table></div>
        <p><b>Beispiel:</b> Ein Velo hat die Masse 12 kg. Gewichtskraft auf der Erde:<br><span class="mono">F<sub>G</sub> = 12 kg · 9,81 N/kg = 117,72 N ≈ 118 N</span></p>
        <p class="tip">Für Überschlagsrechnungen darfst du mit g ≈ 10 N/kg rechnen. In den Aufgaben hier verwenden wir 9,81 N/kg.</p>` },
      { k: 'sim', sim: 'planet' },
      { k: 'ex', ex: { id: 'm3-e1', type: 'num', q: 'Wie gross ist die Gewichtskraft einer Person mit <b>60 kg auf dem Mars</b> (g = 3,71 N/kg)?', answer: 222.6, unit: 'N', label: 'F_G', tol: 1,
        hint: 'F_G = m · g', explain: 'F<sub>G</sub> = 60 kg · 3,71 N/kg = 222,6 N. Auf der Erde wären es 588,6 N.' } },
      { k: 'ex', ex: { id: 'm3-e2', type: 'num', q: 'Ein Mountainbike hat die Masse <b>15 kg</b>. Berechne seine Gewichtskraft auf der Erde.', answer: 147.15, unit: 'N', label: 'F_G', tol: 0.6,
        explain: 'F<sub>G</sub> = 15 kg · 9,81 N/kg = 147,15 N' } },
      { k: 'ex', ex: { id: 'm3-e3', type: 'num', q: 'Eine Astronautin wiegt mit Raumanzug <b>120 kg</b>. Wie gross ist ihre Gewichtskraft auf dem <b>Mond</b> (g = 1,62 N/kg)?', answer: 194.4, unit: 'N', label: 'F_G', tol: 0.6,
        explain: 'F<sub>G</sub> = 120 kg · 1,62 N/kg = 194,4 N – etwa so viel wie 20 kg auf der Erde. Darum können Astronauten auf dem Mond so hoch springen.' } },
      { k: 'ex', ex: { id: 'm3-e4', type: 'num', q: 'Ein Motorrad hat auf der Erde eine Gewichtskraft von <b>1962 N</b>. Welche Masse hat es?', answer: 200, unit: 'kg', label: 'm', tol: 0.6,
        hint: 'Formel umstellen: m = F_G : g', explain: 'm = 1962 N : 9,81 N/kg = 200 kg' } },
      { k: 'ex', ex: { id: 'm3-e5', type: 'mc', q: 'Ein Stein hat auf der Erde die Masse 3 kg. Welche Masse hat er auf dem Mond?', options: ['3 kg', '0,5 kg', '18 kg', '4,86 kg'], correct: 0,
        explain: 'Die Masse ist überall gleich. Nur die Gewichtskraft ändert sich (auf dem Mond: 3 kg · 1,62 N/kg = 4,86 N – Achtung: das sind Newton, nicht Kilogramm!).' } },
      { k: 'ex', ex: { id: 'm3-e6', type: 'sort', q: 'Gehört die Aussage zur Masse oder zur Gewichtskraft?', cats: ['Masse', 'Gewichtskraft'],
        items: [{ t: 'Einheit Kilogramm', c: 0 }, { t: 'Einheit Newton', c: 1 }, { t: 'überall gleich gross', c: 0 }, { t: 'hängt vom Ort ab', c: 1 }, { t: 'Messung mit der Balkenwaage', c: 0 }, { t: 'Messung mit dem Federkraftmesser', c: 1 }, { t: 'zeigt zum Erdmittelpunkt', c: 1 }, { t: 'sagt, wie viel Stoff ein Körper hat', c: 0 }],
        explain: 'Eine Balkenwaage vergleicht Massen – auf dem Mond zeigt sie dasselbe an wie auf der Erde. Ein Federkraftmesser misst die Gewichtskraft.' } },
      { k: 'ex', ex: { id: 'm3-e7', type: 'tf', q: 'Richtig oder falsch?', items: [
        { t: 'Auf der Internationalen Raumstation ISS gibt es keine Erdanziehung.', a: false },
        { t: 'Auf dem Jupiter ist die Masse eines Körpers grösser als auf der Erde.', a: false },
        { t: '1 kg hat auf der Erde eine Gewichtskraft von etwa 10 N.', a: true },
        { t: 'Mit einem Federkraftmesser würde man auf dem Mond für denselben Körper einen kleineren Wert messen.', a: true }],
        explain: 'Die ISS kreist in rund 400 km Höhe. Dort ist der Ortsfaktor noch etwa 8,7 N/kg! Die Astronauten schweben, weil sie mit der Station zusammen ständig um die Erde «fallen».' } },
      { k: 'ex', ex: { id: 'm3-e8', type: 'cloze', text: 'Die {Masse} eines Körpers wird in Kilogramm gemessen und ist überall gleich. Die {Gewichtskraft} wird in {Newton} gemessen. Man berechnet sie mit F<sub>G</sub> = m · {g}. Auf der Erde beträgt der Ortsfaktor {9,81|9.81} N/kg.',
        extra: ['Joule', '1,62', 'Arbeit'], explain: 'F<sub>G</sub> = m · g mit g = 9,81 N/kg auf der Erde.' } }
    ]
  });

  /* =============== Modul 4 =============== */
  M.push({
    id: 'm4', nr: 4, title: 'Federn und Kraftmessung', sub: 'Federkraftmesser, Hookesches Gesetz', min: 14,
    steps: [
      { k: 'lesson', title: 'Kräfte messen', html: `
        <p>Kräfte misst man mit dem <b>Federkraftmesser</b>. In seinem Gehäuse steckt eine Feder: Je grösser die Kraft, desto stärker wird die Feder gedehnt. Eine Skala zeigt die Kraft direkt in Newton an.</p>
        <p><b>So misst du richtig:</b></p>
        <ol>
          <li>Passenden <b>Messbereich</b> wählen (z. B. 0–5 N für leichte Körper).</li>
          <li>Den <b>Nullpunkt</b> einstellen, solange noch nichts angehängt ist.</li>
          <li>Den Körper anhängen bzw. den Kraftmesser <b>in Kraftrichtung</b> halten.</li>
          <li>Warten, bis die Anzeige <b>ruhig</b> ist.</li>
          <li>Auf <b>Augenhöhe</b> ablesen und den Wert <b>mit Einheit</b> notieren.</li>
        </ol>
        ${merk('Achtung', 'Wird eine Feder zu stark gedehnt, ist sie <b>überdehnt</b>: Sie bleibt plastisch verformt und misst danach falsch.')}` },
      { k: 'film', film: 'f4' },
      { k: 'lesson', title: 'Das Hookesche Gesetz', html: `
        <p>Bei einer Feder sind Kraft und Verlängerung <b>proportional</b>: Doppelte Kraft – doppelte Verlängerung. Das gilt, solange die Feder nicht überdehnt wird.</p>
        ${fbox('F = D · s', 'F: Kraft in N · D: Federkonstante in N/cm · s: Verlängerung in cm')}
        <p>Die <b>Federkonstante D</b> beschreibt die Härte der Feder. Man berechnet sie mit <span class="mono">D = F : s</span>.</p>
        <div class="table-wrap"><table class="data">
          <tr><th>F in N</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
          <tr><th>s in cm</th><td>0</td><td>2,5</td><td>5,0</td><td>7,5</td><td>10,0</td></tr>
          <tr><th>F : s in N/cm</th><td>–</td><td>0,4</td><td>0,4</td><td>0,4</td><td>0,4</td></tr>
        </table></div>
        <p>Der Quotient F : s ist immer gleich, also gilt das Hookesche Gesetz. Im F-s-Diagramm ergibt das eine <b>Gerade durch den Nullpunkt</b>.</p>
        <p class="tip">In der Oberstufe wird D oft in N/m angegeben: 0,4 N/cm = 40 N/m.</p>` },
      { k: 'sim', sim: 'feder' },
      { k: 'ex', ex: { id: 'm4-e1', type: 'num', q: 'Bestimme aus deinen Messwerten im Feder-Labor die Federkonstante der <b>mittleren</b> Feder.', answer: 0.8, unit: 'N/cm', label: 'D', tol: 0.02,
        hint: 'D = F : s, z. B. 2 N geteilt durch die gemessene Verlängerung', explain: 'Bei 2 N verlängert sich die mittlere Feder um 2,5 cm: D = 2 N : 2,5 cm = 0,8 N/cm.' } },
      { k: 'ex', ex: { id: 'm4-e2', type: 'order', q: 'Bringe die Schritte beim Messen mit dem Federkraftmesser in die richtige Reihenfolge.', items: ['Passenden Messbereich wählen', 'Nullpunkt einstellen', 'Körper anhängen, Kraftmesser senkrecht halten', 'Warten, bis die Anzeige ruhig ist', 'Auf Augenhöhe ablesen', 'Messwert mit Einheit notieren'],
        explain: 'Zuerst vorbereiten (Messbereich, Nullpunkt), dann messen, dann sauber ablesen und notieren.' } },
      { k: 'ex', ex: { id: 'm4-e3', type: 'num', q: 'Eine Feder hat die Federkonstante D = 0,5 N/cm. Um wie viel verlängert sie sich bei einer Kraft von 3 N?', answer: 6, unit: 'cm', label: 's',
        hint: 's = F : D', explain: 's = 3 N : 0,5 N/cm = 6 cm' } },
      { k: 'ex', ex: { id: 'm4-e4', type: 'num', q: 'Eine Feder verlängert sich bei 6 N um 12 cm. Berechne die Federkonstante und die Verlängerung bei 9 N.', fields: [{ label: 'D', answer: 0.5, unit: 'N/cm', tol: 0.01 }, { label: 's bei 9 N', answer: 18, unit: 'cm', tol: 0.1 }],
        explain: 'D = 6 N : 12 cm = 0,5 N/cm. s = 9 N : 0,5 N/cm = 18 cm.' } },
      { k: 'ex', ex: { id: 'm4-e5', type: 'mc', q: 'Wie sieht das F-s-Diagramm einer Feder aus, die dem Hookeschen Gesetz folgt?', options: ['eine Gerade durch den Nullpunkt', 'eine waagrechte Linie', 'eine Kurve, die immer steiler wird', 'eine Gerade, die bei 5 N beginnt'], correct: 0,
        explain: 'F und s sind proportional: Das ergibt eine Ursprungsgerade. Je steiler die Gerade (F nach oben), desto härter die Feder.' } },
      { k: 'ex', ex: { id: 'm4-e6', type: 'mc', q: 'Du willst die Gewichtskraft eines Radiergummis (ca. 0,3 N) messen. Welcher Federkraftmesser ist am besten geeignet?', options: ['Messbereich 0–1 N', 'Messbereich 0–10 N', 'Messbereich 0–100 N', 'Das ist egal.'], correct: 0,
        explain: 'Der Messbereich sollte knapp über dem erwarteten Wert liegen. Dann ist die Ablesung am genauesten.' } },
      { k: 'ex', ex: { id: 'm4-e7', type: 'cloze', text: 'Eine Feder verlängert sich {proportional} zur Kraft. Das nennt man das {Hookesche} Gesetz: F = D · s. Die Grösse D heisst {Federkonstante}. Eine harte Feder hat ein {grosses|grösseres} D. Wird eine Feder zu stark gedehnt, ist sie {überdehnt} und bleibt {plastisch} verformt.',
        extra: ['kleines', 'elastisch', 'Newtonsche'], explain: 'Eine harte Feder braucht viel Kraft für wenig Verlängerung: D = F : s ist gross.' } }
    ]
  });

  /* =============== Modul 5 =============== */
  M.push({
    id: 'm5', nr: 5, title: 'Kräfte im Zusammenspiel', sub: 'Addieren, Gleichgewicht, Wechselwirkung, Trägheit', min: 15,
    steps: [
      { k: 'lesson', title: 'Kräfte zusammensetzen', html: `
        <p>Oft wirken mehrere Kräfte gleichzeitig auf einen Körper. Liegen sie auf einer Linie, ist das Zusammenzählen einfach:</p>
        <ul>
          <li><b>Gleiche Richtung:</b> Die Kräfte werden <b>addiert</b>. 300 N + 300 N = 600 N.</li>
          <li><b>Entgegengesetzte Richtung:</b> Die Kräfte werden <b>subtrahiert</b>. Die resultierende Kraft zeigt in Richtung der grösseren Kraft. 800 N − 600 N = 200 N.</li>
        </ul>
        ${merk('Kräftegleichgewicht', 'Sind zwei Kräfte gleich gross und entgegengesetzt, heben sie sich auf. Die resultierende Kraft ist 0 N. Ein ruhender Körper bleibt dann in Ruhe – z. B. ein Buch auf dem Tisch: Die Gewichtskraft zieht nach unten, der Tisch drückt gleich stark nach oben.')}` },
      { k: 'film', film: 'f5' },
      { k: 'lesson', title: 'Wechselwirkung und Trägheit', html: `
        ${merk('Wechselwirkungsprinzip', 'Übt ein Körper A eine Kraft auf einen Körper B aus, so übt B eine gleich grosse, entgegengesetzte Kraft auf A aus. Kurz: <i>Kraft = Gegenkraft</i> (lateinisch: actio = reactio).')}
        <p>Beispiele: Eine Rakete stösst Gase nach unten aus – die Gase drücken die Rakete nach oben. Beim Schwimmen drückst du das Wasser nach hinten – das Wasser drückt dich nach vorne. Springst du aus einem Boot an Land, bewegt sich das Boot nach hinten.</p>
        ${merk('Trägheitsprinzip', 'Jeder Körper bleibt in Ruhe oder bewegt sich gleichförmig geradeaus weiter, solange keine resultierende Kraft auf ihn wirkt.')}
        <p>Darum kippst du nach vorne, wenn der Bus bremst, und darum schützt dich der Sicherheitsgurt. Je grösser die Masse, desto träger ist ein Körper.</p>
        <p class="tip">Für FPV-Pilotinnen und -Piloten: Beim Schweben ist die Schubkraft der Propeller gleich gross wie die Gewichtskraft der Drohne – Kräftegleichgewicht.</p>` },
      { k: 'sim', sim: 'tau' },
      { k: 'ex', ex: { id: 'm5-e1', type: 'num', q: 'Zwei Personen schieben ein Auto in die gleiche Richtung, die eine mit <b>250 N</b>, die andere mit <b>180 N</b>. Wie gross ist die resultierende Kraft?', answer: 430, unit: 'N', label: 'F_res',
        explain: 'Gleiche Richtung: 250 N + 180 N = 430 N' } },
      { k: 'ex', ex: { id: 'm5-e2', type: 'num', q: 'Beim Tauziehen zieht Team A mit <b>520 N</b> nach links, Team B mit <b>380 N</b> nach rechts. Wie gross ist die resultierende Kraft?', answer: 140, unit: 'N', label: 'F_res',
        explain: 'Entgegengesetzt: 520 N − 380 N = 140 N, nach links (Richtung Team A).' } },
      { k: 'ex', ex: { id: 'm5-e3', type: 'mc', q: 'Ein Buch liegt ruhig auf dem Tisch. Welche Aussage ist richtig?', options: ['Die Gewichtskraft zieht das Buch nach unten, der Tisch drückt gleich stark nach oben.', 'Auf das Buch wirkt keine Kraft, weil es sich nicht bewegt.', 'Nur die Gewichtskraft wirkt, der Tisch übt keine Kraft aus.', 'Der Tisch drückt stärker nach oben, als die Gewichtskraft nach unten zieht.'], correct: 0,
        explain: 'Das Buch ist in Ruhe, weil die Kräfte im Gleichgewicht sind – nicht, weil keine Kräfte wirken.' } },
      { k: 'ex', ex: { id: 'm5-e4', type: 'sort', q: 'Welches Prinzip erklärt die Situation?', cats: ['Trägheit', 'Wechselwirkung', 'Kräftegleichgewicht'],
        items: [{ t: 'Der Bus bremst, die Fahrgäste kippen nach vorne.', c: 0 }, { t: 'Eine Rakete stösst Gase nach unten aus und steigt.', c: 1 }, { t: 'Eine Lampe hängt ruhig an der Decke.', c: 2 }, { t: 'Ein Ball rollt auf glattem Eis lange weiter.', c: 0 },
          { t: 'Du springst aus dem Boot, das Boot fährt zurück.', c: 1 }, { t: 'Eine Drohne schwebt still in der Luft.', c: 2 }, { t: 'Ein Tischtuch wird schnell weggezogen, das Geschirr bleibt stehen.', c: 0 }, { t: 'Beim Pritschen spürst du den Ball an den Fingern.', c: 1 }],
        explain: 'Trägheit: Körper behalten ihren Bewegungszustand. Wechselwirkung: Kraft und Gegenkraft auf zwei verschiedene Körper. Gleichgewicht: Kräfte auf einen Körper heben sich auf.' } },
      { k: 'ex', ex: { id: 'm5-e5', type: 'num', q: 'Eine FPV-Drohne hat die Masse <b>0,65 kg</b>. Wie gross muss die Schubkraft der Propeller sein, damit sie schwebt?', answer: 6.38, unit: 'N', label: 'F_Schub', tol: 0.06,
        hint: 'Beim Schweben gilt: Schubkraft = Gewichtskraft = m · g', explain: 'F = 0,65 kg · 9,81 N/kg ≈ 6,38 N. Mehr Schub: Die Drohne steigt. Weniger Schub: Sie sinkt.' } },
      { k: 'ex', ex: { id: 'm5-e6', type: 'tf', q: 'Richtig oder falsch?', items: [
        { t: 'Kraft und Gegenkraft wirken immer auf denselben Körper.', a: false },
        { t: 'Ein schwerer Lastwagen ist träger als ein Velo.', a: true },
        { t: 'Wirken zwei gleich grosse, entgegengesetzte Kräfte auf einen Körper, ist die resultierende Kraft 0 N.', a: true },
        { t: 'Ein Körper bewegt sich nur, solange eine Kraft auf ihn wirkt.', a: false }],
        explain: 'Kraft und Gegenkraft wirken auf zwei verschiedene Körper (z. B. Finger und Ball). Ohne Reibung würde ein Körper ohne Kraft einfach weiterrollen – das ist die Trägheit.' } },
      { k: 'ex', ex: { id: 'm5-e7', type: 'cloze', text: 'Wirken zwei Kräfte in die gleiche Richtung, werden sie {addiert}. Wirken sie in entgegengesetzte Richtungen, werden sie {subtrahiert}. Sind sie gleich gross und entgegengesetzt, herrscht {Kräftegleichgewicht|Gleichgewicht}. Nach dem {Wechselwirkungsprinzip} gilt: Kraft = {Gegenkraft}.',
        extra: ['multipliziert', 'Trägheit'], explain: 'Kräfte auf einer Linie werden addiert oder subtrahiert.' } }
    ]
  });

  /* =============== Modul 6 =============== */
  M.push({
    id: 'm6', nr: 6, title: 'Reibung', sub: 'Haft-, Gleit- und Rollreibung', min: 13,
    steps: [
      { k: 'lesson', title: 'Warum es Reibung gibt', html: `
        <p>Jede Oberfläche ist unter dem Mikroskop rau. Liegen zwei Körper aufeinander, verhaken sich die Unebenheiten. Die <b>Reibungskraft F<sub>R</sub></b> wirkt immer <b>gegen die Bewegungsrichtung</b>.</p>
        <ul>
          <li><b>Haftreibung</b>: Der Körper ist in Ruhe. Sie verhindert, dass er losrutscht.</li>
          <li><b>Gleitreibung</b>: Der Körper rutscht über die Unterlage.</li>
          <li><b>Rollreibung</b>: Der Körper rollt (Rad, Kugel).</li>
        </ul>
        ${merk('Merke', 'Haftreibung > Gleitreibung > Rollreibung. Darum ist Anschieben schwerer als Weiterschieben, und darum sind Räder so praktisch.')}` },
      { k: 'film', film: 'f6' },
      { k: 'lesson', title: 'Wovon hängt die Reibung ab?', html: `
        <ul>
          <li>von der <b>Beschaffenheit der Oberflächen</b> (rau, glatt, nass, geölt, Gummi, Eis …),</li>
          <li>von der <b>Kraft, mit der der Körper auf die Unterlage drückt</b> (Normalkraft F<sub>N</sub>). Doppelt so schwer bedeutet etwa doppelt so viel Reibung.</li>
        </ul>
        <p>Die Grösse der Auflagefläche spielt dagegen <b>kaum eine Rolle</b>.</p>
        <p><b>Zusatz für Profis:</b> Man kann die Reibung berechnen:</p>
        ${fbox('F<sub>R</sub> = μ · F<sub>N</sub>', 'μ (sprich «mü»): Reibungszahl, ohne Einheit · F_N: Normalkraft (auf ebenem Boden = Gewichtskraft)')}
        <p>Richtwerte: Holz auf Holz Haftreibung μ ≈ 0,5, Gleitreibung μ ≈ 0,3. Stahl auf Eis μ ≈ 0,02.</p>` },
      { k: 'sim', sim: 'reib' },
      { k: 'ex', ex: { id: 'm6-e1', type: 'num', q: 'Ab welcher Zugkraft rutschte die 5-kg-Kiste auf Holz im Labor los? (Ganze Newton reichen.)', answer: 25, unit: 'N', label: 'F', tol: 1.1,
        explain: 'Die maximale Haftreibung beträgt 0,5 · 49 N ≈ 24,5 N. Bei 25 N reisst die Kiste los. Danach braucht es nur noch die Gleitreibung von etwa 14,7 N.' } },
      { k: 'ex', ex: { id: 'm6-e2', type: 'order', q: 'Ordne die Reibungsarten von der <b>grössten</b> zur <b>kleinsten</b> Kraft.', items: ['Haftreibung', 'Gleitreibung', 'Rollreibung'],
        explain: 'Haftreibung > Gleitreibung > Rollreibung.' } },
      { k: 'ex', ex: { id: 'm6-e3', type: 'sort', q: 'Ist die Reibung hier nützlich oder schädlich?', cats: ['nützlich', 'schädlich'],
        items: [{ t: 'Hallenschuhe stoppen dich beim Block', c: 0 }, { t: 'Reifen nützen sich ab', c: 1 }, { t: 'Velobremse', c: 0 }, { t: 'Motorteile werden heiss', c: 1 }, { t: 'Ein Nagel hält im Holz', c: 0 }, { t: 'Ein Schlitten wird langsamer, obwohl du weiterfahren willst', c: 1 }, { t: 'Ein Streichholz entzünden', c: 0 }, { t: 'Eine Schublade klemmt', c: 1 }],
        explain: 'Ohne Reibung könnte man weder gehen noch bremsen. Gleichzeitig verursacht sie Abnützung und Wärme.' } },
      { k: 'ex', ex: { id: 'm6-e4', type: 'mc', q: 'Warum streut man im Winter Splitt auf vereiste Wege?', options: ['Damit die Reibung zwischen Schuh und Boden grösser wird.', 'Damit das Eis schneller schmilzt.', 'Damit die Gewichtskraft kleiner wird.', 'Damit die Reibung kleiner wird.'], correct: 0,
        explain: 'Splitt macht die Oberfläche rau, die Haftreibung steigt. (Salz würde das Eis schmelzen – Splitt nicht.)' } },
      { k: 'ex', ex: { id: 'm6-e5', type: 'mc', q: 'Eine Kiste wird mit Büchern doppelt so schwer gemacht. Was passiert mit der Gleitreibung?', options: ['Sie wird etwa doppelt so gross.', 'Sie bleibt gleich.', 'Sie wird halb so gross.', 'Sie wird viermal so gross.'], correct: 0,
        explain: 'Die Reibung ist proportional zur Normalkraft: doppelte Gewichtskraft – doppelte Reibung.' } },
      { k: 'ex', ex: { id: 'm6-e6', type: 'tf', q: 'Richtig oder falsch?', items: [
        { t: 'Die Reibung hängt stark von der Grösse der Auflagefläche ab.', a: false },
        { t: 'Öl zwischen zwei Metallteilen verringert die Reibung.', a: true },
        { t: 'Ohne Reibung könnte man besser gehen.', a: false },
        { t: 'Die Reibungskraft wirkt gegen die Bewegungsrichtung.', a: true }],
        explain: 'Beim Gehen stösst du dich mit Hilfe der Haftreibung vom Boden ab. Ohne Reibung würdest du ausrutschen wie auf Glatteis.' } },
      { k: 'ex', ex: { id: 'm6-e7', type: 'num', tag: 'Zusatz', q: 'Ein Schlitten drückt mit F<sub>N</sub> = 400 N auf den Schnee. Die Gleitreibungszahl ist μ = 0,05. Wie gross ist die Reibungskraft?', answer: 20, unit: 'N', label: 'F_R',
        hint: 'F_R = μ · F_N', explain: 'F<sub>R</sub> = 0,05 · 400 N = 20 N' } },
      { k: 'ex', ex: { id: 'm6-e8', type: 'cloze', text: 'Solange ein Körper ruht, wirkt die {Haftreibung}. Rutscht er, wirkt die {Gleitreibung}. Am kleinsten ist die {Rollreibung}. Die Reibung wird grösser, wenn der Körper {stärker} auf die Unterlage drückt.',
        extra: ['schwächer', 'Federkraft'], explain: 'Haft > Gleit > Roll. Mehr Anpresskraft – mehr Reibung.' } }
    ]
  });

  /* =============== Modul 7 =============== */
  M.push({
    id: 'm7', nr: 7, title: 'Mechanische Arbeit', sub: 'W = F · s, Joule, Hubarbeit', min: 16,
    steps: [
      { k: 'lesson', title: 'Arbeit in der Physik', html: `
        <p>Im Alltag ist «Arbeit» alles, was anstrengt. In der Physik ist Arbeit genau festgelegt:</p>
        ${merk('Merke', 'Mechanische Arbeit wird verrichtet, wenn eine <b>Kraft</b> einen Körper <b>entlang eines Weges</b> bewegt – und zwar in Richtung der Kraft.')}
        <p>Keine Arbeit im physikalischen Sinn wird verrichtet, wenn …</p>
        <ul>
          <li>der Weg null ist (gegen eine Wand drücken, eine Hantel ruhig halten),</li>
          <li>Kraft und Weg senkrecht aufeinander stehen (Tasche auf gleicher Höhe tragen: Die Kraft zeigt nach oben, der Weg verläuft waagrecht).</li>
        </ul>
        <p class="tip">Dass du trotzdem müde wirst, liegt an deinen Muskeln: Sie spannen sich ständig an und ab und brauchen dafür Energie.</p>` },
      { k: 'film', film: 'f7' },
      { k: 'lesson', title: 'Formel und Arbeitsformen', html: `
        ${fbox('W = F · s', 'W: Arbeit in Joule (J) · F: Kraft in N · s: Weg in m')}
        <p><span class="mono">1 J = 1 N · 1 m = 1 Nm</span>. 1 kJ = 1000 J.</p>
        <div class="table-wrap"><table class="data">
          <tr><th>Arbeitsform</th><th>Formel</th><th>Beispiel</th></tr>
          <tr><td style="text-align:left">Hubarbeit</td><td style="text-align:left" class="mono">W = F<sub>G</sub> · h = m · g · h</td><td style="text-align:left">Schulsack in den 2. Stock tragen</td></tr>
          <tr><td style="text-align:left">Reibungsarbeit</td><td style="text-align:left" class="mono">W = F<sub>R</sub> · s</td><td style="text-align:left">Kiste über den Boden schieben</td></tr>
          <tr><td style="text-align:left">Spannarbeit</td><td style="text-align:left" class="mono">W = ½ · F · s</td><td style="text-align:left">Bogen oder Feder spannen</td></tr>
          <tr><td style="text-align:left">Beschleunigungsarbeit</td><td style="text-align:left">–</td><td style="text-align:left">Ball abwerfen, Velo anfahren</td></tr>
        </table></div>
        <p><b>Beispiel Hubarbeit:</b> Du trägst deinen Schulsack (6 kg) 3 m die Treppe hoch.<br><span class="mono">W = 6 kg · 9,81 N/kg · 3 m = 176,58 J</span></p>
        <p class="tip">Im F-s-Diagramm ist die Arbeit die Fläche unter der Kurve. Bei einer Feder wächst die Kraft beim Spannen gleichmässig an: Die Fläche ist ein Dreieck, darum ½ · F · s.</p>` },
      { k: 'sim', sim: 'hub' },
      { k: 'ex', ex: { id: 'm7-e1', type: 'num', q: 'Wie gross war die Hubarbeit, als du den 20-kg-Sack 3 m hoch gehoben hast?', answer: 588.6, unit: 'J', label: 'W', tol: 1.5,
        explain: 'W = m · g · h = 20 kg · 9,81 N/kg · 3 m = 588,6 J' } },
      { k: 'ex', ex: { id: 'm7-e2', type: 'sort', q: 'Wird hier (am genannten Körper) Arbeit im physikalischen Sinn verrichtet?', cats: ['Arbeit wird verrichtet', 'keine Arbeit'],
        items: [{ t: 'Du steigst die Treppe hoch.', c: 0 }, { t: 'Du schiebst eine Kiste über den Boden.', c: 0 }, { t: 'Du spannst einen Bogen.', c: 0 }, { t: 'Du hältst eine Hantel ruhig über dem Kopf.', c: 1 },
          { t: 'Du drückst gegen eine Hauswand.', c: 1 }, { t: 'Du löst Rechnungen im Kopf.', c: 1 }, { t: 'Du wirfst einen Ball hoch.', c: 0 }, { t: 'Du trägst eine Tasche auf ebenem Weg, ohne sie anzuheben.', c: 1 }],
        explain: 'Arbeit braucht Kraft UND Weg in Kraftrichtung. Beim Tragen auf gleicher Höhe zeigt die Haltekraft nach oben, der Weg ist waagrecht.' } },
      { k: 'ex', ex: { id: 'm7-e3', type: 'num', q: 'Du schiebst eine Kiste <b>12 m</b> weit über den Boden. Die Reibungskraft beträgt <b>150 N</b>. Wie gross ist die Reibungsarbeit?', answer: 1800, unit: 'J', label: 'W',
        explain: 'W = F<sub>R</sub> · s = 150 N · 12 m = 1800 J = 1,8 kJ' } },
      { k: 'ex', ex: { id: 'm7-e4', type: 'num', q: 'Du trägst deinen Schulsack (<b>6 kg</b>) vom Erdgeschoss in den 3. Stock. Jedes Stockwerk ist <b>3 m</b> hoch. Wie gross ist die Hubarbeit am Schulsack?', answer: 529.74, unit: 'J', label: 'W', tol: 1.5,
        hint: '3 Stockwerke · 3 m = Hubhöhe h', explain: 'h = 9 m, W = 6 kg · 9,81 N/kg · 9 m = 529,74 J' } },
      { k: 'ex', ex: { id: 'm7-e5', type: 'num', q: 'Ein Kran verrichtet an einer Palette mit <b>40 kg</b> eine Hubarbeit von <b>1200 J</b>. Wie hoch hat er sie gehoben?', answer: 3.06, unit: 'm', label: 'h', tol: 0.03,
        hint: 'h = W : (m · g)', explain: 'h = 1200 J : (40 kg · 9,81 N/kg) = 1200 J : 392,4 N ≈ 3,06 m' } },
      { k: 'ex', ex: { id: 'm7-e6', type: 'num', q: 'Eine Velofahrerin (mit Velo zusammen <b>75 kg</b>) fährt einen Pass mit <b>800 m</b> Höhenunterschied hoch. Wie gross ist die Hubarbeit? Gib das Ergebnis in kJ an.', answer: 588.6, unit: 'kJ', label: 'W', tol: 1.5,
        explain: 'W = 75 kg · 9,81 N/kg · 800 m = 588 600 J = 588,6 kJ. Für die Hubarbeit zählt nur der Höhenunterschied, nicht die Länge der Strasse.' } },
      { k: 'ex', ex: { id: 'm7-e7', type: 'match', q: 'Ordne jeder Grösse ihre Einheit zu.', pairs: [['Kraft F', 'Newton (N)'], ['Weg s', 'Meter (m)'], ['Arbeit W', 'Joule (J)'], ['Masse m', 'Kilogramm (kg)'], ['Ortsfaktor g', 'N/kg'], ['Federkonstante D', 'N/cm']],
        explain: 'Arbeit = Kraft · Weg, darum 1 J = 1 N · m.' } },
      { k: 'ex', ex: { id: 'm7-e8', type: 'num', tag: 'Zusatz', q: 'Ein Expander wird gleichmässig gespannt, bis die Kraft <b>200 N</b> beträgt. Dabei wird er um <b>0,4 m</b> gedehnt. Wie gross ist die Spannarbeit?', answer: 40, unit: 'J', label: 'W',
        hint: 'Die Kraft steigt von 0 auf 200 N: Dreiecksfläche ½ · F · s', explain: 'W = ½ · 200 N · 0,4 m = 40 J' } },
      { k: 'ex', ex: { id: 'm7-e9', type: 'cloze', text: 'Arbeit wird verrichtet, wenn eine {Kraft} einen Körper entlang eines {Weges} bewegt. Die Formel lautet W = F · {s}. Die Einheit der Arbeit ist das {Joule}. Beim Heben verrichtet man {Hubarbeit}: W = m · g · {h}.',
        extra: ['Newton', 'Masse', 'Leistung'], explain: 'W = F · s, Einheit Joule. Hubarbeit: W = m · g · h.' } }
    ]
  });

  /* =============== Modul 8 =============== */
  M.push({
    id: 'm8', nr: 8, title: 'Kraftwandler und Goldene Regel', sub: 'Hebel, Rollen, Flaschenzug, schiefe Ebene', min: 20,
    steps: [
      { k: 'lesson', title: 'Kraft sparen – aber keine Arbeit', html: `
        <p>Seit Jahrtausenden nutzen Menschen Hilfsmittel, um schwere Lasten zu bewegen: Hebel, Rollen, Flaschenzüge und schiefe Ebenen. Man nennt sie <b>Kraftwandler</b>.</p>
        <p>Sie verringern die nötige Kraft oder ändern ihre Richtung. Doch es gibt einen Haken: Der Weg wird länger.</p>
        ${merk('Goldene Regel der Mechanik', '«Was man an Kraft spart, muss man an Weg zusetzen.» Die Arbeit bleibt gleich: <span class="mono">F₁ · s₁ = F₂ · s₂</span> (ohne Reibung).')}
        <p class="tip">Mit Reibung braucht man sogar etwas mehr Arbeit als ohne Kraftwandler. Arbeit sparen kann man mit keinem Kraftwandler.</p>` },
      { k: 'film', film: 'f8' },
      { k: 'lesson', title: 'Der Hebel', html: `
        <p>Ein Hebel ist eine starre Stange, die um eine <b>Drehachse</b> drehbar ist. Die Abstände von der Achse zu den Kräften heissen <b>Hebelarme</b> (a).</p>
        ${fbox('F₁ · a₁ = F₂ · a₂', 'Hebelgesetz: Kraft mal Kraftarm = Last mal Lastarm')}
        <ul>
          <li><b>Zweiseitiger Hebel:</b> Die Achse liegt zwischen den Kräften (Wippe, Schere, Zange, Brecheisen).</li>
          <li><b>Einseitiger Hebel:</b> Beide Kräfte liegen auf derselben Seite der Achse (Schubkarre, Nussknacker, Flaschenöffner).</li>
        </ul>
        <p><b>Beispiel:</b> Links sitzt ein Kind (300 N) 1 m von der Achse entfernt. Wie weit weg muss sich rechts ein Kind mit 200 N setzen?<br><span class="mono">300 N · 1 m = 200 N · a₂ → a₂ = 1,5 m</span></p>` },
      { k: 'sim', sim: 'hebel' },
      { k: 'lesson', title: 'Rollen, Flaschenzug, schiefe Ebene', html: `
        <ul>
          <li><b>Feste Rolle:</b> ändert nur die Richtung der Kraft. Kraft = Last.</li>
          <li><b>Lose Rolle:</b> Die Last hängt an 2 Seilstücken. Man braucht die halbe Kraft, aber den doppelten Seilweg.</li>
          <li><b>Flaschenzug:</b> Bei n tragenden Seilstücken gilt:</li>
        </ul>
        ${fbox('F = F<sub>G</sub> : n  ·  s = n · h', 'n: Anzahl tragender Seilstücke · h: Hubhöhe · s: Seilweg')}
        <ul><li><b>Schiefe Ebene:</b> Je länger und flacher die Rampe, desto kleiner die Kraft.</li></ul>
        ${fbox('F = F<sub>G</sub> · h : l', 'h: Höhe · l: Länge der schiefen Ebene (ohne Reibung)')}
        <p class="tip">Serpentinen-Strassen am Gotthard oder ein Rollstuhl-Rampe funktionieren genau so: längerer Weg, weniger Kraft.</p>` },
      { k: 'sim', sim: 'flasche' },
      { k: 'sim', sim: 'rampe' },
      { k: 'ex', ex: { id: 'm8-e1', type: 'num', q: 'Mit einem Brecheisen soll ein Stein (Last <b>600 N</b>) angehoben werden. Lastarm <b>0,2 m</b>, Kraftarm <b>1,2 m</b>. Welche Kraft brauchst du?', answer: 100, unit: 'N', label: 'F',
        hint: 'F₁ · a₁ = F₂ · a₂ → F = 600 N · 0,2 m : 1,2 m', explain: 'F = 600 N · 0,2 m : 1,2 m = 100 N' } },
      { k: 'ex', ex: { id: 'm8-e2', type: 'num', q: 'Auf einer Wippe sitzt links Lena (<b>400 N</b>) <b>1,5 m</b> von der Achse entfernt. Wie weit von der Achse muss Tim (<b>500 N</b>) rechts sitzen?', answer: 1.2, unit: 'm', label: 'a₂', tol: 0.01,
        explain: 'a₂ = 400 N · 1,5 m : 500 N = 1,2 m. Die schwerere Person sitzt näher an der Achse.' } },
      { k: 'ex', ex: { id: 'm8-e3', type: 'num', q: 'Ein Flaschenzug hat <b>4</b> tragende Seilstücke. Die Last hat <b>800 N</b> und soll <b>2 m</b> hoch gehoben werden. Berechne Zugkraft und Seilweg.', fields: [{ label: 'F', answer: 200, unit: 'N' }, { label: 's', answer: 8, unit: 'm' }],
        explain: 'F = 800 N : 4 = 200 N. s = 4 · 2 m = 8 m. Kontrolle: 200 N · 8 m = 1600 J = 800 N · 2 m.' } },
      { k: 'ex', ex: { id: 'm8-e4', type: 'num', q: 'Ein Fass (<b>900 N</b>) wird über eine <b>4 m</b> lange Rampe auf eine <b>1,2 m</b> hohe Ladefläche gerollt. Welche Kraft ist nötig (ohne Reibung)?', answer: 270, unit: 'N', label: 'F',
        explain: 'F = 900 N · 1,2 m : 4 m = 270 N. Arbeit: 270 N · 4 m = 1080 J = 900 N · 1,2 m.' } },
      { k: 'ex', ex: { id: 'm8-e5', type: 'sort', q: 'Einseitiger oder zweiseitiger Hebel?', cats: ['einseitiger Hebel', 'zweiseitiger Hebel'],
        items: [{ t: 'Schere', c: 1 }, { t: 'Schubkarre', c: 0 }, { t: 'Wippe', c: 1 }, { t: 'Nussknacker', c: 0 }, { t: 'Kombizange', c: 1 }, { t: 'Flaschenöffner', c: 0 }],
        explain: 'Zweiseitig: Achse zwischen Kraft und Last. Einseitig: Achse am Ende, Kraft und Last auf derselben Seite.' } },
      { k: 'ex', ex: { id: 'm8-e6', type: 'mc', q: 'Was stimmt für einen Flaschenzug (ohne Reibung)?', options: ['Man spart Kraft, aber die Arbeit bleibt gleich.', 'Man spart Kraft und Arbeit.', 'Man spart Arbeit, aber nicht Kraft.', 'Man spart weder Kraft noch Arbeit.'], correct: 0,
        explain: 'Goldene Regel: weniger Kraft, dafür längerer Weg – gleiche Arbeit.' } },
      { k: 'ex', ex: { id: 'm8-e7', type: 'match', q: 'Welcher Kraftwandler passt?', pairs: [
        ['ändert nur die Kraftrichtung', 'feste Rolle'], ['halbiert die Kraft, verdoppelt den Seilweg', 'lose Rolle'], ['Kraft = Last : Anzahl Seilstücke', 'Flaschenzug'], ['längerer Weg auf die gleiche Höhe', 'schiefe Ebene'], ['Kraft · Kraftarm = Last · Lastarm', 'Hebel']],
        explain: 'Alle Kraftwandler gehorchen der Goldenen Regel der Mechanik.' } },
      { k: 'ex', ex: { id: 'm8-e8', type: 'tf', q: 'Richtig oder falsch?', items: [
        { t: 'Mit einer festen Rolle braucht man nur die halbe Kraft.', a: false },
        { t: 'Je länger eine Rampe (bei gleicher Höhe), desto kleiner die nötige Kraft.', a: true },
        { t: 'Mit einem guten Kraftwandler kann man Arbeit sparen.', a: false },
        { t: 'Bei einem Hebel ist die Kraft kleiner, wenn der Kraftarm länger ist.', a: true }],
        explain: 'Die feste Rolle ändert nur die Richtung. Arbeit kann man nicht sparen.' } },
      { k: 'ex', ex: { id: 'm8-e9', type: 'cloze', text: 'Die Goldene Regel der Mechanik lautet: Was man an {Kraft} spart, muss man an {Weg} zusetzen. Die {Arbeit} bleibt gleich. Bei einem Flaschenzug mit 6 tragenden Seilstücken braucht man {ein Sechstel|1/6} der Kraft, aber den {sechsfachen} Seilweg.',
        extra: ['Masse', 'halben', 'doppelten'], explain: 'F = F<sub>G</sub> : 6 und s = 6 · h.' } }
    ]
  });

  /* =============== Abschlusstest (Pool) =============== */
  const TEST = [
    { id: 't1', type: 'mc', q: 'Welche dieser Situationen zeigt <b>keine</b> Wirkung einer Kraft?', options: ['Ein Ball liegt ruhig im Gras, nichts verändert sich.', 'Ein Ball wird gebremst.', 'Ein Ball wird eingedrückt.', 'Ein Ball fliegt in eine Kurve.'], correct: 0, explain: 'Keine Veränderung von Form oder Bewegungszustand (Kräfte im Gleichgewicht).' },
    { id: 't2', type: 'num', q: 'Ein Kraftpfeil ist 3,5 cm lang, Massstab 1 cm ≙ 40 N. Wie gross ist die Kraft?', answer: 140, unit: 'N', label: 'F', explain: '3,5 · 40 N = 140 N' },
    { id: 't3', type: 'num', q: 'Gewichtskraft eines 8-kg-Hundes auf der Erde?', answer: 78.48, unit: 'N', label: 'F_G', tol: 0.5, explain: '8 kg · 9,81 N/kg = 78,48 N' },
    { id: 't4', type: 'mc', q: 'Auf dem Mond hat ein Körper …', options: ['die gleiche Masse, aber eine kleinere Gewichtskraft.', 'eine kleinere Masse und eine kleinere Gewichtskraft.', 'eine kleinere Masse, aber die gleiche Gewichtskraft.', 'die gleiche Masse und die gleiche Gewichtskraft.'], correct: 0, explain: 'Die Masse ist ortsunabhängig.' },
    { id: 't5', type: 'num', q: 'Eine Feder (D = 0,25 N/cm) wird um 8 cm gedehnt. Welche Kraft wirkt?', answer: 2, unit: 'N', label: 'F', explain: 'F = 0,25 N/cm · 8 cm = 2 N' },
    { id: 't6', type: 'tf', q: 'Richtig oder falsch?', items: [{ t: 'Die Gewichtskraft ist eine Fernkraft.', a: true }, { t: 'Gleitreibung ist grösser als Haftreibung.', a: false }, { t: 'Kraft und Gegenkraft sind gleich gross.', a: true }], explain: 'Haftreibung > Gleitreibung.' },
    { id: 't7', type: 'num', q: 'Zwei Hunde ziehen an einem Seil in entgegengesetzte Richtungen: 230 N und 310 N. Resultierende Kraft?', answer: 80, unit: 'N', label: 'F_res', explain: '310 N − 230 N = 80 N' },
    { id: 't8', type: 'mc', q: 'Warum rutscht man auf Glatteis leicht aus?', options: ['Die Haftreibung zwischen Schuh und Eis ist sehr klein.', 'Die Gewichtskraft ist auf Eis grösser.', 'Eis zieht die Füsse magnetisch an.', 'Auf Eis wirkt keine Gewichtskraft.'], correct: 0, explain: 'Wenig Reibung: Die Schuhe finden keinen Halt.' },
    { id: 't9', type: 'num', q: 'Hubarbeit: 25 kg werden 2 m hoch gehoben.', answer: 490.5, unit: 'J', label: 'W', tol: 1.5, explain: '25 · 9,81 · 2 = 490,5 J' },
    { id: 't10', type: 'mc', q: 'In welcher Situation wird physikalische Arbeit verrichtet?', options: ['Ein Gewichtheber stemmt die Hantel nach oben.', 'Ein Gewichtheber hält die Hantel ruhig oben.', 'Eine Statue steht auf ihrem Sockel.', 'Du drückst gegen einen fest verankerten Pfosten.'], correct: 0, explain: 'Nur beim Hochstemmen gibt es Kraft und Weg in gleicher Richtung.' },
    { id: 't11', type: 'num', q: 'Ein Schrank wird mit 120 N über 4 m geschoben. Arbeit?', answer: 480, unit: 'J', label: 'W', explain: '120 N · 4 m = 480 J' },
    { id: 't12', type: 'num', q: 'Hebel: Last 450 N, Lastarm 0,3 m, Kraftarm 0,9 m. Benötigte Kraft?', answer: 150, unit: 'N', label: 'F', explain: '450 · 0,3 : 0,9 = 150 N' },
    { id: 't13', type: 'num', q: 'Lose Rolle: Eine Last von 360 N soll 1,5 m gehoben werden. Wie lang ist der Seilweg?', answer: 3, unit: 'm', label: 's', explain: 'Lose Rolle: 2 Seilstücke, s = 2 · 1,5 m = 3 m (Kraft 180 N).' },
    { id: 't14', type: 'mc', q: 'Welche Aussage ist die Goldene Regel der Mechanik?', options: ['Was man an Kraft spart, muss man an Weg zusetzen.', 'Je grösser die Masse, desto grösser die Gewichtskraft.', 'Kraft ist gleich Gegenkraft.', 'Arbeit ist Kraft mal Zeit.'], correct: 0, explain: 'Die anderen Aussagen sind entweder andere Gesetze oder falsch.' },
    { id: 't15', type: 'num', q: 'Schiefe Ebene: Last 500 N, Höhe 0,8 m, Länge 2 m. Kraft ohne Reibung?', answer: 200, unit: 'N', label: 'F', explain: '500 N · 0,8 : 2 = 200 N' },
    { id: 't16', type: 'cloze', text: 'Die Einheit der Arbeit ist das {Joule}, die Einheit der Kraft das {Newton} und die Einheit der Masse das {Kilogramm}.', extra: ['Meter', 'Watt'], explain: 'J, N, kg.' },
    { id: 't17', type: 'mc', q: 'Eine Lampe hängt ruhig an einer Feder. Welche Kräfte wirken auf die Lampe?', options: ['Gewichtskraft nach unten und gleich grosse Federkraft nach oben.', 'Nur die Gewichtskraft.', 'Nur die Federkraft.', 'Keine Kräfte, sie hängt ja still.'], correct: 0, explain: 'Kräftegleichgewicht.' },
    { id: 't18', type: 'num', q: 'Wie viel Masse hat ein Körper, der auf dem Mond (g = 1,62 N/kg) eine Gewichtskraft von 81 N hat?', answer: 50, unit: 'kg', label: 'm', tol: 0.3, explain: 'm = 81 N : 1,62 N/kg = 50 kg' },
    { id: 't19', type: 'sort', q: 'Kraftwandler: Was ändert sich?', cats: ['nur die Richtung', 'Kraft wird kleiner'], items: [{ t: 'feste Rolle', c: 0 }, { t: 'lose Rolle', c: 1 }, { t: 'Flaschenzug', c: 1 }, { t: 'lange Rampe', c: 1 }], explain: 'Nur die feste Rolle ändert ausschliesslich die Richtung.' },
    { id: 't20', type: 'mc', q: 'Du steigst mit dem Velo einen Hügel hoch. Wovon hängt die Hubarbeit ab?', options: ['von der Masse und vom Höhenunterschied', 'von der Länge der Strasse', 'nur von der Masse', 'von der Geschwindigkeit'], correct: 0, explain: 'W = m · g · h.' }
  ];

  window.KMODS = M;
  window.KTEST = TEST;
})();
