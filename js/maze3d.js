var MAZE3D = {
    Fields: {
        Empty: 0,
        Used: 1,
        FirewallOff: 2,
        FirewallOn: 3,
        Start: 4,
        Finish: 5
    },

    Moves: {
        Up: "up",
        Down: "down",
        Left: "left",
        Right: "right"
    }
};

$(function() {

    var _board = [
        [1, 4, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 2, 1, 0, 2, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 1, 0, 1, 1, 1],
        [1, 0, 0, 1, 0, 1, 1, 0, 2, 5],
        [1, 2, 1, 1, 2, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 0, 0, 2, 1, 0, 1],
        [1, 2, 0, 0, 1, 1, 0, 1, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    var _boardSize = _board.length;

    var _activeFirewallPosition = {
        row: -1,
        column: -1
    };

    var _boxMaterial;

    // Texture source: https://openclipart.org/detail/20861/brick-tile
    var _wallTextureFile = 'img/brick.jpg';

    MAZE3D.getMovesAt = function (row, column) {
        var moves = [];
        if (row > 0 && possibleLocation(row-1, column)) {
            moves.push(MAZE3D.Moves.Up);
        }
        if (row < (_boardSize - 1) && possibleLocation(row+1, column)) {
            moves.push(MAZE3D.Moves.Down);
        }
        if (column > 0 && possibleLocation(row, column-1)) {
            moves.push(MAZE3D.Moves.Left);
        }
        if (column < (_boardSize - 1) && possibleLocation(row, column+1)) {
            moves.push(MAZE3D.Moves.Right);
        }
        return moves;
    };

    function possibleLocation(row, column) {
        var field = _board[row][column];
        if (field != MAZE3D.Fields.Used && field != MAZE3D.Fields.FirewallOn) {
            return true;
        }
        return false;
    }

    MAZE3D.createMaze = function() {
        var boxTexture = THREE.ImageUtils.loadTexture( _wallTextureFile );
        boxTexture.anisotropy = G.renderer.getMaxAnisotropy();
        _boxMaterial = new THREE.MeshPhongMaterial( { map: boxTexture } );

        for (var row=0; row < _boardSize; ++row) {
            for (var column=0; column < _boardSize; ++column) {
                if (_board[row][column] === MAZE3D.Fields.Used) {
                    G.scene.add(createBoxAt(row * 10, column * 10));
                }
            }
        }

        drawFloor();
    };

    function createBoxAt(positionX, positionZ) {
        var box = new THREE.Mesh(new THREE.BoxGeometry( 10, 10, 10 ), _boxMaterial);
        box.position.x = positionX;
        box.position.y = 2;
        box.position.z = positionZ;
        box.receiveShadow = true;
        // FIXME this is quite strange...
        // box.castShadow = true;
        return box;
    }

    function drawFloor() {
        var size = _boardSize * G.boxSize + 100;
        var texture = THREE.ImageUtils.loadTexture( _wallTextureFile );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 18, 18 );

        var planeGeometry = new THREE.PlaneGeometry(size, size, 50, 50);
        var planeMaterial = new THREE.MeshLambertMaterial({ map : texture });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.castShadow = false;

        plane.rotation.x = -0.5 * Math.PI;

        plane.position.x = (_boardSize / 2) * G.boxSize;
        plane.position.y = -7;
        plane.position.z = (_boardSize / 2) * G.boxSize;

        G.scene.add(plane);
    }

    MAZE3D.activateNearestFirewall = function() {
        var maxDistance = 2;
        var bounds = {
            minRow: Math.max(G.ballPosition.row - maxDistance, 0),
            maxRow: Math.min(G.ballPosition.row + maxDistance, _boardSize),
            minColumn: Math.max(G.ballPosition.column - maxDistance, 0),
            maxColumn: Math.min(G.ballPosition.column + maxDistance, _boardSize)
        };

        var firewalls = [];

        for (var row = bounds.minRow; row <= bounds.maxRow; ++row) {
            for (var column = bounds.minColumn; column <= bounds.maxColumn; ++column) {
                if (_board[row][column] == MAZE3D.Fields.FirewallOff) {
                    firewalls.push({ row: row, column: column });
                }
            }
        }

        if (firewalls.length === 0) {
            console.log("Nearest firewall not found - skipping");
            return;
        }

        var nearest;
        var nearestDistance = Number.MAX_VALUE;
        for (var i = 0; i < firewalls.length; ++i) {
            var firewall = firewalls[i];
            var distanceRow = Math.pow(firewall.row - G.ballPosition.row, 2);
            var distanceColumn = Math.pow(firewall.column - G.ballPosition.column, 2);
            var distance = distanceRow + distanceColumn;
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = firewall;
            }
        }

        if (nearest.row == G.ballPosition.row && nearest.column == G.ballPosition.column && ! G.moveTweenInProgress) {
            BALL.moveBack();
        }

        _activeFirewallPosition.row = nearest.row;
        _activeFirewallPosition.column = nearest.column;
        _board[nearest.row][nearest.column] = MAZE3D.Fields.FirewallOn;
        FIREWALL.activateAt(nearest.row, nearest.column);
    };

    MAZE3D.deactivateFirewall = function() {
        if (_activeFirewallPosition.row == -1 || _activeFirewallPosition.column == -1) {
            return;
        }

        var row = _activeFirewallPosition.row;
        var column = _activeFirewallPosition.column;
        if (_board[row][column] == MAZE3D.Fields.FirewallOn) {
            _board[row][column] = MAZE3D.Fields.FirewallOff;
        }
        FIREWALL.deactivate();
    };

    MAZE3D.onBallMoveComplete = function() {
        var currentBoardPosition = _board[G.ballPosition.row][G.ballPosition.column];
        if (currentBoardPosition == MAZE3D.Fields.FirewallOn) {
            BALL.moveBack();
        } else if(currentBoardPosition == MAZE3D.Fields.Finish) {
            NOTIFICATION.display("You did it! Hit F5 to play again!");
            G.gameOver = true;
        }
    };

});
