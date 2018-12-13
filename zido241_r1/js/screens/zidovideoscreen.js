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
    }

    create() 
    {
        this.video = game.add.video('zidovideo');
        this.video.height = this.game.height;
        this.videoSprite = this.video.addToWorld();
        
        this.video.play();

        var videoScale = Math.min(this.game.width / this.video.width, this.game.height / this.video.height);
        this.videoSprite.scale.set(videoScale);

    }

    update() 
    {
        if(this.video != null && this.videoSprite != null)
        {
            
            var videoScale = Math.min(this.game.width / this.video.width, this.game.height / this.video.height);
            this.videoSprite.scale.set(videoScale);
        
            if(this.video.currentTime >= this.video.duration && !this.videoFinished)
            {
                console.log("=====================call next screen=====================");
                this.nextScreen();
                this.videoFinished = true;
            }
        }
    }

    nextScreen()
    {
        // this.game.state.start("StartScreen");
        //var userData = {};
        //userData.videoWatched = true;
        var userData = JSON.stringify({
            "videoWatched":true
        });
        
        var ref = this;
        ZIDO.post(userData, 
            function(result){
                console.log("Succeed post watched data" + result);
                // ref.state.start(SCREEN_MANAGER.getNext());
                ref.state.start("StartScreen");
            }, 
            function(error){
                console.log("Error post watched data:" + error);
                // ref.state.start(SCREEN_MANAGER.getNext());
                ref.state.start("StartScreen")
            }
        );

        
    }
}
