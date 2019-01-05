Game1Screen = function(game){

};

Game1Screen.inherit({
    preload:function(){
        // super.preload();
        Asset.atlaspng('ingame');
        Asset.png('bg');
        Asset.png('grey-bg');
        Asset.png('star-particle');
        Asset.png('dialogue-box');
        GameScreen.prototype.preload.call(this);
    },
    
    create:function(){
        GameScreen.prototype.create.call(this);
        game.world.setBounds(0, -100, this.gw, this.gh + 600);
        // console.log("game 1 screen");
        
        this.gameStart = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.score = 0;
        this.plTime = 0;
        this.maxTime = 80;
        this.tutorId = 0;
        this.stageReady = false;
        this.startCountdown = false;
        this.curCD = 0;
        this.tutorTalker = null;
        this.isWin = false;

        this.debugPhysic = false;
        this.plTrash = 0;
        this.plBranch = 0;
        this.targetBranch = game.rnd.integerInRange(5, 10);

        game.physics.startSystem(Phaser.Physics.P2JS);

        game.physics.p2.gravity.y = 1800;
        game.physics.p2.world.defaultContactMaterial.friction = 0.3;
        game.physics.p2.world.setGlobalStiffness(1e5);
        this.groundMaterial = game.physics.p2.createMaterial('groundMaterial');
        this.playerMaterial = game.physics.p2.createMaterial('playerMaterial');
        this.groundPlayerCM = game.physics.p2.createContactMaterial(this.playerMaterial, this.groundMaterial, { friction: 0.6 });

        this.gInGame = game.add.group();
        this.gInFront = game.add.group();

        this.gResult = new Endscreen(this.centerX, this.centerY);
        this.gFront.add(this.gResult);    

        this.bg = game.add.sprite(this.centerX, this.centerY, 'bg');
        this.bg.anchor.setTo(0.5);
        this.bg.inputEnabled = true;
        this.gBG.add(this.bg);

        this.gGround = new GroundGroup(0, 0);
        this.gInGame.add(this.gGround);

        var ground = this.gGround.grounds[0]
        var y = ground.y - (ground.height * 0.55)
        this.runner = new Runner(this.gw * 0.15, y);
        this.runner.y -= this.runner.height * 0.5;
        this.gInGame.add(this.runner)

        this.gEmitter = new CorrectBurst(0, 0, 100);
        this.gInFront.add(this.gEmitter);

        this.showCountdown = global.addText(this.centerX, this.centerY, '', 100, global.font2);
        this.showCountdown.anchor.setTo(0.5);
        this.showCountdown.fill = 'red';
        this.showCountdown.stroke = 'yellow';
        this.showCountdown.strokeThickness = 3;
        this.gInFront.add(this.showCountdown);

        this.branchBox = global.addSprite(this.gw * 0.1, this.gh * 0.12, 'ingame/score-branch');
        this.branchBox.anchor.setTo(0.5);
        this.gInGame.add(this.branchBox);

        this.showBranch = global.addText(this.branchBox.x - (this.branchBox.width * 0.05), this.branchBox.y - 2, _t(STRINGS_DATA.data.x, 10), 30, global.font2);
        this.showBranch.anchor.setTo(0, 0.5);
        this.showBranch.fill = '#dd6118';
        this.gInGame.add(this.showBranch)

        this.trashBox = global.addSprite(this.branchBox.x + (this.branchBox.width * 1.1), this.branchBox.y, 'ingame/scorebox-trash');
        this.trashBox.anchor.setTo(0.5);
        this.gInGame.add(this.trashBox)

        this.showTrash = global.addText(this.trashBox.x - (this.trashBox.width * 0.05), this.trashBox.y - 2, _t(STRINGS_DATA.data.x, 10), this.showBranch.fontSize, global.font2);
        this.showTrash.anchor.setTo(0, 0.5);
        this.showTrash.fill = this.showBranch.fill;
        this.gInGame.add(this.showTrash)

        this.scoreBoard = new ScoreBoard(this.centerX, this.centerY)
        this.gInFront.add(this.scoreBoard)

        this.createLogo();

        this.bg.events.onInputDown.add(function(){
            this.runner.jumping();
        }, this);

        this.prepareTutor();

        this.gCont.add(this.gInGame);
        this.gCont.add(this.gInFront);

        // this.gameStart = true;
        // this.countingDown();
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

        if(this.tutorId == 1 || this.tutorId == 2){
            // this.gameEnd();
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
        this.gGround.isRunning = true;
        this.runner.animations.play('run')
    },

    createTutorImg:function(imgid){
        this.tutorImg = global.addSprite(this.centerX, this.gh * 0.4, imgid);
        this.tutorImg.anchor.setTo(0.5);
        this.gFront.add(this.tutorImg);
    },

    checkScore:function(){
        if(this.plBranch < this.targetBranch){
            this.tutorId = 1;
            this.prepareTutor();
        } else {
            this.tutorId = 2;
            this.isWin = true;
            this.scoreBoard.tweenIn();
        }
    },

    gameEnd:function(){
        this.gameOver = true;
        this.gResult.tweenIn();
    },

    update:function() {
        GameScreen.prototype.update.call(this);
        if(!this.gameStart && !transition.isClosed){
            if(!this.stageReady){
                this.stageReady = true;
            }
        }

        this.showBranch.setText('x ' + this.plBranch);
        this.showTrash.setText('x ' + this.plTrash)
    }
}, GameScreen);