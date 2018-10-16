class Plaque extends Phaser.Sprite {
    constructor(game, x, y, controller){
        super(game, x, y, 'rest-food');
        this.anchor.set(.5);
        this._basicHealth = 100;
        this._health = 100;
        this._controller = controller;
        //console.log(this.index);
        //Phaser.Sprite.call(this, game, x, y, 'bacteria');
        //game.add.existing(this);
        //console.log(game);
    }

    cleanUp(){
        //if(this._controller.brush.get)
        //var boundBrush = this._controller.brush.getBounds();
        //var bound = this.getBounds();
        //var check = bound.intersects(boundBrush);
        //if(check){
        this._health -= 1;
        this.alpha = (this._health/this._basicHealth);
        if(this.alpha < 0){
            this.alpha = 0;
            this._controller.runParticles(this.x, this.y);
            this._controller.score += 100;
            this.destroy();
            this._controller.checkingBadEntitiesLeft();
        }
        //}
    }
    
}