PreloadScreen = function(game){

};

PreloadScreen.prototype = {
    preload:function(){
        this.gameImageAssets = new GameImageAssets();
        this.gameAudioAssets = new GameAudioAssets();

        console.log('preload preload')
        this.isReady = false;
        var textOption = {font: "20px " + global.font1, fill: "#ffff00", boundsAlignH: "center", boundsAlignV: "middle" };        

        game.plugins.add(PhaserNineSlice.Plugin);
        game.plugins.add(StateTransition);
        game.plugins.add(Phaser.Plugin.Fade);
        
        this.gameImageAssets.loadAsset(game);

        this.gameAudioAssets.loadAsset(game);

        game.load.nineSlice('dialogue-box', 'assets/dialogue-box.png', 800, 80, 800, 80);
        game.load.onFileComplete.add(this.fileComplete, this);

        transition.bg.alpha = 0;
        transition.isClosed = false;
        transition.isAnimating = false;
    },

    fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {
        // trace("CPRELOADER FILE COMPLETE");
        this.createPreloader();

        if (this.loading_hati)
            this.loading_hati.width = this.loading_hati.temp_width * (progress/100)

            var percent = progress/100;
        if (this.text_loading)
            this.text_loading.setText(progress+"%")
        if (progress == 100){
            // transition.close('StartScreen')
            transition.close('Game1Screen');
            game.load.onFileComplete.remove(this.fileComplete, this);
        }
    },

    createPreloader: function() {
        if (this.preloaderCreated) return;
        this.preloaderCreated = true;

        this.loading_hati = game.add.sprite(0,0,'loading_bar');
        this.loading_hati.x = game.width/2-this.loading_hati.width/2;       
        this.loading_hati.y = game.height/2;

        this.text_wait = game.add.text( this.loading_hati.x+this.loading_hati.width/2,this.loading_hati.y-25, STRINGS_DATA.data.loadingAssets, {
            font:"20px Arial", fill:"#FFFFFF",fontWeight:"bold", align:"center"});  
        this.text_wait.anchor.set(0.5);

        this.text_loading = game.add.text( this.loading_hati.x+this.loading_hati.width/2,this.loading_hati.y+this.loading_hati.height+25, "0%", {
            font:"20px Arial", fill:"#FFFFFF",fontWeight:"bold", align:"center"});  
        this.text_loading.anchor.set(0.5);

        this.loading_hati.temp_width = this.loading_hati.width;
        this.loading_hati.width = 0;
    },

    create:function(){
        var test1 = global.addText(0, 0, "fix", 1, global.font1)
        test1.setTextBounds(0, 0, game.world.width, game.world.height);

        var test2 = global.addText(0, 0, 'fix', 1, global.font2)
        test2.setTextBounds(0, 0, game.world.width, game.world.height);          
        
        this.gameAudioAssets.init();
    },

    update:function(){        
        if(!this.isReady){
            this.isReady = true;
        }
    }
};