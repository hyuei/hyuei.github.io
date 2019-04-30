class PopItem extends Phaser.Sprite {
    constructor(game) {
        super(game);
        this.WIDTH = 91;
        this.HEIGHT = 90;

        this.Key = "";

        this.xOffset = 0;
        this.yOffset = 0;

        this.posRow = 0;
        this.posCol = 0;


        this.onDownSignal = new Phaser.Signal();
    }

    initializeSpritePos(x, y) {
        var xPos = x * this.WIDTH + this.xOffset;
        var yPos = y * this.HEIGHT + this.yOffset;
        this.position.set(xPos, yPos);
        this.anchor.set(0.5);
    }


    updatePos() {
        var xPos = this.posCol * this.WIDTH + this.xOffset;
        var yPos = this.posRow * this.HEIGHT + this.yOffset;
        // this.position.set(, );
        this.game.add.tween(this).to({ x: xPos, y: yPos }, 500, Phaser.Easing.Bounce.Out, true);
    }

    create(veggieKey) {

        this.Key = veggieKey;
        Phaser.Sprite.call(this, game, 0, 0, veggieKey);
        this.game.add.existing(this);

        this.inputEnabled = true;
        this.events.onInputDown.add(this.onDown, this);
    }

    onDown() {
        this.onDownSignal.dispatch(this);
    }

}