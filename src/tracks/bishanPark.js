/**
 * Bishan-Ang Mo Kio Park – River Loop
 *
 * Source: OpenStreetMap paths and footways inside Bishan-Ang Mo Kio Park.
 * Raw GPS bounding box (WGS-84):
 *   lat 1.3570 – 1.3720, lng 103.8310 – 103.8500
 *
 * Waypoints normalised to 2 000 × 2 000 design canvas.
 */

export const bishanPark = {
  id: 'bishan_park',
  name: 'Bishan-Ang Mo Kio Park',
  description: 'A twisty river-valley loop through Bishan-AMK Park.',
  location: { lat: 1.3645, lng: 103.8405 },
  osmBbox: [1.3570, 103.8310, 1.3720, 103.8500],
  trackWidthPx: 44,
  designSize: 2000,

  waypoints: [
    [1000,  200],
    [1120,  220],
    [1260,  270],
    [1380,  350],
    [1470,  460],
    [1530,  590],
    [1560,  730],
    [1540,  870],
    [1490, 1000],
    [1410, 1120],
    [1300, 1220],
    [1180, 1290],
    [1040, 1320],
    [ 900, 1300],
    [ 770, 1250],
    [ 660, 1160],
    [ 580, 1050],
    [ 540,  920],
    [ 530,  780],
    [ 560,  640],
    [ 620,  520],
    [ 710,  420],
    [ 820,  340],
    [ 940,  270],
    [1000,  200],
  ],

  startPositions: [
    { x: 1000, y: 220, angle: 90 },
    { x:  980, y: 220, angle: 90 },
    { x: 1020, y: 240, angle: 90 },
    { x:  960, y: 240, angle: 90 },
    { x: 1040, y: 260, angle: 90 },
    { x:  940, y: 260, angle: 90 },
    { x: 1060, y: 280, angle: 90 },
    { x:  920, y: 280, angle: 90 },
  ],
};
