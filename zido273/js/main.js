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
// ZIDO_API.sendData();

var TALKING_DATA = new TalkingData();
var STRINGS_DATA = new StringsData();
var TALKER_HEIGHT = 152;
var VIDEO_INTRO_URL = "";

var first_timer = true;

var desiredWidthRatio = 960;
var desiredHeightRatio = 540;

var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

console.log(windowWidth + ":" + windowHeight);

// scale based on height
var height = windowHeight;

var ratio = windowHeight/desiredHeightRatio;

var width = desiredWidthRatio * ratio;

var assignOrientationChangeHandlers =  function() {
    setInterval(resizeGame, 100);
}

var resizeGame = function() {
    var ratioWidth = window.innerWidth/desiredWidthRatio;
    var ratioHeight = window.innerHeight/desiredHeightRatio;
    if(ratioWidth<ratioHeight){
        game.scale.setUserScale(ratioWidth, ratioWidth);
    }
    else{
        game.scale.setUserScale(ratioHeight, ratioHeight);
    }
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
}

// var TRANSITION = new TransitionCollections();
var game = new Phaser.Game(desiredWidthRatio, desiredHeightRatio, Phaser.CANVAS, 'game');

game.state.add("ZidoScreen", ZidoScreen);
game.state.add("ZidoVideoScreen", ZidoVideoScreen);
game.state.add("BootScreen", BootScreen);
game.state.add("PreloadScreen", PreloadScreen);
game.state.add("StartScreen", StartScreen);
game.state.add("Game1Screen", Game1Screen);
// real game starting screen
game.state.start("BootScreen");