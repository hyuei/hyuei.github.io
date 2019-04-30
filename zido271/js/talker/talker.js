class Talker extends Phaser.Sprite {
    constructor(game, x, y, talkerWidth, talkerHeight) {
        super(game, x, y);

        this.y = this.y - talkerHeight;

        this.bgWidth = talkerWidth;
        this.bgHeight = talkerHeight;

        this.initView();

        this.talkingArray = [];
        this.talkIndex = 0;

        this.onNext = new Phaser.Signal();
        this.onFinish = new Phaser.Signal();
        this.onStart = new Phaser.Signal();
        this.onReceiveMetadata = new Phaser.Signal();

        this.currentAudio = null;

        this.audioDataList = {};
        this.finished = false;
    }

    initView() {
        // var nineSlice = game.add.nineSlice(0, 0, 'dialogue-box', null, this.bgWidth, this.bgHeight);
        // this.addChild(nineSlice);
        var bgImage = game.add.sprite(this.bgWidth/2, this.bgHeight/2, 'dialogue-box');
        bgImage.anchor.set(0.5);

        bgImage.inputEnabled = true;
        bgImage.events.onInputOver.add(this.scaleCursor, this, 0, bgImage);
        bgImage.events.onInputOut.add(this.scaleOutCursor, this, 0, bgImage);

        this.addChild(bgImage);

        var leftPadding = 130;
        var topPadding = 30;

        var nameTextOption = { font: "30px Harmattan", fill: "#000000", align: "right", wordWrap: true, wordWrapWidth: this.bgWidth - (leftPadding / 2) };
        this.name = this.game.add.text(leftPadding / 4, topPadding / 2, "name", nameTextOption);
        this.addChild(this.name);

        var textOption = { font: "25px Harmattan", fill: "#000000", align: "right", boundsAlignH: "right", wordWrap: true, wordWrapWidth: this.bgWidth - (leftPadding / 2) };
        this.content = this.game.add.text(leftPadding / 4, topPadding / 2 + 30, "test", textOption);
        this.content.setTextBounds(0, 0, this.bgWidth - (leftPadding / 2), this.bgHeight);
        this.addChild(this.content);

        // draw button
        // this.nextButton = game.add.button(this.bgWidth - 50, this.bgHeight - 50, 'next-btn', this.nextButtonOnClick, this);
        // this.addChild(this.nextButton);
        var arrowPos = { x: this.bgWidth - 50, y: this.bgHeight - 50 };
        var arrowPosOffset = { x: this.bgWidth - 50, y: this.bgHeight - 50 + 10 };
        var nextArrow = game.add.sprite(arrowPos.x, arrowPos.y, "next-arrow");
        this.addChild(nextArrow);
        this.game.add.tween(nextArrow).to(arrowPosOffset, 500, Phaser.Easing.Exponential.Out, true).loop(true).yoyo(true);

        this.game.input.onDown.add(this.onDown, this);

        this.visible = false;
    }

    onDown() {
        this.nextButtonOnClick();
    }

    startTalk() {
        console.log("START TALK");

        this.talkIndex = 0;
        this.finished = false;
        this.updateTalk();

        this.visible = true;

        this.onStart.dispatch();
    }

    startTalkWithDelay(delay) {
        console.log("START TALK");

        var ref = this;
        setTimeout(function () {
            ref.talkIndex = 0;
            ref.finished = false;
            ref.updateTalk();
            ref.visible = true;
        }, delay);

        ref.onStart.dispatch();

    }

    next() {
        if (this.talkIndex < this.talkingArray.length - 1) {
            this.talkIndex++;
            this.updateTalk();


            return true;
        }
        else {
            return false;
        }
    }

    updateTalk() {
        this.name.text = this.talkingArray[this.talkIndex].char;

        this.content.text = this.talkingArray[this.talkIndex].talk + "\u200F";


        if (this.talkingArray[this.talkIndex].hasOwnProperty('voice')) {
            if (this.currentAudio !== null) {
                this.currentAudio.stop();
            }

            // this.currentAudio = game.add.audio(this.talkingArray[this.talkIndex].voice, true);
            var audioKey = this.talkingArray[this.talkIndex].voice;
            if (this.audioDataList.hasOwnProperty(audioKey)) {
                if (this.audioDataList[audioKey] != null) {
                    this.currentAudio = this.audioDataList[audioKey];
                    this.currentAudio.play();
                }
            }
        }
    }

    loadTalkingArray(talkingData) {
        this.talkingArray = talkingData;

        this.addAudios(this.game, talkingData);
    }

    addAudios(game, talkingArray) {
        for (var itTalk = 0; itTalk < talkingArray.length; itTalk++) {
            if (this.talkingArray[itTalk].hasOwnProperty("voice")) {
                var fileName = this.talkingArray[itTalk].voice;
                this.audioDataList[fileName] = game.add.audio(fileName, true);
            }
        }
    }

    destroyAudios() {
        //TODO: Find way to destroy audios

        // for (var itTalk = 0; itTalk < Object.keys(this.audioDataList).length; itTalk++)
        // {
        //     var fileName = this.talkingArray[itTalk].voice;
        //     var key = Object.keys(this.audioDataList)[itTalk];
        //     console.log("Destroy " + key);
        //     this.audioDataList[key].destroy(true);
        // }
    }

    nextButtonOnClick() {
        if (this.finished) {
            return;
        }


        if (this.next()) {
            this.onNext.dispatch();


            // execute previous talking metadata
            var targetMetaIndex = this.talkIndex - 1;
            if (targetMetaIndex >= 0 || targetMetaIndex < this.talkingArray.length) {
                if (this.talkingArray[targetMetaIndex].hasOwnProperty('postmeta')) {
                    this.onReceiveMetadata.dispatch(this.talkingArray[targetMetaIndex].postmeta);
                }
            }

            //execute current talking metadata
            if (this.talkingArray[this.talkIndex].hasOwnProperty('premeta')) {
                this.onReceiveMetadata.dispatch(this.talkingArray[this.talkIndex].premeta);
            }
        }
        else {
            this.onNext.dispatch();

            this.visible = false;

            if (this.currentAudio !== null) {
                this.currentAudio.stop();
            }

            var ref = this;
            setTimeout(function () {
                ref.onFinish.dispatch();
            }, 150);


            this.finished = true;

            var targetMetaIndex = this.talkIndex;
            if (targetMetaIndex >= 0 || targetMetaIndex < this.talkingArray.length) {
                if (this.talkingArray[targetMetaIndex].hasOwnProperty('postmeta')) {
                    this.onReceiveMetadata.dispatch(this.talkingArray[targetMetaIndex].postmeta);
                }
            }
        }


    }

    shutdown() {
        if (this.currentAudio != null) {
            this.currentAudio.stop();
        }

        // this.destroyAudios();
    }


    scaleCursor(bgImage){
        bgImage.scale.setTo(1.03);
    }

    scaleOutCursor(bgImage){
        bgImage.scale.setTo(1);
    }

}