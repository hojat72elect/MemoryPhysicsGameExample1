// CLASS TO PRELOAD ASSETS

// this class extends Scene class
export class PreloadAssets extends Phaser.Scene {

    // constructor
    constructor() {
        super({
            key : 'PreloadAssets'
        });
    }

    // method to be executed during class preloading
    preload(): void {

        // this is how we preload a sprite sheet
        this.load.spritesheet('tiles', 'assets/img/tiles.png', {
            frameWidth: 136,
            frameHeight: 136
        });

        // this is how we preload an image
        this.load.image('wall', 'assets/img/wall.png');
	}

    // method to be called once the instance has been created
	create(): void {

        // call PlayGame class
        this.scene.start('PlayGame');
	}
}
