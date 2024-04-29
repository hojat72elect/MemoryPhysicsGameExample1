import * as planck from 'planck';
import {toMeters} from "./PlanckUtils";

// A phaser sprite which follows planckJS physical rules.
export class PhysicsBox extends Phaser.GameObjects.Sprite {

    /**
     *
     * @param scene - The scene that I want to add this sprite to.
     * @param world
     * @param posX
     * @param posY
     * @param width
     * @param height
     * @param hideAfter
     */
    constructor(
        scene: Phaser.Scene,
        world: planck.World,
        posX: number,
        posY: number,
        width: number,
        height: number,
        hideAfter: number
    ) {

        super(scene, posX, posY, 'tiles');

        // adjust sprite display width and height
        this.displayWidth = width;
        this.displayHeight = height;

        // add sprite to scene
        scene.add.existing(this);

        // this is how we create a generic Box2D body
        let box: planck.Body = world.createBody();

        // Box2D bodies are created as static bodies, but we can make them dynamic
        box.setDynamic();

        // a body can have one or more fixtures. This is how we create a box fixture inside a body
        box.createFixture(planck.Box(toMeters(width / 2), toMeters(height / 2)));

        // now we place the body in the world
        box.setPosition(planck.Vec2(toMeters(posX), toMeters(posY)));

        // time to set mass information
        box.setMassData({

            // body mass
            mass: 1,

            // body center
            center: planck.Vec2(),

            // I have to say I do not know the meaning of this "I", but if you set it to zero, bodies won't rotate
            I: 1
        });

        // initial random value
        let randomValue: number = -1;

        // set a random value
        randomValue = Phaser.Math.Between(0, 9);

        // set sprite frame to randomValue
        this.setFrame(randomValue);

        // set a timed event to hide box image
        let timedEvent: Phaser.Time.TimerEvent = scene.time.addEvent({

            // event delay
            delay: hideAfter,

            // optional arguments: the sprite itself
            args: [this],

            // callback function
            callback: () => {

                // set frame to 10 (cover)
                this.setFrame(10);

                // get box user data
                let userData: any = box.getUserData();

                // set box as covered
                userData.covered = true;
            }
        });

        // a body can have anything in its user data, normally it's used to store its sprite
        box.setUserData({
            sprite: this,
            value: randomValue,
            covered: false,
            event: timedEvent
        });
    }
}
