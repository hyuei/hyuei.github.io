class PreloadScreen
{
    constructor(game)
    {

    }

    preload()
    {

        var textOption = {font: "20px Arial", fill: "#ffff00", boundsAlignH: "center", boundsAlignV: "middle" };
        this.text = this.game.add.text(0,0, STRINGS_DATA.data.loadingAssets, textOption);
        this.text.setTextBounds(0, 0, game.world.width, game.world.height);

        game.plugins.add(PhaserNineSlice.Plugin);
        game.plugins.add(StateTransition);
        game.plugins.add(Phaser.Plugin.Fade);
        
        var gameImageAssets = new GameImageAssets();
        gameImageAssets.loadAsset(game);
        gameImageAssets.loadAtlas(game);

        var gameAudioAssets = new GameAudioAssets();
        gameAudioAssets.loadAsset(game);


        game.load.nineSlice('dialogue-box', 'assets/images/dialogue-box.png', 800, 80, 800, 80);

        TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.Prologue);
        TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.EndFailed);
        TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.EndFinish);

        game.load.bitmapFont('arabnumbers', 'assets/fonts/arabnumber.png', 'assets/fonts/arabnumber.fnt');

        //game.load.onFileComplete.add(this.checkFileComplete, this);

        this.game.add.text(0, 0, "fix", {font:"1px Harmattan", fill:"#FFFFFF"});
        this.game.add.text(-20, 0, "0", {font:"1px vag", fill:"#000000"});
    }

    checkFileComplete(progress, cacheKey, success, totalLoaded, totalFiles){
        console.log("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles +" file name :" + cacheKey);
    }

    create()
    {
        console.log("Preload screen");
        this.game.state.start("ZidoScreen"); //should call this
        //this.game.state.start("StartScreen"); // im jumping into game because want to focus finishing game
    }
}