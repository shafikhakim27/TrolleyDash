import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, NUM_RACERS, NUM_LAPS, RACER_NAMES } from '../config.js';
import { ALL_TRACKS, loadTrack } from '../tracks/trackLoader.js';
import { Racer } from '../entities/Racer.js';

/**
 * RaceScene – the main gameplay loop.
 *
 * Lifecycle
 *   create()  – build track, spawn 8 racers, set up HUD
 *   update()  – tick racers, update HUD, check finish
 */
export class RaceScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RaceScene' });
  }

  init(data) {
    this.trackId = data.trackId || ALL_TRACKS[0].id;
  }

  create() {
    // Load and scale the track
    const raw = ALL_TRACKS.find(t => t.id === this.trackId) || ALL_TRACKS[0];
    this.trackData = loadTrack(raw);

    // Race state
    this.raceTimer    = 0;
    this.countDown    = 3;
    this.raceStarted  = false;
    this.raceFinished = false;
    this.finishOrder  = [];

    // Draw track
    this._drawTrack();

    // Spawn racers
    this.racers = [];
    for (let i = 0; i < NUM_RACERS; i++) {
      this.racers.push(new Racer(this, i, NUM_LAPS, this.trackData.waypoints));
    }

    // Sort by start position depth (for visual overlap)
    this.racers.forEach(r => this.children.bringToTop(r));

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // HUD (runs in a separate scene layered on top)
    this.scene.launch('HUDScene', { raceScene: this });

    // Count-down timer
    this.time.delayedCall(1000, () => this._tick());
  }

  _tick() {
    this.countDown--;
    if (this.countDown > 0) {
      this.time.delayedCall(1000, () => this._tick());
    } else {
      this.raceStarted = true;
    }
  }

  _drawTrack() {
    const g     = this.add.graphics();
    const wp    = this.trackData.waypoints;
    const w     = this.trackData.trackWidthPx;

    // Background
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x2d5a27);

    // Track surface
    g.lineStyle(w, 0x555566, 1);
    g.beginPath();
    wp.forEach(([x, y], i) => { i === 0 ? g.moveTo(x, y) : g.lineTo(x, y); });
    g.closePath();
    g.strokePath();

    // Track edge – outer
    g.lineStyle(w + 6, 0xffffff, 0.25);
    g.beginPath();
    wp.forEach(([x, y], i) => { i === 0 ? g.moveTo(x, y) : g.lineTo(x, y); });
    g.closePath();
    g.strokePath();

    // Centre dashed line
    g.lineStyle(2, 0xffff00, 0.5);
    for (let i = 0; i < wp.length; i++) {
      const [ax, ay] = wp[i];
      const [bx, by] = wp[(i + 1) % wp.length];
      const mid = i % 2 === 0;
      if (mid) {
        g.beginPath();
        g.moveTo(ax, ay);
        g.lineTo(bx, by);
        g.strokePath();
      }
    }

    // Start / finish line
    const [sx, sy] = wp[0];
    const [sx2, sy2] = wp[1];
    const angle = Math.atan2(sy2 - sy, sx2 - sx) + Math.PI / 2;
    const hw = w * 0.6;
    g.lineStyle(4, 0xffffff, 1);
    g.beginPath();
    g.moveTo(sx + Math.cos(angle) * hw, sy + Math.sin(angle) * hw);
    g.lineTo(sx - Math.cos(angle) * hw, sy - Math.sin(angle) * hw);
    g.strokePath();

    // Track name
    this.add.text(10, 10, this.trackData.name, {
      fontSize: '13px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    });
  }

  update(time, delta) {
    if (!this.raceStarted || this.raceFinished) return;

    this.raceTimer += delta / 1000;

    // Update all racers
    this.racers.forEach(r => r.update(delta, this.cursors));

    // Sort positions
    const sorted = [...this.racers].sort((a, b) => b.distanceTravelled - a.distanceTravelled);
    sorted.forEach((r, i) => { r.racePosition = i + 1; });

    // Collect newly-finished racers
    this.racers.forEach(r => {
      if (r.finished && !this.finishOrder.includes(r)) {
        this.finishOrder.push(r);
      }
    });

    // Race ends when all 8 are done, or the player finishes
    const player = this.racers[0];
    if (player.finished || this.finishOrder.length === NUM_RACERS) {
      this.raceFinished = true;
      this.time.delayedCall(2000, () => this._endRace());
    }
  }

  _endRace() {
    const results = this.finishOrder.map((r, pos) => ({
      position:   pos + 1,
      name:       r.name,
      isPlayer:   r.isPlayer,
      finishTime: r.finishTime,
    }));
    // Fill any not-yet-finished racers at end of list
    this.racers.forEach(r => {
      if (!this.finishOrder.includes(r)) {
        results.push({
          position:   results.length + 1,
          name:       r.name,
          isPlayer:   r.isPlayer,
          finishTime: null,
        });
      }
    });

    this.scene.stop('HUDScene');
    this.scene.start('ResultsScene', { results, trackName: this.trackData.name });
  }
}
