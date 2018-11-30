class BootScreen
{
    constructor(game)
    {        
    }

    preload() {
        //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        assignOrientationChangeHandlers();
        //resizeGame();
        /*
        var ratioWidth = windowWidth/desiredWidthRatio;
        var ratioHeight = windowHeight/desiredHeightRatio;
        if(ratioWidth<1){
            this.game.scale.setUserScale(ratioWidth, ratioWidth);
        }
        else if(ratioHeight<1){
            this.game.scale.setUserScale(ratioHeight, ratioHeight);
        }
        //this.game.scale.pageAlignVertically = true;
        this.game.scale.pageAlignHorizontally = true;
        //this.game.scale.setShowAll();
        this.game.scale.refresh();
        */
    }
    
    create() {
        console.log("Boot");

        // zido loading
        // game.state.start("ZidoScreen");

        // game.state.start("StartScreen");

        game.state.start("PreloadScreen");

    }
}