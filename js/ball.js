var BALL = {

};

$(function() {

    var _ballPreviousPosition;

    function saveCurrentPositionAsPrevious() {
        _ballPreviousPosition = {
                row: G.ballPosition.row,
                column: G.ballPosition.column
        };
    }

    BALL.create = function() {
        saveCurrentPositionAsPrevious();
        createAt(G.ballPosition.row * 10, 2, G.ballPosition.column * 10);
        initMovement();
    };

    function createAt(positionX, positionY, positionZ) {
        var ballMaterial = new THREE.MeshPhongMaterial( { color: 0x3333FF, metal: false } );
        var ballGeometry = new THREE.SphereGeometry(2, 32, 32);
        G.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        G.ball.castShadow = true;

        G.ball.position.x = G.ballPosition.row * 10;
        G.ball.position.y = 2;
        G.ball.position.z = G.ballPosition.column * 10;

        G.scene.add(G.ball);
    }

    function initMovement() {
        $(document).keydown(function(e) {
            if (G.moveTweenInProgress || G.gameOver) {
                if (e.which >= 37 && e.which <= 40) {
                    e.preventDefault();
                }
                return;
            }
            switch(e.which) {
                case 37: // left
                    moveBall(MAZE3D.Moves.Left);
                    break;
                case 38: // up
                    moveBall(MAZE3D.Moves.Down);
                    break;
                case 39: // right
                    moveBall(MAZE3D.Moves.Right);
                    break;
                case 40: // down
                    moveBall(MAZE3D.Moves.Up);
                    break;
                default:
                    return;
            }
            e.preventDefault();
        });
    }

    function moveBall(direction) {
        var possibleMoves = MAZE3D.getMovesAt(G.ballPosition.row, G.ballPosition.column);
        if ($.inArray(direction, possibleMoves) == -1) {
            // illegal move
            return;
        }

        switch (direction) {
            case MAZE3D.Moves.Left:
                moveBallTo(G.ballPosition.row, G.ballPosition.column - 1);
                break;
            case MAZE3D.Moves.Up:
                moveBallTo(G.ballPosition.row - 1, G.ballPosition.column);
                break;
            case MAZE3D.Moves.Right:
                moveBallTo(G.ballPosition.row, G.ballPosition.column + 1);
                break;
            case MAZE3D.Moves.Down:
                moveBallTo(G.ballPosition.row + 1, G.ballPosition.column);
                break;
            default: return;
        }
    }

    function moveBallTo(row, column) {
        var initX = G.ballPosition.row * 10;
        var initZ = G.ballPosition.column * 10;

        var endX = row * 10;
        var endZ = column * 10;

        var currentPosition = { x: initX, y: 2, z: initZ };
        var endPosition = { x: initX + ((endX - initX) / 2), y: 7, z: initZ + ((endZ - initZ) / 2) };
        var terminatePosition = { x: endX, y: 2, z: endZ };

        G.moveTweenInProgress = true;
        var moveTween = new TWEEN.Tween(currentPosition).to(endPosition, 500);
        moveTween.onUpdate(function() {
            G.ball.position.x = currentPosition.x;
            G.ball.position.y = currentPosition.y;
            G.ball.position.z = currentPosition.z;
        });
        moveTween.easing(TWEEN.Easing.Quadratic.In);

        moveTween2 = new TWEEN.Tween(currentPosition).to(terminatePosition, 500);
        moveTween2.onUpdate(function() {
            G.ball.position.x = currentPosition.x;
            G.ball.position.y = currentPosition.y;
            G.ball.position.z = currentPosition.z;
        });
        moveTween2.onComplete(function() {
            G.moveTweenInProgress = false;

            saveCurrentPositionAsPrevious();

            G.ballPosition.row = row;
            G.ballPosition.column = column;

            MAZE3D.onBallMoveComplete();
        });
        moveTween.chain(moveTween2);
        moveTween.start();

        console.log("Moving ball from [" + G.ballPosition.row + "][" +
            G.ballPosition.column + "] to [" + row + "][" + column + "]");
    }

    BALL.moveBack = function() {
        moveBallTo(_ballPreviousPosition.row, _ballPreviousPosition.column);
        NOTIFICATION.display("Watch out!", 500);
    };

});
