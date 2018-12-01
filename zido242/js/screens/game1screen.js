Game1Screen = function(game){

};

Game1Screen.inherit({
    preload:function(){
        // super.preload();
        Asset.atlaspng('ingame');
        Asset.png('bg');
        Asset.png('star-particle');
        Asset.png('grey-bg');
        Asset.png('dialogue-box');
        Asset.png('cave-foreground');
        Asset.png('bg-cover');
        Asset.png('cave-foreground-cover');
        GameScreen.prototype.preload.call(this);
    },
    
    create:function(){
        GameScreen.prototype.create.call(this);
        // console.log("game 1 screen");
        
        this.gameStart = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.score = 0;
        this.plTime = 0;
        this.maxTime = 80;
        this.tutorId = 0;
        this.stageReady = false;
        this.curStage = 1;
        this.maxStage = 5;
        this.startCountdown = false;
        this.curCD = 0;
        this.tutorTalker = null;

        this.gInGame = game.add.group();
        this.gInFront = game.add.group();

        this.gResult = new Endscreen(this.centerX, this.centerY);
        this.gFront.add(this.gResult);    

        this.shadowBg = game.add.sprite(this.centerX, this.centerY, 'bg-cover');
        this.shadowBg.anchor.setTo(0.5);
        this.gBG.add(this.shadowBg);

        this.bg = game.add.sprite(this.centerX, this.centerY, 'bg');
        this.bg.anchor.setTo(0.5);
        this.gBG.add(this.bg);

        this.gObjects = new ObjectGroup();
        this.gInGame.add(this.gObjects);

        this.shadowFG = game.add.sprite(this.centerX, this.centerY, 'cave-foreground-cover');
        this.shadowFG.anchor.setTo(0.5);
        this.gInGame.add(this.shadowFG)

        this.foreGround = game.add.sprite(this.centerX, this.centerY, 'cave-foreground');
        this.foreGround.anchor.setTo(0.5);
        this.gInGame.add(this.foreGround)

        this.flashBase = global.addSprite(this.gw * 0.92, this.gh * 0.88, 'ingame/base-flashlight')
        this.flashBase.anchor.setTo(0.5);
        this.gInFront.add(this.flashBase);

        this.flashlight = new Flashlight(this.flashBase.x, this.flashBase.y);
        // this.gInFront.add(this.flashlight);

        this.bg.mask = this.flashlight.lightMask;
        this.foreGround.mask = this.flashlight.lightMask;

        this.gEmitter = new CorrectBurst(0, 0, 100);
        this.gInFront.add(this.gEmitter);

        this.gFound = game.add.group();
        this.gInFront.add(this.gFound)

        this.scoreBox = global.addSprite(this.centerX, this.gh * 0.1, 'ingame/gamescorebox');
        this.scoreBox.anchor.setTo(0.5);
        this.gInFront.add(this.scoreBox);

        var score = this.writeThousands(1000)
        this.showScore = global.addText(0, 7, score, 35, global.font2);
        this.showScore.anchor.setTo(0.5);
        this.showScore.fill = '#c6541f';
        this.scoreBox.addChild(this.showScore);

        this.batIcon = global.addSprite(this.gw * 0.02, this.gh * 0.92, 'ingame/batterybase');
        this.batIcon.anchor.setTo(0, 0.5);
        this.gInFront.add(this.batIcon);

        this.barFull = 89;
        var height = 36;
        this.barColors = {yellow:0xffd900, red:0xFF3300, green:0x33FF00}
        this.batBars = {};
        this.curBarColor = 'green';
        var x = this.batIcon.x + 9;
        var y = this.batIcon.y - (this.batIcon.height * 0.5) + 7.5;
        for(var colorName in this.barColors){
            var color = this.barColors[colorName];
            var bar = game.add.graphics(x, y);
            bar.beginFill(color);
            bar.drawRect(0, 0, this.barFull, height);
            this.gInFront.add(bar);
            bar.visible = false;
            this.batBars[colorName] = bar;
        }

        this.batBars[this.curBarColor].visible = true;

        this.showTimer = global.addText(this.batIcon.x + this.batIcon.width + 10, this.batIcon.y + 3, '100%', 35, global.fonts2);
        this.showTimer.anchor.setTo(0, 0.5);
        this.showTimer.fill = 'white';
        this.gInFront.add(this.showTimer)

        this.showCountdown = global.addText(this.centerX, this.centerY, '', 100, global.font2);
        this.showCountdown.anchor.setTo(0.5);
        this.showCountdown.fill = 'red';
        this.showCountdown.stroke = 'yellow';
        this.showCountdown.strokeThickness = 3;
        this.gInFront.add(this.showCountdown);

        this.trashIcons = [];
        var x = this.gw * 0.28;
        var y = this.gh * 0.98;
        for(var a = 0; a < 4; a++){
            var icon = global.addSprite(x, y, 'ingame/trash-' + (a + 1) + '-a');
            icon.anchor.setTo(0.5, 1);
            icon.x += icon.width * 0.5;
            icon.countTrash = 0;
            this.gInFront.add(icon);

            var txt = global.addText(icon.x + (icon.width * 0.6), icon.y, 'x 0', 35, global.fonts2);
            txt.anchor.setTo(0, 0.5);
            txt.fill = '#fff200';
            txt.y -= 20;
            this.gInFront.add(txt);

            icon.showCount = txt;

            x = txt.x + txt.width + 30;

            this.trashIcons.push(icon)
        }

        this.charaIcon = global.addSprite(this.gh * 0.1, this.scoreBox.y, 'ingame/bilal-a');
        this.charaIcon.anchor.setTo(0.5, 1);
        this.charaIcon.y += this.charaIcon.height * 0.5
        this.gInFront.add(this.charaIcon);

        this.charaCount = this.maxStage;
        this.showStage = global.addText(this.charaIcon.x + (this.charaIcon.width * 0.6), this.charaIcon.y, 'x ' + this.charaCount, 35, global.fonts2);
        this.showStage.anchor.setTo(0, 0.5);
        this.showStage.fill = '#fff200';
        this.showStage.y -= 20;
        this.gInFront.add(this.showStage);

        this.greyBg = game.add.sprite(this.centerX, this.centerY, 'bg-transition');
        this.greyBg.anchor.setTo(0.5);
        this.greyBg.alpha = 0;
        this.gFront.add(this.greyBg);

        this.createLogo();
        this.gObjects.createObject();
        this.flashlight.reposFlashLight();

        this.prepareTutor();

        this.gCont.add(this.gInGame);
        this.gCont.add(this.gInFront);
        this.gCont.add(this.flashlight);

        // this.countingDown();
    },

    prepareTutor:function(){
        this.gamePaused = true;
        var data = TALKING_DATA.talkingdata.Game1Screen['part' + (this.tutorId + 1)];
        // console.log('tutorId', this.tutorId)
        var isUp = false;        

        if(this.tutorId == 2){
            if(this.gObjects.secretChara.a.y >= this.gObjects.downY){
                isUp = true;
            }
        } else if(this.tutorId == 4){
            this.createTutorImg('ingame/img-2-4');
        }

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
                    this.gameStart = true;
                    this.clickCover.visible = false;
                }
            }, this)
        }, this);
    },

    createTutorImg:function(imgid){
        this.tutorImg = global.addSprite(this.centerX, this.gh * 0.4, imgid);
        this.tutorImg.anchor.setTo(0.5);
        this.gFront.add(this.tutorImg);
    },

    changeStage:function(){
        for(var a = 0; a < this.gObjects.objects.length; a++){
            var obj = this.gObjects.objects[a];
            obj.a.destroy();
            obj.b.destroy();
        }

        for(var a = 0; a < this.gObjects.trashes.length; a++){
            var trash = this.gObjects.trashes[a];
            trash.a.destroy();
            trash.b.destroy();
        }

        this.gObjects.secretChara.a.destroy();
        this.gObjects.secretChara.b.destroy();

        this.gObjects.createObject();
        this.flashlight.checkObjects(false);
    },

    upgradeStage:function(){
        this.charaCount--;
        this.showStage.setText('x ' + this.charaCount)
        if(this.curStage < this.maxStage){
            this.gamePaused = true;
            this.curStage++;

            this.tutorId = 2;
            this.prepareTutor();
            // closeCurtain.chain(openCurtain);
        } else {
            this.gameOver = true;
            this.clickCover.visible = false;
            this.flashlight.flashlight.inputEnabled = false;
            var percentage = (this.plTime / this.maxTime) * 100;
            var curPercentage = 100 - percentage;
            if(curPercentage < 0) curPercentage = 0;
            curPercentage = parseInt(curPercentage);
            this.curPercentage = curPercentage;
            this.tutorId = 4;
            this.prepareTutor();
            // this.countBonus();
            // transition.close('Game1Screen')
        }
    },

    closeCurtain:function(){
        this.flashlight.reposFlashLight();
        var timer = 300;
        var closeCurtain = game.add.tween(this.greyBg);
        closeCurtain.to({alpha:1}, timer);
        closeCurtain.onComplete.add(function(){
            this.changeStage();
            this.tutorId = 3;
            this.prepareTutor();
        }, this);
        closeCurtain.start();
    },

    openCurtain:function(){
        var timer = 300;
        var openCurtain = game.add.tween(this.greyBg);
        openCurtain.to({alpha:0}, timer);
        openCurtain.onComplete.add(function(){
            this.clickCover.visible = false;
            this.gamePaused = false;
        }, this);
        openCurtain.start();
    },

    countBonus:function(){
        this.showTimer.setText(this.curPercentage + '%')
        this.batBars[this.curBarColor].width = this.barFull * (this.curPercentage / 100)
        if(this.curPercentage <= 0){
            this.gameEnd();
        } else {
            this.curPercentage--;
            this.score += 100;
            game.time.events.add(10, function(){
                this.countBonus();
            }, this)
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

        this.showScore.setText(this.writeThousands(this.score))
        if(!this.gameStart) this.clickCover.visible = true;
        if(!this.gameStart || this.gameOver || this.gamePaused) return;
        var countMs = game.time.physicsElapsedMS * 0.001;
        if(this.plTime < this.maxTime){
            this.plTime += countMs
            var percentage = (this.plTime / this.maxTime) * 100;
            var curPercentage = 100 - (percentage);
            var width = this.barFull * ((curPercentage) / 100);
            if(curPercentage <= 0) {
                curPercentage = 0;
                this.gameOver = true;
                this.tutorId = 1;
                this.prepareTutor();
                // this.gameEnd();
            } else {
                if(curPercentage <= 50 && curPercentage > 25){
                    var height = this.batBars[this.curBarColor].height
                    if(this.curBarColor != 'yellow'){
                        this.batBars[this.curBarColor].visible = false;
                        this.curBarColor = 'yellow';
                        this.batBars[this.curBarColor].visible = true;
                    } 
                } else if(curPercentage <= 25){
                    if(this.curBarColor != 'red'){
                        this.batBars[this.curBarColor].visible = false;
                        this.curBarColor = 'red';
                        this.batBars[this.curBarColor].visible = true;
                    }
                }
            }

            this.batBars[this.curBarColor].width = width;
            curPercentage = parseInt(curPercentage);
            this.showTimer.setText(curPercentage + '%');
        }
    }
}, GameScreen);