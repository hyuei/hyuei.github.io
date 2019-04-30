class Character extends Phaser.Sprite
{
    constructor() {
        super(game);
    }

    create(characterKey) {
        // var nameTextOption = { font: "100px Harmattan", fill: "#ffffff", align: "right", wordWrap: true };
        // this.game.add.text(0,0,"character", nameTextOption);

        Phaser.Sprite.call(this, game, 0, 0, characterKey); 

        this.game.add.existing(this);
    }
}