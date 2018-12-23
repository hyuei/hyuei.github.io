CustomPointer = function(x, y){
    Phaser.Sprite.call(this, game, x, y, 'hand-pointer');
    this.scale.set(0.5);
    
    var ref = this;
    game.input.addMoveCallback(function(pointer, x, y) {
        ref.x = x;
        ref.y = y;        
    }, this);
}

CustomPointer.inherit({

}, Phaser.Sprite)