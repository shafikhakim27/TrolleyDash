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

  const scaledWaypoints = track.waypoints.map(scalePoint);
  const first = scaledWaypoints[0];
  const last = scaledWaypoints[scaledWaypoints.length - 1];
  const hasClosingDuplicate =
    scaledWaypoints.length > 1 &&
    first[0] === last[0] &&
    first[1] === last[1];

  return {
    ...track,
    scale,
    offsetX,
    offsetY,
    waypoints:      hasClosingDuplicate ? scaledWaypoints.slice(0, -1) : scaledWaypoints,
    startPositions: track.startPositions.map(scalePos),
    trackWidthPx:   track.trackWidthPx * scale,
  };
}
