class EndGameOverlay extends Phaser.Sprite
{
    constructor(game,x, y)
    {
        super(game, x, y);
        this._game = game;
        
        this.group = game.add.group();

        this.stars = [];
        this.triocheers = null;
        this.congratsTitle = null;
        this.emitter = null;
        this.retryButton = null;
        this.blackOverlay = null;

        this.onRetryButtonDown = new Phaser.Signal();

        this.wasDown = false;
        

        this.createObjects();
        this.hide();
    }

    update() {
        // // testing
        // if(game.input.activePointer.isDown && !this.wasDown){
        //     if(game.input.activePointer.leftButton.isDown)
        //     {
        //         // this.animate();
        //         this.show();
        //     }
        // }else if(game.input.activePointer.isUp){
        //     this.wasDown = false;
        // }

        var ref = this;
        ref.emitter.forEachAlive(function(p) {
            p.alpha = p.lifespan / ref.emitter.lifespan;
        });
    }

    show()
    {
        this.group.alpha = 1;
        this.animate();
    }

    hide()
    {
        this.group.alpha = 0;
        this.retryButton.inputEnabled = false;
    }

    fadeIn()
    {}

    fadeOut()
    {}

    createObjects()
    {
        this.createBlackOverlay();
        this.createCharacter();
        this.createCongratsTitle();
        this.createScoreBox();
        this.createStars();
        this.createButtons();
        this.createParticles();
    }

    createCharacter()
    {
        this.triocheers = this.game.add.sprite(0,0, "trio-cheers");
        this.triocheers.anchor.set(0.5);
        this.triocheers.position.set(this.game.world.centerX, this.game.world.height *.3);

        this.group.add(this.triocheers);
    }

    createScoreBox(){
        //this.scoreBox = this.group.create(this.game.world.centerX, this.game.world.height*.5, 'scorebox');
        //this.scoreBox.anchor.set(.5);

        this.scoreBox = this.game.add.sprite(0,0, "scorebox");
        this.scoreBox.anchor.set(0.5);
        this.scoreBox.position.set(this.game.world.centerX, this.game.world.height *.68);

        this.textScore = this.scoreBox.addChild(this.game.add.text(0, 0, 'defaultscore', {fontSize:40, fill:"#c53a2c"}));
        this.textScore.anchor.set(.5, .65);

        this.group.add(this.scoreBox);
    }

    createCongratsTitle()
    {
        this.congratsTitle = this.game.add.sprite(0,0, "congrats-title");
        this.congratsTitle.anchor.set(0.5);
        this.congratsTitle.position.set(this.game.world.centerX, this.game.world.height*.4);
        //this.congratsTitle.scale.set(0.9);

        this.group.add(this.congratsTitle);
    }

    createStars()
    {
        
        var positions = [[122,168],[300,64],[642,73],[808,181]];//,[688,315],[248,331]];

        for (var i = 0; i < positions.length; i++) {
            var position = positions[i];

            var star = this.game.add.sprite(0,0, "star-particle");
            star.anchor.set(0.5);
            star.scale.set(0.75);
            this.stars.push(star);

            star.position.set(positions[i][0], positions[i][1]);
            this.group.add(star);
        }

    }

    createButtons()
    {
        var ref = this;
        this.retryButton = this.game.add.button(0,0, "btn-retry", function(){ ref.onRetryButtonDown.dispatch(); });
        this.retryButton.scale.set(0.75);
        this.retryButton.position.set(this.game.world.centerX - 50, this.game.world.height*.75);
        // this.retryButton.input.useHandCursor = false;

        this.group.add(this.retryButton);
    }

    setTextScore(_text){
        this.textScore.text =_text; 
    }

    createParticles()
    {
        this.emitter = game.add.emitter(this.game.world.centerX, this.game.world.centerY,30);
        this.emitter.makeParticles("star-particle");
        this.emitter.gravity = 500;
        this.emitter.minParticleSpeed.setTo(-500, -500);
        this.emitter.maxParticleSpeed.setTo(500, 500);
        this.emitter.minParticleScale = 0.5;
        this.emitter.maxParticleScale = 0.75;

        this.group.add(this.emitter);
    }

    createBlackOverlay()
    {
        this.blackOverlay = game.add.graphics(0,0);
        this.blackOverlay.beginFill(0x000000, 1);
        this.blackOverlay.drawRect(0,0,game.width, game.height); 
        this.blackOverlay.alpha = 0;

        this.group.add(this.blackOverlay);
    }

    particleBurst(){
        this.emitter.start(true, 2000, null, 30);
    }

    animate(){
        
        var ref = this;
        
        this.group.alpha = 0;
        this.game.add.tween(this.group).to({alpha: 1}, 100, Phaser.Easing.Exponential.Out, true, 0);
        
        this.blackOverlay.alpha = 0;
        this.game.add.tween(this.blackOverlay).to( { alpha: 0.7 }, 1000, Phaser.Easing.Linear.None, true);

        this.triocheers.alpha = 0;
        this.game.add.tween(this.triocheers).to({alpha : 1}, 800, Phaser.Easing.Exponential.Out, true, 1000);

        this.congratsTitle.alpha = 0;
        this.game.add.tween(this.congratsTitle).to({alpha : 1}, 800, Phaser.Easing.Exponential.Out, true, 1000);

        this.scoreBox.alpha = 0;
        this.game.add.tween(this.scoreBox).to({alpha : 1}, 800, Phaser.Easing.Exponential.Out, true, 1000);

        this.retryButton.alpha = 0;
        this.game.add.tween(this.retryButton).to({alpha : 1}, 800, Phaser.Easing.Exponential.Out, true, 1000);

        for(var i = 0; i < this.stars.length; i++){
            var star = this.stars[i];
            if(star != null)
            {
                star.scale.set(0, 0);
                this.game.add.tween(star.scale).to({x:1, y:1}, 300, Phaser.Easing.Exponential.Out, true, (i * 100) + 1000);
            }
        }
        setTimeout(function(){ref.particleBurst();}, 800);

        setTimeout(() => {
            ref.retryButton.inputEnabled = true;
        }, 1000);
    }

    retryButtonDown()
    {
        this.onRetryButtonDown.dispatch();
    }


}