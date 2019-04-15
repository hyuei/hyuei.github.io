class ScoreUI extends Phaser.Group {
    constructor() {
        super(game);
        this.score = 0;
        this.text = null;
    }

    create() {
        var bg = this.game.add.sprite(0, 0, "base-ui");
        bg.anchor.set(0.5);
        this.add(bg);

        var nameTextOption = { font: "29.8px Vag", fill: "#07abf8", align: "center", wordWrap: true };
        this.text = this.game.add.text(0, 0, this.score, nameTextOption);
        this.text.anchor.set(0.5);
        this.add(this.text);
    }

    setScore(score) {

        if (score < this.score) {
            this.text.addColor('#df0000', 0);
            this.text.scale.set(2);
            var tweenText = this.game.add.tween(this.text.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Bounce.In, true);
            tweenText.onComplete.add(function () {
                this.text.addColor('#07abf8', 0);
            }, this);
        } else {
            this.text.addColor('#f4b042', 0);
            this.text.scale.set(2);

            var tweenText = this.game.add.tween(this.text.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Bounce.Out, true);
            tweenText.onComplete.add(function () {
                this.text.addColor('#07abf8', 0);
            }, this);
        }

        this.score = score;
        this.text.text = this.score;
    }
}