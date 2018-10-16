class BootScreen
{
    constructor(game)
    {        
    }

    preload() {
        transition.loadAsset();

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.refresh();

        CustomStorage.loadAll();

        this.isReady = false;
    }
    
    create() {
        console.log("Boot");

        // zido loading
        // game.state.start("ZidoScreen");

        // game.state.start("StartScreen");

        transition.create();

        // game.state.start("PreloadScreen");
    }

    update(){
        if(!this.isReady){
            this.isReady = true;
            // transition.close("Game1Screen");
            // transition.close("PreloadScreen");
            game.state.start('PreloadScreen')
            // game.state.start('ZidoScreen')
        }
    }
}