var CAMERA = {

};

$(function() {

    CAMERA.init = function() {
        G.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        G.camera.position.x = 50;
        G.camera.position.y = 30;
        G.camera.position.z = 100;
        G.camera.lookAt(G.scene.position);
    };

    CAMERA.updatePosition = function() {
        G.camera.position.x = G.ball.position.x - 10;
        G.camera.position.z = G.ball.position.z + 10;
        G.camera.lookAt(G.ball.position);
    };

    CAMERA.handleResize = function() {
        G.camera.aspect = window.innerWidth / window.innerHeight;
        G.camera.updateProjectionMatrix();
    };

});
