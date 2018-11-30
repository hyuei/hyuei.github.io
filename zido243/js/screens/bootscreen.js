class BootScreen
{
    constructor(game)
    {        
    }

    preload() {
        // this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.game.scale.refresh();

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        assignOrientationChangeHandlers();
    }
    
    create() {
        console.log("Boot");
       
        game.state.start("PreloadScreen");

    }
}