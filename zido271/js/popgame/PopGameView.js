class PopGameView extends Phaser.Sprite {
    constructor(game) {
        super(game);
    }

    create() {
        this.createBackground();
        this.createBoard();
        this.createUI();
    }

    createUI() {
        this.scoreUI = new ScoreUI();
        this.scoreUI.create();
        this.scoreUI.x = 880;
        this.scoreUI.y = this.game.height - 50;

        this.timerUI = new TimerUI();
        this.timerUI.create();
        this.timerUI.x = 78;
        this.timerUI.y = this.game.height - 50;
    }

    createBackground() {
        this.background = this.game.add.sprite(0, 0, "veg-bg");
    }

    createBoard() {
        this.board = new PopBoard(this.game);
        this.board.createBoard();
    }
}