window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

window.log = function(a){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
  	console.log(a)
  }
};

global = {}

// ****************************************************
// bagian google webfont
// ****************************************************
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

// ****************************************************
// bagian atlas/texture handling
// ****************************************************
//global.add = {};
//global.load = {};

global.addAtlas = function(key, subfolder, png, json) {
  if (png == undefined) 
    png = key;

  if (json == undefined)
    json = png;

  if (subfolder != undefined && subfolder != "")
    subfolder = subfolder + "/"
  else if (subfolder == undefined)
    subfolder =""

  game.load.atlas(key, 'assets/'+BasicGame.screen+'/'+subfolder+png+'.png', 'assets/'+BasicGame.screen+'/'+subfolder+json+'.json');
  game.load.json(json, 'assets/'+BasicGame.screen+'/'+subfolder+json+'.json')
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

global.loadTexture = function(sprite, newKey) { 
  var temp = global.findAtlasBySpriteKey(newKey);
  sprite.loadTexture(temp.atlasKey, newKey)
  var ssc = temp.p.spriteSourceSize;
  var dw = ssc.w - ssc.x;
  var dh = ssc.h - ssc.y;

  sprite.atlasName = temp.atlasKey;
  sprite.pivot.x = sprite.tempPivotX - ssc.x;
  sprite.pivot.y = sprite.tempPivotY - ssc.y; 
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

// ****************************************************
// bagian responsive
// ****************************************************
global.processScaling = function (argument) {
  // body...
  var device = Phaser.Device;
  device.desktop = !mobileAndTabletcheck();
  
  var r = BasicGame.logicWidth/BasicGame.logicHeight;

  BasicGame.gameHeight = global.logicHeight;
  BasicGame.gameWidth = BasicGame.gameHeight*r;
};

global.cw = function(value){
    return Math.floor(value/BasicGame.logicWidth * BasicGame.gameWidth); 
  };

global.ch = function(value){
  return Math.floor(value/BasicGame.logicHeight * BasicGame.gameHeight);
};

Function.prototype.inherit = function(proto, parentClass) {
  if (parentClass) {
    this.prototype = Object.create(parentClass.prototype);
    this.prototype.$parent = parentClass;
  }

  this.prototype.constructor = this;
  extend(this.prototype, proto);
};

extend = function(obj, extObj) {

    if (arguments.length > 2) {

        for (var a = 1; a < arguments.length; a++) {

            extend(obj, arguments[a]);

        }

    } else {

        for (var i in extObj) {

            obj[i] = extObj[i];

        }

    }

    return obj;

};
