BasicGame.Boot = function (game) {    
    console.log('BootScreen')        
};


BasicGame.Boot.prototype = {

    preload: function () {
        Asset.png('loading_bar');       
        // Asset.atlaspng('preloader');
        
        transition.loadAsset();
        game.load.enableParallel = true;
        game.load.useXDomainRequest = true;

        CustomStorage.loadAll();

        this.isReady = false;
        /*if (this.isCorrectOrientation() == false)
            return;*/

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        // ctransition.loadAsset();

        // csound.start();
    },

    isCorrectOrientation: function() {

        if (Phaser.Device.desktop || global.forceWidth)
            return true;

        if (window.innerWidth > window.innerHeight && global.landscape == false) {
            return false
        } else if (window.innerWidth < window.innerHeight && global.landscape == true) {
            return false
        }

        return true;
    },

    create: function () {
       /* if (this.isCorrectOrientation() == false)
           return;*/
        global.phaserDevice = Phaser.Device;

        this.input.maxPointers = 1;
        global.scaleStage = this.scaleStage;

        this.stage.disableVisibilityChange = false;

        global.scaleStage();
        
        this.onResize2CallCounter = 0;
        this.onSizeChangeCallCounter = 0;

        game.scale.setResizeCallback(this.onResize2, this)
        game.scale.onSizeChange.add(this.onSizeChange, this)

        transition.create();
    },

    update: function(){
        if (this.scaleReady == 1 && !this.isReady) {
            this.scaleReady = 2;
            this.isReady = true;
            transition.close('PreloadScreen');
            // transition.close('Game1Screen');
            // transition.close('ZidoScreen');
        }
    },

    onResize2:function(scale, parentBounds) {

        this.onResize2CallCounter++;
        if (this.onResize2CallCounter >= 400) {
            //this.onResize2CallCounter = 1;
        }
       if (this.onResize2CallCounter > 1 && helper.isInIFrameIos) 
           return

        this.onResize2CallCounter++;
        // if (global.skeletonMode)
        //   console.log("@boot ----------------------------->>>>>>>>>>> onResize2 inner " + global.deviceWidth + "-" + global.deviceHeight 
        //    +", game.scale.w/h : "+ scale.width + " - " + game.scale.height 
        //     + ", game.w/h : " + game.width + "-" + game.height
        //     + ", scaleFactor x/y " + scale.scaleFactor.x + "-" + game.scale.scaleFactor.y
        //     + ", old inner w/h " + MyScaleManager.oldInnerW
        //     + "-" + MyScaleManager.oldInnerH
        // )

       if (MyScaleManager.oldInnerW == global.deviceWidth && MyScaleManager.oldInnerH == global.deviceHeight) {
            return
        } 
        MyScaleManager.oldInnerH = global.deviceHeight
        MyScaleManager.oldInnerW = global.deviceWidth

       MyScaleManager.setNoBorder2();
    },

    onSizeChange:function(scale, parentBounds) {
        this.onSizeChangeCallCounter++;
        if (this.onSizeChangeCallCounter >= 400) {
            //this.onSizeChangeCallCounter = 1;
        }
       if (this.onSizeChangeCallCounter > 1 && helper.isInIFrameIos) 
          return


      // if (global.skeletonMode) 
      //     console.log("@boot ***********************>>> onSizeChange ------- inner " + global.deviceWidth + "-" + global.deviceHeight 
      //      +", game.scale.w/h : "+ game.scale.width + " - " + game.scale.height 
      //       + ", game.w/h : " + game.width + "-" + game.height
      //       + ", scaleFactor x/y " + scale.scaleFactor.x + "-" + game.scale.scaleFactor.y
      //       + ", game.scale.game.canvas.style.marginLeft/top " + game.canvas.style.marginLeft 
      //       + "-" + game.canvas.style.marginTop
      //      )
      MyScaleManager.onSizeChange();
      this.scaleReady = 1;
    },
    
    scaleStage:function(){

        game.scale.setMinMax(BasicGame.gameWidth/30, BasicGame.gameHeight/30, BasicGame.gameWidth*2, BasicGame.gameWidth*2)
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        // hack debug
        if (
            (Phaser.Device.desktop == true && (global.astrid == false && global.simulatedMobile == false)) 
            || (Phaser.Device.desktop == true && (global.astrid == true && global.landscape == false)) 
            || (global.forceWidth) || (!Phaser.Device.desktop && global.astrid)
        )
        {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; 
            //game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT; 
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
            //game.scale.setShowAll();
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVeritcally = true;
            game.scale.refresh();
            // if (global.skeletonMode) 
            //     console.log("SET SCALE MODE TO SHOW_ALL")
        }
        else
        {
            // if (global.skeletonMode) 
            //     console.log("ENTUT @boot.scaleStage scale.min : " + game.scale.minWidth + " - " + game.scale.minHeight
            //         + ", scale.max : " + game.scale.maxWidth + "-" + game.scale.maxHeight
            //         + ", scale.w/h : " + game.scale.width  + "-" + game.scale.height
            //     )              

            console.log("------------------------------> Platform name : " + platform.name)  
            game.scale.pageAlignHorizontally = false;
            game.scale.pageAlignVertically = false;
            game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE

            if (global.respMode == undefined || global.respMode == 0) {
                //console.log("@@@@@@@@@@@@ KUCING MIBER")
                if (global.landscape == true)
                    game.scale.forceOrientation(true, false);
                else 
                    game.scale.forceOrientation(false, true);
            }

            MyScaleManager.setNoBorder();
            //  )
        }

    },

    gameResized: function (width, height) {

        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device.
        //console.log("gameResized event : scale.width/height " + this.scale.width + " - " + this.scale.height)
        //this.scaleStage();
    },

    enterIncorrectOrientation: function () {
        BasicGame.orientated = false;
    },

    leaveIncorrectOrientation: function () {
        BasicGame.orientated = true;
    }

};