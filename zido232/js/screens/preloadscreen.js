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
        TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.ImageLockOne);
        TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.ImageLockTwo);
        TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.ImageLockThree);
        TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.ImageLockFour);
        TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.ImageLockFive);
        TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.End);
        //TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.Game4Screen_Complete);
        //TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.Game6Screen_Complete);

        game.load.bitmapFont('arabnumbers', 'assets/fonts/arabnumber.png', 'assets/fonts/arabnumber.fnt');

        this.game.add.text(0, 0, "fix", {font:"1px Harmattan", fill:"#FFFFFF"});
        this.game.add.text(-20, 0, "0", {font:"1px vag", fill:"#000000"});
    }

    create()
    {
        console.log("Preload screen");
        //this.game.state.start("ZidoScreen");
        this.game.state.start("StartScreen"); // im jumping into game because want to focus finishing game
    }
}