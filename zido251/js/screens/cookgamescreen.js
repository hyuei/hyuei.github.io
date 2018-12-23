class CookGameScreen extends GameScreen {
    constructor(game) {
        super(game);
        this.talker = null;
        this.scoreText = null;

        this.scoreTotal = 0;

        this.MINIMUM_SCORE = 400;
        this.GAME_TIME = 60000;
    }

    create() {

        game.add.sprite(-2, 0, "bg");

        var uiSkor = game.add.sprite(game.world.centerX, 0, "ui-skor");
        uiSkor.anchor.set(0.5, 0);

        this._isPlaying = true;
        this._isGameInitialized = false;
        this.gameStarted = false;

        this.createGame();
        this.createScoreUI();
        this.createTimer();
        this.createTalker();

        // tutorial
        this.tutorial = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 20, "bonus-tutorial");
        this.tutorial.visible = false;
        this.tutorial.anchor.set(0.5);

        // min score tutorial
        var minScoreTextOption = { font: "100px Vag", fill: "#ffffff", align: "center", wordWrap: true };
        this.minScoreText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "0", minScoreTextOption);
        this.minScoreText.stroke = "#000000";
        this.minScoreText.strokeThickness = 20;
        this.minScoreText.anchor.set(0.5);
        this.minScoreText.visible = false;
        this.minScoreText.text = this.MINIMUM_SCORE;

        this.endgameoverlay = new EndGameOverlay(game);
        this.endgameoverlay.onRetryButtonDown.add(this.onRetryButtonDown);

        this.setTime(this.GAME_TIME);

        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.CookGame_Prolog);
        this.talker.startTalk();
        this.createStartButton();
    }

    createGame() {
        this._cookGame = new CookGame(game);
        this._cookGame.init();

        var ref = this;
        this._cookGame.OnScoreAdded.add(this.onScoreAdded, ref);

        this._isGameInitialized = true;
    }

    createScoreUI() {
        var scoreTextOption = { font: "40px Vag", fill: "#ffffff", align: "right", wordWrap: true };
        this.scoreText = this.game.add.text(10, 10, "0", scoreTextOption);
        this.scoreText.stroke = "#000000";
        this.scoreText.strokeThickness = 5;
        this.scoreText.anchor.set(0);
    }

    onScoreAdded(score) {
        this.scoreTotal = (score * 10);
        this.scoreText.text = this.scoreTotal.toString();
    }

    update() {
        if (this._cookGame != null) {
            this._cookGame.update();
            this.updateTime();
        }
    }

    render() {
        this._cookGame.render();
    }

    createTalker() {

        this.talker = new Talker(game, 0, game.world.height, game.world.width, TALKER_HEIGHT);
        this.game.add.existing(this.talker);

        var ref = this;
        this.talker.onStart.add(function () {
            ref._cookGame.setInteractable(false);
        });

        this.talker.onFinish.add(function () {

        });

        this.talker.onReceiveMetadata.add(ref.onReceiveMetadata, this);

    }

    onReceiveMetadata(metadata) {
        console.log("metadata: " + metadata);

        switch (metadata) {
            case "show_start_button":
                {
                    this.startButton.visible = true;
                }
                break;
            case "endgame":
                {
                    this.endgameoverlay.setTextScore(this.scoreTotal.toString());
                    this.endgameoverlay.show();
                }
                break;
            case "failgame":
                {
                    this.endgameoverlay.setTextScore(this.scoreTotal.toString());
                    this.endgameoverlay.show();
                }
                break;
            case "showtutorial":
                {
                    this.tutorial.visible = true;
                }
                break;
            case "hidetutorial":
                {
                    this.tutorial.visible = false;
                }
                break;
            case "showminscore":
                {
                    this.minScoreText.visible = true;

                    this.game.add.tween(this.minScoreText.scale).to({ x: 1.75, y: 1.75 }, 500, Phaser.Easing.Quartic.InOut, true).loop(true).yoyo(true);
                }
                break;
            case "hideminscore":
                {
                    this.minScoreText.visible = false;
                }
                break;
        }
    }

    createStartButton() {
        this.startButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY, "btn-taptoplay", this.onStartButtonClick, this);
        this.startButton.anchor.set(0.5);

        var nameTextOption = { font: "100px Harmattan", fill: "#ffffff", align: "right", wordWrap: true };
        this.startText = this.game.add.text(0, 0, "اِبْدَأْ", nameTextOption);
        this.startText.stroke = "#000000";
        this.startText.strokeThickness = 3;
        this.startText.anchor.set(0.5);
        this.startButton.addChild(this.startText);

        this.startButton.visible = false;

        this.startBtnTween = this.game.add.tween(this.startButton.scale).to({ x: 1.25, y: 1.25 }, 1000, Phaser.Easing.Quartic.InOut, true).loop(true).yoyo(true);
    }

    onStartButtonClick() {
        //TODO: set game states
        this.startBtnTween.stop();
        this.startBtnTween = this.game.add.tween(this.startButton.scale).to({ x: 0, y: 0 }, 500, Phaser.Easing.Quartic.In, true);
        this.startBtnTween.onComplete.add(
            function () {
                this.startButton.visible = false;
            },
            this
        );

        this.gameStarted = true;
        this._cookGame.setInteractable(true);
    }


    createTimer() {
        var timerPosX = game.world.centerX - 10;
        var timerPosY = 65;

        this._timerGroup = this.game.add.group();

        var timerBox = this.game.add.sprite(timerPosX, timerPosY, "timerbox");
        timerBox.anchor.set(0.5);
        timerBox.scale.set(0.35);
        timerBox.visible = false;
        this._timerGroup.add(timerBox);

        this.CurrentSecondsElapsed = 0;
        this.IsUpdatingTime = true;

        var timerTextOption = { font: "35px Arial", fill: "#8a4100", align: "right", wordWrap: true };
        this._timeText = this.game.add.text(timerPosX + 15, timerPosY, this.CurrentSecondsElapsed.toString(), timerTextOption);
        this._timeText.anchor.set(0.5);
        this._timerGroup.add(this._timeText);
        this.updateTime();

        var timerIcon = this.game.add.sprite(timerPosX - 50, timerPosY - 5, "time-logo");
        timerIcon.anchor.set(0.5);
        timerIcon.scale.set(0.4);
        timerIcon.visible = false;
        this._timerGroup.add(timerIcon);
    }

    setTime(time) {
        this.CurrentSecondsElapsed = time;

        this._elapsedSec = Math.round(this.CurrentSecondsElapsed / 1000);

        var seconds = Math.floor(this._elapsedSec % 60);
        var minutes = Math.floor(this._elapsedSec / 60);

        var secondsStr = (seconds < 10 ? "0" + seconds.toString() : seconds.toString());
        var minutesStr = (minutes < 10 ? "0" + minutes.toString() : minutes.toString());

        this._timeText.text = minutesStr + ":" + secondsStr;
    }

    updateTime() {


        if (this._timeText !== null) {
            if (this._cookGame.isInteractable &&
                this._isGameInitialized &&
                this.talker != null &&
                this.gameStarted) {

                if (this._isPlaying) {



                    if (this.CurrentSecondsElapsed > 0) {

                        this.CurrentSecondsElapsed -= this.game.time.elapsedMS;
                    } else {

                        if (this.scoreTotal >= this.MINIMUM_SCORE) {
                            this.talker.loadTalkingArray(TALKING_DATA.talkingdata.CookGame_End);
                            this.talker.startTalk();
                        }else{
                            this.talker.loadTalkingArray(TALKING_DATA.talkingdata.CookGame_Fail);
                            this.talker.startTalk();
                        }

                        // call API
                        ZIDO_API.setScore(this.scoreTotal);
                        // ZIDO_API.sendData();

                        this._cookGame.moveFoodOut();

                        this._isPlaying = false;
                    }

                    this.setTime(this.CurrentSecondsElapsed);

                }

            }
        }

    }

    onRetryButtonDown() {
        game.state.start("CookGameScreen");
    }

}