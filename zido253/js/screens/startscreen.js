class StartScreen
{
    constructor(game)
    {        
    }

    preload() {
    }
    
    create() {
        console.log("start screen");
        
        var startButton = game.add.button(game.world.centerX, game.world.centerY, "btn-taptoplay", function(){
            // game.state.start(SCREEN_MANAGER.getNext());
            game.state.start("PrologueScreen");//("Game1Screen");
        });
        startButton.anchor.set(0.5);
        startButton.scale.set(0.75);
        startButton.position.set(game.world.centerX, game.world.centerY);

        var textOption = {font: "53px Harmattan", fill: "#FFFFFF", align: "right", boundsAlignH: "right"};
        var startToPlayText = this.game.add.text(0, 0, "اِبْدَأْ اللَّعِبَ", textOption);
        startToPlayText.anchor.set(0.5);
        startButton.addChild(startToPlayText);

        this.game.add.tween(startButton.scale).to({x:0.7, y:0.7}, 500, Phaser.Easing.Exponential.Out, true).loop(true).yoyo(true);

    }
}