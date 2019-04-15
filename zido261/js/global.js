global = {}

global.font1 = 'Farah';
global.font2 = 'Varela';
global.fontReady = false;

global.addText = function (xx, yy, txt, size, font, settings) {
    // console.log("webfont ready : " + global.webFontReady)
    // body...
    if (font == undefined || font == null) font = "Farah";
    if (size == undefined || size == null) size = "32";

    var text = null;
    text = game.add.text(xx, yy, txt, settings);
    //text.anchor.setTo(0.5);
    text.font = font;
    text.fontSize = size;

    return text;
}

global.findAtlasBySpriteKey = function(key) {
    var found =false;
    var val = {};
    var jsons = game.cache.getKeys(Phaser.Cache.JSON);
    for (var sKey in jsons) {
        var arr = game.cache.getJSON(jsons[sKey]).frames;
        for (var i = 0; i < arr.length; i++) {
            var p = arr[i];
            
            if (p.filename == key) {
                val.atlasKey = jsons[sKey]
                val.p = p;
                //console.log("p " + p.filename + " - key " + key + " | " + jsons[sKey])
                return val;
            }
        };
    }

    return null;

}

global.addSprite = function(x, y, key) {
    var temp = global.findAtlasBySpriteKey(key);
    if (temp == null) {
        console.log("atlas on global.add.sprite with key |" + key + "| not found on any json files")
    }

    var t = game.add.sprite(x, y, temp.atlasKey);
    t.frameName = key;

    var ssc = temp.p.spriteSourceSize;
    var dw = ssc.w - ssc.x;
    var dh = ssc.h - ssc.y;

    t.atlasName = temp.atlasKey;
    t.tempPivotX = t.pivot.x;
    t.tempPivotY = t.pivot.y;
    t.pivot.x -= ssc.x;
    t.pivot.y -= ssc.y; 
    t.dw = dw;
    t.dh = dh;

    //console.log(t.x + " - " + t.y)

    return t;
}