/// <reference path="../phaser.js" />

class PopGameScreen extends GameScreen {
    constructor(game) {
        super(game);

        this._game = game;

        this.gameController = null;

        this.talker = null;
        this.scoreText = null;

        this.scoreTotal = 0;

        this.scoreBox = null;
        this.timeBox = null;

        this.MINIMUM_SCORE = 400;
        this.GAME_TIME = 60000;

        this.trashGameController = null;
        this.endGameOverlay = null;
    }

    preload() {

    }

    create() {
        this.gameController = new PopGame(this.game);
        this.gameController.create();
        this.gameController.stopGameAction();

        this.createTalker();

        

        this.tut01 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 20, "2-7-1-01");
        this.tut01.anchor.set(0.5);
        this.tut01.visible = false;
        this.tut02 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 20, "2-7-1-02");
        this.tut02.anchor.set(0.5);
        this.tut02.visible = false;
        this.tut03 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 20, "2-7-1-03");
        this.tut03.anchor.set(0.5);
        this.tut03.visible = false;
        this.tut04 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 20, "2-7-1-04");
        this.tut04.anchor.set(0.5);
        this.tut04.visible = false;
        this.tut05 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 20, "2-7-1-05");
        this.tut05.anchor.set(0.5);
        this.tut05.visible = false;

        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.PopGame_Prolog);
        this.talker.startTalk();
        this.createStartButton();

        this.createEndGameOverlay();

        this.gameController.gameWinSignal.add(this.onGameWin, this);
        this.gameController.gameLoseSignal.add(this.onGameLose, this);
    }

    update() {
        this.gameController.update();
    }

    createTalker() {

        this.talker = new Talker(game, 0, game.world.height, game.world.width, TALKER_HEIGHT);
        this.game.add.existing(this.talker);

        var ref = this;
        this.talker.onStart.add(function () {
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
                    this.endGameOverlay.setTextScore(this.gameController.getScoreValue().toString());
                    this.endGameOverlay.showCongrats();
                }
                break;
            case "failgame":
                {
                    this.endGameOverlay.setTextScore(this.gameController.getScoreValue().toString());
                    this.endGameOverlay.showTooBad();
                }
                break;
            case "showtut_01":
                {
                    this.tut01.visible = true;
                }
                break;
            case "showtut_02":
                {
                    this.tut02.visible = true;
                }
                break;
            case "showtut_03":
                {
                    this.tut03.visible = true;
                }
                break;
            case "showtut_04":
                {
                    this.tut04.visible = true;
                }
                break;
            case "showtut_05":
                {
                    this.tut05.visible = true;
                }
                break;
            case "hidetut_01":
                {
                    this.tut01.visible = false;
                }
                break;
            case "hidetut_02":
                {
                    this.tut02.visible = false;
                }
                break;
            case "hidetut_03":
                {
                    this.tut03.visible = false;
                }
                break;
            case "hidetut_04":
                {
                    this.tut04.visible = false;
                }
                break;
            case "hidetut_05":
                {
                    this.tut05.visible = false;
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
        this.startButton.inputEnabled = false;

        var ref = this;
        //TODO: set game states
        this.startBtnTween.stop();
        this.startBtnTween = this.game.add.tween(this.startButton.scale).to({ x: 0, y: 0 }, 500, Phaser.Easing.Quartic.In, true);
        this.startBtnTween.onComplete.add(
            function () {
                ref.startButton.visible = false;
                console.log(ref.gameController);
                ref.gameController.startGameAction();
            },
            this
        );

        this.gameStarted = true;
    }

    createEndGameOverlay() {
        this.endGameOverlay = new EndGameOverlay(this.game, 0, 0);
        this.endGameOverlay.onRetryButtonDown.add(this.EndGame_OnRetryButtonDown, this);
    }

    EndGame_OnRetryButtonDown() {
        this.game.state.start("PopGameScreen");
    }

    onGameWin(score) {
        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.PopGame_End);
        this.talker.startTalk();
    }

    onGameLose(score) {
        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.PopGame_Fail);
        this.talker.startTalk();
    }
}
