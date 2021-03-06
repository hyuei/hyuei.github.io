class ShopGame {
    constructor(game) {
        this._game = game;

        this.OnTimeEnd = new Phaser.Signal();
        this.OnScoreAdded = new Phaser.Signal();
        this.OnGameCompleted = new Phaser.Signal();

        this._addedFruitRacks = [];
        this._addedFruitIds = [];
        this._buttonGroup = null;
        this._buyerGroup = null;

        this._selectedPositions = [{ x: 763, y: 131 }, { x: 690, y: 131 }, { x: 614, y: 131 }];
        this._buyerPositions = [{ x: 310, y: 210 }, { x: 180, y: 210 }, { x: 50, y: 210 }];
        this._shopListPositions = [{ x: 130, y: 450 }, { x: 220, y: 450 }, { x: 310, y: 450 }];

        this._rackFruit = {
            "frarea-01": "lemon",
            "frarea-02": "orange",
            "frarea-03": "apple",
            "frarea-04": "grape",
            "frarea-05": "date"
        };

        this.SELLER_GREET_TEXT = "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ، مَرْحَباً!";
        this.BUYER_RESPONSE_TEXT = "وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُه!ُ" + "\u200F" + " أَوَدُّ اقْتِنَاءُ هَذِهِ الْأَنْوَاعِ مِنْ فَضْلِكَ:";
        this.BUYER_RIGHT_ITEM_TEXT = "جَازَاكَ اللهُ خَيْراً، تَفَضَّلْ هَذَا هُوَ الْبَاقِي.";
        this.BUYER_WRONG_ITEM_TEXT = "أَنَا آسِفٌ، لَيْسَ هَذَا مَا طَلَبْتُهُ... سَأُحَاوِلُ الْبَحْثَ فِي مَكَانٍ آخَرَ.";
        this.TOO_LONG_TIME_TEXT = "أَنَا آسِفٌ فَوَقْتِي لَا يَسَعُنِي لِلِانْتِظَارِ. سَأَنْصَرِفُ الْآنَ. فِي أَمَانِ اللهِ.";
        this.GREET_BUTTON_TEXT = "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ.";

        this._buyerBalloonPos = { x: 220, y: 400 };

        this._fruitTypes = ["lemon", "orange", "apple", "grape", "date"];

        this._addedBuyersSprites = [];
        this._selectedFruitsSprites = [];

        this._shopListSprites = [];
        this._shopItems = [];

        this._buyerBalloon = null;
        this._sellerBalloon = null;

        this._buyerBalloonGroup = null;
        this._greetBButtonGroup = null;
        this._shopListGroup = null;
        this._thanksGroup = null;
        this._sorryGroup = null;

        this._selectedFruitGroup = null;

        this._sellerBalloonGroup = null;
        this._sellerBButtonGroup = null;
        this._finalScoreGroup = null;
        this._buyerTimerGroup = null;

        this._timerBar = null;
        this._initialTimeWidth = 40;

        this._judgementGroup = null;

        this._rackInteractable = false;

        this._scoreText = null;
        this._timerText = null;

        this._currentScore = 0;
        this._currentTime = 0;
        this._currentBuyerTime = 0;

        this._currentSecondsElapsed = 0;

        this.INITIAL_TIME = 120000;
        this.INITIAL_BUYER_TIME = 20000;
        this.SCORE_MULTIPLIER = 10;

        this.BUYER_WRONG_ITEM_TIME = 1000;
        this.BUYER_TOO_LONG_TIME = 1000;
        this.BUYER_THANKS_TIME = 1000;

        this._correctMark = null;
        this._falseMark = null;


        this._resultWindow = null;

        this._isPlaying = false;
        this._mostFrontBuyerTween = null;

        this._finalScoreObjects = {};
        this._finalTotalScoreText = null;

        this._isBuyerServed = false;
        this._isBuyerTimingOut = false;

        this._hasGreeted = false;
        this._hasBuyerNoticed = false;

        this._currentTalkingAudioExtra = null;

    }

    talkExtra(audioID) {

        if (this._currentTalkingAudioExtra !== null) {
            console.log("STOP AUDIO");
            this._currentTalkingAudioExtra.stop();
            console.log(this._currentTalkingAudioExtra);
        }

        this._currentTalkingAudioExtra = game.add.audio(audioID, true);
        this._currentTalkingAudioExtra.play();

    }


    init() {

        this.createBackground();
        this.createFruitButtons();
        this.createSeller();
        this.createSellerButtons();


        this._buyerGroup = this._game.add.group();

        this.createBuyer();
        this.createBuyer();
        this.createBuyer();

        this.createBuyerTimer();

        this._selectedFruitGroup = this._game.add.group();

        this.createBuyerBalloon();
        this.createSellerBalloon();





        // UIs
        this.createScoreUI();
        this.createTimerUI();


        this.createFinalScoreWindow();
        // this.showFinalScoreWindow();

        // this.setIsPlaying(true);
        this.reset();


    }

    reset() {
        this.setIsPlaying(false);
        this.hideFinalScoreWindow();
        this.clearShop();
        this.clearSelectedFruits();

        this._currentScore = 0;
        this._currentTime = 0;
        this._currentBuyerTime = this.INITIAL_BUYER_TIME;
        this._currentSecondsElapsed = this.INITIAL_TIME;

        this.updateBuyerTime();

        this.setTime(this._currentSecondsElapsed);

        // initial
        this.showGreetButton();


        // clear count
        for (var key in this._finalScoreObjects) {
            this._finalScoreObjects[key].count = 0;
        }

        // reset score
        this.setScore(this._currentScore);
        
        this._finalTotalScoreText.text = "";
    }

    createBackground() {
        this._game.add.sprite(0, 0, "bg");
    }

    createFruitButtons() {

        this._buttonGroup = this._game.add.group();

        this.createButton(610, 490, "frarea-01");
        this.createButton(775, 490, "frarea-02");
        this.createButton(900, 470, "frarea-03");
        this.createButton(945, 310, "frarea-04");
        this.createButton(918, 149, "frarea-05");
    }

    createButton(x, y, buttonName, onClick) {
        var button = this._game.add.button(x, y, buttonName);
        this._buttonGroup.add(button);
        var ref = this;
        button.anchor.set(0.5);
        button.onInputDown.add(function () {
            if (ref._rackInteractable && ref._isPlaying) {
                if (onClick != null) {
                    onClick();
                }
                button.loadTexture(buttonName + "-clicked");
                ref._buttonGroup.bringToTop(button);

                ref.selectFruitRack(buttonName, x, y);
            }
        }, this);

        button.onInputUp.add(function () {
            button.loadTexture(buttonName);
        }, this);

        var fruitTween = this._game.add.tween(button.scale).to({ y: 1.02, x: 1.02 }, 500, "Linear", true, 0, -1);
        fruitTween.yoyo(true, 0);

        return button;
    }

    selectFruitRack(rackId, startPosX, startPosY) {
        var fruitIndex = this._addedFruitRacks.indexOf(rackId);
        if (fruitIndex <= -1) {
            if (this._addedFruitRacks.length < 3) {
                console.log((this._addedFruitRacks.length - 1) + ".... add " + rackId);
                console.log(this._addedFruitRacks.length);
                this.createSelectedFruit(rackId, this._addedFruitRacks.length, startPosX, startPosY);

                this._addedFruitRacks.push(rackId);

                this._addedFruitIds.push(this._rackFruit[rackId]);
            }
        } else {
            console.log(this._addedFruitRacks);
            console.log("Fruit have ever been added");
        }
    }

    createSelectedFruit(fruitCrateId, indexPos, startX, startY) {

        var fruitId = this._rackFruit[fruitCrateId];
        var pos = this._selectedPositions[indexPos];

        console.log("POS" + indexPos + " : ");

        var fruitSprite = this._game.add.sprite(startX, startY, fruitId);
        this._game.add.tween(fruitSprite).to({ x: pos.x, y: pos.y }, 300, Phaser.Easing.Quartic.InOut, true, 50);

        this._selectedFruitGroup.add(fruitSprite);
        fruitSprite.anchor.set(0.5);
        this._selectedFruitsSprites.push(fruitSprite);

    }

    createSellerButtons() {
        var btnSubmit = this._game.add.button(600, 310, "btn-submit");
        var btnDelete = this._game.add.button(700, 310, "btn-delete");

        btnDelete.onInputDown.add(this.btnDelete_OnDown, this);
        btnSubmit.onInputDown.add(this.btnSubmit_OnDown, this);
    }

    btnDelete_OnDown() {
        if (this._isPlaying)
            this.clearSelectedFruits();
    }

    btnSubmit_OnDown() {
        if (this._isPlaying && !this._isBuyerServed && this._hasGreeted)
            this.checkShopCorrect();
    }

    checkShopCorrect() {

        this._isBuyerServed = true;

        var i = 0;
        var allCorrect = true;
        do {
            var fruitId = this._shopItems[i];
            var sellerItemIndex = this._addedFruitIds.indexOf(fruitId)
            if (sellerItemIndex < 0) {
                allCorrect = false;
            }
            i++;
        } while (allCorrect && i < this._shopItems.length);

        if (allCorrect) {

            this.addScore(this._shopItems.length);

            // put to final score data
            for (var i = 0; i < this._shopItems.length; i++) {
                var fruitId = this._shopItems[i];
                this._finalScoreObjects[fruitId].count++;
            }

            this.showCorrectMark();

            var ref = this;

            setTimeout(function () {
                ref.giveSelectedFruits(ref._buyerPositions[0].x, ref._buyerPositions[0].y);
                ref.clearShop();
                setTimeout(function () { ref.shiftBuyer(true); }, 350);
            }, 500);

        } else {
            // wrong animation
            this.buyerWrongAnimation();

            this.showFalseMark();


            this.buyerExit("BUYER_WRONG_ITEM");
        }
    }

    buyerExit(condition) {
        var ref = this;
        setTimeout(function () {
            ref.clearSelectedFruits();
            ref.clearShop();
            setTimeout(function () { ref.shiftBuyer(false, condition); }, 350);
        }, 500);
    }

    addScore(score) {
        this._currentScore += score * this.SCORE_MULTIPLIER;
        console.log("current score:" + this._currentScore);
        this._scoreText.text = "x " + this._currentScore.toString();

        this.OnScoreAdded.dispatch(this._currentScore);
    }

    setScore(score) {
        this._currentScore = score * this.SCORE_MULTIPLIER;
        console.log("current score:" + this._currentScore);
        this._scoreText.text = "x " + this._currentScore.toString();

        this.OnScoreAdded.dispatch(this._currentScore);
    }

    clearSelectedFruits() {
        for (var i = 0; i < this._selectedFruitsSprites.length; i++) {
            this._selectedFruitsSprites[i].destroy();
        }

        this._selectedFruitsSprites = [];
        this._addedFruitRacks = [];
        this._addedFruitIds = [];
    }

    giveSelectedFruits(targetX, targetY) {
        for (var i = 0; i < this._selectedFruitsSprites.length; i++) {
            // this._selectedFruitsSprites[i].destroy();
            let fruit = this._selectedFruitsSprites[i];
            this._game.add.tween(fruit).to({ x: targetX + 50, y: targetY }, 180, Phaser.Easing.Quartic.Out, true, i * 100)
                .onComplete.add(function () {
                    fruit.destroy();
                });
        }

        this._selectedFruitsSprites = [];
        this._addedFruitRacks = [];
        this._addedFruitIds = [];
    }

    clearSelectedFruits() {
        for (var i = 0; i < this._selectedFruitsSprites.length; i++) {
            // this._selectedFruitsSprites[i].destroy();
            let fruit = this._selectedFruitsSprites[i];
            fruit.destroy();
        }

        this._selectedFruitsSprites = [];
        this._addedFruitRacks = [];
        this._addedFruitIds = [];
    }

    createSeller() {
        this._mainChar = this._game.add.sprite(640, 170, "seller");
    }

    createBuyerTimer() {

        this._buyerTimerGroup = this._game.add.group();

        var timerBase = this._game.add.sprite(255, 260, "timer-base");

        // timer bar
        this._timerBar = game.add.graphics(0, 0);
        this._timerBar.anchor.x = 0;
        this._timerBar.anchor.y = 0.5;
        this._timerBar.beginFill(0xF84D44, 1);
        this._timerBar.drawRect(291, 281, this._initialTimeWidth, 9);

        this._buyerTimerGroup.add(timerBase);
        this._buyerTimerGroup.add(this._timerBar);

        this._currentBuyerTime = this.INITIAL_BUYER_TIME;
        this.updateBuyerTimer(this._currentBuyerTime);

    }

    updateBuyerTimer(time) {
        this._timerBar.clear();
        this._timerBar.drawRect(291, 281, time / this.INITIAL_BUYER_TIME * this._initialTimeWidth, 9);
    }

    createBuyer() {
        var buyer = null;

        var randomBuyer = Math.floor(Math.random() * 3);

        switch (randomBuyer) {
            case 0:
                buyer = this._game.add.sprite(0, 0, "buyer");
                break;
            case 1:
                buyer = this._game.add.sprite(0, 0, "buyer-b");
                break;
            default:
                buyer = this._game.add.sprite(0, 0, "buyer-c");
                break;
        }


        buyer.anchor.set(0.5);

        this._buyerGroup.add(buyer);

        this._addedBuyersSprites.push(buyer);

        // initial  pos
        buyer.x = -100;
        buyer.y = this._buyerPositions[0].y;


        // destroy most front customer
        if (this._addedBuyersSprites.length > 3) {
            this._addedBuyersSprites[0].destroy();
            this._addedBuyersSprites.shift();
        }

        this.repositionAllBuyer();
    }

    repositionAllBuyer() {

        // reposition all buyer 
        for (var i = 0; i < this._addedBuyersSprites.length; i++) {
            var buyerPos = this._buyerPositions[i];
            let movingBuyer = this._addedBuyersSprites[i];
            this._game.add.tween(movingBuyer).to({ x: buyerPos.x, y: buyerPos.y }, 300, Phaser.Easing.Bounce.Out, true, i * 100);
        }

        // switch current most front buyer for tweening
        if (this._mostFrontBuyerTween != null) {
            this._mostFrontBuyerTween.stop();
        }
        this._mostFrontBuyerTween = this._game.add.tween(this._addedBuyersSprites[0]).to({ y: buyerPos.y - 10 }, 500, Phaser.Easing.Bounce.Out, true, 0, -1);
        this._mostFrontBuyerTween.yoyo(true, 0);

    }

    shiftBuyer(isThanks = false, condition = "") {
        this._hasBuyerNoticed = false;

        var ref = this;

        let soundTime = 200;
        let balloonAnimTime = 600;

        let showBalloon = true;

        if (isThanks) {
            // ref.talkExtra("BUYER_RIGHT_ITEM");
            ref._thanksGroup.visible = true;
            ref._sorryGroup.visible = false;

            soundTime = ref.BUYER_THANKS_TIME;
            showBalloon = true;
        } else {
            ref._thanksGroup.visible = false;
            ref._sorryGroup.visible = true;

            var sorryText = "";

            if (condition == "BUYER_WRONG_ITEM") {
                // ref.talkExtra("BUYER_WRONG_ITEM");
                sorryText = ref.BUYER_WRONG_ITEM_TEXT
                soundTime = ref.BUYER_WRONG_ITEM_TIME;
                showBalloon = true;
            }
            else if (condition == "TOO_LONG_TIME") {
                // ref.talkExtra("TOO_LONG_TIME");
                sorryText = ref.TOO_LONG_TIME_TEXT
                soundTime = ref.BUYER_TOO_LONG_TIME;
                showBalloon = true;
            }

            ref._sorryText.text = sorryText + "\u200F";

        }
        // soundTime = ref._currentTalkingAudioExtra.totalDuration * 1000;

        ref._shopListGroup.visible = false;
        ref._greetBButtonGroup.visible = false;

        var ref = this;
        var offset = 50;
        ref._buyerBalloonGroup.y = 0 - offset;



        if (showBalloon) {
            ref._buyerBalloonGroup.visible = true;
        } else {
            ref._buyerBalloonGroup.visible = false;
        }

        ref._game.add.tween(ref._buyerBalloonGroup).to({ y: 0 }, balloonAnimTime, Phaser.Easing.Quartic.Out, true)
            .onComplete.add(function () {

                setTimeout(function () {

                    ref._buyerBalloonGroup.visible = true;

                    // move most front out of screen
                    var mostFrontBuyer = ref._addedBuyersSprites[0];
                    ref._game.add.tween(mostFrontBuyer).to({ y: -80 }, 400, Phaser.Easing.Quartic.In, true)
                        .onComplete.add(function () {
                            mostFrontBuyer.destroy();
                            ref._addedBuyersSprites.shift();

                            ref._currentBuyerTime = ref.INITIAL_BUYER_TIME;
                            ref.updateBuyerTimer(ref._currentBuyerTime);

                            ref.createBuyer();
                            ref.showGreetButton();

                            ref._isBuyerServed = false;
                            ref._hasGreeted = false;

                            ref._isBuyerTimingOut = false;

                        });

                }, soundTime - balloonAnimTime);
            });



    }

    update() {
        // if (this._game.input.activePointer.leftButton.isDown) {
        //     console.log(this._game.input.activePointer.position);
        // }

        if (this._isPlaying) {
            if (this._currentSecondsElapsed <= 0) {
                this.OnTimeEnd.dispatch();

                this.setIsPlaying(false);
                this.showFinalScoreWindow();
            } else {
                this.updateGameTime();


                this.updateBuyerTime();

            }
        }

    }

    updateGameTime() {
        this._currentSecondsElapsed -= this._game.time.elapsedMS;
        this.setTime(this._currentSecondsElapsed);
    }

    updateBuyerTime() {
        // buyer timer update
        // if (!this._hasBuyerNoticed) {
        if (!this._isBuyerServed) {
            if (!this._isBuyerTimingOut && this._currentBuyerTime > 0) {
                this._currentBuyerTime -= this._game.time.elapsedMS;
                this.updateBuyerTimer(this._currentBuyerTime);
            } else {
                if (this._currentBuyerTime <= 0 && !this._isBuyerTimingOut) {
                    this.buyerExit("TOO_LONG_TIME");
                    this._isBuyerTimingOut = true;
                }
            }
        }
        // }
    }

    createBuyerBalloon() {
        this._buyerBalloonGroup = this._game.add.group();
        this._buyerBalloon = this._game.add.sprite(this._buyerBalloonPos.x, this._buyerBalloonPos.y, "balloon-buyer");
        this._buyerBalloon.anchor.set(0.5);

        this._buyerBalloonGroup.add(this._buyerBalloon);

        this._shopListGroup = this._game.add.group();
        this._buyerBalloonGroup.add(this._shopListGroup);


        this.createGreetButton();
        this.createShopList();
        this.createThanks();
        this.createSorry();

        this._judgementGroup = this._game.add.group();
        this._buyerBalloonGroup.add(this._judgementGroup);
        this.createJudgementMarks();
        this.hideJudgementMarks();

    }

    createGreetButton() {
        this._greetBButtonGroup = this._game.add.group();
        this._buyerBalloonGroup.add(this._greetBButtonGroup);

        var position = { x: 220, y: 418 };
        var ref = this;

        // create button
        var btnGreet = this._game.add.button(position.x, position.y, "btn-greet");
        btnGreet.anchor.set(0.5);
        this._greetBButtonGroup.add(btnGreet);
        btnGreet.onInputDown.add(ref.btnGreet_onDown, this);

        // create text
        var greetTextOption = { font: "35px Harmattan", fill: "#0c7162", align: "right", wordWrap: true, wordWrapWidth: 300 };
        var greetText = this._game.add.text(position.x, position.y, this.GREET_BUTTON_TEXT, greetTextOption);
        greetText.anchor.set(0.5);
        this._greetBButtonGroup.add(greetText);

        var greetTween = this._game.add.tween(btnGreet.scale).to({ x: 1.05, y: 1.05 }, 500, Phaser.Easing.Quartic.InOut, true, 0, -1);
        greetTween.yoyo(true, 0);
    }

    createThanks() {
        this._thanksGroup = this._game.add.group();
        this._buyerBalloonGroup.add(this._thanksGroup);

        var position = { x: 227, y: 420 };
        var ThanksTextOption = { font: "30px Harmattan", fill: "#0c7162", align: "center", wordWrap: true, wordWrapWidth: 300 };
        var ThanksText = this._game.add.text(position.x, position.y, this.BUYER_RIGHT_ITEM_TEXT, ThanksTextOption);
        ThanksText.anchor.set(0.5);
        this._thanksGroup.add(ThanksText);
    }

    createSorry() {
        this._sorryGroup = this._game.add.group();
        this._buyerBalloonGroup.add(this._sorryGroup);

        var position = { x: 227, y: 420 };
        var SorryTextOption = { font: "30px Harmattan", fill: "#0c7162", align: "center", wordWrap: true, wordWrapWidth: 300 };
        this._sorryText = this._game.add.text(position.x, position.y, "Sorry", SorryTextOption);
        this._sorryText.anchor.set(0.5);
        this._sorryGroup.add(this._sorryText);
    }

    createShopList() {

        // create text
        var position = { x: 220, y: 380 };
        var answerGreetTextOption = { font: "25px Harmattan", fill: "#0c7162", align: "center", wordWrap: true, wordWrapWidth: 300 };
        var answerGreetText = this._game.add.text(position.x, position.y, this.BUYER_RESPONSE_TEXT + "\u200F", answerGreetTextOption);
        answerGreetText.anchor.set(0.5);
        this._shopListGroup.add(answerGreetText);

        this.generateRandomShopList();
    }

    generateRandomShopList() {

        // clear previous items
        for (var i = 0; i < this._shopListSprites.length; i++) {
            this._shopListSprites[i].destroy();
        }
        this._shopListSprites = [];
        this._shopItems = [];

        // randomize shop list
        for (var i = 0; i < this._shopListPositions.length; i++) {
            var selectedItem = "";
            do {
                var index = Math.floor(Math.random() * this._fruitTypes.length);
                selectedItem = this._fruitTypes[index];
            } while (this._shopItems.indexOf(selectedItem) >= 0);
            this._shopItems.push(selectedItem);
        }

        for (var i = 0; i < this._shopListPositions.length; i++) {
            var pos = this._shopListPositions[i];
            var shopItem = this._game.add.sprite(pos.x, pos.y, this._shopItems[i]);
            shopItem.anchor.set(0.5);
            this._shopListGroup.add(shopItem);

            this._shopListSprites.push(shopItem);
        }
    }

    btnGreet_onDown() {
        if (this._isPlaying) {
            this._greetBButtonGroup.visible = false;
            this._buyerBalloonGroup.visible = false;

            this._sellerBalloonGroup.visible = true;

            this.greetingsOrchestration();
        }
    }

    createSellerBalloon() {
        var position = { x: 679, y: 110 };
        this._sellerBalloonGroup = this._game.add.group();
        this._sellerBalloon = this._game.add.sprite(position.x, position.y, "balloon-seller");
        this._sellerBalloon.anchor.set(0.5);

        this._sellerBalloonGroup.add(this._sellerBalloon);

        var greetTextOption = { font: "22px Harmattan", fill: "#b15315", align: "center", wordWrap: true, wordWrapWidth: 200 };
        var greetText = this._game.add.text(position.x, position.y - 5, this.SELLER_GREET_TEXT + "\u200F", greetTextOption)
        greetText.anchor.set(0.5);
        this._sellerBalloonGroup.add(greetText)
    }

    clearShop() {
        this._shopListGroup.visible = false;
        this._sellerBalloonGroup.visible = false;
        // this._buyerBalloonGroup.visible = false;
        this._thanksGroup.visible = false;
        this._sorryGroup.visible = false;
    }

    showGreetButton() {

        this._rackInteractable = false;

        var ref = this;

        var offset = 50;
        ref._buyerBalloonGroup.y -= offset;
        ref._buyerBalloonGroup.visible = true;
        ref._greetBButtonGroup.visible = true;
        ref._thanksGroup.visible = false;
        ref._sorryGroup.visible = false;
        ref._game.add.tween(ref._buyerBalloonGroup).to({ y: 0 }, 600, Phaser.Easing.Bounce.Out, true)
            .onComplete.add(function () {

            });
    }

    greetingsOrchestration() {
        // this._buyerBaloonGroup.scale.set(0.5);

        this._hasBuyerNoticed = true;

        var ref = this;
        var offset = 50;

        ref._sellerBalloonGroup.y += offset;

        // ref.talkExtra("SELLER_GREET");

        const baloonAnimTime = 600;

        // show seller balloon
        ref._game.add.tween(ref._sellerBalloonGroup).to({ y: ref._sellerBalloonGroup.y - offset }, baloonAnimTime, Phaser.Easing.Bounce.Out, true)
            .onComplete.add(function () {

                // show buyer balloon
                setTimeout(function () {

                    ref._sellerBalloonGroup.visible = false;
                    ref._buyerBalloonGroup.visible = true;
                    ref._shopListGroup.visible = true;
                    ref.generateRandomShopList();
                    ref._rackInteractable = true;

                    ref._buyerBalloonGroup.y -= offset;

                    // ref.talkExtra("BUYER_RESPONSE");

                    ref._game.add.tween(ref._buyerBalloonGroup).to({ y: ref._buyerBalloonGroup.y + offset }, 600, Phaser.Easing.Bounce.Out, true)
                        .onComplete.add(function () {
                            ref._hasGreeted = true;
                        });

                    // }, (ref._currentTalkingAudioExtra.totalDuration * 1000) - baloonAnimTime);
                }, baloonAnimTime);

            });
    }

    buyerWrongAnimation() {
        var ref = this;
        var buyer = this._addedBuyersSprites[0];
        this._game.add.tween(buyer).to({ y: buyer.y - 30 }, 500, Phaser.Easing.Bounce.InOut, true)
            .onComplete.add(function () {
                buyer.y = ref._buyerPositions[0].y;
            });
    }

    createScoreUI() {
        this._game.add.sprite(18, 18, "base-ui");
        var iconCoin = this._game.add.sprite(52, 53, "icon-coins");
        iconCoin.anchor.set(0.5);


        // create text
        var position = { x: 80, y: 33 };
        var scoreTextOption = { font: "30px Vag", fill: "#07abf8", align: "left" };
        this._scoreText = this._game.add.text(position.x, position.y, "x " + this._currentScore.toString(), scoreTextOption);
    }

    createTimerUI() {
        this._game.add.sprite(195, 18, "base-ui");
        var iconTimer = this._game.add.sprite(228, 53, "icon-timer");
        iconTimer.anchor.set(0.5);

        // create text
        var position = { x: 300, y: 55 };
        var timerTextOption = { font: "30px Vag", fill: "#f86d07", align: "left" };
        this._timerText = this._game.add.text(position.x, position.y, "00:00", timerTextOption);
        this._timerText.anchor.set(0.5);
    }

    setTime(time) {
        this._currentSecondsElapsed = time;

        this._elapsedSec = Math.round(this._currentSecondsElapsed / 1000);

        var seconds = Math.floor(this._elapsedSec % 60);
        var minutes = Math.floor(this._elapsedSec / 60);

        var secondsStr = (seconds < 10 ? "0" + seconds.toString() : seconds.toString());
        var minutesStr = (minutes < 10 ? "0" + minutes.toString() : minutes.toString());

        this._timerText.text = minutesStr + ":" + secondsStr;
    }

    createJudgementMarks() {
        this._correctMark = this._game.add.sprite(218, 413, "ans-right");
        this._correctMark.anchor.set(0.5);
        this._judgementGroup.add(this._correctMark);

        this._falseMark = this._game.add.sprite(218, 413, "ans-wrong");
        this._falseMark.anchor.set(0.5);
        this._judgementGroup.add(this._falseMark);
    }

    showCorrectMark() {
        this._correctMark.visible = true;
        this._falseMark.visible = false;

        this._correctMark.scale.set(0);
        this._game.add.tween(this._correctMark.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Bounce.Out, true);

        var ref = this;
        setTimeout(function () { ref.hideJudgementMarks(); }, 500);
    }

    showFalseMark() {
        this._correctMark.visible = false;
        this._falseMark.visible = true;

        this._falseMark.scale.set(0.1);
        this._game.add.tween(this._falseMark.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Bounce.Out, true);

        var ref = this;
        setTimeout(function () { ref.hideJudgementMarks(); }, 500);
    }

    hideJudgementMarks() {
        this._correctMark.visible = false;
        this._falseMark.visible = false;
    }

    createFinalScoreWindow() {

        this._finalScoreGroup = this._game.add.group();

        // black overlay
        this.blackOverlay = game.add.graphics(0, 0);
        this.blackOverlay.beginFill(0x000000, 1);
        this.blackOverlay.drawRect(0, 0, game.width, game.height);
        this.blackOverlay.alpha = 0.7;
        this._finalScoreGroup.add(this.blackOverlay);


        // result window
        this._resultWindow = this._game.add.sprite(game.width / 2, game.height / 2, "base-result");
        this._resultWindow.anchor.set(0.5);

        this._finalScoreGroup.add(this._resultWindow);

        // result fruits

        var resultData = {
            grape: {
                pos: { x: 285, y: 187 }
            },
            lemon: {
                pos: { x: 461, y: 187 }
            },
            date: {
                pos: { x: 635, y: 187 }
            },
            apple: {
                pos: { x: 369, y: 274 }
            },
            orange: {
                pos: { x: 542, y: 274 }
            }
        };

        for (var key in resultData) {

            var data = resultData[key];
            var sprite = this._game.add.sprite(data.pos.x, data.pos.y, key);
            sprite.anchor.set(0.5);


            this._finalScoreGroup.add(sprite);

            // create text
            var fruitCountTextPosition = { x: data.pos.x + 63, y: data.pos.y + 5 };
            var fruitCountTextOption = { font: "30px Vag", fill: "#f86d07", align: "left" };
            var fruitCountText = this._game.add.text(fruitCountTextPosition.x, fruitCountTextPosition.y, "x 10", fruitCountTextOption);
            fruitCountText.anchor.set(0.5);

            this._finalScoreGroup.add(fruitCountText);


            this._finalScoreObjects[key] = {};
            this._finalScoreObjects[key].icon = sprite;
            this._finalScoreObjects[key].text = fruitCountText;
            this._finalScoreObjects[key].count = 0;
        }

        // create text
        var totalScoreTextPosition = { x: 401, y: 346 };
        var totalScoreTextOption = { font: "30px Vag", fill: "#f86d07", align: "center" };
        this._finalTotalScoreText = this._game.add.text(totalScoreTextPosition.x, totalScoreTextPosition.y, "", totalScoreTextOption);

        this._finalScoreGroup.add(this._finalTotalScoreText);
    }

    hideFinalScoreWindow() {
        this._finalScoreGroup.visible = false;
    }

    showFinalScoreWindow() {
        this._finalScoreGroup.visible = true;
        var ref = this;

        var dataList = [];

        for (var key in this._finalScoreObjects) {
            let data = this._finalScoreObjects[key];
            let icon = data.icon;
            let text = data.text;
            dataList.push(data);

            icon.scale.set(0);

            text.text = "";
        }


        ref.showFinalScoreItem(dataList[0], dataList, 0, function () {
            console.log("Complete");

            ref._finalTotalScoreText.text = "مجموع  " + ref._currentScore;

            ref.OnGameCompleted.dispatch();
        });
    }



    showFinalScoreItem(data, dataList, itData, onComplete) {
        var ref = this;

        let icon = data.icon;
        let text = data.text;
        let count = data.count;

        let currentCount = 0;

        let intervalId = null;

        icon.scale.set(0);

        this._game.add.tween(icon.scale).to({ x: 1, y: 1 }, 300, Phaser.Easing.Bounce.Out, true);

        setTimeout(function () {

            intervalId = setInterval(function () {
                text.text = "x " + currentCount.toString();
                if (currentCount < count) {
                    currentCount++;
                } else {
                    clearInterval(intervalId);

                    itData++;
                    if (itData < dataList.length) {
                        setTimeout(function () { ref.showFinalScoreItem(dataList[itData], dataList, itData, onComplete); }, 500);
                    } else {
                        onComplete();
                    }
                }
            }, 90);
        }, 200);
    }

    setIsPlaying(value) {
        this._isPlaying = value;
    }
}