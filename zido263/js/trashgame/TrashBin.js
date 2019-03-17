class TrashBin extends Phaser.Sprite
{
    constructor() {
        super(game);
    }

    create(trashbinKey) {
        Phaser.Sprite.call(this, game, 0, 0, trashbinKey); 
        this.game.add.existing(this);

        this.anchor.set(0.5, 1);

        this.game.physics.enable(this, Phaser.Physics.ARCADE);
    }
}