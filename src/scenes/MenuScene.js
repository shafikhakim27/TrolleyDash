import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { ALL_TRACKS } from '../tracks/trackLoader.js';

/**
 * Main menu scene – shows the game title and a "Play" button.
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Background
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e);

    // Title
    this.add.text(GAME_WIDTH / 2, 130, 'TROLLEY', {
      fontSize: '72px',
      fontStyle: 'bold',
      color: '#ffdd00',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 210, 'DASH', {
      fontSize: '72px',
      fontStyle: 'bold',
      color: '#ff4444',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 285, 'Singapore Racing', {
      fontSize: '22px',
      color: '#aaaacc',
    }).setOrigin(0.5);

    // Play button
    const btn = this.add.rectangle(GAME_WIDTH / 2, 390, 260, 60, 0xffdd00)
      .setInteractive({ useHandCursor: true });
    this.add.text(GAME_WIDTH / 2, 390, 'PLAY', {
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#1a1a2e',
    }).setOrigin(0.5);

    btn.on('pointerover',  () => btn.setFillStyle(0xffee66));
    btn.on('pointerout',   () => btn.setFillStyle(0xffdd00));
    btn.on('pointerdown',  () => this.scene.start('TrackSelectScene'));

    // Controls hint
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 40,
      '↑ Accelerate   ↓ Brake   ← → Steer', {
        fontSize: '14px',
        color: '#666688',
      }).setOrigin(0.5);
  }
}
