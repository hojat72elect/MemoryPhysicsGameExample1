import 'phaser'
import {PreloadAssets} from "./PreloadAssets";
import {PlayGame} from "./PlayGame";

const scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'thegame',
    width: 700,
    height: 1244,
};

const configObject: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0x1dc8fc,
    scale: scaleObject,
    scene: [PreloadAssets, PlayGame],
};

window.addEventListener('load', () => {
    new Phaser.Game(configObject)
});
