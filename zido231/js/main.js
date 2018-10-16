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
ZIDO_API.sendData();

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
var game = new Phaser.Game(desiredWidthRatio, desiredHeightRatio, Phaser.CANVAS, 'forestrun');




var SCREEN_MANAGER = new StateScreenManager(game, 
    [
        // "OpeningScreen",
        // "Game1Screen",
        // "Game2Screen",
        // "Game3Screen",
        // "Game4Screen",  
        // "Game5Screen",
        // "Game6Screen",
        // "ClosingScreen"
    ]
);
game.state.add("ZidoScreen", ZidoScreen);
game.state.add("ZidoVideoScreen", ZidoVideoScreen);
game.state.add("BootScreen", BootScreen);
game.state.add("PreloadScreen", PreloadScreen);
game.state.add("MenuScreen", MenuScreen);
game.state.add("OpeningScreen", OpeningScreen);
game.state.add("StartScreen", StartScreen);
game.state.add("Game1Screen", Game1Screen);
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
game.state.start("BootScreen");
