BootScreen = function(game){

}

BootScreen.prototype = {
    preload:function() {
        Asset.png('loading_bar');       
        Asset.png('bg');
        Asset.png('grey-bg');
        Asset.png('star-particle');
        Asset.png('dialogue-box');
        Asset.atlaspng('ingame');
        // Asset.atlaspng('preloader');
        
        transition.loadAsset();
        game.load.enableParallel = true;
        game.load.useXDomainRequest = true;

        CustomStorage.loadAll();
        
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        assignOrientationChangeHandlers();

        this.isReady = false;
    },
    
    create:function() {
        console.log("Boot");

        // zido loading
        // game.state.start("ZidoScreen");

        // game.state.start("StartScreen");

        transition.create();

        // game.state.start("PreloadScreen");
    },

    update:function(){
        if(!this.isReady){
            this.isReady = true;
            // transition.close("Game1Screen");
            // transition.close("PreloadScreen");
            // game.state.start('PreloadScreen')
            game.state.start('PreloadScreen')
        }
    },
}