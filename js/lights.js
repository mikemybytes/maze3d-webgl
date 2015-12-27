var LIGHTS = {

};

$(function () {

    var _lightGroup;
    var _spotLight;

    LIGHTS.init = function() {
        _lightGroup = new THREE.Object3D();
        _lightGroup.position.x = 0;
        _lightGroup.position.y = 0;
        _lightGroup.position.z = 0;

        _lightGroup.add(createPointLightAt(-12, 0, -12));
        _lightGroup.add(createPointLightAt(12, 0, 12));
        _lightGroup.add(createPointLightAt(-12, 0, 12));
        _lightGroup.add(createPointLightAt(12, 0, -12));

        _spotLight = new THREE.SpotLight(0xffffff);
        _spotLight.onlyShadow = true;
        _spotLight.shadowCameraNear = 20;
        _spotLight.shadowCameraFar = 150;
        _spotLight.castShadow = true;

        _spotLight.position.set(G.ball.position.x, 50, G.ballPosition.z);

        G.ball.add(_spotLight);
        G.scene.add(_lightGroup);
    };

    LIGHTS.update = function() {
        _lightGroup.position.x = G.camera.position.x;
        _lightGroup.position.y = G.camera.position.y;
        _lightGroup.position.z = G.camera.position.z;

        _spotLight.position.set(G.ball.position.x, 50, G.ball.position.z);
        _spotLight.position.set(0, 50, G.ball.position.z + 10);

        _spotLight.lookAt(G.ball.position);
        _spotLight.updateMatrix();
        _spotLight.updateMatrixWorld();

        _lightGroup.lookAt(G.ball.position);

        _lightGroup.updateMatrix();
        _lightGroup.updateMatrixWorld();
    };

    function createPointLightAt(positionX, positionY, positionZ) {
        var pl = new THREE.PointLight(0xe6e6e6, 1, 50);
        pl.position.set( positionX, positionY, positionZ );
        return pl;
    }

});
