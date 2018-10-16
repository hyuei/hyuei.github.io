class ZidoVideoScreen 
{
    constructor(game)
    {
        this.calledAPI = false;

        this.videoFinished = false;
    }
    
    preload() 
    {
        console.log("Loading video from url: " + VIDEO_INTRO_URL);
        // game.add.text(100, 100, "Loading videos ...", { font: "65px Arial", fill: "#ff0044" });

        var textOption = {font: "20px Arial", fill: "#ffff00", boundsAlignH: "center", boundsAlignV: "middle" };
        this.text = this.game.add.text(0,0, STRINGS_DATA.data.loadingVideo, textOption);
        this.text.setTextBounds(0, 0, game.world.width, game.world.height);

        game.load.video('zidovideo', VIDEO_INTRO_URL, 'canplaythrough', true);
        this.game.input.onDown.add(this.skipVideo, this);
    }

    create() 
    {
        this.video = game.add.video('zidovideo');
        this.video.height = this.game.height;
        this.videoSprite = this.video.addToWorld();

        var videoScale = Math.min(this.game.width / this.video.width, this.game.height / this.video.height);
        this.videoSprite.scale.set(videoScale);
        
        this.video.play();

    }

    update() 
    {
        if(this.videoFinished) return;
        if(this.video != null && this.videoSprite != null)
        {
            // if(!this.video.exists || !this.videoSprite.exists) return;
            var videoScale = Math.min(this.game.width / this.video.width, this.game.height / this.video.height);
            this.videoSprite.scale.set(videoScale);
        
            if(this.video.currentTime >= this.video.duration && !this.videoFinished)
            {
                console.log("=====================call next screen=====================");
                this.videoFinished = true;
                this.nextScreen();
            }
        }
    }

    skipVideo(){
        if(this.video != null && this.videoSprite != null){
            if(!this.videoFinished && CustomStorage.data['videoWatched']){
                this.videoFinished = true;
                // game.stage.removeChild(this.videoSprite);
                // game.stage.removeChild(this.video);
                this.nextScreen();
            }
        }
    }

    nextScreen()
    {
        // this.game.state.start("StartScreen");
        this.video.destroy();
        this.videoSprite.destroy();

        this.game.input.onDown.remove(this.skipVideo, this);

        CustomStorage.save('videoWatched', true);

        var userData = {};
        userData.videoWatched = true;
        var data = JSON.stringify({
            "data":CustomStorage.data,
        });

        console.log(data)
        
        var ref = this;
        ZIDO.post(data, 
            function(result){
                console.log("Succeed post watched data" + result);
                // ref.state.start(SCREEN_MANAGER.getNext());
                // ref.state.start("StartScreen");
                transition.close('PreloadScreen')
            }, 
            function(error){
                console.log("Error post watched data:" + error);
                // ref.state.start(SCREEN_MANAGER.getNext());
                ref.state.start("PreloadScreen")
                // transition.close('PreloadScreen')
            }
        );        
    }
}
