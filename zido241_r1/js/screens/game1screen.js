class Game1Screen extends GameScreen
{

    constructor(game)
    {
        super(game);
    }
    
    preload() 
    {
        game.time.advancedTiming = true;   
        if(game.score == undefined){
            game.score = 0;
        }
        if(game.timeElapsed == undefined){
            game.timeElapsed = 0;
        }
    }
    
    create()
    {
        console.log("game 1 screen");
        
        game.input.mouse.capture = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        this.numberCallingGame = new numberCallingGame(game);
        this.numberCallingGame.init(this);

        this.numberCallingGame.countingDown();

        this._enGroup = game.add.group();

        this.endgameoverlay = new EndGameOverlay(game);
        this.endgameoverlay.onRetryButtonDown.add(this.onRetryButtonDown);
        this.game.add.existing(this.endgameoverlay);

        this.createLogo();
    }
    
    createTalker()
    {

        this.talker = new Talker(game, 10, 530, game.world.width , TALKER_HEIGHT, this);
        this.game.add.existing(this.talker);
        if(this.numberCallingGame.gameTimer < 300){
            this.talker.loadTalkingArray(TALKING_DATA.talkingdata.EndFinish);
        }
        else{
            this.talker.loadTalkingArray(TALKING_DATA.talkingdata.EndFailed);
        }
        this.talker.startTalk();

        this.talker.onNext.add(this.nextTalker, this);
        this.talker.onFinish.add(function(){
            //let timer = this.numberCallingGame.updateTextTimer(this.numberCallingGame.gameTimer);
            let score = this.numberCallingGame.getScore();
            this.endgameoverlay.setTextScore(score);
            this.endgameoverlay.show();

            ZIDO_API.setScore(score);
            //this.waitAndNext();
            //var closeAudio = game.add.audio("applause", true);
            //closeAudio.play();;
        }, this);
    }

    nextTalker(){
        if(this._enGroup.length>0){
            this._enGroup.removeAll(true)
        }
    }

    onRetryButtonDown(){
        game.state.start("PrologueScreen");
    }

    update() {
        //record time
        this.numberCallingGame.timeCount(game.time.physicsElapsed);
    }

    render(){
        //game.debug.text('FPS: ' + game.time.fps || 'FPS: --', 40, 40, "#00ff00");
        //this.cleanTeethGame.renderSpriteBody();
    }

    waitAndNext() {
    }

    endGame(){
        console.log("endgame");
        this.createTalker();

        /*== you can call API score here ==*/
         var userData = JSON.stringify({
            "score":this.cleanTeethGame.gameTimer
        });
        
        ZIDO.post(userData, 
            function(result){
                //console.log("Succeed post watched data" + result);
            }, 
            function(error){
                //console.log("Error post watched data:" + error);
            }
        );
    }

    createCurtains(){
        // var curtainLeft = this.game.add.sprite(0, 0, 'curtain-halfright');
        // curtainLeft.anchor.set(0,0);
        // curtainLeft.scale.set(0.5, 1);

        // var curtainRight = this.game.add.sprite(0, 0, 'curtain-halfright');
        // curtainRight.position.set(game.width, 0);
        // curtainRight.anchor.set(1,0);
        // curtainRight.scale.set(0.5, 1);

        // // animate curtains
        // this.game.add.tween(curtainLeft.scale).to({x:0}, 800, Phaser.Easing.Exponential.Out, true, 200);
        // this.game.add.tween(curtainRight.scale).to({x:0}, 800, Phaser.Easing.Exponential.Out, true, 200);


        var graphics = game.add.graphics(0,0);
        graphics.beginFill(0x000000, 1);
        graphics.drawRect(0,0,game.width, game.height);

        game.add.tween(graphics).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0);   
    }
}
