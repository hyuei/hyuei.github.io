(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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
},{"./scenes/GameScene":4}],3:[function(require,module,exports){
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
},{"./StateManager":2}],4:[function(require,module,exports){
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
},{"../GunkerbatGame":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL0d1bmtlcmJhdEdhbWUudHMiLCJzY3JpcHRzL1N0YXRlTWFuYWdlci50cyIsInNjcmlwdHMvbWFpbi50cyIsInNjcmlwdHMvc2NlbmVzL0dhbWVTY2VuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7OztBQ0FBO0lBQW1DLGlDQUF3QjtJQUN2RCx1QkFBbUIsS0FBbUI7UUFBdEMsWUFDSSxrQkFBTSxLQUFLLENBQUMsU0FHZjtRQUZHLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7O0lBRWpDLENBQUM7SUFDTCxvQkFBQztBQUFELENBTkEsQUFNQyxDQU5rQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssR0FNMUQ7QUFOWSxzQ0FBYTs7OztBQ0ExQixnREFBK0M7QUFHL0M7SUFLSSxzQkFBbUIsSUFBaUI7UUFKcEMsU0FBSSxHQUFnQixJQUFJLENBQUM7UUFFekIsV0FBTSxHQUFxQixJQUFJLEtBQUssRUFBYSxDQUFDO1FBRzlDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBTWpCLElBQUksU0FBUyxHQUFjLElBQUkscUJBQVMsRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLGdDQUFTLEdBQWhCO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDTCxtQkFBQztBQUFELENBbkJBLEFBbUJDLElBQUE7QUFuQlksb0NBQVk7Ozs7QUNIekIsK0NBQThDO0FBRTlDO0lBQUE7SUFzQkEsQ0FBQztJQXJCaUIsWUFBSSxHQUFsQjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUUvQyxJQUFNLE1BQU0sR0FBZTtZQUN2QixLQUFLLEVBQUUsYUFBYTtZQUNwQixNQUFNLEVBQUUsTUFBTTtZQUNkLEtBQUssRUFBQztnQkFDRixRQUFRLEVBQUUsSUFBSTtnQkFDZCxLQUFLLEVBQUUsSUFBSTthQUNkO1lBQ0QsS0FBSyxFQUFFLEdBQUc7WUFDVixNQUFNLEVBQUUsR0FBRztTQUNkLENBQUE7UUFFRCxJQUFJLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbkMsSUFBSSxFQUFFLEdBQWdCLElBQUksMkJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFZixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0F0QkEsQUFzQkMsSUFBQTtBQUVELE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUMxQmYsa0RBQWlEO0FBRWpEO0lBQStCLDZCQUFZO0lBSXZDO1FBQUEsWUFDSSxrQkFBTSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsQ0FBQyxTQUM5QjtRQUpELGNBQVEsR0FBNEIsSUFBSSxDQUFDOztJQUl6QyxDQUFDO0lBRUQsMkJBQU8sR0FBUDtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCwwQkFBTSxHQUFOO1FBQ0ksSUFBSSxhQUFhLEdBQWtCLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUU5QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELDBCQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFTCxnQkFBQztBQUFELENBeEJBLEFBd0JDLENBeEI4QixNQUFNLENBQUMsS0FBSyxHQXdCMUM7QUF4QlksOEJBQVMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJleHBvcnQgY2xhc3MgR3Vua2VyYmF0R2FtZSBleHRlbmRzIFBoYXNlci5HYW1lT2JqZWN0cy5Hcm91cHtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihzY2VuZTogUGhhc2VyLlNjZW5lKSB7XHJcbiAgICAgICAgc3VwZXIoc2NlbmUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiR3Vua2VyYmF0Z2FtZVwiKTtcclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBHYW1lU2NlbmUgfSBmcm9tIFwiLi9zY2VuZXMvR2FtZVNjZW5lXCI7XHJcbmltcG9ydCB7IEhlbGxvU2NlbmUgfSBmcm9tIFwiLi9zY2VuZXMvSGVsbG9TY2VuZVwiXHJcblxyXG5leHBvcnQgY2xhc3MgU3RhdGVNYW5hZ2VyIHtcclxuICAgIGdhbWU6IFBoYXNlci5HYW1lID0gbnVsbDtcclxuXHJcbiAgICBzdGF0ZXM6IEFycmF5PEdhbWVTY2VuZT4gPSBuZXcgQXJyYXk8R2FtZVNjZW5lPigpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihnYW1lOiBQaGFzZXIuR2FtZSkge1xyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcblxyXG4gICAgICAgIC8vIHZhciBoZWxsb1NjZW5lOkhlbGxvU2NlbmUgPSBuZXcgSGVsbG9TY2VuZSgpXHJcbiAgICAgICAgLy8gdGhpcy5nYW1lLnNjZW5lLmFkZChcIkhlbGxvU2NlbmVcIiwgaGVsbG9TY2VuZSk7XHJcbiAgICAgICAgLy8gdGhpcy5nYW1lLnNjZW5lLnN0YXJ0KFwiSGVsbG9TY2VuZVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGdhbWVTY2VuZTogR2FtZVNjZW5lID0gbmV3IEdhbWVTY2VuZSgpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5zY2VuZS5hZGQoXCJHYW1lU2NlbmVcIiwgZ2FtZVNjZW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnRHYW1lKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5zY2VuZS5zdGFydChcIkdhbWVTY2VuZVwiKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFN0YXRlTWFuYWdlciB9IGZyb20gXCIuL1N0YXRlTWFuYWdlclwiO1xyXG5cclxuY2xhc3MgU3RhcnR1cCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIG1haW4oKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnVXBkYXRlIGdhayBzaWggYXNkICBhc2QgYXNkYWRhZCcpO1xyXG5cclxuICAgICAgICBjb25zdCBjb25maWc6IEdhbWVDb25maWcgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBcIkhlbGxvIFdvcmxkXCIsXHJcbiAgICAgICAgICAgIHBhcmVudDogXCJnYW1lXCIsXHJcbiAgICAgICAgICAgIGlucHV0OntcclxuICAgICAgICAgICAgICAgIGtleWJvYXJkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbW91c2U6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgd2lkdGg6IDMyMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0ODBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKGNvbmZpZyk7XHJcbiAgICAgICBcclxuICAgICAgICB2YXIgc206U3RhdGVNYW5hZ2VyID0gbmV3IFN0YXRlTWFuYWdlcihnYW1lKTtcclxuICAgICAgICBzbS5zdGFydEdhbWUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbn1cclxuXHJcblN0YXJ0dXAubWFpbigpOyIsImltcG9ydCB7IEd1bmtlcmJhdEdhbWUgfSBmcm9tIFwiLi4vR3Vua2VyYmF0R2FtZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVTY2VuZSBleHRlbmRzIFBoYXNlci5TY2VuZSB7XHJcblxyXG4gICAgYnRuSW1hZ2U6UGhhc2VyLkdhbWVPYmplY3RzLkltYWdlID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoeyBrZXk6IFwiR2FtZVNjZW5lXCIgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlbG9hZCgpIHtcclxuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoXCJmc19idG5cIiwgXCJhc3NldHMvZnNfYnRuLnBuZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGUoKSB7XHJcbiAgICAgICAgdmFyIGd1bmtlcmJhdEdhbWU6IEd1bmtlcmJhdEdhbWUgPSBuZXcgR3Vua2VyYmF0R2FtZSh0aGlzKTtcclxuICAgICAgICB0aGlzLmFkZC5ncm91cChndW5rZXJiYXRHYW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy5idG5JbWFnZSA9IHRoaXMuYWRkLmltYWdlKDAsIDAsIFwiZnNfYnRuXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICB0aGlzLmJ0bkltYWdlLnggKz0gMTtcclxuICAgICAgICB0aGlzLmJ0bkltYWdlLnkgKz0gMTtcclxuICAgIH1cclxuXHJcbn0iXX0=
