class memoryChainGame{
    constructor(game){
        this.game = game;
        this.posdots = [];
        this.numberClick = 0;
        this.curCD = 3;
        this.gameState = "idle";
        this.gamescreen = null;
        this.gameTimer = 0;
        //this.
    }


    init(gamescreen){
        this.gamescreen = gamescreen;

        this.allContent = this.game.add.group();
        this.bgGroup = this.game.add.group();
        this.entitiesDots = this.game.add.group();
        this.entitiesDotsObs = this.game.add.group();
        this.enGrap = this.game.add.group();
        this.objRemember = this.game.add.group();
        this.frontUI = this.game.add.group();
        this.entitiesNumber = this.game.add.group();

        this.posLine = [];//new Array();
        //this.dotsImageCar = [[]]

        //add sound
        this.rightAudio = this.game.add.audio("choice-right", true);
        this.wrongAudio = this.game.add.audio("choice-wrong", true);

        this.allContent.add(this.bgGroup);
        this.allContent.add(this.entitiesDotsObs);
        this.allContent.add(this.entitiesDots);
        this.allContent.add(this.entitiesNumber);
        this.allContent.add(this.enGrap);
        this.allContent.add(this.objRemember);
        this.allContent.add(this.frontUI);
        this.spawnBackground();
        this.spawnUI();
        this.createEmiterCleaner();
        //this.spawnDots();

        //this.game.input.addMoveCallback(this.updateDrawLine, this);
    }

    spawnCar(){
        this.contentdraw = this.game.add.sprite(this.game.width*.5, this.game.height*.5, "car");
        this.contentdraw.anchor.set(.5);
        this.objRemember.add(this.contentdraw);
        this.contentdraw.alpha = 0;
    }

    spawnBooth(){
        this.contentdraw = this.game.add.sprite(this.game.width*.5, this.game.height*.5, "booth");
        this.contentdraw.anchor.set(.5);
        this.objRemember.add(this.contentdraw);
        this.contentdraw.alpha = 0;
    }

    spawnHouse(){
        this.contentdraw = this.game.add.sprite(this.game.width*.5, this.game.height*.5, "house");
        this.contentdraw.anchor.set(.5);
        this.objRemember.add(this.contentdraw);
        this.contentdraw.alpha = 0;
    }

    spawnTree(){
        this.contentdraw = this.game.add.sprite(this.game.width*.5, this.game.height*.5, "tree");
        this.contentdraw.anchor.set(.5);
        this.objRemember.add(this.contentdraw);
        this.contentdraw.alpha = 0;
    }

    spawnPond(){
        this.contentdraw = this.game.add.sprite(this.game.width*.5, this.game.height*.5, "pond");
        this.contentdraw.anchor.set(.5);
        this.objRemember.add(this.contentdraw);

        //this.game.time.events.add(Phaser.Timer.SECOND*4, this.clipShow, this);
        this.contentdraw.alpha = 0;
    }

    spawnRock(){
        this.contentdraw = this.game.add.sprite(this.game.width*.5, this.game.height*.5, "rock");
        this.contentdraw.anchor.set(.5);
        this.objRemember.add(this.contentdraw);
        this.contentdraw.alpha = 0;
    }

    createEmiterCleaner() {
        this.particle = this.game.add.emitter(0, 0, 50);
        this.particle.makeParticles('star-particle');
        this.particle.maxParticleScale = 0.3;
        this.particle.minParticleScale = 0.1;
        this.particle.minParticleSpeed.set(-200, -200);
        this.particle.maxParticleSpeed.set(200, 200);
        this.particle.minRotation = 20;
        this.particle.maxRotation = 80;
    }

    runParticles(x, y) {
        this.particle.x = x;
        this.particle.y = y;
        this.particle.start(true, 1000, null, 20);
    }

    clipShow(){
        var tween = this.game.add.tween(this.contentdraw).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true, 0, 0);
        var tweenchain = this.game.add.tween(this.contentdraw.scale).to({x:.75, y:.75}, 500, Phaser.Easing.Linear.None);
        var tweenanotherchain = this.game.add.tween(this.contentdraw).to({y:200}, 500, Phaser.Easing.Linear.None);
        tween.chain(tweenchain);
        tweenchain.chain(tweenanotherchain);
        tween.onComplete.add(function(){
            //console.log("end clipshow");
            //this.game.time.events.add(Phaser.Timer.SECOND*4, this.clipShow, this);
        }, this);
    }

    spawnBackground() {
        var bgImg = this.game.add.sprite(0, 0, "bg");
        this.bgGroup.add(bgImg);
        //this._allContent.sendToBack(bgImg);

        //create a ballon draw
        var ballonDraw = this.game.add.sprite(55,15, "balloon");
        this.bgGroup.add(ballonDraw);

        //create sammi think
        var sammi = this.game.add.sprite(42, 354, "sammi-think");
        this.bgGroup.add(sammi);
    }

    spawnNumber(array){
        for(var i = 0; i<array.length; i++){
            var num, textoption, px, py;
            px = array[i][0];
            py = array[i][1];
            textoption = {font:"20px vag", fill:"#272a4c", align :"center"};
            num = this.game.add.text(px, py, i+1, textoption);
            this.entitiesNumber.add(num);
        }
    }

    spawnDots(array){
        for(var i = 0; i<array.length; i++){
            var dots, px, py;
            px = array[i][0];
            py = array[i][1];
            dots = this.game.add.sprite(px,py, "dots");
            dots.inputEnabled = true;
            dots.anchor.set(.5);
            var textoption = {font:"14px Arial", fill:"#000000", align :"center"};
            dots.green = this.game.add.sprite(0,0, "dotg");
            dots.green.anchor.set(.5);
            dots.green.alpha = 0;
            dots.addChild(dots.green);
            dots.red = this.game.add.sprite(0,0,"dotr");
            dots.red.anchor.set(.5);
            dots.red.alpha = 0;
            dots.addChild(dots.red);
            dots.texting = this.game.add.text(0,0, i+1, textoption);
            dots.texting.anchor.set(.5);
            dots.texting.alpha = 0;
            dots.addChild(dots.texting);
            //dots.input.enableDrag();
            //dots.events.onDragStop.add(this.checkpos, this);
            dots.events.onInputDown.add(this.drawingLine, this, 0, dots);
            dots.events.onInputOver.add(this.scaleUp, this, 0, dots);
            dots.events.onInputOut.add(this.scaleDown, this, 0, dots);
            this.entitiesDots.add(dots);
        }

        this.grap = this.game.add.graphics(0,0);
        this.updategrap = this.game.add.graphics(0,0);
        this.enGrap.add(this.grap);
        this.enGrap.add(this.updategrap);
    }

    scaleUp(dots){
        if(this.gameState != "play")return;
        dots.scale.setTo(2);
    }

    scaleDown(dots){
        dots.scale.setTo(1);
    }

    spawnObstacleDots(){
        var l = Math.ceil(this.posdots.length *.5);
        for(var i = 0; i < l ; i++){
            //xmin = 200 ymin = 130
            //xmax = 720 ymax = 460
            var obsDots = this.game.add.sprite(this.game.rnd.between(200, 720), this.game.rnd.between(130,460), "doto");
            obsDots.inputEnabled = true;
            obsDots.anchor.set(.5);
            obsDots.red = this.game.add.sprite(0,0, "dotr");
            obsDots.red.anchor.set(.5);
            obsDots.red.alpha = 0;
            obsDots.addChild(obsDots.red);

            //adding events
            obsDots.events.onInputDown.add(this.wrongClick, this, obsDots);
            obsDots.events.onInputOver.add(this.scaleUp, this, 0, obsDots);
            obsDots.events.onInputOut.add(this.scaleDown, this, 0, obsDots);
            this.entitiesDotsObs.add(obsDots);
        }
    }

    spawnUI(){
        this.showCountdown = this.game.add.text(this.game.width*.5, this.game.height*.5, '', {fontSize:100});
        this.showCountdown.anchor.set(.5);
        this.showCountdown.fill = 'red';
        this.showCountdown.stroke = 'yellow';
        this.showCountdown.strokeThickness = 5;
        this.frontUI.add(this.showCountdown);
    }

    countingDown(){
        var text = parseInt(this.curCD);
        if(this.curCD < 1) {
            text = STRINGS_DATA.data.start;
        }

        this.showCountdown.setText(text);
        this.showCountdown.scale.setTo(2);

        this.showCountdown.alpha = 0

        var tweenScale = this.game.add.tween(this.showCountdown.scale).to({x:1, y:1}, 500).start();
        var tween = this.game.add.tween(this.showCountdown).to({alpha:1}, 500, Phaser.Easing.Linear.None, true)
        .onComplete.add(function(){
            setTimeout(function(){
                this.curCD--;
                if(this.curCD >= 0){
                    this.countingDown();
                } else {
                    this.showCountdown.destroy();
                    this.gameState = "play";
                }
            }.bind(this), 200)
        }, this);
    }

    /*
    reposDots(array){
        for(var i=0; i<array.length; i++){
            var dts = this.entitiesDots.getAt(i);
            dts.x = array[i][0];
            dts.y = array[i][1];
        }
    }
    */

    ///for debuging only
    checkpos(pointer){
        console.log(pointer.x+" "+pointer.y);
        //console.log(this.pointer.x+" "+this.pointer.y);
    }

    wrongClick(dots){
        //console.log("wrong click");
        if(this.gameState != "play" || this.game.tweens.isTweening(dots)) return;
        this.wrongAudio.play();
        this.game.time.events.repeat(200, 8, this.clipingDotsWrong, this, dots);
        var posBefore = dots.x;
        var moveX = posBefore+5;
        this.game.add.tween(dots).to({x:moveX}, 200, Phaser.Easing.Linear.None, true, 0, 4, true);
    }

    drawingLine(dots){
        //console.log("show be drawing line");
        if(this.gameState != "play" || this.game.tweens.isTweening(dots))return;
        var num = parseInt(dots.texting.text)-1;
        if(num == this.numberClick){
            this.rightAudio.play();
            this.numberClick += 1;
            dots.green.alpha = .5;
            this.runParticles(dots.x, dots.y);
            if(this.numberClick == this.posdots.length){
                //console.log("game end or next level");
                this.gameState = "idle";
                this.updategrap.clear();
                this.clipShow();
                this.gamescreen.createTalker();
                this.game.score += this.getScore();
                this.game.timeElapsed += this.gameTimer;
            }
        }
        else {
            //return;
            this.game.time.events.repeat(200, 8, this.clipingDotsWrong, this, dots);
            this.wrongAudio.play();
            var posBefore = dots.x;
            var moveX = posBefore+5;
            this.game.add.tween(dots).to({x:moveX}, 200, Phaser.Easing.Linear.None, true, 0, 3, true);
            return;
        }
        this.grap.lineStyle(2, 0xff0000, 1);
        var objCoordinate = {x:dots.x, y:dots.y};
        this.posLine.push(objCoordinate);
        var posBefore = this.posLine.length-1;
        if(posBefore <=0){
            this.grap.moveTo(dots.x, dots.y);
        }
        else{
            var lineBefore = this.posLine[posBefore];
            this.grap.lineTo(lineBefore.x,lineBefore.y);
        }
        //console.log(pos.x);
        //this.grap.moveTo();
    }

    getScore(){
        if(this.gameTimer < 60){ //1 menit dalam milisecond
            return 1000;
        }
        else if(this.gameTimer > 360){ // 6 menit dalam milisecond
            return 100;
        }
        else{
            //return (1000 - (timerelapse * 0.0167));// 1000;
            var timerxxx = this.gameTimer/60;
            return (1/timerxxx)*1000;
        }
    }

    timeCount(elapsedMS){
        if(this.gameState == "play"){
            this.gameTimer += elapsedMS;
        }
    }

    clipingDotsWrong(dots){
        if(dots.red.alpha >= .65){
            dots.red.alpha = 0;
            //dots.x += 5;
        }
        else{
            dots.red.alpha = .7;
            //dots.x -= 10;
        }
    }

    updateDrawLine(pointer, x, y){
        if(this.posLine.length<=0 || this.gameState == "idle") return;
        this.updategrap.clear();
        this.updategrap.lineStyle(2, 0xff0000, 1);
        var posBefore = this.posLine.length-1;
        var linebefore = this.posLine[posBefore];
        this.updategrap.moveTo(linebefore.x, linebefore.y);
        this.updategrap.lineTo(x, y);
    }

    updateTextTimer(time) {
        var min = parseInt(time / 60);
        var sec = parseInt(time - (min * 60));
        var minString = String(min)
        var secString = String(sec);
        if (sec < 10) {
            secString = "0" + String(sec);
        }
        if (min < 10) {
            minString = "0" + String(min);
        }
        return (minString + ":" + secString);
    }
}