var G = {
    renderer: undefined,
    scene: undefined,
    camera: undefined,
    stats: undefined,
    params: undefined,
    cameraControl: undefined,

    ball: undefined,
    ballPosition: {
        row: 0,
        column: 1
    },
    ballMaterial: undefined,
    moveTweenInProgress: false,

    boxSize: 10,

    gameOver: false
};
