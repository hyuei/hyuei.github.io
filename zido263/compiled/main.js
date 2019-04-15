"use strict";
exports.__esModule = true;
var StateManager_1 = require("./StateManager");
var Startup = (function () {
    function Startup() {
    }
    Startup.main = function () {
        console.log('Update gak sih asd  asd asdadad');
        var config = {
            title: "Hello World",
            parent: "game",
            input: {
                keyboard: true,
                mouse: true
            },
            width: 320,
            height: 480
        };
        var game = new Phaser.Game(config);
        var sm = new StateManager_1.StateManager(game);
        sm.startGame();
        return 0;
    };
    return Startup;
}());
Startup.main();
//# sourceMappingURL=main.js.map