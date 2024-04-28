import 'phaser'
import {PreloadAssets} from "./preloadAssets";
import {PlayGame} from "./playGame";


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
}

window.addEventListener('load', () => {
    const game = new Phaser.Game(configObject)
})
