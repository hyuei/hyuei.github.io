class StartScreen
{
    constructor(game)
    {        
    }

    preload() {
        Asset.png('btn-taptoplay')
    }
    
    create() {
        console.log("start screen");
        transition.open();
        this.isReady = false;
        SCREEN_MANAGER.init();
        console.log("current index:" + SCREEN_MANAGER._currentScreenIndex);
        
        var startButton = game.add.button(game.world.centerX, game.world.centerY, "btn-taptoplay", function(){
            // game.state.start(SCREEN_MANAGER.getNext());
            // game.state.start("Game1Screen");
            transition.close('Game1Screen')
        });
        startButton.anchor.set(0.5);
        startButton.scale.set(0);
        startButton.position.set(game.world.centerX, game.world.centerY);

        var textOption = {font: "53px Harmattan", fill: "#FFFFFF", align: "right", boundsAlignH: "right"};
        var startToPlayText = this.game.add.text(0, 0, "اِبْدَأْ اللَّعِبَ", textOption);
        startToPlayText.anchor.set(0.5);
        startButton.addChild(startToPlayText);

        this.startButton = startButton;
    }

    spawnButton(){
        var tweenBtn = this.game.add.tween(this.startButton.scale).to({x:0.7, y:0.7}, 500, Phaser.Easing.Exponential.Out, false).loop(true).yoyo(true);
        var tweenNormal = this.game.add.tween(this.startButton.scale).to({x:0.75, y:0.75}, 200, Phaser.Easing.Linear.None, false).chain(tweenBtn);
        var tweenPop = this.game.add.tween(this.startButton.scale).to({x:0.85, y:0.85}, 200, Phaser.Easing.Linear.None, true).chain(tweenNormal);
    }

    update(){
        if(transition && !transition.isClosed){
            if(!this.isReady){
                this.isReady = true;
                this.spawnButton();
            }
        }
    }
}