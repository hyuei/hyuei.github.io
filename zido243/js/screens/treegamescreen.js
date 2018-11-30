class TreeGameScreen extends GameScreen {
    constructor(game) {
        super(game);
        this.talker = null;
        this.scoreText = null;

        this.scoreTotal = 0;

        this.scoreBox = null;
        this.timeBox = null;

        this.MINIMUM_SCORE = 400;
        this.GAME_TIME = 60000;
    }

    create() {
        var ref = this;

        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
        
        game.add.sprite(0,0, "bg");

        this._treeGame = new TreeGame(game);
        this._treeGame.init();
        this._treeGame.IsPlaying = false;
        this._treeGame.OnScoreAdded.add(this.onScoreAdded, ref);

        this.createTalker();

        // score UI
        this.scoreBox = this.game.add.sprite(10,10,"scorebox");
        var scoreTextOption = { font: "40px Vag", fill: "#ffffff", align: "right", wordWrap: true };
        this.scoreText = this.game.add.text(90, 35, "0", scoreTextOption)
        this.scoreText.stroke = "#000000";
        this.scoreText.strokeThickness = 5;
        this.scoreText.anchor.set(0);

        // timer UI
        this.CurrentSecondsElapsed = 0;
        this.IsUpdatingTime = true;
        this.timeBox = this.game.add.sprite(775, 20, "timebox");
        var timerTextOption = { font: "35px Arial", fill: "#8a4100", align: "right", wordWrap: true };
        this._timeText = this.game.add.text(880, 67, this.CurrentSecondsElapsed.toString(), timerTextOption);
        this._timeText.anchor.set(0.5);
        this.setTime(this.GAME_TIME);
        this.updateTime();

        // tutorials
        this.tutimg01 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 35, "img-3-1");
        this.tutimg01.anchor.set(0.5);
        this.tutimg01.visible = false;
        this.tutimg02 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 35, "img-3-2");
        this.tutimg02.anchor.set(0.5);
        this.tutimg02.visible = false;
        this.tutimg03 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 35, "img-3-3");
        this.tutimg03.anchor.set(0.5);
        this.tutimg03.visible = false;

        this.endgameoverlay = new EndGameOverlay(game);
        this.endgameoverlay.onRetryButtonDown.add(this.onRetryButtonDown);

        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.ClimbTree_Prolog);
        this.talker.startTalk();
        this.createStartButton();
    }
    
    update() {
        
        if(this._treeGame != null) {
            this._treeGame.update();
            this.updateTime();
        }
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
            case "show_tutimg01":
                {
                    this.tutimg01.visible = true;
                }
            break;
            case "hide_tutimg01":
                {
                    this.tutimg01.visible = false;
                }
            break;
            case "show_tutimg02":
                {
                    this.tutimg02.visible = true;
                }
            break;
            case "hide_tutimg02":
                {
                    this.tutimg02.visible = false;
                }
            break;
            case "show_tutimg03":
                {
                    this.tutimg03.visible = true;
                }
            break;
            case "hide_tutimg03":
                {
                    this.tutimg03.visible = false;
                }
            break;
            case "showtutorial":
                {
                    // this.tutorial.visible = true;
                }
                break;
            case "hidetutorial":
                {
                    // this.tutorial.visible = false;
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
        this.startButton.inputEnabled = false;

        var ref = this;
        //TODO: set game states
        this.startBtnTween.stop();
        this.startBtnTween = this.game.add.tween(this.startButton.scale).to({ x: 0, y: 0 }, 500, Phaser.Easing.Quartic.In, true);
        this.startBtnTween.onComplete.add(
            function () {
                this.startButton.visible = false;

                ref._treeGame.IsPlaying = true;
            },
            this
        );

        this.gameStarted = true;
    }

    onRetryButtonDown() {
        game.state.start("TreeGameScreen");
    }

    onScoreAdded(score) {
        this.scoreTotal = (score * 10);
        this.scoreText.text = this.scoreTotal.toString();
    }

    updateTime() {


        if (this._timeText !== null) {
            if (this._treeGame.IsPlaying) {

                if (this.CurrentSecondsElapsed > 0) {

                    this.CurrentSecondsElapsed -= this.game.time.elapsedMS;
                } else {

                    if (this.scoreTotal >= this.MINIMUM_SCORE) {
                        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.ClimbTree_End);
                        this.talker.startTalk();
                    }else{
                        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.ClimbTree_Fail);
                        this.talker.startTalk();
                    }

                    // call API
                    ZIDO_API.setScore(this.scoreTotal);

                    this._treeGame.IsPlaying = false;
                }

                this.setTime(this.CurrentSecondsElapsed);
            }
        }

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

}