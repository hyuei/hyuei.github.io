class PreloadScreen
{
    constructor(game)
    {
        // super(game);
        this.gameImageAssets = new GameImageAssets();
        this.gameAudioAssets = new GameAudioAssets();
        // global.fontReady = false;
    }

    preload()
    {
        console.log('preload preload')
        this.isReady = false;
        var textOption = {font: "20px " + global.font1, fill: "#ffff00", boundsAlignH: "center", boundsAlignV: "middle" };
        // this.text = this.game.add.text(0,0, STRINGS_DATA.data.loadingAssets, textOption);
        this.text = global.addText(0, 0,  STRINGS_DATA.data.loadingAssets, 20, 'Arial');
        this.text.fill = textOption.fill;
        this.text.boundsAlignH = 'center';
        this.text.boundsAlignV = 'middle';
        this.text.setTextBounds(0, 0, game.world.width, game.world.height);        

        game.plugins.add(PhaserNineSlice.Plugin);
        game.plugins.add(StateTransition);
        game.plugins.add(Phaser.Plugin.Fade);
        
        this.gameImageAssets.loadAsset(game);

        this.gameAudioAssets.loadAsset(game);


        game.load.nineSlice('dialogue-box', 'assets/dialogue-box.png', 800, 80, 800, 80);
        game.load.onFileComplete.add(this.fileComplete, this)
    }

    fileComplete(progress, cacheKey, success, totalLoaded, totalFiles){        
        if (progress == 100){
            transition.open();
            game.load.onFileComplete.remove(this.fileComplete, this);
        }
    }

    create()
    {
        // super.create();
        var test1 = global.addText(0, 0, "fix", 1, global.font1)
        test1.setTextBounds(0, 0, game.world.width, game.world.height);  
        // this.gBG.add(test1)
        var test2 = global.addText(0, 0, 'fix', 1, global.font2)
        test2.setTextBounds(0, 0, game.world.width, game.world.height);  
        // this.gBG.add(test2)
        
        this.gameAudioAssets.init();

        FontDetect.onFontLoaded (global.font1, function(){
            console.log('web font looks good')
        }.bind(this), function(){
            console.log('using local font')
            global.fontReady = true;
        }.bind(this), {msTimeout: 2000});
    }

    update(){
        if(!global.fontReady){
            global.fontReady = (FontDetect.isFontLoaded(global.font1) && FontDetect.isFontLoaded(global.font2));
            // console.log(global.fontReady)
            return;
        }

        if(!this.isReady && global.fontReady){
            this.isReady = true;
            transition.close('StartScreen')
            // transition.close('Game1Screen');
        }
    }
}