class StringsData{
    constructor()
    {
        this.data =
        {
            loadingAssets: "Loading assets text",
            unauthorized: "Unauthorized text",
            loadingVideo: "Loading Video text",
            waitingZidoAPI: "Waiting Zido API Text",

            "start" : "اِبْدَأْ",
            "phase" : "%1 مستوى  ",
        };
    }
}

_t = function(string) {
    var r = string;
    for(var i = 1; i < arguments.length; i++) {
        r = r.replace('%' + i, arguments[i]);
    }
    return r;
}