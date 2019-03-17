Game1Screen = function(game){

};

Game1Screen.inherit({
    preload:function(){
        // super.preload();
        GameScreen.prototype.preload.call(this);
    },
    
    create:function(){
        // console.log("game 1 screen");
        GameScreen.prototype.create.call(this)
        
        this.gameStart = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.score = 0;
        this.maxTime = 150;
        this.plTime = this.maxTime;
        this.tutorId = 0;
        this.stageReady = false;
        this.startCountdown = false;
        this.curCD = 0;
        this.tutorTalker = null;
        this.isWin = false;

        this.curStage = 0;
        this.maxLegs = 3;
        this.maxLines = 3;
        this.maxCons = 0;
        this.countTime = false;

        this.stageFg = game.add.sprite(this.centerX, this.centerY, 'bg-transition');
        this.stageFg.anchor.setTo(0.5);
        this.stageFg.alpha = 0
        this.g0.add(this.stageFg)

        this.gInGame = game.add.group();
        this.gInFront = game.add.group();

        this.gResult = new Endscreen(this.centerX, this.centerY);
        this.gFront.add(this.gResult);    

        this.bg = game.add.sprite(this.centerX, this.centerY, 'bg');
        this.bg.anchor.setTo(0.5);
        this.bg.inputEnabled = true;
        this.bg.x -= 26;
        this.bg.y -= 4
        this.gBG.add(this.bg);

        this.timerBg = global.addSprite(0, this.gh, 'ingame/base-ui')
        this.timerBg.anchor.setTo(0.5);
        this.timerBg.x += this.timerBg.width * 0.7;
        this.timerBg.y -= this.timerBg.height * 0.67;
        this.gInFront.add(this.timerBg)

        this.timerLogo = global.addSprite(this.timerBg.x - (this.timerBg.width * 0.5), this.timerBg.y - 5, 'ingame/icon-timer');
        this.timerLogo.anchor.setTo(0.5);
        this.timerLogo.x += this.timerLogo.width * 1.2;
        this.gInFront.add(this.timerLogo)

        this.showTime = global.addText(this.timerLogo.x + (this.timerLogo.width * 0.62), this.timerBg.y, "00:00", 27.5, global.font2);
        this.showTime.anchor.setTo(0, 0.5);
        this.showTime.fill = '#f86d07';
        this.gInFront.add(this.showTime)

        this.scoreBg = global.addSprite(this.gw, this.timerBg.y, 'ingame/base-ui');
        this.scoreBg.anchor.setTo(0.5)
        this.scoreBg.x -= this.scoreBg.width * 0.7;
        this.gInFront.add(this.scoreBg);

        this.showScore = global.addText(this.scoreBg.x, this.scoreBg.y - 2, '0', 29.8, global.font2);
        this.showScore.anchor.setTo(0.5);
        this.showScore.fill = '#07abf8';
        this.gInFront.add(this.showScore)

        // this.charas = [];
        // for(var a = 0; a < 3; a++){
        //     var charas = ['khalid', 'ammar', 'sammi'];
        //     var chara = new Chara(0, this.scoreBg.y, 'ingame/' + charas[a] + '-idle');
        //     chara.y += this.scoreBg.height * 0.4;
        //     var border = 1.7
        //     chara.x = this.centerX - (chara.width * border) + (a * chara.width * border);
        //     this.gInFront.add(chara);
        //     this.charas.push(chara)
        // }

        this.playBtn = new ClickBtn(this.centerX, this.scoreBg.y, 'ingame/play-btn-a');
        this.playBtn.onClick.add(function(){
            this.playBtn.inputEnabled = false;
            this.runWalkers();
        }, this);
        this.gInFront.add(this.playBtn)

        this.gBoard = game.add.group();
        this.gInGame.add(this.gBoard)

        this.showCountdown = global.addText(this.centerX, this.centerY, '', 100, global.font2);
        this.showCountdown.anchor.setTo(0.5);
        this.showCountdown.fill = 'red';
        this.showCountdown.stroke = 'yellow';
        this.showCountdown.strokeThickness = 3;
        this.gInFront.add(this.showCountdown)

        this.createPlayBoard()

        this.createLogo();

        this.prepareTutor();

        this.gCont.add(this.gInGame);
        this.gCont.add(this.gInFront);

        // this.gameStart = true;
        // this.countingDown();
    },

    prepareTutor:function(arg){
        this.gamePaused = true;
        var data = TALKING_DATA.talkingdata.Game1Screen['part' + (this.tutorId + 1)];
        // console.log('tutorId', this.tutorId)
        isUp = false;        

        if(this.tutorId == 0){
            this.playBtn.inputEnabled = false;
            if(!first_timer) {
                this.checkAfterTutor();
                return;
            }
        }

        if(arg) isUp = arg;
        this.createTalker(data, isUp);
    },

    checkAfterTutor:function(){        
        this.gamePaused = false;
        this.tutorTalker = null;
        if(this.tutorId == 0){
            this.gameStart = true;
            this.gamePaused = true;
            this.countingDown();
        } else if(this.tutorId == 1 || this.tutorId == 2){
            this.gameEnd();
            first_timer = false;
        }

        // this.tutorId++;
    },

    createTalker:function(data, isUp){
        if(isUp == undefined) isUp = false;
        // var talker = new Tutorial(this.centerX, 0, data);

        // this.gInFront.add(talker);

        var talker = new Talker(game, this.centerX, 0, game.world.width , TALKER_HEIGHT);
        talker.anchor.setTo(0.5)
            
        if(!isUp){
            talker.y = this.gh - (talker.height * 0.5);
        } else {
            talker.y = this.gh * 0.32
        }
        this.gFront.add(talker);
        talker.loadTalkingArray(data)
        talker.startTalk();
            
        talker.onFinish.add(this.checkAfterTutor, this);

        talker.onNext.add(function(){
            SoundData.sfxPlay("vn-cont");
            if(curState().tutorId == 0){
                if(curState().tutorImg) curState().tutorImg.destroy();
                if(this.talkIndex == 4){
                    curState().createTutorImg('ingame/tutor1');
                } else if(this.talkIndex == 5){
                    curState().createTutorImg('ingame/tutor2');
                } else if(this.talkIndex == 6){
                    curState().createTutorImg('ingame/tutor3');
                } else if(this.talkIndex == 7){
                    curState().createTutorImg('ingame/tutor4');
                }
            } 
        }, talker);

        this.tutorTalker = talker;

    },

    createArrow:function(x, y){
        this.tutorArrow = global.addSprite(x, y, 'ingame/arrow');
        this.tutorArrow.anchor.setTo(0, 0.5);
        this.gInFront.add(this.tutorArrow);

        var toX = this.tutorArrow.x - 10;
        var tween = game.add.tween(this.tutorArrow);
        tween.to({x:toX}, 500, null, true, 0, -1, true)
    },

    countingDown:function(){
        var text = parseInt(this.curCD);
        if(this.curCD < 1) {
            text = STRINGS_DATA.data.start;
            SoundData.sfxPlay('start')
        }

        this.showCountdown.setText(text);
        this.showCountdown.scale.setTo(2);
        this.showCountdown.alpha = 0

        var tweenScale = game.add.tween(this.showCountdown.scale).to({x:1, y:1}, 500).start();
        var tween = game.add.tween(this.showCountdown).to({alpha:1}, 500, Phaser.Easing.Linear.None, true)
        .onComplete.add(function(){
            game.time.events.add(1000, function(){
                this.curCD--;
                if(this.curCD >= 0){
                    this.countingDown();
                } else {
                    this.showCountdown.visible = false;
                    this.startGame();
                    this.clickCover.visible = false;
                }
            }, this)
        }, this);
    },

    runWalkers:function(){
        var allPlaced = 0;
        for(var a = 0; a < this.gPlay.walkers.length; a++){
            var walker = this.gPlay.walkers[a];
            if(walker.lineIdx >= 0){
                allPlaced++;
            }
        }
        // console.log(allPlaced)
        if(allPlaced == this.gPlay.walkers.length){
            this.gamePaused = true;
            for(var a = 0; a < this.gPlay.walkers.length; a++){
                var walk = this.gPlay.walkers[a];
                walk.startWalking();
            }
        } else {
            this.playBtn.inputEnabled = true;
        }
    },  

    nextStage:function(){
        if(this.gameOver || this.plTime <= 0) {
            this.gamePaused = false;
            return;
        }
        if(this.curStage >= 4) {
            // this.gResult.tweenIn();
            if(this.plTime > 0){
                this.tutorId = 2;
                this.isWin = true;
                this.prepareTutor();
            }
            return;
        }

        var tween = game.add.tween(this.stageFg);
        tween.to({alpha:1}, 500, Phaser.Easing.Quadratic.Out, true);
        tween.yoyo(true, 500);
        tween.onRepeat.add(this.createPlayBoard, this);
        tween.onComplete.add(function(){
            this.gamePaused = false;
            this.stageReady = true
            this.playBtn.inputEnabled = true;
        }, this);
    },

    createPlayBoard:function(){
        if(this.gPlay) this.gPlay.destroy();
        this.gPlay = new PlayBoard(this.centerX, this.gh * 0.4);
        this.gBoard.add(this.gPlay) 

        var maxHeight = 350;
        if(this.gPlay.height > maxHeight){
            this.gPlay.scale.setTo(maxHeight/this.gPlay.height)
        }

        this.stageReady = false;
        this.curStage++;
        this.maxLegs++;
        this.maxCons++

        if(this.curStage >= 2){
            this.maxLines++
        }
    },

    startGame:function(){
        this.gameStart = true;
        this.gamePaused = false;
        this.playBtn.inputEnabled = true;
    },

    createTutorImg:function(imgid){
        this.tutorImg = global.addSprite(this.centerX, this.gh * 0.4, imgid);
        this.tutorImg.anchor.setTo(0.5);
        this.gFront.add(this.tutorImg);
    },

    gameEnd:function(){
        this.gameOver = true;
        this.gResult.tweenIn();
    },

    update:function() {
        GameScreen.prototype.update.call(this);
        if(!transition.isClosed){
            // this.gameStart = true;
            if(!this.stageReady){
                this.stageReady = true;
            }
        }

        if(this.gameStart && !this.gamePaused && !this.gameOver){
            var countMs = game.time.physicsElapsedMS * 0.001;
            if(this.plTime > 0){
                this.plTime -= countMs;

                if(this.plTime <= 0){
                    this.plTime = 0
                    this.tutorId = 1;
                    this.prepareTutor();
                }
            } else {
                if(!this.gamePaused && !this.gameOver){
                    this.plTime = 0
                    this.tutorId = 1;
                    this.prepareTutor();   
                }
            }
        }

        this.showTime.setText(this.countMin(this.plTime))
        this.showScore.setText(this.score)
    }
}, GameScreen);