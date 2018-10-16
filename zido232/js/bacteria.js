class Bacteria extends Phaser.Sprite {
    constructor(game, x, y, controller, color){
        var texture = "bacteria-"+color;
        super(game, x, y, texture);
        this.anchor.set(.5);
        this._basicHealth = 200;
        this._health = 200;
        this._controller = controller;
        this.colorBacteria = color;
        //console.log(this.index);
        //Phaser.Sprite.call(this, game, x, y, 'bacteria');
        //game.add.existing(this);
        //console.log(game);
    }

    cleanUp(colorBrush){
        var splitName = colorBrush.split("-");
        if(splitName[1] == this.colorBacteria){
            this._health -= 1;
            this.alpha = (this._health/this._basicHealth);
            
            if(this.alpha < 0){
                this.alpha = 0;
                this._controller.runParticles(this.x, this.y);
                this._controller.score+= 200;
                this.destroy();
                this._controller.checkingBadEntitiesLeft();
            }
        }
    }   
}