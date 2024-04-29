/**
 * All the configurable options of the game.
 */
export const GameOptions = {

    // World scale to convert Box2D meters to pixels (1 meter = 30 pixels).
    worldScale: 30,

    // Gravity of the world.
    gameGravity: 7,

    // Number of boxes when the game starts.
    startingBoxes: 16,

    // Box size, in pixels.
    boxSize: 100,

    // delay between two boxes, in milliseconds
    boxDelay: 5000,

    // time before box value is hidden, in milliseconds
    timeBeforeHide: 2000
}
