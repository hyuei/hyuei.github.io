Game1Screen = function(game){

};

Game1Screen.inherit({
    preload:function(){
        // super.preload();
        Asset.atlaspng('ingame');
        Asset.atlaspng('rain');
        Asset.png('bg');
        Asset.png('bg-02');
        Asset.png('grey-bg');
        Asset.png('star-particle');
        Asset.png('dialogue-box');
        GameScreen.prototype.preload.call(this);
    },
    
    create:function(){
        GameScreen.prototype.create.call(this);
        var offsetY = 200
        game.world.setBounds(0, -offsetY, this.gw, this.gh + offsetY);
        // console.log("game 1 screen");
        
        this.gameStart = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.score = 0;
        this.maxTime = 80;
        this.plTime = this.maxTime;
        this.tutorId = 0;
        this.stageReady = false;
        this.startCountdown = false;
        this.curCD = 3;
        this.tutorTalker = null;
        this.isWin = false;

        this.debugPhysic = false;
        this.plTrash = 0;
        this.plLife = 5;
        this.targetTrash = game.rnd.integerInRange(5, 10);

        game.physics.startSystem(Phaser.Physics.P2JS);

        game.physics.p2.gravity.y = 1800;
        game.physics.p2.world.defaultContactMaterial.friction = 0.3;
        game.physics.p2.world.setGlobalStiffness(1e5);
        this.groundMaterial = game.physics.p2.createMaterial('groundMaterial');
        this.playerMaterial = game.physics.p2.createMaterial('playerMaterial');
        this.trashMaterial = game.physics.p2.createMaterial('trashMaterial');
        this.groundPlayerCM = game.physics.p2.createContactMaterial(this.playerMaterial, this.groundMaterial, { friction: 0.8 });
        this.groundTrashCM = game.physics.p2.createContactMaterial(this.trashMaterial, this.groundMaterial, { friction: 0.8, bounce : 0.8 });

        this.runnerGroup = game.physics.p2.createCollisionGroup();
        this.objectGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();

        this.gInGame = game.add.group();
        this.gInFront = game.add.group();

        this.winBg = game.add.sprite(this.centerX, this.centerY, 'bg-02');
        this.winBg.anchor.setTo(0.5);
        this.gBG.add(this.winBg)

        this.bg = game.add.sprite(this.centerX, this.centerY, 'bg');
        this.bg.anchor.setTo(0.5);
        this.bg.inputEnabled = true;
        this.gBG.add(this.bg);

        this.runnerImg = global.addSprite(this.gw * 0.15, 0, 'ingame/chara-01');
        this.runnerImg.anchor.setTo(0.5);
        this.runnerImg.animations.add("run", Phaser.Animation.generateFrameNames('ingame/chara-0', 1, 3, '', 1), 15, true);
        this.runnerImg.animations.add('idle', Phaser.Animation.generateFrameNames('ingame/chara-0', 2, 3, '', 1), 5, true);
        this.runnerImg.animations.play('idle')

        this.runner = new Runner(this.runnerImg.x, 0);

        this.gGround = new GroundGroup(0, 0);
        this.gInGame.add(this.gGround);

        this.gInGame.add(this.runnerImg);

        var ground = this.gGround.grounds[0]
        var y = ground.y - (ground.height * 0.5) - 2
        this.runner.y = y - this.runner.height * 0.5;
        this.gInGame.add(this.runner)

        this.scoreBox = global.addSprite(this.centerX, this.gh, 'ingame/base-ui');
        this.scoreBox.anchor.setTo(0.5);
        this.scoreBox.x += this.scoreBox.width * 0.55
        this.scoreBox.y -= this.scoreBox.height * 0.6
        this.gInFront.add(this.scoreBox);

        if(!Phaser.Device.desktop){
            game.input.maxPointers = 2;

            this.leftBtn = new MoveBtn(0, this.gh, 'ingame/btn-left', 'left');
            this.leftBtn.anchor.setTo(0.5);
            this.leftBtn.x += this.leftBtn.width * 0.6;
            this.leftBtn.y -= this.leftBtn.height * 0.6;
            this.gInFront.add(this.leftBtn)

            this.rightBtn = new MoveBtn(this.leftBtn.x + (this.leftBtn.width * 1.2), this.leftBtn.y, 'ingame/btn-right', 'right');
            this.rightBtn.anchor.setTo(0.5);
            this.gInFront.add(this.rightBtn)

            this.jumpBtn = global.addSprite(this.gw, this.leftBtn.y, 'ingame/btn-jump');
            this.jumpBtn.anchor.setTo(0.5);
            this.jumpBtn.x -= this.jumpBtn.width * 0.6
            this.jumpBtn.inputEnabled = true;
            this.jumpBtn.isClicked = false;
            this.jumpBtn.events.onInputDown.add(function(){
                if(this.jumpBtn.isClicked) return;
                this.jumpBtn.isClicked = true;
                this.jumpBtn.frameName = 'ingame/btn-jump-down'
                this.runner.jumping();
            }, this);
            this.jumpBtn.events.onInputUp.add(function(){
                if(!this.jumpBtn.isClicked) return;
                this.jumpBtn.frameName = 'ingame/btn-jump'
                this.jumpBtn.isClicked = false;
                this.runner.isJumped = false;
            }, this)
            this.gInFront.add(this.jumpBtn)

            this.scoreBox.y = this.leftBtn.y + (this.leftBtn.height * 0.5) - (this.scoreBox.height * 0.5)
        }


        this.timeBox =  global.addSprite(this.scoreBox.x - (this.scoreBox.width * 1.1), this.scoreBox.y, 'ingame/base-ui');
        this.timeBox.anchor.setTo(0.5);
        this.gInFront.add(this.timeBox)

        this.timeIcon = global.addSprite(this.timeBox.x - (this.timeBox.width * 0.21), this.timeBox.y - 5, 'ingame/icon-timer');
        this.timeIcon.anchor.setTo(0.5);
        this.gInFront.add(this.timeIcon)

        this.showTime = global.addText(this.timeIcon.x + (this.timeIcon.width * 0.5) + 5, this.timeBox.y, '', 27.5, global.font2);
        this.showTime.anchor.setTo(0, 0.5);
        this.showTime.fill = '#f86d07';
        this.gInFront.add(this.showTime)

        this.showScore = global.addText(this.scoreBox.x, this.scoreBox.y, this.score + '', this.showTime.fontSize, global.font2);
        this.showScore.anchor.setTo(0.5);
        this.showScore.fill = '#00aeef';
        this.gInFront.add(this.showScore)

        this.showCountdown = global.addText(this.centerX, this.centerY, '', 100, global.font2);
        this.showCountdown.anchor.setTo(0.5);
        this.showCountdown.fill = 'red';
        this.showCountdown.stroke = 'yellow';
        this.showCountdown.strokeThickness = 3;
        this.gInFront.add(this.showCountdown);

        this.charaIcon = global.addSprite(0, 0, 'ingame/chara-02');
        this.charaIcon.anchor.setTo(0.5);
        this.charaIcon.scale.setTo(0.5)
        this.charaIcon.x += this.charaIcon.width * 0.7;
        this.charaIcon.y += this.charaIcon.height * 0.7;
        this.gInFront.add(this.charaIcon)

        this.showLife = global.addText(this.charaIcon.x + (this.charaIcon.width * 0.5) + 5, this.charaIcon.y, 'x5', 27, global.font2);
        this.showLife.anchor.setTo(0, 0.5);
        this.showLife.fill = '#20e000';
        this.gInFront.add(this.showLife)

        // this.scoreBoard = new ScoreBoard(this.centerX, this.centerY)
        // this.gInFront.add(this.scoreBoard)

        this.createLogo();

        // this.prepareTutor();

        this.rainCurtain = global.addSprite(this.centerX, this.centerY, 'rain/bg-rain-01');
        this.rainCurtain.anchor.setTo(0.5);
        var sequence = Phaser.Animation.generateFrameNames('rain/bg-rain-0', 1, 2, '', 1);
        this.rainCurtain.animations.add('raining', sequence, 6, true);
        this.rainCurtain.animations.play('raining')
        this.gInFront.add(this.rainCurtain)

        this.gCont.add(this.gInGame);
        this.gCont.add(this.gInFront);

        // this.gameStart = true;
        this.countingDown();
    },

    createTargetBoard:function(){
        this.gTarget = game.add.group();
        this.gInFront.add(this.gTarget);

        this.gTarget.x = this.centerX;
        this.gTarget.y = this.centerY;

        this.tapTarget = game.time.now + 1000;

        var targetBg = global.addSprite(0, 0, 'ingame/base-result')
        targetBg.anchor.setTo(0.5);
        targetBg.scale.y = 0.8;
        targetBg.inputEnabled = true;
        targetBg.events.onInputDown.add(function(){
            if(game.time.now > this.tapTarget){
                this.countingDown();
                this.gTarget.destroy();
            }
        }, this);
        this.gTarget.add(targetBg);

        var targetTxt = global.addText(targetBg.width * 0.4, -10, STRINGS_DATA.data.target, 50, global.font2);
        targetTxt.anchor.setTo(1, 0.5);
        targetTxt.align = 'right';
        targetTxt.fill = 'black';
        this.gTarget.add(targetTxt);

        var branchIcon = global.addSprite(targetTxt.x - (targetTxt.width * 1.3), targetTxt.y - 10, 'ingame/branch');
        branchIcon.anchor.setTo(1, 0.5);
        branchIcon.scale.setTo(0.8);
        this.gTarget.add(branchIcon)

        var twoDots = global.addText(branchIcon.x - (branchIcon.width * 1.2), targetTxt.y, ':', targetTxt.fontSize, global.font2);
        twoDots.anchor.setTo(1, 0.5);
        twoDots.fill = "black";
        twoDots.align = "right";
        this.gTarget.add(twoDots)

        var showTarget = global.addText(targetBg.width * -0.4, targetTxt.y, this.targetBranch + '', targetTxt.fontSize, global.font2);
        showTarget.anchor.setTo(0, 0.5);
        showTarget.fill = '#dd6118';
        this.gTarget.add(showTarget);

        var tapHere = global.addText(0, targetBg.height * 0.38, STRINGS_DATA.data.taptocontinue, 30, global.font2);
        tapHere.anchor.setTo(0.5);
        tapHere.align = 'right';
        tapHere.fill = 'grey'
        this.gTarget.add(tapHere)
        this.gTarget.tapHere = tapHere;

        game.time.events.add(1000, function(){
            this.tapHere.fill = 'maroon'
        }, this.gTarget)
    },

    prepareTutor:function(arg){
        this.gamePaused = true;
        var data = TALKING_DATA.talkingdata.Game1Screen['part' + (this.tutorId + 1)];
        // console.log('tutorId', this.tutorId)
        isUp = false;        

        if(this.tutorId == 0){
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
            // this.countingDown();
            this.createTargetBoard();
        } else if(this.tutorId == 1 || this.tutorId == 2){
            this.gameEnd();
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
                    curState().createTutorImg('ingame/img-2-1');
                } else if(this.talkIndex == 5 || this.talkIndex == 6){
                    curState().createTutorImg('ingame/img-2-2');
                } else if(this.talkIndex == 7){
                    curState().createTutorImg('ingame/img-2-3');
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

    startGame:function(){
        this.gameStart = true;
    },

    createTutorImg:function(imgid){
        this.tutorImg = global.addSprite(this.centerX, this.gh * 0.4, imgid);
        this.tutorImg.anchor.setTo(0.5);
        this.gFront.add(this.tutorImg);
    },

    createResult:function(){        
        this.gResult = new Endscreen(this.centerX, this.centerY);
        this.gFront.add(this.gResult);    
        this.gResult.tweenIn();
    },

    gameEnd:function(){
        if(this.gameOver) return;
        this.gameOver = true;
        if(this.isWin){
            var timer = 1000;
            var tween = game.add.tween(this.bg);
            tween.to({alpha:0}, timer);
            tween.onComplete.add(function(){
                this.bg.destroy();
                this.runnerImg.animations.stop(this.runnerImg.animations.currentAnim.name);
                this.runnerImg.frameName = 'ingame/chara-01'

                game.time.events.add(2000, this.createResult, this)
            }, this);
            tween.start();

            var tweenRain = game.add.tween(this.rainCurtain);
            tweenRain.to({alpha:0}, timer);
            tweenRain.start();
        } else {
            this.runnerImg.animations.currentAnim.stop();
            this.runnerImg.frameName = 'ingame/chara-fail';
            game.time.events.add(1000, this.createResult, this)
        }
    },

    update:function() {
        GameScreen.prototype.update.call(this);
        if(!this.gameStart && !transition.isClosed){
            if(!this.stageReady){
                this.stageReady = true;
            }
        }

        this.showTime.setText(this.countMin(this.plTime))
        this.showScore.setText(this.score + '')
        this.showLife.setText('x ' + this.plLife)
        if(curState().gameOver || curState().gamePaused || !curState().gameStart) return;
        var countMS = game.time.physicsElapsedMS * 0.001;
        if(this.plTime > 0){
            this.plTime -= countMS;
            if(this.plTime <= 0){
                this.isWin = true
                this.plTime = 0;
                this.gameEnd();
            }
        }
        // this.showBranch.setText('x ' + this.plBranch);
        // this.showTrash.setText('x ' + this.plTrash)
    }
}, GameScreen);