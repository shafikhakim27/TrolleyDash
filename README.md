# TrolleyDash 🛒

A top-down 8-racer trolley-dash racing game set across Singapore parks and roads.

## Tracks

| # | Track | Location |
|---|-------|----------|
| 1 | **East Coast Park** | Coastal path along East Coast Park Service Road |
| 2 | **Bishan-Ang Mo Kio Park** | River-valley loop through Bishan-AMK Park |
| 3 | **Sentosa Circuit** | High-speed island circuit weaving through Sentosa's resort roads |

Track waypoints are derived from **OpenStreetMap** data via the Overpass API (see `scripts/scrapeTrackData.js`).

## Racers

8 racers per race:

| Index | Name | Colour |
|-------|------|--------|
| 0 | **You** (Player) | Gold |
| 1 | Ali | Red |
| 2 | Mei | Blue |
| 3 | Kumar | Green |
| 4 | Siti | Orange |
| 5 | Raj | Purple |
| 6 | Bao | Pink |
| 7 | Rani | Cyan |

## Controls

| Key | Action |
|-----|--------|
| ↑ | Accelerate |
| ↓ | Brake / reverse |
| ← | Steer left |
| → | Steer right |

## Getting Started

```bash
npm install
npm run dev        # open http://localhost:3000
npm run build      # production build → dist/
npm run scrape     # refresh OSM map data → data/tracks/
```

## Project Structure

```
TrolleyDash/
├── index.html
├── vite.config.js
├── src/
│   ├── main.js            # Phaser game bootstrap
│   ├── config.js          # game constants (speed, racers, etc.)
│   ├── entities/
│   │   └── Racer.js       # player + AI trolley entity
│   ├── scenes/
│   │   ├── MenuScene.js
│   │   ├── TrackSelectScene.js
│   │   ├── RaceScene.js
│   │   ├── HUDScene.js
│   │   └── ResultsScene.js
│   └── tracks/
│       ├── trackLoader.js  # scales waypoints to viewport
│       ├── eastCoastPark.js
│       ├── bishanPark.js
│       └── sentosa.js
├── scripts/
│   └── scrapeTrackData.js  # Overpass API scraper
└── data/
    └── tracks/             # scraped GeoJSON output (generated)
```

## Tech Stack

- **[Phaser 3](https://phaser.io/)** – HTML5 game engine
- **[Vite](https://vitejs.dev/)** – build tool / dev server
- **[OpenStreetMap / Overpass API](https://overpass-api.de/)** – map data source

## Next Steps (for Codex)

- Replace rectangle trolley graphics with proper sprite sheets
- Add camera follow / zoom for the player trolley
- Implement off-track grass slowing and collision detection
- Add sound effects and music
- Persist high scores to localStorage
- Mobile touch controls
