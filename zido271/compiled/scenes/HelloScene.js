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
var HelloScene = (function (_super) {
    __extends(HelloScene, _super);
    function HelloScene() {
        var _this = _super.call(this, { key: "HelloScene" }) || this;
        _this.score = 0;
        _this.image = null;
        _this.text = null;
        _this.viewKlikMouse = null;
        _this.totalKlikMouse = 0;
        _this.viewTouch = null;
        _this.totalTouch = 0;
        _this.fsSprite = null;
        _this.fullscreenFunc = null;
        console.log("constructed");
        return _this;
    }
    HelloScene.prototype.preload = function () {
        this.load.image("fs_btn", "assets/fs_btn.png");
    };
    HelloScene.prototype.init = function () {
        this.input.addPointer(1);
    };
    HelloScene.prototype.create = function () {
        console.log("init");
        var style = { color: '#df0000', fontSize: 30 };
        this.text = this.add.text(0, 0, "halo dunia", style);
        this.viewKlikMouse = this.add.text(0, 50, this.totalKlikMouse.toString());
        this.viewTouch = this.add.text(0, 100, this.totalTouch.toString());
    };
    HelloScene.prototype.update = function () {
        if (this.input.mousePointer.justDown) {
            this.totalKlikMouse++;
        }
        if (this.input.pointer1.justDown) {
            this.totalTouch++;
        }
        this.viewKlikMouse.setText("diklik:" + this.totalKlikMouse);
        this.viewTouch.setText("ditouch:" + this.totalTouch);
    };
    return HelloScene;
}(Phaser.Scene));
exports.HelloScene = HelloScene;
//# sourceMappingURL=HelloScene.js.map