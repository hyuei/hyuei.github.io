StartScreen = function(game){
};

StartScreen.inherit({
    preload:function(){
        BaseState.prototype.preload.call(this);
        Asset.png('btn-taptoplay')        
    },

    create:function(){
        BaseState.prototype.create.call(this);

        this.isReady = false;

        var startButton = game.add.button(game.world.centerX, game.world.centerY, "btn-taptoplay", function(){
            // game.state.start("Game1Screen");
            transition.close('Game1Screen')
        });
        startButton.anchor.set(0.5);
        startButton.scale.set(0);

        var textOption = {font: "53px Harmattan", fill: "#FFFFFF", align: "right", boundsAlignH: "right"};
        var startToPlayText = this.game.add.text(0, 0, "اِبْدَأْ اللَّعِبَ", textOption);
        startToPlayText.anchor.set(0.5);
        startButton.addChild(startToPlayText);

        this.startButton = startButton;

        this.gCont.add(this.startButton)
        this.onResize();
    },

    spawnButton:function(){
        var tweenBtn = this.game.add.tween(this.startButton.scale).to({x:0.7, y:0.7}, 500, Phaser.Easing.Exponential.Out, false).loop(true).yoyo(true);
        var tweenNormal = this.game.add.tween(this.startButton.scale).to({x:0.75, y:0.75}, 200, Phaser.Easing.Linear.None, false).chain(tweenBtn);
        var tweenPop = this.game.add.tween(this.startButton.scale).to({x:0.85, y:0.85}, 200, Phaser.Easing.Linear.None, true).chain(tweenNormal);
    },

    update:function(){
        if(transition && !transition.isClosed){
            if(!this.isReady){
                this.isReady = true;
                this.spawnButton();
            }
        }
    },    
}, BaseState);