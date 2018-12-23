class ShopGameScreen extends GameScreen {
    constructor(game) {
        super(game);

        this.talker = null;
        this.endgameoverlay = null;

        this.GAME_TIME = 60000;
    }

    create() {
        this._shopGame = new ShopGame(game);
        this._shopGame.INITIAL_TIME = this.GAME_TIME;
        this._shopGame.init();

        this.createTalker();

        this.endgameoverlay = new EndGameOverlay(game);
        this.endgameoverlay.onRetryButtonDown.add(this.onRetryButtonDown);

        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.Shop_Prolog);
        this.talker.startTalk();
        this.createStartButton();


        this._shopGame.OnGameCompleted.add(this.shopGame_onGameCompleted, this);
    }

    update() {
        this._shopGame.update();
    }

    shopGame_onGameCompleted() {
        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.Shop_End);
        this.talker.startTalk();
    }

    createTalker() {

        this.talker = new Talker(game, 0, game.world.height, game.world.width, TALKER_HEIGHT);
        this.game.add.existing(this.talker);

        var ref = this;
        this.talker.onStart.add(function () {
            // ref._cookGame.setInteractable(false);
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
                    this.endgameoverlay.setTextScore(this._shopGame._currentScore);
                    this.endgameoverlay.show();
                }
                break;
            case "failgame":
                {
                    this.endgameoverlay.setTextScore(this._shopGame._currentScore);
                    this.endgameoverlay.show();
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
                this.startButton.visible = false;

                ref._shopGame.setIsPlaying(true);
            },
            this
        );

        this.gameStarted = true;
    }

    onRetryButtonDown() {
        game.state.start("ShopGameScreen");
    }
    
}