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
var GunkerbatGame = (function (_super) {
    __extends(GunkerbatGame, _super);
    function GunkerbatGame(scene) {
        var _this = _super.call(this, scene) || this;
        console.log("Gunkerbatgame");
        return _this;
    }
    return GunkerbatGame;
}(Phaser.GameObjects.Group));
exports.GunkerbatGame = GunkerbatGame;
//# sourceMappingURL=GunkerbatGame.js.map