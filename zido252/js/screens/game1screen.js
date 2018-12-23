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

        this.debugPhysic = false;
        this.plTrash = 0;
        this.plBranch = 0;

        game.physics.startSystem(Phaser.Physics.P2JS);

        game.physics.p2.gravity.y = 1200;
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

        this.createLogo();

        this.bg.events.onInputDown.add(function(){
            this.runner.jumping();
        }, this);

        // this.prepareTutor();

        this.gCont.add(this.gInGame);
        this.gCont.add(this.gInFront);

        this.countingDown();
    },

    prepareTutor:function(arg){
        this.gamePaused = true;
        var data = TALKING_DATA.talkingdata.Game1Screen['part' + (this.tutorId + 1)];
        // console.log('tutorId', this.tutorId)
        isUp = false;        

        if(this.tutorId == 2){
            if(this.gObjects.secretChara.a.y >= this.gObjects.downY){
                isUp = true;
            }
        } else if(this.tutorId == 4){
            this.createTutorImg('ingame/img-2-4');
        } else if(this.tutorId == 5){
            if(this.gObjects.otherChara.a.y >= this.gObjects.downY){
                isUp = true;
            }
        }

        if(arg) isUp = arg;
        this.createTalker(data, isUp);
    },

    checkAfterTutor:function(){        
        this.gamePaused = false;
        this.tutorTalker = null;
        if(this.tutorId == 0){
            this.countingDown();
        } else if(this.tutorId == 2){
            this.closeCurtain();
        } else if(this.tutorId == 3){
            this.openCurtain();
        } else if(this.tutorId == 1){
            this.gameEnd();
        } else if(this.tutorId == 4){
            if(this.tutorImg) this.tutorImg.destroy();
            this.countBonus();
        } else if(this.tutorId == 5){
            var isUp = false;
            if(this.gObjects.otherChara.a.y >= this.gObjects.downY){
                isUp = true;
            }
            this.tutorId = 1;
            this.prepareTutor(isUp);
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
                if(this.talkIndex == 3){
                    curState().createTutorImg('ingame/img-2-1');
                } else if(this.talkIndex == 4){
                    curState().createTutorImg('ingame/img-2-2');
                } else if(this.talkIndex == 5){
                    curState().createTutorImg('ingame/img-2-3');
                }
            } else if(curState().tutorId == 4){                
                if(this.talkIndex == 2){
                    if(curState().tutorImg) curState().tutorImg.destroy();
                    curState().createTutorImg('ingame/img-2-5');
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