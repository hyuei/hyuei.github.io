"use strict";
exports.__esModule = true;
var GameScene_1 = require("./scenes/GameScene");
var StateManager = (function () {
    function StateManager(game) {
        this.game = null;
        this.states = new Array();
        this.game = game;
        var gameScene = new GameScene_1.GameScene();
        this.game.scene.add("GameScene", gameScene);
    }
    StateManager.prototype.startGame = function () {
        this.game.scene.start("GameScene");
    };
    return StateManager;
}());
exports.StateManager = StateManager;
//# sourceMappingURL=StateManager.js.map