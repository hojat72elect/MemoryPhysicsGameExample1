// THE GAME ITSELF

import * as planck from 'planck';
import { GameOptions } from './gameOptions';
import { PhysicsBox } from './physicsBox';
import { PhysicsWall } from './physicsWall';
import { toMeters, toPixels } from './planckUtils';

// this class extends Scene class
export class PlayGame extends Phaser.Scene {

    // Box2d world
    world : planck.World;

    // variable to store game width, in pixels
    gameWidth: number;

    // variable to store game height, in pixels
    gameHeight : number;

    // array where to store the two selected boxes
    selectedBoxes : planck.Body[];

    // constructor
    constructor() {
        super({
            key: 'PlayGame'
        });
    }

    // method to be executed when the scene has been created
    create() : void {  

        // save game width and height in a variable
        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;

        // world gravity, as a Vec2 object. It's just a x, y vector
        let gravity = new planck.Vec2(0, GameOptions.gameGravity); 
        
        // this is how we create a Box2D world
        this.world = new planck.World(gravity);

        // add static physics boxes
        new PhysicsWall(this, this.world, this.gameWidth / 2, this.gameHeight - 20, this.gameWidth, 40);
        new PhysicsWall(this, this.world, 20, this.gameHeight / 2, 40, this.gameHeight);
        new PhysicsWall(this, this.world, this.gameWidth - 20, this.gameHeight / 2, 40, this.gameHeight);

        // time event to place the first boxes
        let firstTimeEvent : Phaser.Time.TimerEvent = this.time.addEvent({

            // event delay, in milliseconds
            delay : 200,

            // how many times do we repeat the event?
            repeat : GameOptions.startingBoxes,

            // callback function
            callback: () => {

                // add a new physics box
                new PhysicsBox(this, this.world, Phaser.Math.Between(100, this.gameWidth - 100), -100, GameOptions.boxSize, GameOptions.boxSize, GameOptions.timeBeforeHide);
               
                // is this the last time we have to repeat the event?
                if (firstTimeEvent.repeatCount == 0) {
 
                    // time event to place the remaining boxes
                    this.time.addEvent({

                        // event delay, in milliseconds
                        delay : GameOptions.boxDelay,
                        
                        // callback function
                        callback : () => {

                            // add a new physics box
                            new PhysicsBox(this, this.world, Phaser.Math.Between(100, this.gameWidth - 100), -100, 100, 100, GameOptions.timeBeforeHide);
                        },

                        // repeat the event forever
                        loop : true
                    });
                }
            }
        });

        // array where to store the two selected boxes
        this.selectedBoxes = [];

        // input listener
        this.input.on('pointerdown', this.selectBox, this);    
    }

    // method to select a box
    selectBox(event : Phaser.Input.Pointer) : void {
 
        // did we select less than 2 boxes?
        if (this.selectedBoxes.length < 2) {

            // loop through all bodies
            for (let body : planck.Body = this.world.getBodyList() as planck.Body; body; body = body.getNext() as planck.Body) {

                // loop through all fixtures
                for (let fixture : planck.Fixture = body.getFixtureList() as planck.Fixture; fixture; fixture = fixture.getNext() as planck.Fixture) {

                    // if the fixture contains the input coordinate...
                    if (fixture.testPoint(new planck.Vec2(toMeters(event.x), toMeters(event.y)))) {

                        // get body userData
                        let userData : any = body.getUserData();

                        // if the body is dynamic and covered
                        if (body.isDynamic() && userData.covered) {

                            // show actual box face
                            userData.sprite.setFrame(userData.value);
                            
                            // the box is no longer covered
                            userData.covered = false;

                            // push the box in selectedBoxes array
                            this.selectedBoxes.push(body);

                            // does selectedBoxes array contain two boxes?
                            if (this.selectedBoxes.length == 2) {

                                // wait 1/2 seconds
                                this.time.addEvent({

                                    // event delay, in milliseconds
                                    delay : 500,
                                    
                                    // callback function
                                    callback : () => {

                                        // get userData of both boxes
                                        let userData : any[] = [this.selectedBoxes[0].getUserData(), this.selectedBoxes[1].getUserData()];

                                        // do boxes have the same value?
                                        if (userData[0].value == userData[1].value) {

                                            // destroy the sprites
                                            userData[0].sprite.destroy();
                                            userData[1].sprite.destroy();

                                            // destroy the bodies
                                            this.world.destroyBody(this.selectedBoxes[0]);
                                            this.world.destroyBody(this.selectedBoxes[1]);

                                        }

                                        // do boxes have different values?
                                        else {

                                            // hide boxes images
                                            userData[0].sprite.setFrame(10);
                                            userData[1].sprite.setFrame(10);

                                            // set boxes as covered
                                            userData[0].covered = true;
                                            userData[1].covered = true;
                                        }

                                        // empty selectedBoxes array
                                        this.selectedBoxes = [];
                                    }
                                })
                            }
                        }
                    }
                }
            }
        }
    }

    // method to be executed at each frame
    update() : void {
 
        // advance the simulation by 1/30 seconds
        this.world.step(1 / 30);
 
        // crearForces  method should be added at the end on each step
        this.world.clearForces();
 
        // iterate through all bodies
        for (let body : planck.Body = this.world.getBodyList() as planck.Body; body; body = body.getNext() as planck.Body) {
 
            // get body position
            let bodyPosition : planck.Vec2 = body.getPosition();
 
            // get body angle, in radians
            let bodyAngle : number = body.getAngle();
 
            // get body user data, the graphics object
            let userData : any = body.getUserData();
 
            // adjust graphic object position and rotation
            userData.sprite.x = toPixels(bodyPosition.x);
            userData.sprite.y = toPixels(bodyPosition.y);
            userData.sprite.rotation = bodyAngle;
        }
    }
}