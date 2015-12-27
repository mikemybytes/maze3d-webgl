var STATS = {

};

$(function() {

    STATS.init = function() {
        G.stats = new Stats();
        G.stats.setMode(0);

        G.stats.domElement.style.position = 'absolute';
        G.stats.domElement.style.left = '0px';
        G.stats.domElement.style.top = '0px';

        document.body.appendChild( G.stats.domElement );
    };

    STATS.update = function() {
        G.stats.update();
    };

});
