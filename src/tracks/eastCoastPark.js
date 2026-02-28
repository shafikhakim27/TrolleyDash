/**
 * East Coast Park – Coastal Track
 *
 * Source: OpenStreetMap ways along East Coast Park Service Road / Coastal Path.
 * Raw GPS bounding box (WGS-84):
 *   lat 1.2970 – 1.3020, lng 103.8960 – 103.9480
 *
 * Waypoints are normalised to a 2 000 × 2 000 design canvas then scaled by
 * TrackLoader to fit the game viewport.  They describe the centre-line of the
 * racing surface; track width is given in the metadata.
 */

export const eastCoastPark = {
  id: 'east_coast_park',
  name: 'East Coast Park',
  description: 'A scenic coastal dash along East Coast Park Service Road.',
  location: { lat: 1.2995, lng: 103.9220 },
  osmBbox: [1.2970, 103.8960, 1.3020, 103.9480],
  trackWidthPx: 48,
  designSize: 2000,

  /** Centre-line waypoints [x, y] in design-canvas coordinates (0–2000). */
  waypoints: [
    [120, 1000],
    [180,  960],
    [270,  920],
    [400,  900],
    [540,  895],
    [680,  900],
    [800,  920],
    [920,  950],
    [1040,  990],
    [1160, 1020],
    [1280, 1040],
    [1400, 1050],
    [1520, 1040],
    [1640, 1010],
    [1760,  960],
    [1860,  900],
    [1920,  840],
    [1960,  780],
    [1970,  700],
    [1940,  630],
    [1880,  570],
    [1800,  530],
    [1700,  510],
    [1580,  520],
    [1460,  550],
    [1340,  580],
    [1200,  590],
    [1060,  570],
    [920,   540],
    [780,   530],
    [640,   550],
    [510,   590],
    [400,   640],
    [300,   710],
    [230,   790],
    [180,   880],
    [150,   960],
    [120,  1000],
  ],

  /** Grid start positions relative to design canvas (angle in degrees). */
  startPositions: [
    { x: 120, y: 1020, angle: 0 },
    { x: 120, y:  980, angle: 0 },
    { x: 150, y: 1040, angle: 0 },
    { x: 150, y:  960, angle: 0 },
    { x: 180, y: 1060, angle: 0 },
    { x: 180, y:  940, angle: 0 },
    { x: 210, y: 1050, angle: 0 },
    { x: 210, y:  950, angle: 0 },
  ],
};
