var FIREWALL = {

};


$(function() {
    var _active = false;
    var _particleCount = 75;
    var _position = {
        row: 0,
        column: 0
    };

    var _particleSystem;
    var _particles = {};
    var _particleRefreshPerSecond = 15;
    var _firewallShowInterval = 2500;

    FIREWALL.init = function() {
        _particles = new THREE.Geometry();
        var particleMaterial = new THREE.ParticleBasicMaterial({
            color: 0xFFFFFF,
            size: 1,
            map: THREE.ImageUtils.loadTexture("img/particle.png"),
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        var bounds = getBounds();

        for (var p = 0; p < _particleCount; ++p) {
            var pX = randomInt(bounds.minX, bounds.maxX),
                pY = randomInt(bounds.minY, bounds.maxY),
                pZ = randomInt(bounds.minZ, bounds.maxZ),
                particle = new THREE.Vector3(pX, pY, pZ);

            particle.velocity = new THREE.Vector3(
                Math.random() * randomSign(),
                Math.random() * randomSign(),
                Math.random() * randomSign()
            );

            _particles.vertices.push(particle);
        }

        _particleSystem = new THREE.ParticleSystem(_particles, particleMaterial);
        _particleSystem.visible = false;

        G.scene.add(_particleSystem);

        setTimeout(activateNearestFirewall, _firewallShowInterval);

        setTimeout(updateParticles, 1000 / _particleRefreshPerSecond);
    };

    function activateNearestFirewall() {
        MAZE3D.activateNearestFirewall();
        setTimeout(deactivateFirewall, _firewallShowInterval);
    }

    function deactivateFirewall() {
        MAZE3D.deactivateFirewall();
        setTimeout(activateNearestFirewall, _firewallShowInterval);
    }

    function updateParticles() {
        if (! _active || ! _particleSystem.visible) {
            setTimeout(updateParticles, 1000 / _particleRefreshPerSecond);
            return;
        }

        var bounds = getBounds();
        for (i= 0; i < _particleCount; ++i) {
            var particle = _particles.vertices[i];
            var x = particle.x,
                y = particle.y,
                z = particle.z;
            if (x < bounds.minX || x > bounds.maxX) {
                particle.velocity.x *= -1;
            }
            if (y < bounds.minY || y > bounds.maxY) {
                particle.velocity.y *= -1;
            }
            if (z < bounds.minZ || z > bounds.maxZ) {
                particle.velocity.z *= -1;
            }
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.z += particle.velocity.z;
        }
        _particleSystem.geometry.verticesNeedUpdate = true;

        setTimeout(updateParticles, 1000 / _particleRefreshPerSecond);
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomSign() {
        return Math.random() < 0.5 ? -1 : 1;
    }

    function getBounds() {
        var row = _position.row;
        var column = _position.column;
        var boxSizeHalf = G.boxSize / 2;
        return {
            minX: -boxSizeHalf,
            maxX: boxSizeHalf,
            minY: -boxSizeHalf,
            maxY: boxSizeHalf,
            minZ: -boxSizeHalf,
            maxZ: boxSizeHalf
        };
    }

    FIREWALL.activateAt = function(row, column) {
        console.log("Activating firewall at [" + row + "][" + column + "]");

        _position.row = row;
        _position.column = column;

        _particleSystem.position.x = row * G.boxSize;
        _particleSystem.position.z = column * G.boxSize;

        _active = true;
        _particleSystem.visible = true;
    };

    FIREWALL.deactivate = function() {
        console.log("Deactivating firewall");

        _active = false;
        _particleSystem.visible = false;
    };

});
