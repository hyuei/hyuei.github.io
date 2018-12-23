ZidoScreen = function(game){
        this.calledAPI = false;
};

ZidoScreen.prototype = {
    preload:function() 
    {
        this.text = null;
        this.video = null;
    },

    create:function() 
    {
        console.log("Zido");
        var textOption = {font: "20px Arial", fill: "#ffff00", boundsAlignH: "center", boundsAlignV: "middle" };
        this.text = this.game.add.text(0,0, STRINGS_DATA.data.waitingZidoAPI, textOption);
        this.text.setTextBounds(0, 0, game.world.width, game.world.height);        
    },

    update:function() 
    {        
        // console.log("get zido");
        if(ZIDO_VALIDATION === 1)
        {
            // call API just once
            if(!this.calledAPI)
            {
                this.calledAPI = true;
                var ref =this;

                // see zidoconnet.js for usage
                ZIDO.get()
                .then(function(result){
     
                    // authorized
                    ref.text.text = result;
                    console.log("RESULT:" + result);
                    var resultObject = result;

                    var videoURL = resultObject.config.introURL;

                    // set origin target
                    console.log("iframeOrigin:::" + resultObject.config.allowedDomains);
                    ZIDO.setDomainTargetOrigins(resultObject.config.allowedDomains);

                    console.log("url:" + resultObject.config.introURL);

                    // check whether iframe origin is from allowed domains
                    var currentiFrameLocation = document.domain;
                    console.log("iFrameContentWindowLocation: " + currentiFrameLocation);
                    if (ZIDO.isInTargetOrigins(currentiFrameLocation)) {
                        console.log("Is in target origins");

                        if (false && resultObject.config.enableIntroVideo){
                            var hadWatched = false;
                            // // check had watched video previously
                            if (resultObject.data && resultObject.data.hasOwnProperty("videoWatched")){
                                // CustomStorage.data.videoWatched = resultObject.data.videoWatched;
                                if (resultObject.data.videoWatched) {
                                    CustomStorage.data.videoWatched = true;
                                    CustomStorage.save('videoWatched', CustomStorage.data.videoWatched);
                                    // had watched video, then just play the game
                                    ref.nextScreen();
                                    hadWatched = true;
                                }
                            }

                            if(resultObject.data.hasOwnProperty("highScore")){
                                CustomStorage.data.highScore = resultObject.data.highScore;
                                CustomStorage.save('highScore', CustomStorage.data.highScore)
                            }

                            if (!hadWatched) {
                                VIDEO_INTRO_URL = videoURL;
                                ref.nextScreen();
                                // haven't watched before
                            }                         
                            
                            console.log("Start zido video");
                            // ref.game.state.start("ZidoVideoScreen");

                            // var data = JSON.stringify(CustomStorage.data);
                            // ZIDO_API.setData(CustomStorage.data);
                            // ZIDO_API.sendData();
                            
                            // ref.game.state.start('PreloadScreen');

                        }else{
                            // no video, then start the game immediately
                            ref.nextScreen();
                        }

                    }else{
                        console.log("Isn't in target origins");
                    }

                })
                .catch(function(result) {
                    // status 403 and 204

                    if (result === 401) {
                        ref.text.text = gameData.zido.unauthorized;
                    } else {
                        ref.text.text = gameData.zido.cantCallAPI + " :" + result;
                    }

                });

            }

        } else if(ZIDO_VALIDATION === -1){
            var textOption = {font: "20px Arial", fill: "#ffff00", align: "center"};
            this.text.text = "Fail to validate";
        } else if(ZIDO_VALIDATION === 0){
            if(!this.calledAPI){
                this.calledAPI = true
                this.nextScreen();
            }
        }
    },

    nextScreen:function()
    {
        // this.game.state.start("StartScreen");
        this.game.state.start('PreloadScreen')
        // this.game.state.start(SCREEN_MANAGER.getNext());
    },
};