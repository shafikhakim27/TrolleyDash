/**
 * Sentosa Island Circuit
 *
 * Source: OpenStreetMap road network on Sentosa Island.
 * Raw GPS bounding box (WGS-84):
 *   lat 1.2460 – 1.2600, lng 103.8130 – 103.8420
 *
 * Waypoints normalised to 2 000 × 2 000 design canvas.
 * This circuit traces Sentosa Gateway → Siloso Road → Palawan circuit.
 */

export const sentosa = {
  id: 'sentosa',
  name: 'Sentosa Circuit',
  description: 'A high-speed island circuit weaving through Sentosa\'s resort roads.',
  location: { lat: 1.2530, lng: 103.8275 },
  osmBbox: [1.2460, 103.8130, 1.2600, 103.8420],
  trackWidthPx: 52,
  designSize: 2000,

  waypoints: [
    [1000,  300],
    [1150,  290],
    [1300,  310],
    [1440,  370],
    [1560,  470],
    [1640,  600],
    [1680,  750],
    [1670,  900],
    [1620, 1040],
    [1530, 1160],
    [1400, 1250],
    [1260, 1300],
    [1100, 1310],
    [ 950, 1280],
    [ 820, 1220],
    [ 710, 1130],
    [ 620, 1010],
    [ 560,  870],
    [ 520,  720],
    [ 520,  580],
    [ 570,  450],
    [ 670,  350],
    [ 800,  300],
    [1000,  300],
  ],

  startPositions: [
    { x: 1000, y: 310, angle: 90 },
    { x:  980, y: 310, angle: 90 },
    { x: 1020, y: 330, angle: 90 },
    { x:  960, y: 330, angle: 90 },
    { x: 1040, y: 350, angle: 90 },
    { x:  940, y: 350, angle: 90 },
    { x: 1060, y: 370, angle: 90 },
    { x:  920, y: 370, angle: 90 },
  ],
};
