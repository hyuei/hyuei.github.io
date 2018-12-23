"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var GunkerbatGame_1 = require("../GunkerbatGame");
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this, { key: "GameScene" }) || this;
        _this.btnImage = null;
        return _this;
    }
    GameScene.prototype.preload = function () {
        this.load.image("fs_btn", "assets/fs_btn.png");
    };
    GameScene.prototype.create = function () {
        var gunkerbatGame = new GunkerbatGame_1.GunkerbatGame(this);
        this.add.group(gunkerbatGame);
        this.btnImage = this.add.image(0, 0, "fs_btn");
    };
    GameScene.prototype.update = function () {
        this.btnImage.x += 1;
        this.btnImage.y += 1;
    };
    return GameScene;
}(Phaser.Scene));
exports.GameScene = GameScene;
//# sourceMappingURL=GameScene.js.map