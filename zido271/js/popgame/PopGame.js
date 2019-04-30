class PopGame extends Phaser.Sprite {
    constructor(game) {
        super(game);

        this.currentTime = 0;

        this.GS_PAUSE = "pause";
        this.GS_PLAY = "play";
        this.GS_GAMEOVER = "gameover";
        this.currentGameState = this.GS_PAUSE; //initial state

        // constants
        this.SCORE_MULTIPLIER = 10;
        this.MAX_TIME = 90000;
        this.MINIMUM_SCORE = 10;

        this.currentScore = 0;

        this.IsPlaying = false;

        this.gameWinSignal = new Phaser.Signal();
        this.gameLoseSignal = new Phaser.Signal();
    }

    create() {
        console.log("Create Pop Game");

        this.view = new PopGameView(this.game);
        this.view.create();

        this.view.board.onItemPopped.add(this.onItemPopped, this);
        this.view.board.scoreMultiplier = this.SCORE_MULTIPLIER;
        this.startGame();
    }

    startGame() {
        this.currentTime = this.MAX_TIME;
        this.view.timerUI.setMiliSeconds(this.currentTime);
        this.currentGameState = this.GS_PLAY;
    }

    update() {
        if (!this.IsPlaying)
            return;

        if (this.currentGameState == this.GS_PLAY) {
            this.updateTime();
        }
        if (this.currentGameState == this.GS_PLAY && this.currentTime <= 0) {
            this.currentGameState = this.GS_GAMEOVER;
            this.stopGameAction();  
            this.onGameOver();
        }
    }

    updateTime() {
        this.currentTime -= this.game.time.elapsedMS;
        this.view.timerUI.setMiliSeconds(this.currentTime);
    }

    onItemPopped(popItem) {
        this.currentScore++;
        this.view.scoreUI.setScore(this.getScoreValue());
        console.log(this.currentScore);
    }

    getScoreValue() {
        let scoreValue = this.currentScore * this.SCORE_MULTIPLIER;
        return scoreValue;
    }

    startGameAction() {
        console.log("start game");
        this.view.board.inputEnabled = true;
        this.IsPlaying = true;
    }

    stopGameAction() {
        console.log("stop");
        this.view.board.inputEnabled = false;
        this.IsPlaying = false;
    }

    onGameOver() {
        if (this.getScoreValue() >= this.MINIMUM_SCORE) {
            this.gameWinSignal.dispatch(this.getScoreValue())
        } else {
            this.gameLoseSignal.dispatch(this.getScoreValue());
        }
    }


}