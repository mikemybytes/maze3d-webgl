    function init() {
        G.scene = new THREE.Scene();

        CAMERA.init();

        G.renderer = new THREE.WebGLRenderer();
        G.renderer.setClearColor(0x000000, 1.0);
        G.renderer.setSize(window.innerWidth, window.innerHeight);
        G.renderer.shadowMapEnabled = true;

        MAZE3D.createMaze();

        BALL.create();

        LIGHTS.init();

        FIREWALL.init();

        update();

        STATS.init();

        document.getElementById('workspace').appendChild(G.renderer.domElement);

        NOTIFICATION.display('Find the way out!', 2500);

        render();
    }

    function update() {
        CAMERA.updatePosition();
        LIGHTS.update();
    }

    function render() {
        TWEEN.update();

        update();
        G.renderer.render(G.scene, G.camera);
        STATS.update();
    }

    function animate() {
        render();
        requestAnimationFrame(animate);
    }

    function handleResize() {
        CAMERA.handleResize();
        G.renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    $(function() {
        init();
        animate();
    });

    window.addEventListener('resize', handleResize, false);
