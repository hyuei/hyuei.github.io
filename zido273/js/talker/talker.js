Talker = function(game, x, y, talkerWidth, talkerHeight){
    Phaser.Sprite.call(this, game, x, y, 'dialogue-box')
    this.bgWidth = talkerWidth;
    this.bgHeight = talkerHeight;

    this.initView();

    this.talkingArray = [];
    this.talkIndex = 0;

    this.onNext = new Phaser.Signal();
    this.onFinish = new Phaser.Signal();
    this.onStart = new Phaser.Signal();

    this.currentAudio = null;

    this.audioDataList = {};
    this.finished = false;
    this.clickTimer = game.time.now;
};

Talker.inherit({
    initView:function()
    {
        // var nineSlice = game.add.nineSlice(0, 0, 'dialogue-box', null, this.bgWidth, this.bgHeight);
        // this.addChild(nineSlice);
        // var bgImage = game.add.sprite(0,0, 'dialogue-box');
        // this.addChild(bgImage);

        var leftPadding = 130;
        var topPadding = 30;
        this.isClicked = false;

        var x = -this.width * 0.43;
        var y = -this.height * 0.35;
        var font = "30px " + global.font1;
        var nameTextOption = {font:font, fill: "#000000", align: "right", wordWrap:true, wordWrapWidth:this.bgWidth - (leftPadding/2)};
        this.name = this.game.add.text(x, y, "name",  nameTextOption);
        this.name.anchor.setTo(1, 0);
        this.name.x += this.name.width;
        this.addChild(this.name);

        var textAreaWidth = this.width * 0.86;
        var x = this.width * 0.43;
        var y = this.name.y + this.name.height - 5;
        font = "30px " + global.font1;
        var textOption = {font: font, fill: "#834711", align: "right", boundsAlignH: "right", wordWrap:true, wordWrapWidth:textAreaWidth};
        this.content = this.game.add.text(x, y, "test",  textOption);
        this.content.anchor.setTo(1, 0);
        this.addChild(this.content);

        var x = (this.width * 0.5) - 50;
        var y = (this.height * 0.5) - 70
        var arrowPos = {x:x, y:y};
        var arrowPosOffset = {x:x, y:y + 10};
        var nextArrow = global.addSprite(arrowPos.x, arrowPos.y, "ingame/next-arrow");
        this.addChild(nextArrow);
        this.game.add.tween(nextArrow).to(arrowPosOffset, 500, Phaser.Easing.Exponential.Out, true).loop(true).yoyo(true);

        // var tapTxt = global.addText((-this.width * 0.5) + 50, nextArrow.y, STRINGS_DATA.data.taptocontinue, 20, global.font1);
        // tapTxt.anchor.setTo(1, 0);
        // tapTxt.x += tapTxt.width;
        // tapTxt.fill = 'maroon'
        // this.addChild(tapTxt)
        
        this.game.input.onDown.add(this.onDown, this);
    },

    onDown:function()
    {
        if(this.isClicked) return;
        if(transition && transition.isClosed) return;
        if(game.time.now < this.clickTimer) return;
        this.clickTimer = game.time.now + 500;
        this.isClicked = true;
        this.nextButtonOnClick();
    },

    startTalk:function()
    {
        console.log("START TALK");
        this.talkIndex = 0;
        this.finished = false;
        this.updateTalk();
        
        this.onStart.dispatch(this);
    },

    next:function()
    {
        if (this.talkIndex < this.talkingArray.length-1)
        {
            this.talkIndex++;
            this.updateTalk();
            return true;
        }
        else
        {
            return false;
        }
    },

    updateTalk:function()
    {
        this.name.text = this.talkingArray[this.talkIndex].char;
        // this.name.setText('Test')
        var mode = 'talk';
        var txt = this.talkingArray[this.talkIndex][mode];
        if(curState().tutorId == 2 && this.talkIndex == 1){
            // console.log('min: '+ min)
            txt = _t(txt, curState().tutorMinBoxPoint, curState().tutorMinBoxPoint)
        }

        if(txt.length == 0){
            txt = this.talkingArray[this.talkIndex]['en']
        }

        this.content.text = txt + "\u200F";

        if(this.talkingArray[this.talkIndex].hasOwnProperty('voice'))
        {
            if(this.currentAudio && this.currentAudio.isPlaying)
            {
                this.currentAudio.stop();
            }

            var audioKey = this.talkingArray[this.talkIndex].voice;
            // console.log(audioKey);
            if(audioKey.length > 0){
                if(this.audioDataList.hasOwnProperty(audioKey))
                {
                    this.currentAudio = this.audioDataList[audioKey]
                    if(this.currentAudio != null)
                    {
                        SoundData.sfxPlay(audioKey);
                    }
                }
            }
        }
    },

    loadTalkingArray:function(talkingData)
    {
        // console.log(JSON.stringify(talkingData));
        this.talkingArray = talkingData;
        
        this.addAudios(this.game, talkingData);
    },

    addAudios:function(game, talkingArray)
    {
        for (var itTalk = 0; itTalk < talkingArray.length; itTalk++)
        {
            if(this.talkingArray[itTalk].hasOwnProperty("voice"))
            {
                var fileName = this.talkingArray[itTalk].voice;
                if(fileName.length > 0){
                    this.audioDataList[fileName] = SoundData.sfxObj[fileName];
                }
            }
        }
    },

    destroyAudios:function()
    {
        //TODO: Find way to destroy audios

        for (var itTalk = 0; itTalk < Object.keys(this.audioDataList).length; itTalk++)
        {
            var fileName = this.talkingArray[itTalk].voice;
            var key = Object.keys(this.audioDataList)[itTalk];
            console.log("Destroy " + key);
            this.audioDataList[key].destroy(true);
        }
    },

    nextButtonOnClick:function()
    {
        if(this.finished)
            return;

        if(this.next())
        {
            this.onNext.dispatch(this);
            game.time.events.add(100, function(){
                this.isClicked = false;
            }, this)
        }
        else
        {
            this.game.input.onDown.remove(this.onDown, this);
            this.onNext.dispatch(this);

            this.visible = false;
            if(this.currentAudio != null)
            {
                this.currentAudio.stop();    
            }

            this.onFinish.dispatch(this);

            this.finished = true;

            this.destroy();
        }
    },

    shutdown:function()
    {
        if(this.currentAudio != null)
        {
            this.currentAudio.stop();
        }

        this.destroyAudios();
    },
}, Phaser.Sprite);