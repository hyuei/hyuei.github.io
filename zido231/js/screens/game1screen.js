class Game1Screen extends GameScreen
{

    constructor(game)
    {
        super(game);
        this.startPos = {x: 80, y: 250};
        this.endPos = {x: 880, y: 250};

        
        this.avatar = null;    
    }
    
    preload() 
    {
        // super.preload();
        Asset.atlaspng('ingame');
        Asset.png('bg');
        Asset.png('star-particle');
        Asset.png('grey-bg');
        Asset.png('dialogue-box');
    }
    
    create()
    {
        super.create()
        // console.log("game 1 screen");
        
        game.input.mouse.capture = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
        var left1 = game.input.keyboard.addKey(Phaser.Keyboard.A);
        var left2 = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        left1.onDown.add(function(){
            this.moveChara(1)
        }, this);
        left2.onDown.add(function(){
            this.moveChara(1)
        }, this)

        var right1 = game.input.keyboard.addKey(Phaser.Keyboard.D);
        var right2 = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right1.onDown.add(function(){
            this.moveChara(-1)
        }, this);
        right2.onDown.add(function(){
            this.moveChara(-1)
        }, this)
        
        this.gameStart = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.phaseTimes = [30, 45];
        this.score = 0;
        this.tutorId = 0;
        this.stageReady = false;

        this.speed = 4
        this.isMoving = true;
        this.curCountCreate = 0;

        this.curPos = 1;
        this.curDist = 0;
        this.curTime = 0;
        this.curPoint = 0;
        this.totalCoin = 0;
        this.placeSave = true;
        this.plAvailable = true;
        this.tutorMinBoxPoint = null;
        this.tutorImg = null;

        // this.curPhase = 0;
        // this.curTime = this.phaseTimes[this.curPhase];

        this.gInGame = game.add.group();
        this.gInFront = game.add.group();

        this.gResult = new Endscreen(this.centerX, this.centerY);
        this.gFront.add(this.gResult);

        this.bgGround = game.add.sprite(this.centerX, this.centerY, 'bg');
        this.bgGround.anchor.setTo(0.5);
        this.bgGround.inputEnabled = true;
        this.bgGround.events.onInputDown.add(this.onStartClick, this)
        this.bgGround.events.onInputUp.add(this.onReleaseClick, this)
        this.gBG.add(this.bgGround)

        this.bgs = [];
        for(var a = 0; a < 3; a++){
            var y = this.gh;
            if(a > 0) {
                var prevGround = this.bgs[a-1];
                y = prevGround.y - (prevGround.height);
            }
            var bg = new bgGroup(this.centerX, y);
            bg.bgId = a;
            bg.isFilled = false;
            this.gBG.add(bg);

            this.bgs.push(bg)
        }

        this.bushes = [];
        for(var a = 0; a < 3; a++){
            var y = this.gh;
            if(a > 0){
                var prevBush = this.bushes[a - 1];
                y = prevBush.y - prevBush.height;
            }

            var gBush = game.add.group();
            gBush.y = y;
            this.gBG.add(gBush);

            for(var b = 0; b < 2; b++){
                var x = 0;
                var scaleX = 1;
                if(b == 1) {
                    x = this.gw;
                    scaleX = -1;
                }

                var bush = global.addSprite(x, 0, 'ingame/bush');
                bush.anchor.setTo(0, 1);
                bush.scale.x = scaleX;
                gBush.add(bush);
            }

            this.bushes.push(gBush);
        }

        this.gGoals = game.add.group();
        this.gBG.add(this.gGoals);

        this.goals = [];
        var tempBg = this.bgs[0];
        for(var a = 0; a < 3; a++){
            var ground = tempBg.grounds[a];
            var pos = tempBg.toGlobal(ground.position)
            var goal = global.addSprite(pos.x, 0, 'ingame/finish');
            goal.anchor.setTo(0.5);
            this.gGoals.add(goal);

            this.goals.push(goal)
        }

        this.gGoals.y = -(goal.height * 0.6)

        this.gObjects = new Obstacles(0, 0);
        // this.gObjects.createCoins();
        // this.gObjects.createBox();
        this.gInGame.add(this.gObjects);

        // this.gEffect = game.add.group();
        this.gEffect = new CorrectBurst(0, 0, 100);
        this.gInGame.add(this.gEffect);

        this.plChara = global.addSprite(this.centerX, this.gh * 0.95, 'ingame/run-02')
        this.plChara.anchor.setTo(0.5, 1);
        this.gInGame.add(this.plChara)

        this.showPoint = global.addText(0, -(this.plChara.height * 0.65), '0', 65, global.font2);
        this.showPoint.anchor.setTo(0.5);
        this.showPoint.fill = '#c53a2c' //'#089a5b';
        this.showPoint.fontWeight = 'bold'
        this.showPoint.strokeThickness = 10;
        this.showPoint.stroke = 'white';
        this.plChara.addChild(this.showPoint)

        this.plChara.scale.setTo(0.8)

        var frames = Phaser.Animation.generateFrameNames('ingame/run-0', 1, 3, '', 1);
        var anim = this.plChara.animations.add('run', frames, 10, true)
        // console.log(anim)
        anim.enableUpdate = true;
        anim.onUpdate.add(function(){
            // console.log(this.currentFrame.name)
            if(!curState().gameStart || curState().gameOver || curState().gamePaused) return;
            if(this.currentFrame.name == 'ingame/run-01' || this.currentFrame.name == 'ingame/run02'){
                SoundData.sfxPlay('run')
            }
        }, anim)

        this.distBar = global.addSprite(this.gw * 0.95, this.centerY, 'ingame/distance-bar');
        this.distBar.anchor.setTo(0.5);
        this.gInGame.add(this.distBar);

        this.distIndicator = global.addSprite(this.distBar.x - 6, this.distBar.y + (this.distBar.height * 0.5), 'ingame/distance-indicator');
        this.distIndicator.anchor.setTo(0.5);
        this.distIndicator.y -= this.distIndicator.height * 0.5
        this.gInGame.add(this.distIndicator)

        this.startCountdown = false;
        this.curCD = 3;
        this.showCountdown = global.addText(this.centerX, this.centerY, '', 100, global.font2);
        this.showCountdown.anchor.setTo(0.5);
        this.showCountdown.fill = 'red';
        this.showCountdown.stroke = 'yellow';
        this.showCountdown.strokeThickness = 3;
        this.gInFront.add(this.showCountdown)

        this.maxDist = this.distBar.y - (this.distBar.height * 0.37);
        var timer = 60 //in second
        this.distSpeed = (this.distIndicator.y - this.maxDist) / (timer / (game.time.physicsElapsedMS * 0.001));
        // console.log(this.distSpeed)

        this.maxTime = timer;
        this.showTime = global.addText(5, 5, '', 70, global.font1);
        this.showTime.fill = 'red'
        this.gInGame.add(this.showTime)

        this.actualDist = this.speed * (timer / (game.time.physicsElapsedMS * 0.001));
        // console.log(this.actualDist)

        for(var a = 2; a < this.bgs.length; a++){
            var bg = this.bgs[a];
            this.createObs(bg);
            bg.isFilled = true
        }

        this.coinIcon = global.addSprite(20, 20, 'ingame/coin');
        this.coinIcon.anchor.setTo(0, 0.5);
        this.coinIcon.scale.setTo(0.7)
        this.coinIcon.y += this.coinIcon.height * 0.5;
        this.gInFront.add(this.coinIcon)

        this.showCoin = global.addText(this.coinIcon.x + (this.coinIcon.width * 1.1), this.coinIcon.y, 'TEST', 40, global.font2);
        this.showCoin.anchor.setTo(0, 0.5);
        this.showCoin.fill = 'green';
        this.showCoin.stroke = 'white';
        this.showCoin.strokeThickness = 8
        this.gInFront.add(this.showCoin)

        this.createLogo();

        // this.gTutor = new Tutorial(this.centerX, this.centerY);
        // this.gInFront.add(this.gTutor);
        this.prepareTutor();
        // this.countingDown();
        // this.gResult.tweenIn();

        this.gCont.add(this.gInGame);
        this.gCont.add(this.gInFront);
    }

    prepareTutor(){
        this.gamePaused = true;
        this.plChara.animations.paused = true;
        var data = TALKING_DATA.talkingdata.Game1Screen['part' + (this.tutorId + 1)];
        // console.log('tutorId', this.tutorId)
        var isUp = false;
        if(this.tutorId == 0){
            isUp = true;
        } else if(this.tutorId == 2){
            var tutorBox = null;
            var boxes = this.gObjects.boxes;
            for(var a = 0; a < boxes.length; a++){
                for(var b = 0; b < boxes[a].length; b++){
                    var box = boxes[a][b];
                    if(!box || !box.exists || !box.isActive) continue;
                    if(box.boxPoint == this.tutorMinBoxPoint){
                        tutorBox = box;
                    }
                }
            }

            var boxBound = tutorBox.getBounds();
            var x = boxBound.right + 10;
            var y = boxBound.y + boxBound.halfHeight;
            this.createArrow(x, y)
        } else if(this.tutorId == 3){
            if(this.plChara.y < 0){
                data = TALKING_DATA.talkingdata.Game1Screen.part5;
            } else {
                isUp = true;
            }
        }

        this.createTalker(data, isUp);
    }

    checkAfterTutor(){        
        this.gamePaused = false;
        this.tutorTalker = null;
        this.plChara.animations.paused = false;
        var tutorId = this.tutorId;
        if(tutorId == 0){
            // this.countingDown();
            if(this.tutorImg) this.tutorImg.destroy();
            this.gameStart = true;
            this.plChara.animations.play('run')
        // this.gResult.tweenIn();
        } else if(tutorId == 2){
            this.tutorArrow.destroy();
        } else if(tutorId == 3) {
            this.gResult.tweenIn();
        }

        this.tutorId++;
    }

    createTalker(data, isUp){
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
        this.gInFront.add(talker);
        talker.loadTalkingArray(data)
        talker.startTalk();
            
        talker.onFinish.add(this.checkAfterTutor, this);

        talker.onNext.add(function(){
            if(curState().tutorId == 0 && this.talkIndex == 3 && !curState().tutorImg){
                this.y = curState().gh - (this.height * 0.5)
                curState().createTutorImg('ingame/tutor1');
                var frames = Phaser.Animation.generateFrameNames('ingame/tutor', 1, 3, '', 1);
                var anim = curState().tutorImg.animations.add('move', frames, 5);
                anim.onComplete.add(function(){
                    game.time.events.add(500, function(){
                        this.animations.play('move')
                    }, this)
                }, curState().tutorImg)
                curState().tutorImg.animations.play('move')
                console.log('tutor keyboard')
            }

            SoundData.sfxPlay("vn-cont");
        }, talker);

        this.tutorTalker = talker;

    }

    createArrow(x, y){
        this.tutorArrow = global.addSprite(x, y, 'ingame/arrow');
        this.tutorArrow.anchor.setTo(0, 0.5);
        this.gInFront.add(this.tutorArrow);

        var toX = this.tutorArrow.x - 10;
        var tween = game.add.tween(this.tutorArrow);
        tween.to({x:toX}, 500, null, true, 0, -1, true)
    }

    countingDown(){
        var text = parseInt(this.curCD);
        if(this.curCD < 1) {
            text = STRINGS_DATA.data.start;
            SoundData.sfxPlay('voice9')
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
                    this.plChara.animations.play('run');
                }
            }, this)
        }, this);
    }

    createTutorImg(imgid){
        this.tutorImg = global.addSprite(this.centerX, this.gh * 0.4, imgid);
        this.tutorImg.anchor.setTo(0.5);
        this.gInFront.add(this.tutorImg);
    }

    onStartClick(obj, pointer){
        if(this.isClicked) return;
        this.isClicked = true;
        this.startClick = {x:game.input.x, y:game.input.y};
    }

    onReleaseClick(obj, pointer){
        if(!this.isClicked) return;
        this.isClicked = false;
        var minDist = 100;
        var direction = this.startClick.x - game.input.x;
        // console.log(direction)
        var checkDist = Math.abs(direction);
        if(checkDist >= minDist){
            this.moveChara(direction)
        }
    }

    plHitBox(){
        this.plAvailable = false;
        var tween = game.add.tween(this.plChara);
        tween.to({alpha:0.5}, 100);
        tween.repeat(3);
        tween.yoyo(true);
        tween.onComplete.add(function(){
            this.plAvailable = true;
        }, this);
        tween.start();
    }

    moveChara(direction){
        if(this.gamePaused || this.gameOver || !this.gameStart) return;
        var grounds = this.bgs[0].grounds;
        if(direction > 0 && this.curPos > 0){
            this.curPos--;
        } else if(direction < 0 && this.curPos < grounds.length - 1){
            this.curPos++;
        }

        var pos = this.bgs[0].toGlobal(grounds[this.curPos]);
        this.plChara.x = pos.x;        
    }

    moveBg() {
        if(!this.isMoving) return;
        for(var a = 0; a < this.bgs.length; a++){
            var prevId = a - 1;
            if(prevId < 0) prevId = this.bgs.length - 1;

            var bg = this.bgs[a];
            var prevBg = this.bgs[prevId];

            var tempY = bg.y + this.speed;

            if(tempY - bg.height >= this.gh){
                bg.y = prevBg.y - prevBg.height + this.speed;
                this.createObs(bg)
            } else {
                bg.y = tempY;
            }
        }

        for(var a = 0; a < this.bushes.length; a++){
            var prevId = a - 1;
            if(prevId < 0) prevId = this.bushes.length - 1;
            var bush = this.bushes[a];
            var prevBush = this.bushes[prevId];

            var tempY = bush.y + this.speed;
            if(tempY - bush.height > this.gh){
                bush.y = prevBush.y - prevBush.height + this.speed;
            } else {
                bush.y = tempY
            }
        }
    }

    createObs(obj){
        if(!this.placeSave) return;
        this.curCountCreate++;
        var modulul = this.curCountCreate % 3;
        if(modulul > 0){
            this.gObjects.createCoins(obj);
        } else {
            this.gObjects.createBox(obj)        
        }
    }

    destroyObs(obj){
        var coins = this.gObjects.coins;
        var boxes = this.gObjects.boxes;

        for(var a = 0; a < coins.length; a++){
            for(var b = 0; b < coins[a].length; b++){
                var coin = coins[a][b];
                if(!coin || !coin.exists || !coin.isActive) continue;
                var goalBound = this.gGoals.getBounds();
                var coinBound = coin.getBounds();
                var intersect = goalBound.intersects(coinBound)
                if(!intersect && coinBound.y > goalBound.bottom) continue;
                var minY = coin.y - (coin.height * 0.5);
                var maxY = coin.y + (coin.height * 0.5);
                if(maxY < goalBound.y){
                    coin.destroy();
                } else {
                    if(coinBound.bottom > 0){
                        coin.isActive = false;
                        var toY = -(coin.height * (coin.anchor.y))
                        var tween = game.add.tween(coin);
                        tween.to({alpha:0, y:toY}, 300);
                        tween.onComplete.add(function(){
                            this.destroy();
                        }, coin);
                        tween.start();
                    } else {
                        coin.destroy();
                    }
                }
                    
                coins[a][b] = null;
            }
        }

        for(var a = 0; a < boxes.length; a++){
            for(var b = 0; b < boxes[a].length; b++){
                var box = boxes[a][b];
                if(!box || !box.exists || !box.isActive) continue;
                var goalBound = this.gGoals.getBounds();
                var boxBound = box.getBounds();
                var intersect = goalBound.intersects(boxBound)
                if(!intersect && boxBound.y > goalBound.bottom) continue;
                var minY = box.y - (box.height * 0.5);
                var maxY = box.y + (box.height * 0.5);
                if(maxY < goalBound.y){
                    box.destroy();
                } else {
                    if(maxY > 0){
                        box.isActive = false;
                        var toY = -(box.height * box.anchor.y);
                        var tween = game.add.tween(box);
                        tween.to({alpha:0, y:toY}, 300);
                        tween.onComplete.add(function(){
                            this.destroy();
                        }, box);
                        tween.start();
                    } else {
                        box.destroy();
                    }
                }
                    
                boxes[a][b] = null;
            }
        }
    }

    moveGoal(){
        var moveBorder = this.plChara.y - this.gGoals.y;
        var cue = this.actualDist - moveBorder;
        this.curDist += this.speed;
        if(this.curDist >= cue){
            if(this.placeSave) {
                // console.log('place save end')
                this.placeSave = false;
                this.destroyObs();
            }            

            if(this.gGoals.y < this.centerY){
                this.gGoals.y += this.speed;
                if(this.gGoals.y >= this.centerY){
                    this.isMoving = false;
                }
            } else {
                if(this.plChara.y > 0) {
                    this.plChara.y -= this.speed;
                } else {
                    this.gameOver = true;
                    this.isMoving = false;
                    this.prepareTutor();
                }
            }
        }
    }

    moveDistIndicator(){
        if(!this.isMoving) return;
        var tempY = this.distIndicator.y - this.distSpeed;
        if(tempY > this.maxDist){
            this.distIndicator.y = tempY;
        }
    }

    lose(){
        this.gameOver = true;
        this.isMoving = false;
        this.plChara.animations.stop('run')
        this.plChara.frameName = 'ingame/dizzy';

        var tween = game.add.tween(this.showPoint);
        tween.to({y:-(this.plChara.height * 0.9)}, 300);
        tween.start();

        // this.gResult.tweenIn();
        this.prepareTutor();
    }

    pauseGame(){
        this.gamePaused = true;
        this.plChara.animations.paused = true;
    }

    update() {
        super.update();
        if(!this.gameStart && !transition.isClosed){
            if(!this.stageReady){
                // this.plHitBox();
                // this.prepareTutor();
                this.stageReady = true;
                // this.countingDown();
                // this.gameStart = true;
                // this.plChara.animations.play('run');
            }
        }

        this.showPoint.setText(this.curPoint)
        this.showCoin.setText(this.writeThousands(this.totalCoin));

        if(!this.gameStart || this.gamePaused || this.gameOver) return;

        this.moveBg();
        this.moveGoal()
        this.moveDistIndicator();

        var countMs = game.time.physicsElapsedMS * 0.001;
        if(this.curTime < this.maxTime) {
            var sec = this.countSec(this.curTime);
            // this.showTime.setText(sec)
            this.curTime += countMs;
        }
    }

    render(){
        // var rect = this.trashes[0].getBounds();
        // game.debug.geom(rect, 'rgba(255,0,0,0.5)')
    }
}
