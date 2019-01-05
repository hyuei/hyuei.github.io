class PreloadScreen {
    constructor(game) {

    }

    preload() {

        var textOption = { font: "20px Arial", fill: "#ffff00", boundsAlignH: "center", boundsAlignV: "middle" };
        this.text = this.game.add.text(0, 0, STRINGS_DATA.data.loadingAssets, textOption);
        this.text.setTextBounds(0, 0, game.world.width, game.world.height);

        game.plugins.add(PhaserNineSlice.Plugin);
        game.plugins.add(StateTransition);
        game.plugins.add(Phaser.Plugin.Fade);

        var gameImageAssets = new GameImageAssets();
        gameImageAssets.loadAsset(game);

        var gameAudioAssets = new GameAudioAssets();
        gameAudioAssets.loadAsset(game);


        game.load.nineSlice('dialogue-box', 'assets/dialogue-box.png', 800, 80, 800, 80);

        TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.Shop_Prolog);
        TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.Shop_End);
        TALKING_DATA.loadAudios(game, TALKING_DATA.talkingdata.Shop_Fail);

        game.load.bitmapFont('arabnumbers', 'assets/fonts/arabnumber.png', 'assets/fonts/arabnumber.fnt');

        this.game.add.text(0, 0, "fix", { font: "1px Harmattan", fill: "#FFFFFF" });
        this.game.add.text(0, 0, "fix", { font: "1px Vag", fill: "#FFFFFF" });
    }

    create() {
        console.log("Preload screen");

        // this.game.state.start("ZidoScreen");


        // this.game.state.start("CookGameScreen");
        this.game.state.start("StartScreen");
    }
}