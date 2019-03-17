class MatchingGameScreen extends GameScreen {

    constructor(game) {
        super(game);
        this.startPos = { x: 80, y: 250 };
        this.endPos = { x: 880, y: 250 };

        this.talker = null;


        this.avatar = null;


        this.gameStarted = false;
        this.endTalkingShown = false;
    }

    preload() {

    }

    create() {


        this.gameStarted = false;
        this.endTalkingShown = false;

        this.backgroundImage = this.game.add.sprite(0, 0, "bg");
        this.backgroundImage.scale.set(0.335);

        // reasons
        this.createReasons();
        this.createGame();
        this.createLogo();
        this.createTutorialImage();
        this.createTalker();
        this.createStartButton();

        this.endgameoverlay = new EndGameOverlay(game);
        this.endgameoverlay.onRetryButtonDown.add(this.onRetryButtonDown);

        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.MatchingGame_Prolog);
        this.talker.startTalk();

    }

    createGame() {
        var ref = this;
        this.matchCardGame = new MatchCardGame(
            game,
            ["fish", "herb", "orange", "rice", "salt", "tomato", "tree", "water", "worm"],
            3,
            6
        );
        this.matchCardGame.init();
        this.matchCardGame.onAllAnswerd.add(
            function () {
                console.log("From matching game screen, congratulate all answered");

                var timeElapsed = ref.matchCardGame.CurrentSecondsElapsed;
                console.log("Your time " + timeElapsed);
                
                //Submit score to ZIDO
                var userData = JSON.stringify({
                    "score":timeElapsed
                });
        
                ZIDO.post(userData, 
                    function(result){
                        console.log("Succeed post data" + result);
                    }, 
                    function(error){
                        console.log("Error post data:" + error);
                    }
                );
        
            }
        );

        this.matchCardGame.onPairAnswered.add(
            function (answeredType) {
                console.log("Answered type:" + answeredType);
                ref.onPairAnswered(answeredType);
            }
        );
    }

    showReason(reasonId) {
        var currentReasonObj = this.reasons[reasonId];
        currentReasonObj.sprite.visible = true;
        var prevScaleX = currentReasonObj.sprite.scale.x;
        var prevScaleY = currentReasonObj.sprite.scale.y;
        currentReasonObj.sprite.scale.set(0);

        this.matchCardGame.moveCardPairs(currentReasonObj.sprite.position.x, currentReasonObj.sprite.position.y);

        this.game.add.tween(currentReasonObj.sprite.scale).to({ x: prevScaleX, y: prevScaleY }, 1000, Phaser.Easing.Bounce.Out, true, 800);

        setTimeout(() => {
            this.createParticles(currentReasonObj.position);
        }, 1000);


        this.talker.startTalkWithDelay(2000);
        // this.talker.startTalk();
    }

    onPairAnswered(answeredType) {
        switch (answeredType) {
            case "fish":
                this.talker.loadTalkingArray(TALKING_DATA.talkingdata.CardMatch_Card_Fish);

                this.showReason("fish");

                break;
            case "herb":
                this.talker.loadTalkingArray(TALKING_DATA.talkingdata.CardMatch_Card_Herb);

                this.showReason("herb");
                break;
            case "orange":
                this.talker.loadTalkingArray(TALKING_DATA.talkingdata.CardMatch_Card_Orange);

                this.showReason("orange");
                break;
            case "rice":
                this.talker.loadTalkingArray(TALKING_DATA.talkingdata.CardMatch_Card_Rice);

                this.showReason("rice");
                break;
            case "salt":
                this.talker.loadTalkingArray(TALKING_DATA.talkingdata.CardMatch_Card_Salt);


                this.showReason("salt");
                break;
            case "tomato":
                this.talker.loadTalkingArray(TALKING_DATA.talkingdata.CardMatch_Card_Tomato);


                this.showReason("tomato");
                break;
            case "tree":
                this.talker.loadTalkingArray(TALKING_DATA.talkingdata.CardMatch_Card_Tree);


                this.showReason("tree");
                break;
            case "water":
                this.talker.loadTalkingArray(TALKING_DATA.talkingdata.CardMatch_Card_Water);


                this.showReason("water");
                break;
            case "worm":
                this.talker.loadTalkingArray(TALKING_DATA.talkingdata.CardMatch_Card_Worm);
                this.showReason("worm");
                break;
            default:
                {

                }
                break;
        }
    }

    createParticles(positionArray) {

        var emitter = this.game.add.emitter(positionArray[0], positionArray[1], 30);
        emitter.makeParticles("star-particle");
        emitter.gravity = 500;
        emitter.minParticleSpeed.setTo(-500, -500);
        emitter.maxParticleSpeed.setTo(500, 500);
        emitter.minParticleScale = 0.3;
        emitter.maxParticleScale = 0.55;

        emitter.start(true, 2000, null, 50);

        setTimeout(function () {
            emitter.destroy();
        }, 5000);

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
        this.matchCardGame.interactable = true;
    }

    createTutorialImage() {
        this.tutorialImage = game.add.sprite(game.world.centerX, game.world.centerY - 70, "tutorial");
        this.tutorialImage.anchor.set(0.5);
        this.tutorialImage.scale.set(0.37);
        this.tutorialImage.visible = false;
    }

    createTalker() {
        // this.hopNumberGame.isPlaying = false;

        this.talker = new Talker(game, 0, game.world.height, game.world.width, TALKER_HEIGHT);
        this.game.add.existing(this.talker);

        var ref = this;
        this.talker.onStart.add(function () {
            ref.matchCardGame.interactable = false;
        });

        this.talker.onFinish.add(function () {
            if (ref.gameStarted) {
                if (ref.matchCardGame.isAllAnswered && !ref.endTalkingShown) {
                    ref.endTalkingShown = true;
                    ref.talker.loadTalkingArray(TALKING_DATA.talkingdata.MatchingGame_End);
                    ref.talker.startTalk();
                }

                ref.matchCardGame.interactable = true;
            }
        });

        this.talker.onReceiveMetadata.add(ref.onReceiveMetadata, this);
    }

    onReceiveMetadata(metadata) {
        console.log("metadata: " + metadata);

        switch (metadata) {
            case "show_tutorial":
                {
                    this.tutorialImage.visible = true;
                }
                break;
            case "hide_tutorial":
                {
                    this.tutorialImage.visible = false;
                }
                break;
            case "show_cards":
                {
                    this.matchCardGame.showCards();
                }
                break;
            case "show_start_button":
                {
                    this.startButton.visible = true;
                }
                break;
            case "endgame":
                {
                    this.endgameoverlay.show();
                }
                break;
        }
    }

    createReasons() {

        this.reasons = {
            fish: {
                position: [65, 65], scale: 0.45
            },
            herb: {
                position: [65, 255], scale: 0.45
            },
            orange: {
                position: [65, 425], scale: 0.45
            },
            rice: {
                position: [205, 305], scale: 0.45
            },
            salt: {
                position: [105, 175], scale: 0.45
            },
            tomato: {
                position: [155, 485], scale: 0.45
            },
            tree: {
                position: [235, 425], scale: 0.5
            },
            water: {
                position: [205, 85], scale: 0.35
            },
            worm: {
                position: [105, 335], scale: 0.35
            }
        };

        for (var key in this.reasons) {
            this.reasons[key].sprite = this.game.add.sprite(this.reasons[key].position[0], this.reasons[key].position[1], key);
            this.reasons[key].sprite.anchor.set(0.5);
            this.reasons[key].sprite.scale.set(this.reasons[key].scale);

            // hide all at first
            this.reasons[key].sprite.visible = false;
        }
    }

    update() {
        // this.hopNumberGame.update();
        this.matchCardGame.update();
    }

    waitAndNext() {
        game.state.start("Game2Screen");
    }

    onRetryButtonDown() {
        game.state.start("MatchingGameScreen");
    }

    createCurtains() {
        // var curtainLeft = this.game.add.sprite(0, 0, 'curtain-halfright');
        // curtainLeft.anchor.set(0,0);
        // curtainLeft.scale.set(0.5, 1);

        // var curtainRight = this.game.add.sprite(0, 0, 'curtain-halfright');
        // curtainRight.position.set(game.width, 0);
        // curtainRight.anchor.set(1,0);
        // curtainRight.scale.set(0.5, 1);

        // // animate curtains
        // this.game.add.tween(curtainLeft.scale).to({x:0}, 800, Phaser.Easing.Exponential.Out, true, 200);
        // this.game.add.tween(curtainRight.scale).to({x:0}, 800, Phaser.Easing.Exponential.Out, true, 200);


        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0x000000, 1);
        graphics.drawRect(0, 0, game.width, game.height);

        game.add.tween(graphics).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0);
    }
}
