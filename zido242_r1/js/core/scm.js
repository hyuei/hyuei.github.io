 // ----------------------------------------------------------------------------------------------
 // DYNAMICALLY CHANGE VIEWPORT FOR SPECIFIC PLATFORM FIX
 // ----------------------------------------------------------------------------------------------
var mvp = document.getElementById('vpr');

if (mvp == null || mvp == undefined) {
    mvp = document.querySelector("meta[name=viewport]");
}

if (mvp == null || mvp == undefined) {
}
 
mvp.parentNode.removeChild(mvp);

viewport = document.createElement('meta');
viewport.name = 'viewport';

var content = "initial-scale=1.0, maximum-scale=1.01, minimum-scale=1.0, user-scalable=no,width=device-width, minimal-ui";

if (platform.name == "IE Mobile") {
   content = 'initial-scale=0.9, maximum-scale=0.9, minimum-scale=0.9, user-scalable=no,width=device-width,minimal-ui';
} 
// fix for android 4 stock browser
else if (platform.os.family == "Android" && platform.name == "Android Browser" && parseInt(platform.os.version,10) < 5){
    content = 'width=device-width';
}

viewport.content = content;
document.head.appendChild(viewport);

BasicGame = {
    score: 0,
    music: null,
    orientated: false
};

window.helper = {}
helper.init = function() {
    //global.printObj(platform)
    var ua = navigator.userAgent;
    var bAndroid = boolean = (/Android/.test(ua));
    var bChrome= boolean = (/Chrome/.test(ua));
    var bXiaomi = boolean = (/XiaoMi/.test(ua));
    if (bXiaomi) {
        helper.phaserMode = Phaser.CANVAS;
    }
    else if (platform.os.family == "Windows Phone" && platform.name == "IE Mobile") {
        helper.phaserMode = Phaser.CANVAS;
    } else if (bAndroid && !bChrome ) {
        helper.phaserMode = Phaser.CANVAS;
    } else {
        helper.phaserMode = Phaser.AUTO;
    }
}

helper.preCreatePhaser = function() {
        global.webFontReady = false;
        if (global.webFontArr == undefined || global.webFontArr == null) {
            global.webFontReady = true;
        }
        //  The Google WebFont Loader will look for this object, so create it before loading the script.
        WebFontConfig = {
            
            active: function() { 
                setTimeout(function() {
                    global.webFontReady = true;
                }, 1000);
            },

            //  The Google Fonts we want to load (specify as many as you like in the array)
            google: {
              families: global.webFontArr
            }
        };

        
        global.deviceWidth = window.innerWidth;
        global.deviceHeight = window.innerHeight;
        deviceSizeCheckIntervalID = setInterval(deviceSizeCheck, 1);

        BasicGame.logicWidth = global.logicWidth;
        BasicGame.logicHeight = global.logicHeight;

        window.regainIncorrectOrientation = true;

        global.processScaling();
        
        window.game = null;
            console.log("pre createPhaser", Phaser.Device);

        Phaser.Device.onInitialized.add(function() {
            console.log("INITIALISESSDES");
            if (global.forceWidth || (global.astrid && global.landscape == false && Phaser.Device.desktop) || (!Phaser.Device.desktop && global.astrid)) {
                window.addEventListener("resize", auto_resize_area, false);
                auto_resize_area();
                auto_resize_area_id = setInterval(initOnce, 3000);
                setInterval(auto_resize_area, 1000);
            } else if (global.simulatedMobile == true) {
                window.addEventListener("resize", init_refresh_page, false);
            }

            if (global.astrid == true) {
                // if responsive mode
                if (Phaser.Device.desktop && global.landscape == true){
                    window.regainIncorrectOrientation = true;
                    //window.addEventListener("resize", resizeResponsive, false); 
                } else if (Phaser.Device.desktop == false) {
                    // window.addEventListener("resize", init_refresh_page, false);
                }
                //document.getElementById('game').style.width =   (window.innerWidth-2) + 'px';
                //document.getElementById('game').style.height =  (window.innerHeight-2) + 'px';
                auto_refresh_page_id2 = setInterval(auto_refresh_page, 1000);
                document.getElementById('main-game').style.overflow = "hidden";
                // if (Phaser.Device.desktop == true) {
                //     document.getElementById('main-game').style.overflow = "hidden";
                // }
            }
            
            window.addEventListener('orientationchange', orientationchange);
            window.addEventListener("resize", orientationchange, false);
            // (optional) Android doesn't always fire orientationChange on 180 degree turns
            setInterval(orientationchange, 1000);
            setInterval(forceScroll, 20);
        });

        window.game = new Phaser.Game(BasicGame.gameWidth,BasicGame.gameHeight, helper.phaserMode, window.brimCanvasElement);

        window.createPhaser();
        
        if (
            (platform.os.family == 'iOS' && parseInt(platform.os.version, 10) >= 8)
            && (platform.name == "Safari")
            && ("standalone" in window.navigator) && !window.navigator.standalone
         ) {
            Phaser.DOM.getOffset = function (element, point) {

                    point = point || new Phaser.Point();

                    var box = element.getBoundingClientRect();

                    var scrollTop = Phaser.DOM.scrollY;
                    var scrollLeft = Phaser.DOM.scrollX;
                    var clientTop = document.documentElement.clientTop;
                    var clientLeft = document.documentElement.clientLeft;

                    point.x = box.left + scrollLeft - clientLeft;
                    point.y = box.top + scrollTop - clientTop;

                    point.x = Math.floor(point.x / 2);
                    point.y = Math.floor(point.y / 2);
                    return point;
            }
        }

}

// ====================================================================================================
// init var and functions right after window.onLoad event
helper.initOnLoad = function() {
    var scream;
    var brim;
    
    //IS ALREAD LOADED
    var firstTime = true;
    
    //APPEND CANVAS TO THIS ELEMENT
    var brimCanvasElement = 'game';

    if(firstTime)
    {
        //alert("flag b")
        //DO ONLY ONCE AT STARTUP
        firstTime = false;
        //SET THE RIGHT DOM ELEMENT
        document.querySelector('#game').style.display = 'block';
        window.brimCanvasElement = 'game';
        //CREATE PHASER CANVAS
        helper.preCreatePhaser();
    }
    
}

// ====================================================================================================
// Generic vars and functions definitions

var temp_scroll_x = 10;
function forceScroll() {
    if (Phaser.Device.desktop || game.canvas == null || game.canvas == undefined || document.getElementById('game') == undefined || document.getElementById('game') == null) {
        return;
    }
    
    if (temp_scroll_x == 10) {
        temp_scroll_x = -10;
        document.getElementById('orientation').innerHTML = '.';
    } else {
        temp_scroll_x = 10;
        document.getElementById('orientation').innerHTML = '..';
    }
}

helper.constraintResponsive = function() {
    if (window.deviceSizeCheckIntervalID)
        clearInterval(window.deviceSizeCheckIntervalID);
    window.deviceSizeCheckIntervalID = setInterval(window.deviceSizeCheck, 1);
}

function resizeResponsive() {
    if (!game)
        return;

    if (!game.scale)
        return;

    if (!global.scaleStage)
        return;

    document.getElementById('game').style.width =   (window.innerWidth) + 'px';
    document.getElementById('game').style.height =  (window.innerHeight) + 'px';
}

function auto_resize_area() {
    var default_aspect_ratio = true;
            
    var original_width = game.width; var original_height = game.height;

    var optimal_aspect_ratio = original_width / original_height; 
    var device_aspect_ratio = window.innerWidth  / window.innerHeight;
    var optimal_width = window.innerWidth; var optimal_height = window.innerHeight;
    
    if (default_aspect_ratio == true) {
        if (device_aspect_ratio > optimal_aspect_ratio) 
            optimal_width = window.innerHeight * optimal_aspect_ratio;
         else 
            optimal_height = window.innerWidth / optimal_aspect_ratio;
    } else {
        optimal_width = window.innerHeight / optimal_aspect_ratio;
        optimal_height = window.innerWidth * optimal_aspect_ratio;
    }

    document.getElementById('game').style.width =   (window.innerWidth) + 'px';
    document.getElementById('game').style.height =  (window.innerHeight) + 'px';

    if (game.canvas) {
        game.canvas.style.width =   optimal_width + 'px';
        game.canvas.style.height =  optimal_height + 'px';
        document.getElementById('orientation').style.width = window.innerWidth + 'px';
        document.getElementById('orientation').style.height = window.innerHeight + 'px';
        game.canvas.style.marginLeft =    'auto';
        game.canvas.style.marginRight =    'auto';
    }

    init_refresh_page();
}

var oldInnerWidth = window.innerWidth;
var oldInnerHeight = window.innerHeight;
global.hasOrientationChanged = false;

var auto_refresh_page_id = -1;
var auto_refresh_page_id2 = -1;
global.forceReloadFlag = false;
function init_refresh_page () {
    // body...
    auto_refresh_page_id = setTimeout(auto_refresh_page, 1500);
}

function get_current_ori () {
    var currentOrientation = ""

    if (window.innerWidth > window.innerHeight) {
        return "landscape"
    } else {
        return "portrait"
    }
}

function auto_refresh_page() {
    if (Phaser.Device.desktop == true)
        return;
    
    var newInnerWidth = window.innerWidth;
    var newInnerHeight = window.innerHeight;
    var dw = Math.abs(oldInnerWidth - newInnerWidth);
    var dh = Math.abs(oldInnerHeight - newInnerHeight);

    global.dw = dw;
    global.dh = dh;

    var currentOrientation = get_current_ori();

    if ((
        (((currentOrientation == "portrait" && global.landscape == false) || (currentOrientation == "landscape" && global.landscape == true))
            )
        && (global.hasOrientationChanged)
    ) || (

        (((currentOrientation == "portrait" && global.landscape == false) || (currentOrientation == "landscape" && global.landscape == true))
            ) &&
        (global.forceReloadFlag == true)
      )
    )
    {
        if (global.forceWidth == false && global.forceReloadFlag == true) {
            clearInterval(auto_refresh_page_id);
            clearInterval(auto_refresh_page_id2);
            location.reload();
            //alert("flag b")
        } else {
            console.log("CORRECT ORI")
            document.getElementById('orientation').style.display = 'none';
        }
    }

    if ((global.hasOrientationChanged && currentOrientation == "landscape" && global.landscape == true) 
        || (global.hasOrientationChanged && currentOrientation == "portrait" && global.landscape == false)
    ) {
        global.hasOrientationChanged = false;
    }

    if ((currentOrientation == "portrait" && global.landscape == false) || (currentOrientation == "landscape" && global.landscape == true)) {
        oldInnerWidth = newInnerWidth;
        oldInnerHeight = newInnerHeight
    }
    
    if(global.hasOrientationChanged == true){
        oldInnerWidth = newInnerWidth;
        oldInnerHeight = newInnerHeight
        global.hasOrientationChanged = false;
    }

    if ((currentOrientation == "portrait" && global.mobileLandscape == true) || (currentOrientation == "landscape" && global.mobileLandscape == false)) {        
        document.getElementById('orientation').style.display = 'block';
    } else if((currentOrientation == 'landscape' && global.mobileLandscape == true) || (currentOrientation == 'portrait' && global.mobileLandscape == false)){
        setTimeout(function(){
            document.getElementById('orientation').style.display = 'none'  
        }, 1500);
    }
}

function initOnce() {
    auto_resize_area();
    clearInterval(auto_resize_area_id)
}

var previousOrientation = get_current_ori();
function orientationchange() {
     var curOri = get_current_ori();
    if(curOri !== previousOrientation){
        previousOrientation = curOri;
        global.hasOrientationChanged = true;
    }
}

var deviceSizeCheckIntervalID;
function deviceSizeCheck() {
    global.deviceWidth = window.innerWidth;
    global.deviceHeight = window.innerHeight;
}

/**Injecting no border code for Phaser.ScaleManager*/

MyScaleManager = {};
//MyScaleManager.NO_BORDER = 3;
MyScaleManager.oldInnerW = -777
MyScaleManager.oldInnerH = -777

MyScaleManager.oldRatio = -777
MyScaleManager.setScreenSize = function (force) {
        if (typeof force == 'undefined')
        {
            force = true;
        }

        if (game.device.iPad === false && game.device.webApp === false && game.device.desktop === false)
        {
            if (game.device.android && game.device.chrome === false)
            {
                window.scrollTo(0, 1);
            }
            else
            {
                window.scrollTo(0, 0);
            }
        }

        if (global.forceWidth == true || (Phaser.Device.desktop == true && global.astrid == true && global.landscape == false)){
            //game.scale._iterations--;
        }


        // console.log("flag 22b force : " + force + " - global.deviceHeight : " + global.deviceHeight 
        //          + " - startHeight : " + game.scale._startHeight
        //          + " - game.scale._iterations : " + game.scale._iterations
        //     )

        if (    force )
        {
            if (
                (game.scale.incorrectOrientation === true && Phaser.Device.desktop === false)
                || (window.regainIncorrectOrientation == undefined && Phaser.Device.desktop === true && game.scale.incorrectOrientation === true)
            )
            {
                //game.scale.setMaximum();
            }
            else if (!game.scale.isFullScreen)
            {
                MyScaleManager.setNoBorder();//Don't call setSize
                return;
            }
            else
            {
                MyScaleManager.setNoBorder();//Don't call setSize
                return;
            }
        }

}

MyScaleManager.setNoBorder = function(){
        this.ow = parseInt(game.scale.width,10);
        this.oh = parseInt(game.scale.height,10);
        this.ratio = Math.max(global.deviceWidth/this.ow,global.deviceHeight/this.oh);
        game.scale.setUserScale(this.ratio, this.ratio, 0, 0)

        this.ow *= this.ratio;
        this.oh *= this.ratio

        this.reverseRatio = BasicGame.gameHeight/this.oh;
}

MyScaleManager.setNoBorder2 = function(){
        //game.scale.setShowAll();
        //console.log("setNoBorder game.scale.w/h : "+ game.scale.width + " - " + game.scale.height)
        this.ow = parseInt(game.width,10);
        this.oh = parseInt(game.height,10);

        var tempRatio = Math.max(global.deviceWidth/this.ow,global.deviceHeight/this.oh);

        this.ratio = tempRatio;

        game.scale.setUserScale(this.ratio, this.ratio, 0, 0)

        this.ow *= this.ratio;
        this.oh *= this.ratio

        this.reverseRatio = 1/this.ratio;

         if (this.ratio == this.oldRatio) {
            this.onSizeChange();
         }

         this.oldRatio = this.ratio;
}

function isRetina(){
    return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
}

MyScaleManager.onSizeChange = function(){
        if (((Phaser.Device.desktop === true && global.landscape == true && global.astrid)||(Phaser.Device.desktop ===  false && global.astrid)) && window.regainIncorrectOrientation)
        {
            var mx = Math.round((global.deviceWidth - this.ow) / 2);
            if (global.astrid) {
                /*console.log("------------ SAPI " + platform.os.family + "," +platform.os.version 
                    + "," + platform.name + "-" + window.navigator.standalone
                    )  */
               
                if (
                    (platform.os.family == 'iOS' && parseInt(platform.os.version, 10) >= 8)
                    && (platform.name == "Safari")
                    && ("standalone" in window.navigator) && !window.navigator.standalone
                    && isRetina()
                 ) {
                    mx = Math.round(mx * 2);
                }
                // document.getElementById('game').style.marginLeft =   mx + "px"
                document.getElementById('game').style.marginLeft =   0 + "px"
                document.getElementById('main-game').style.width =  (global.deviceWidth) + 'px';
            }
        }
        else
        {
            if (Phaser.Device.desktop && global.astrid)
                document.getElementById('game').style.marginLeft =   + "0px"
        }

        // _g.isRetina = isRetina();

        if (((Phaser.Device.desktop === true && global.landscape == true && global.astrid)||(Phaser.Device.desktop ===  false && global.astrid)) && window.regainIncorrectOrientation)
        {
           var my = Math.round((global.deviceHeight - this.oh) / 2);
           //console.log("my " + my + " - deviceHeight : " + global.deviceHeight + " - this oh " + this.oh)
           if (
                    (platform.os.family == 'iOS' && parseInt(platform.os.version, 10) >= 8)
                    && (platform.name == "Safari")
                    && ("standalone" in window.navigator) && !window.navigator.standalone
                    && isRetina()
                 ) {
                my = Math.round(my * 2);
               // _g.v11 = true;
           }

            // document.getElementById('game').style.marginTop =   my + "px"
            document.getElementById('game').style.marginTop =   0 + "px"
            document.getElementById('main-game').style.height =  (global.deviceHeight) + 'px';
        }
        else
        {
           document.getElementById('game').style.marginTop =   "0px"
        }

        if (global.forceWidth) {
            //console.log("aaa")
            /*game.canvas.style.marginLeft = '0px';
            game.canvas.style.marginTop = '0px';*/
        }

        var device =  global.phaserDevice;
        if(!(device.desktop && global.simulatedMobile) == true){
            //console.log("checkOrientationState")
           // game.scale.checkOrientationState();
        }

       if(game.scale.scaleMode==Phaser.ScaleManager.USER_SCALE){
            BasicGame.viewX = (MyScaleManager.ow/2 - global.deviceWidth/2)*MyScaleManager.reverseRatio;
            BasicGame.viewY = (MyScaleManager.oh/2 - global.deviceHeight/2 - 1)*MyScaleManager.reverseRatio;
            BasicGame.viewRight = BasicGame.gameWidth-BasicGame.viewX;
            
            BasicGame.viewBottom = BasicGame.gameHeight-BasicGame.viewY;
            BasicGame.viewWidth = BasicGame.viewRight - BasicGame.viewX; 
            BasicGame.viewHeight = BasicGame.viewBottom - BasicGame.viewY; 
            
        }else{
            BasicGame.viewX = 0;
            BasicGame.viewY = 0;
            BasicGame.viewRight = BasicGame.gameWidth;
            BasicGame.viewBottom = BasicGame.gameHeight;
            BasicGame.viewWidth = BasicGame.gameWidth;
            BasicGame.viewHeight = BasicGame.gameHeight;
        }
        global.init();
        var curState = game.state.getCurrentState()
        if (curState.onResize){
            curState.onResize();
        }
}