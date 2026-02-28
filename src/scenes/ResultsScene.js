import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';

/**
 * ResultsScene – podium / leaderboard after a race.
 */
export class ResultsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultsScene' });
  }

  init(data) {
    this.results   = data.results   || [];
    this.trackName = data.trackName || '';
  }

  create() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e);

    // Title
    this.add.text(GAME_WIDTH / 2, 40, 'RACE RESULTS', {
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#ffdd00',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 82, this.trackName, {
      fontSize: '16px',
      color: '#aaaacc',
    }).setOrigin(0.5);

    // Results table
    const colHeaders = ['POS', 'RACER', 'TIME'];
    const colX       = [100, 280, 580];
    const headerY    = 130;

    colHeaders.forEach((h, i) => {
      this.add.text(colX[i], headerY, h, {
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#888899',
      }).setOrigin(0, 0.5);
    });

    this.add.line(0, headerY + 16, 60, 0, GAME_WIDTH - 60, 0, 0x444466)
      .setLineWidth(1);

    const posColours = { 1: '#ffdd00', 2: '#cccccc', 3: '#cc8844' };

    this.results.slice(0, 8).forEach((r, i) => {
      const y       = headerY + 40 + i * 42;
      const colour  = r.isPlayer ? '#ffdd00' : (posColours[r.position] || '#ffffff');

      // Row background for player
      if (r.isPlayer) {
        this.add.rectangle(GAME_WIDTH / 2, y, GAME_WIDTH - 80, 36, 0x2a2a4e);
      }

      this.add.text(colX[0], y, `#${r.position}`, {
        fontSize: '20px',
        fontStyle: 'bold',
        color: colour,
      }).setOrigin(0, 0.5);

      const nameLabel = r.isPlayer ? `★ ${r.name}` : r.name;
      this.add.text(colX[1], y, nameLabel, {
        fontSize: '18px',
        color: colour,
      }).setOrigin(0, 0.5);

      const timeLabel = r.finishTime !== null
        ? this._formatTime(r.finishTime)
        : 'DNF';
      this.add.text(colX[2], y, timeLabel, {
        fontSize: '18px',
        color: colour,
      }).setOrigin(0, 0.5);
    });

    // Buttons
    const btnY = GAME_HEIGHT - 60;

    const playAgain = this.add.rectangle(GAME_WIDTH / 2 - 120, btnY, 200, 46, 0xffdd00)
      .setInteractive({ useHandCursor: true });
    this.add.text(GAME_WIDTH / 2 - 120, btnY, 'PLAY AGAIN', {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#1a1a2e',
    }).setOrigin(0.5);
    playAgain.on('pointerdown', () => this.scene.start('TrackSelectScene'));

    const menu = this.add.rectangle(GAME_WIDTH / 2 + 120, btnY, 200, 46, 0x334488)
      .setInteractive({ useHandCursor: true });
    this.add.text(GAME_WIDTH / 2 + 120, btnY, 'MAIN MENU', {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);
    menu.on('pointerdown', () => this.scene.start('MenuScene'));
  }

  _formatTime(t) {
    const min = Math.floor(t / 60);
    const sec = Math.floor(t % 60).toString().padStart(2, '0');
    const ms  = Math.floor((t % 1) * 100).toString().padStart(2, '0');
    return `${min}:${sec}.${ms}`;
  }
}
