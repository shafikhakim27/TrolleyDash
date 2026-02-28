import Phaser from 'phaser';
import { GAME_WIDTH, NUM_RACERS, NUM_LAPS, RACER_COLOURS, RACER_NAMES } from '../config.js';

/**
 * HUDScene – transparent overlay drawn on top of RaceScene.
 * Displays: countdown, lap counter, race timer, position leaderboard.
 */
export class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HUDScene' });
  }

  init(data) {
    this.raceScene = data.raceScene;
  }

  create() {
    // Position badge (top-left)
    this.positionText = this.add.text(20, 20, 'P1 / 8', {
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#ffdd00',
      stroke: '#000000',
      strokeThickness: 4,
    });

    // Lap counter (top-centre)
    this.lapText = this.add.text(GAME_WIDTH / 2, 20, `LAP 1 / ${NUM_LAPS}`, {
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0);

    // Timer (top-right)
    this.timerText = this.add.text(GAME_WIDTH - 20, 20, '0:00.00', {
      fontSize: '22px',
      color: '#aaffaa',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(1, 0);

    // Mini leaderboard (right panel)
    this.leaderItems = [];
    for (let i = 0; i < NUM_RACERS; i++) {
      const y = 80 + i * 22;
      const dot = this.add.circle(GAME_WIDTH - 115, y, 5, RACER_COLOURS[i]);
      const txt = this.add.text(GAME_WIDTH - 106, y, `${i + 1}. ${RACER_NAMES[i]}`, {
        fontSize: '12px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(0, 0.5);
      this.leaderItems.push({ dot, txt });
    }

    // Countdown overlay
    this.countdownText = this.add.text(GAME_WIDTH / 2, 260, '', {
      fontSize: '100px',
      fontStyle: 'bold',
      color: '#ffdd00',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5);

    // Speed indicator (bottom-left)
    this.speedText = this.add.text(20, 540, '0 km/h', {
      fontSize: '18px',
      color: '#aaaaff',
      stroke: '#000000',
      strokeThickness: 3,
    });
  }

  update() {
    const rs = this.raceScene;
    if (!rs) return;

    // Countdown
    if (!rs.raceStarted) {
      const cd = rs.countDown;
      this.countdownText.setText(cd > 0 ? String(cd) : 'GO!');
    } else {
      this.countdownText.setText('');
    }

    const player = rs.racers && rs.racers[0];
    if (!player) return;

    // Position
    this.positionText.setText(`P${player.racePosition} / ${NUM_RACERS}`);

    // Lap
    const lap = Math.min(player.lapCount + 1, NUM_LAPS);
    this.lapText.setText(`LAP ${lap} / ${NUM_LAPS}`);

    // Timer
    const t = rs.raceTimer;
    const min  = Math.floor(t / 60);
    const sec  = Math.floor(t % 60).toString().padStart(2, '0');
    const ms   = Math.floor((t % 1) * 100).toString().padStart(2, '0');
    this.timerText.setText(`${min}:${sec}.${ms}`);

    // Speed (px/s → approx km/h for fun)
    const kmh = Math.round(player.speed * 0.18);
    this.speedText.setText(`${kmh} km/h`);

    // Leaderboard
    const sorted = [...rs.racers].sort((a, b) => a.racePosition - b.racePosition);
    sorted.forEach((r, i) => {
      const item = this.leaderItems[i];
      if (!item) return;
      const label = r.isPlayer ? `★ ${r.name}` : r.name;
      item.txt.setText(`${r.racePosition}. ${label}`);
      item.dot.setFillStyle(RACER_COLOURS[r.racerIndex]);
      item.txt.setColor(r.isPlayer ? '#ffdd00' : '#ffffff');
    });
  }
}
