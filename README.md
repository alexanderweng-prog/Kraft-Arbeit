# Kraft & Arbeit – Lernapp

Interaktive Lernapp für die Sekundarstufe I (Lehrplan 21, NT) zu **Kräften und mechanischer Arbeit** (ohne Leistung).
Läuft komplett im Browser, ohne Installation und ohne Server-Logik.

## Inhalt (ca. 2 Stunden)

| Modul | Thema | Film | Labor |
|---|---|---|---|
| 1 | Was ist eine Kraft? Wirkungen, Newton | ✓ | – |
| 2 | Kraftpfeile, Massstab, Kraftarten | ✓ | Kraftpfeil zeichnen (Aufgaben) |
| 3 | Masse und Gewichtskraft, F_G = m · g | ✓ | Planeten-Waage |
| 4 | Federkraftmesser, Hookesches Gesetz | ✓ | Feder-Labor mit Messtabelle und Diagramm |
| 5 | Kräfte addieren, Gleichgewicht, Wechselwirkung, Trägheit | ✓ | Tauziehen |
| 6 | Haft-, Gleit-, Rollreibung | ✓ | Reibungs-Labor |
| 7 | Arbeit W = F · s, Hubarbeit, Reibungs- und Spannarbeit | ✓ | Hub-Labor mit F-s-Diagramm |
| 8 | Hebel, Rollen, Flaschenzug, schiefe Ebene, Goldene Regel | ✓ | Wippe, Flaschenzug, Rampe |
| 9 | Abschlusstest (15 aus 20 Fragen) mit Lernnachweis | | |

Aufgabentypen: Multiple Choice, Lückentext mit Wortspeicher, Rechnen, Zuordnen, Paare finden, Reihenfolge, Richtig/Falsch, Kraftpfeil zeichnen.

- **Erklärfilme**: eigene Canvas-Animationen mit Untertiteln. Der Sprechtext wird über die Sprachausgabe des Geräts vorgelesen (Web Speech API, Stimme je nach Gerät/Browser).
- **Töne**: werden im Browser erzeugt (Web Audio), keine Audiodateien.
- **Fortschritt, Punkte, Lernzeit** werden nur lokal im Browser gespeichert (localStorage).

## Starten

`index.html` direkt im Browser öffnen oder lokal einen Server starten:

```bash
python3 -m http.server 8000
```

Für die Klasse eignet sich GitHub Pages (Settings → Pages → Branch wählen).

## Dateien

- `index.html` – Grundgerüst
- `css/style.css` – Gestaltung (hell/dunkel)
- `js/draw.js` – Zeichenfunktionen (Pfeile, Federn, Rollen …)
- `js/engine.js` – Speicher, Ton, Sprachausgabe, Filmplayer, Aufgabentypen
- `js/films.js` – die 8 Erklärfilme
- `js/sims.js` – die 8 Labore
- `js/content.js` – Lerntexte, Aufgaben, Testfragen (hier lassen sich Inhalte anpassen)
- `js/app.js` – Navigation und Seiten
