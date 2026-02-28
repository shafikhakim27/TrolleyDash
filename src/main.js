import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config.js';
import { MenuScene }        from './scenes/MenuScene.js';
import { TrackSelectScene } from './scenes/TrackSelectScene.js';
import { RaceScene }        from './scenes/RaceScene.js';
import { HUDScene }         from './scenes/HUDScene.js';
import { ResultsScene }     from './scenes/ResultsScene.js';

const config = {
  type: Phaser.AUTO,
  width:  GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#1a1a2e',
  scene: [MenuScene, TrackSelectScene, RaceScene, HUDScene, ResultsScene],
  physics: { default: 'arcade' },
  parent: document.body,
};

new Phaser.Game(config);
