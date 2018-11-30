var ZIDO_VALIDATION = 0;
var ZIDO = new ZidoConnect();
ZIDO.listenMessageEvent(
    function(result)
    {
        ZIDO_VALIDATION = result;
        console.log('ZIDO_VALIDATION', result);
    }
);

var ZIDO_API = new ZidoAPI();
console.log(ZIDO)
// ZIDO_API.sendData();

var TALKING_DATA = new TalkingData();
var STRINGS_DATA = new StringsData();
var TALKER_HEIGHT = 152;
var VIDEO_INTRO_URL = "";

var desiredWidthRatio = 960;
var desiredHeightRatio = 540;

var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

console.log(windowWidth + ":" + windowHeight);

// scale based on height
var height = windowHeight;

var ratio = windowHeight/desiredHeightRatio;

var width = desiredWidthRatio * ratio;

var TRANSITION = new TransitionCollections();
// var game = new Phaser.Game(desiredWidthRatio, desiredHeightRatio, Phaser.CANVAS, 'main-game');

window.addEventListener("load", function() {

    // Phaser.Device.whenReady(function() {
        helper.init();

        global.logicWidth = 960;
        global.logicHeight = 540;
        global.mobileLandscape = true;
        // global.landscape = false;
        global.simulatedMobile = false;
        global.forceWidth =  false;
        global.astrid = true;

        window.createPhaser = function() {
            var SCREEN_MANAGER = new StateScreenManager(game, 
                [
                    // "OpeningScreen",
                ]
            );
            
            //By default we set 
            // device canvas size 
            //  Add the States your game has.
            //  You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
            game.state.add("ZidoScreen", ZidoScreen);
            game.state.add("ZidoVideoScreen", ZidoVideoScreen);
            // game.state.add("BootScreen", BootScreen);
            game.state.add("BootScreen", BasicGame.Boot);
            game.state.add("PreloadScreen", PreloadScreen);
            game.state.add("StartScreen", StartScreen);
            game.state.add("Game1Screen", Game1Screen);
            game.state.start("BootScreen");
        }

        helper.initOnLoad();
    // });
});

// game.state.add("ZidoScreen", ZidoScreen);
// game.state.add("ZidoVideoScreen", ZidoVideoScreen);
// // game.state.add("BootScreen", BootScreen);
// game.state.add("BootScreen", BasicGame.Boot);
// game.state.add("PreloadScreen", PreloadScreen);
// game.state.add("MenuScreen", MenuScreen);
// game.state.add("OpeningScreen", OpeningScreen);
// game.state.add("StartScreen", StartScreen);
// game.state.add("Game1Screen", Game1Screen);
// game.state.add("Game2Screen", Game2Screen);
// game.state.add("Game3Screen", Game3Screen);
// game.state.add("Game4Screen", Game4Screen);
// game.state.add("Game5Screen", Game5Screen);
// game.state.add("Game6Screen", Game6Screen);
// game.state.add("ClosingScreen", ClosingScreen);

// game.state.add("DesignerScreen", DesignerScreen);
// level design screen
// game.state.start("DesignerScreen");

// real game starting screen
// game.state.start("BootScreen");
