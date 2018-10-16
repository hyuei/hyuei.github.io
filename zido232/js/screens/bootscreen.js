class BootScreen
{
    constructor(game)
    {        
    }

    preload() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.refresh();
    }
    
    create() {
        console.log("Boot");

        // zido loading
        // game.state.start("ZidoScreen");

        // game.state.start("StartScreen");

        game.state.start("PreloadScreen");

    }
}