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
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.input.mouse.capture = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        this.carnavalMarchGame = new carnavalMarchGame(game);
        this.carnavalMarchGame.init(this);

        //this.carnavalMarchGame.countingDown();

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
            //var timer = this.carnavalMarchGame.updateTextTimer(this.carnavalMarchGame.gameTimer);
            //this.endgameoverlay.setTextScore(timer);
            //this.endgameoverlay.show();
            this.endGame();

            ZIDO_API.setScore(this.carnavalMarchGame.gameTimer);
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
        game.state.start("Game1Screen");
    }

    update() {
        //record time
        this.carnavalMarchGame.gameUpdate(game.time.physicsElapsed);
    }

    render(){
        //game.debug.text('FPS: ' + game.time.fps || 'FPS: --', 40, 40, "#00ff00");
        this.carnavalMarchGame.renderSpriteBody();
    }

    waitAndNext() {
    }

    endGame(){
        var timer = this.carnavalMarchGame.updateTextTimer(this.carnavalMarchGame.gameTimer);
        this.endgameoverlay.setTextScore(timer);
        this.endgameoverlay.show();
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
