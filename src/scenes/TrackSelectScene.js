import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, NUM_LAPS } from '../config.js';
import { ALL_TRACKS } from '../tracks/trackLoader.js';

/**
 * Track selection scene – shows the three Singapore tracks as cards.
 */
export class TrackSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TrackSelectScene' });
  }

  create() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x16213e);

    this.add.text(GAME_WIDTH / 2, 50, 'SELECT TRACK', {
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#ffdd00',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    const cardW = 280;
    const cardH = 320;
    const gap   = 30;
    const totalW = ALL_TRACKS.length * cardW + (ALL_TRACKS.length - 1) * gap;
    const startX = (GAME_WIDTH - totalW) / 2 + cardW / 2;

    ALL_TRACKS.forEach((track, i) => {
      const cx = startX + i * (cardW + gap);
      const cy = GAME_HEIGHT / 2 + 20;

      // Card background
      const card = this.add.rectangle(cx, cy, cardW, cardH, 0x0f3460)
        .setInteractive({ useHandCursor: true })
        .setStrokeStyle(2, 0x334488);

      // Mini track preview
      this._drawMiniTrack(track, cx, cy - 70, 200, 130);

      // Track name
      this.add.text(cx, cy + 60, track.name, {
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#ffffff',
        wordWrap: { width: cardW - 20 },
        align: 'center',
      }).setOrigin(0.5);

      // Description
      this.add.text(cx, cy + 100, track.description, {
        fontSize: '11px',
        color: '#aaaacc',
        wordWrap: { width: cardW - 20 },
        align: 'center',
      }).setOrigin(0.5);

      // Select button
      const btnBg = this.add.rectangle(cx, cy + 145, 180, 38, 0xffdd00);
      this.add.text(cx, cy + 145, 'RACE HERE', {
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#1a1a2e',
      }).setOrigin(0.5);

      card.on('pointerover',  () => { card.setFillStyle(0x1a4a80); btnBg.setFillStyle(0xffee66); });
      card.on('pointerout',   () => { card.setFillStyle(0x0f3460); btnBg.setFillStyle(0xffdd00); });
      card.on('pointerdown',  () => this._startRace(track));
    });

    // Back button
    const back = this.add.text(60, 50, '← Back', {
      fontSize: '18px',
      color: '#aaaacc',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on('pointerover',  () => back.setColor('#ffffff'));
    back.on('pointerout',   () => back.setColor('#aaaacc'));
    back.on('pointerdown',  () => this.scene.start('MenuScene'));
  }

  _drawMiniTrack(track, cx, cy, w, h) {
    const g = this.add.graphics();
    const scale = Math.min(w, h) / track.designSize;
    const ox = cx - track.designSize * scale / 2;
    const oy = cy - track.designSize * scale / 2;

    g.lineStyle(3, 0x44aaff, 1);
    g.beginPath();
    track.waypoints.forEach(([x, y], i) => {
      const sx = x * scale + ox;
      const sy = y * scale + oy;
      if (i === 0) g.moveTo(sx, sy);
      else         g.lineTo(sx, sy);
    });
    g.closePath();
    g.strokePath();

    // Start marker
    const sp = track.waypoints[0];
    g.fillStyle(0xffdd00, 1);
    g.fillCircle(sp[0] * scale + ox, sp[1] * scale + oy, 5);
  }

  _startRace(track) {
    this.scene.start('RaceScene', { trackId: track.id });
  }
}
