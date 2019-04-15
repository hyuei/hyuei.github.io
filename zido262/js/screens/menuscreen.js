class MenuScreen
{
    constructor(game)
    {        
    }

    preload() {

    }

    create() {      
        console.log("Menu");

        // draw character
        var avatar = new Avatar(game, 100, 100, 'avatar-idle');
        this.game.add.existing(avatar);

        // draw button
        var button = game.add.button(game.world.centerX - 95, 100, 'play-btn', this.actionOnClick, this);

        // draw text
        var textOption = {font: "65px Arial", fill: "#ffff00", align: "right"};
        var text = this.game.add.text(game.world.centerX, game.world.centerY, "معرفة الأرقام", textOption);
    
        this.createCurtains();  
        // // debug
        // this.game.state.start("Game1Screen");
    }

    actionOnClick() {
        this.game.state.start("OpeningScreen");
    }

    createCurtains(){
        var curtainLeft = this.game.add.sprite(0, 0, 'curtain-halfright');
        curtainLeft.anchor.set(0,0);
        curtainLeft.scale.set(0.5, 1);

        var curtainRight = this.game.add.sprite(0, 0, 'curtain-halfright');
        curtainRight.position.set(game.world.width, 0);
        curtainRight.anchor.set(1,0);
        curtainRight.scale.set(0.5, 1);

        // animate curtains
        this.game.add.tween(curtainLeft.scale).to({x:0}, 1000, Phaser.Easing.Exponential.Out, true, 200);
        this.game.add.tween(curtainRight.scale).to({x:0}, 1000, Phaser.Easing.Exponential.Out, true, 200);
    }
}