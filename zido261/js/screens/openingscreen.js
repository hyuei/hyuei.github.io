class OpeningScreen 
{
    constructor(game)
    {
        this.talker = null;
        //this.hopNumberGame = new hopNumberGame(game);
    }

    preload()
    {
        
        // draw text
        this._talker = new Talker(game, 0, game.world.height, game.world.width , TALKER_HEIGHT);
        this._talker.loadTalkingArray(TALKING_DATA.talkingdata.Game1Screen);
    }
    
    create()
    {   
        //this.hopNumberGame.init(this);
        console.log("opening screen");
        
        var textOption = {font: "65px Arial", fill: "#ffff00", align: "right"};
        var text = this.game.add.text(game.world.centerX, game.world.centerY, "intro", textOption);

        this.game.add.existing(this._talker);
        this._talker.startTalk();
        var ref = this;

        this._talker.onFinish.add(function(){ 
            ref.game.state.start(SCREEN_MANAGER.getNext(), TRANSITION.OutTransition, TRANSITION.EnteringTransition);
        });

        this.createCurtains();
    }

    update()
    { 
    }

    shutdown()
    {
        this._talker.shutdown();
    }

    createCurtains(){
        var curtainLeft = this.game.add.sprite(0, 0, 'curtain-halfright');
        curtainLeft.anchor.set(0,0);
        curtainLeft.scale.set(0.5, 1);

        var curtainRight = this.game.add.sprite(0, 0, 'curtain-halfright');
        curtainRight.position.set(game.width, 0);
        curtainRight.anchor.set(1,0);
        curtainRight.scale.set(0.5, 1);

        // animate curtains
        this.game.add.tween(curtainLeft.scale).to({x:0}, 800, Phaser.Easing.Exponential.Out, true, 200);
        this.game.add.tween(curtainRight.scale).to({x:0}, 800, Phaser.Easing.Exponential.Out, true, 200);
    }
}