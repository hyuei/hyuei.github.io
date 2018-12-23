class CustomPointer extends Phaser.Sprite{

    constructor(game, x, y)
    {
        super(game, x, y, "hand-pointer");
        this.scale.set(0.5);
        
        var ref = this;
        game.input.addMoveCallback(function(pointer, x, y) {
            ref.x = x;
            ref.y = y;        
        }, this);
    }
}