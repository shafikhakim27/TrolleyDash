import Phaser from 'phaser';
import { TROLLEY, AI, RACER_COLOURS, RACER_NAMES } from '../config.js';

/**
 * Racer – a single trolley on the track.
 *
 * For the player (index 0) steering is driven by keyboard input.
 * For AI racers, a simple waypoint-following algorithm is used.
 */
export class Racer extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} index           – 0 = player, 1-7 = AI
   * @param {number} laps            – total laps in the race
   * @param {number[][]} waypoints   – scaled track waypoints
   */
  constructor(scene, index, laps, waypoints) {
    const pos = scene.trackData.startPositions[index];
    super(scene, pos.x, pos.y);

    this.racerIndex  = index;
    this.isPlayer    = index === 0;
    this.name        = RACER_NAMES[index];
    this.totalLaps   = laps;
    this.waypoints   = waypoints;
    this.colour      = RACER_COLOURS[index];

    // Race state
    this.speed           = 0;
    this.currentWaypoint = this._initialWaypointIndex(); // next waypoint to reach
    this.lapCount        = 0;
    this.racePosition    = index + 1;
    this.finished        = false;
    this.finishTime      = null;

    // AI variance: each AI gets a slightly different top speed
    this.topSpeedMult = this.isPlayer
      ? 1
      : 1 + (Math.random() * 2 - 1) * AI.topSpeedVariance;

    // Trolley body (drawn via Graphics)
    this._buildSprite(scene);

    // Name label
    this.label = scene.add.text(0, -24, this.name, {
      fontSize: '10px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
    }).setOrigin(0.5, 1);
    this.add(this.label);

    scene.add.existing(this);

    // Rotation tracks our heading in radians
    this.rotation = Phaser.Math.DegToRad(pos.angle);

    this.waypointCaptureRadius = Math.max(24, scene.trackData.trackWidthPx * 0.65);
  }

  /** Draw the trolley graphic. */
  _buildSprite(scene) {
    const g = scene.add.graphics();
    // Body
    g.fillStyle(this.colour, 1);
    g.fillRect(-14, -10, 28, 20);
    // Front indicator
    g.fillStyle(0xffffff, 0.9);
    g.fillRect(10, -4, 6, 8);
    // Wheels
    g.fillStyle(0x222222, 1);
    [[-10, -12], [8, -12], [-10, 10], [8, 10]].forEach(([wx, wy]) => {
      g.fillRect(wx, wy, 6, 4);
    });
    this.add(g);
  }

  /**
   * Main update called every frame.
   * @param {number} delta  – ms since last frame
   * @param {object} cursors – Phaser cursor keys
   */
  update(delta, cursors) {
    if (this.finished) return;

    const dt = delta / 1000;

    if (this.isPlayer) {
      this._updatePlayer(dt, cursors);
    } else {
      this._updateAI(dt);
    }

    // Move forward
    this.x += Math.cos(this.rotation) * this.speed * dt;
    this.y += Math.sin(this.rotation) * this.speed * dt;

    // Check waypoint progress
    this._checkWaypoint();
  }

  /** Player-controlled steering. */
  _updatePlayer(dt, cursors) {
    const maxSpd = TROLLEY.maxSpeed;

    if (cursors.up.isDown) {
      this.speed = Math.min(this.speed + TROLLEY.acceleration * dt, maxSpd);
    } else if (cursors.down.isDown) {
      this.speed = Math.max(this.speed - TROLLEY.brakingForce * dt, 0);
    } else {
      this.speed *= TROLLEY.friction;
    }

    if (this.speed > 5) {
      const turn = TROLLEY.turnSpeed * dt;
      if (cursors.left.isDown)  this.rotation -= turn;
      if (cursors.right.isDown) this.rotation += turn;
    }
  }

  /** Pick the next waypoint closest to the current spawn lane. */
  _initialWaypointIndex() {
    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    this.waypoints.forEach(([wx, wy], idx) => {
      const d = Phaser.Math.Distance.Between(this.x, this.y, wx, wy);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = idx;
      }
    });

    return (bestIdx + 1) % this.waypoints.length;
  }

  /** Simple waypoint-following AI. */
  _updateAI(dt) {
    const currentTarget = this.waypoints[this.currentWaypoint];
    const distanceToCurrent = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      currentTarget[0],
      currentTarget[1],
    );

    const targetIdx = distanceToCurrent > this.waypointCaptureRadius * 1.5
      ? this.currentWaypoint
      : (this.currentWaypoint + AI.lookAheadIndex) % this.waypoints.length;
    const target = this.waypoints[targetIdx];

    const dx    = target[0] - this.x;
    const dy    = target[1] - this.y;
    const desiredAngle = Math.atan2(dy, dx);
    let   diff  = Phaser.Math.Angle.Wrap(desiredAngle - this.rotation);

    const maxTurn = TROLLEY.turnSpeed * dt;
    this.rotation += Phaser.Math.Clamp(diff, -maxTurn, maxTurn);

    const maxSpd = TROLLEY.maxSpeed * this.topSpeedMult;
    this.speed   = Math.min(this.speed + TROLLEY.acceleration * dt, maxSpd);
  }

  /** Advance waypoint when close enough. */
  _checkWaypoint() {
    // Advance through one-or-more waypoints if we're already in the capture radius.
    // This makes progression robust on fast sections and tighter bends.
    let safety = 0;
    while (safety < this.waypoints.length) {
      const wp = this.waypoints[this.currentWaypoint];
      const dist = Phaser.Math.Distance.Between(this.x, this.y, wp[0], wp[1]);
      if (dist > this.waypointCaptureRadius) break;

      const prev = this.currentWaypoint;
      this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;

      // Lap completion: wrapped back around to start
      if (this.currentWaypoint === 0 && prev === this.waypoints.length - 1) {
        this.lapCount++;
        if (this.lapCount >= this.totalLaps) {
          this.finished = true;
          this.finishTime = this.scene.raceTimer;
          break;
        }
      }

      safety++;
    }
  }

  /**
   * Race distance metric used for position sorting.
   * Higher is further along.
   */
  get distanceTravelled() {
    return this.lapCount * this.waypoints.length + this.currentWaypoint;
  }
}
