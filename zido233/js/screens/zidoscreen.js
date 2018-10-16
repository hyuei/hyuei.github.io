class ZidoScreen 
{
    constructor(game)
    {
        this.calledAPI = false;
    }
    
    preload() 
    {
        this.text = null;
        this.video = null;
    }

    create() 
    {
        console.log("Zido");
        var textOption = {font: "20px Arial", fill: "#ffff00", boundsAlignH: "center", boundsAlignV: "middle" };
        this.text = this.game.add.text(0,0, STRINGS_DATA.data.waitingZidoAPI, textOption);
        this.text.setTextBounds(0, 0, game.world.width, game.world.height);
    }

    update() 
    {
        if(ZIDO_VALIDATION === 1)
        {
            // call API just once
            if(!this.calledAPI)
            {
                this.calledAPI = true;
                var ref =this;

                // see zidoconnet.js for usage
                ZIDO.get(function(result){
     
                    // authorized
                    ref.text.text = result;
                    console.log("RESULT:" + result);
                    var resultObject = JSON.parse(result);

                    var videoURL = resultObject.config.introURL;
                    // var videoURL = "testvid.mp4";
                    // var videoURL = "/game/testvid.mp4";

                    // set origin target
                    console.log("iframeOrigin:::" + resultObject.config.allowedDomains);
                    ZIDO.setDomainTargetOrigins(resultObject.config.allowedDomains);

                    console.log("url:" + resultObject.config.introURL);

                    // check whether iframe origin is from allowed domains
                    var currentiFrameLocation = document.domain;
                    console.log("iFrameContentWindowLocation: " + currentiFrameLocation);
                    if (ZIDO.isInTargetOrigins(currentiFrameLocation)) {
                        console.log("Is in target origins");

                        if(resultObject.config.enableIntroVideo){
                            var hadWatched = false;
                            // check had watched video previously
                            if (resultObject.data.hasOwnProperty("videoWatched")) {
                                if (resultObject.data.videoWatched) {
                                    // had watched video, then just play the game
                                    ref.nextScreen();
                                    hadWatched = true;
                                }
                            }

                            if (!hadWatched) {
                                // haven't watched before
                                VIDEO_INTRO_URL = videoURL;
                                console.log("Start zido video");
                                ref.game.state.start("ZidoVideoScreen");
                            }                         

                        }else{
                            // no video, then start the game immediately
                            ref.nextScreen();
                        }

                    }else{
                        console.log("Isn't in target origins");
                    }

                }, function(result){
                    // status 403 and 204

                    if(result === 401)
                    {
                        ref.text.text = "Unauthorized";
                    }else{
                        ref.text.text = "Can't call API. Result:" + result;
                    }

                });

            }

        }else if(ZIDO_VALIDATION === -1){
            var textOption = {font: "20px Arial", fill: "#ffff00", align: "center"};
            this.text.text = "Fail to validate";
        }
    }

    nextScreen()
    {
        this.game.state.start("MatchingGameScreen");
    }
}
