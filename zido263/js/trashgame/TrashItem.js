class TrashItem extends Phaser.Sprite
{
    constructor(){
        super(game);
    }

    create(trashSpriteKey, posX, posY) {
        Phaser.Sprite.call(this, game, posX, posY, trashSpriteKey);

        this.anchor.set(0.5);

        this.game.add.existing(this);   
        
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
    }
}