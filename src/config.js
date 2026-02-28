/** Central game configuration */
export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 576;

export const NUM_RACERS = 8;
export const NUM_LAPS = 3;
export const PLAYER_INDEX = 0; // racer 0 is human-controlled

/** Trolley physics */
export const TROLLEY = {
  maxSpeed: 220,       // px/s
  acceleration: 180,   // px/s²
  brakingForce: 320,   // px/s²
  turnSpeed: 2.8,      // rad/s at full speed
  friction: 0.96,      // velocity multiplier per frame
  offTrackMultiplier: 0.55,
};

/** AI behaviour */
export const AI = {
  lookAheadIndex: 3,   // waypoints ahead to steer towards
  topSpeedVariance: 0.12, // ±12 % speed variance between AI
};

/** Racer colours (player first) */
export const RACER_COLOURS = [
  0xffdd00, // player – gold
  0xff4444,
  0x44aaff,
  0x44ff88,
  0xff8844,
  0xcc44ff,
  0xff44cc,
  0x44ffee,
];

export const RACER_NAMES = [
  'You',
  'Ali',
  'Mei',
  'Kumar',
  'Siti',
  'Raj',
  'Bao',
  'Rani',
];
