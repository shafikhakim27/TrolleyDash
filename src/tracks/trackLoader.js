import { eastCoastPark } from './eastCoastPark.js';
import { bishanPark }    from './bishanPark.js';
import { sentosa }       from './sentosa.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';

export const ALL_TRACKS = [eastCoastPark, bishanPark, sentosa];

/**
 * Scale waypoints from the track's design canvas to the game viewport,
 * preserving aspect ratio and centring the track.
 *
 * @param {object} track  – raw track definition
 * @returns {object}      – track with scaled `waypoints` and `startPositions`
 */
export function loadTrack(track) {
  const scale = Math.min(GAME_WIDTH, GAME_HEIGHT) / track.designSize;
  const offsetX = (GAME_WIDTH  - track.designSize * scale) / 2;
  const offsetY = (GAME_HEIGHT - track.designSize * scale) / 2;

  const scalePoint = ([x, y]) => [
    x * scale + offsetX,
    y * scale + offsetY,
  ];

  const scalePos = ({ x, y, angle }) => ({
    x: x * scale + offsetX,
    y: y * scale + offsetY,
    angle,
  });

  return {
    ...track,
    scale,
    offsetX,
    offsetY,
    waypoints:      track.waypoints.map(scalePoint),
    startPositions: track.startPositions.map(scalePos),
    trackWidthPx:   track.trackWidthPx * scale,
  };
}

/**
 * Return the total arc-length of the waypoint polyline.
 * @param {number[][]} waypoints
 */
export function trackLength(waypoints) {
  let len = 0;
  for (let i = 1; i < waypoints.length; i++) {
    const dx = waypoints[i][0] - waypoints[i - 1][0];
    const dy = waypoints[i][1] - waypoints[i - 1][1];
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

/**
 * Given the current waypoint index and progress (0–1) to the next,
 * return the interpolated world position.
 */
export function waypointPosition(waypoints, index, t) {
  const a = waypoints[index];
  const b = waypoints[(index + 1) % waypoints.length];
  return {
    x: a[0] + (b[0] - a[0]) * t,
    y: a[1] + (b[1] - a[1]) * t,
  };
}
