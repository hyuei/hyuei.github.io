StringsData = function(){
    this.data =
    {
        loadingAssets: "Loading...",
        unauthorized: "Unauthorized text",
        loadingVideo: "Loading Video text",
        waitingZidoAPI: "Waiting Zido API Text",

        "start" : "اِبْدَأْ",
        "phase" : "%1 مستوى  ",
        "taptocontinue":"انْقُرْ لِلْمُتَابَعَةِ",
        "x" : "X %1",
        "totalscore" : "Total Score : %1",
        "target" : "هَدَف  ",
    };
}

global.font1 = 'Farah';
global.font2 = 'Varela';

_t = function(string) {
    var r = string;
    for(var i = 1; i < arguments.length; i++) {
        r = r.replace('%' + i, arguments[i]);
    }
    return r;
}

curState = function() {
    return game.state.getCurrentState();
}