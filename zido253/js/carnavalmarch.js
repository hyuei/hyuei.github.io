/// <reference path="../defs/phaser.d.ts" />

class carnavalMarchGame {
    constructor(game) {
        this.game = game;
        this.gameState = "play";
        this.gamescreen = null;
        this.gameTimer = 0;
        this.timeLimit = 120;
        this.curCD = 3;
        this.direction = "right";
        this.nextDirection = "";
        this.maxSpeed = 2; 
        this.moveSpeedKid = {x:0, y:0};
        this.tailBody = [];
        this.allGRID = [];
        this.foods = null;
        this.foodBonus = null;
        this.timeSpawnObstacle = 0;
        this.timeSpawnBonus = 10;
        this.timeLiveFoods = 10;
        this.CONSTTIMEFOODS = 10;
        this.BONUSTIMER = 5;
        this.score = 0;

        this.friendEncounter = 1;

        if(gameControl == null){
            gameControl = this;
        }

        /*RULES
        • Untuk si temen2 yang bisa diambil, jadinya animasinya dibounce aja scale atas bawah kaya jalan.
        • Tambahin shadow di bawahnya (static aja).
        • Mau jalan ke arah manapun, tetep ngarah ke depan aja.
        • Urutan spawn warnanya dibikin kaya sekarang aja, kalo udah sampe friend-05, spawn berikutnya kembali ke friend-01
        */


        /*TODO
            scale movement boing-boing
            zIndex
        */
    }


    init(gamescreen) {
        this.gamescreen = gamescreen;

        this.allContent = this.game.add.group();
        this.backcgroundGroup = this.game.add.group();
        this.entityGroup = this.game.add.group();
        this.goodEntitiesGroup = this.game.add.group();//snake from head to tail
        this.foodEntitiesGroup = this.game.add.group();
        this.badEntitiesGroup = this.game.add.group();
        this.frontUI = this.game.add.group();
        this.backUI = this.game.add.group();

        this.allContent.add(this.backcgroundGroup);
        this.allContent.add(this.entityGroup);
        this.allContent.add(this.backUI);
        this.allContent.add(this.frontUI);

        this.entityGroup.add(this.goodEntitiesGroup);
        this.entityGroup.add(this.foodEntitiesGroup);
        this.entityGroup.add(this.badEntitiesGroup);

        this.goodEntitiesGroup.enableBody = true;
        this.foodEntitiesGroup.enableBody = true;
        this.badEntitiesGroup.enableBody = true;

        for(let i = 0; i<6; i++){
            if(i == 0){
                this.allGRID.push([0,0,0,0,0,0,0,0,0,0,0]);
            }
            else{
                this.allGRID.push([0,0,0,0,0,0,0,0,0,0,0]);
            }
        }

        this.spawnBackground();
        this.spawnSnake();
        this.spawnFood();
        this.spawnBonus();
        //this.spawnSnakeBody();
        //this.spawnObstacle();
        this.spawnUI();
        this.spawnGraphics();
        this.createEmiterCleaner();

        let mRight = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        let mLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        let mUp = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        let mDown = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

        mRight.onDown.add(this.moveChar, this, 0, "right");
        mLeft.onDown.add(this.moveChar, this, 0, "left");
        mUp.onDown.add(this.moveChar, this, 0, "up");
        mDown.onDown.add(this.moveChar, this, 0, "down");

        this.bg.inputEnabled = true;
        this.bg.events.onInputDown.add(this.onStartClick, this);
        this.bg.events.onInputUp.add(this.onReleaseClick, this);

        this.timeSpawnObstacle = 15;//this.game.rnd.between(8, 15);
        
    }

    spawnBackground() {
        this.bg = this.game.add.sprite(0, 0, "bg");
        this.backcgroundGroup.add(this.bg);
    }

    spawnUI() {
        this.showCountdown = this.game.add.text(this.game.width * .5, this.game.height * .5, '', {
            fontSize: 100
        });
        this.showCountdown.anchor.set(.5);
        this.showCountdown.fill = 'red';
        this.showCountdown.stroke = 'yellow';
        this.showCountdown.strokeThickness = 5;
        this.frontUI.add(this.showCountdown);

        this.timerInGame = this.game.add.sprite(this.game.width*.5, this.game.height-10, 'scoreboxingame');
        this.scoreInGame =  this.game.add.sprite(this.game.width*.5, 10, 'scoreboxingame');
        this.timerInGame.anchor.setTo(.5);
        this.scoreInGame.anchor.setTo(.5);
        this.backUI.add(this.timerInGame);
        this.backUI.add(this.scoreInGame);

        let timerimg = this.game.add.sprite(-50, -25, 'timer-icon');
        this.textTimerInGame = this.game.add.text(15, -8, '00:15', {
            font: "25px vag",
            fill: "#dd6118"
        });
        this.textTimerInGame.anchor.setTo(.5);
        this.timerInGame.addChild(timerimg);
        this.timerInGame.addChild(this.textTimerInGame);

        this.textScoreInGame = this.game.add.text(0, 8, '0', {
            font: "25px vag",
            fill: "#dd6118"
        });
        this.textScoreInGame.anchor.setTo(.5);
        this.scoreInGame.addChild(this.textScoreInGame);
    }

    spawnSnake() {
        this.kid = new SnakeHead(this.game, 144, 80, this);
        this.kid.playAnims("right");

        //push movement and dirr
        this.goodEntitiesGroup.add(this.kid);
        //this.kid.body.setSize(30, 30, 15, 50);
    }

    spawnGraphics(){
        this.graphicRenderBody = this.game.add.graphics(0,0);
    }

    spawnFood(){
        //new spawn food code
        let numberShow = 0;
        numberShow = this.friendEncounter;
        let numFriend = "friend-"+ numberShow;
        if(this.foods){
            this.foods.loadTexture(numFriend);
        }
        else {
            this.foods = this.game.add.sprite(0, 0, numFriend);
            this.timebarFood = this.game.add.sprite(0,-20, 'timebar');
            this.foods.addChild(this.timebarFood);
            this.timebarFood.anchor.set(.5);
        }
        this.friendEncounter++;
        this.timeLiveFoods = 10;
        if(this.friendEncounter > 5)this.friendEncounter = 1;
        let randGrid ={x:0, y:0};
        let recheckRepeat = 5;
        do{
            randGrid = {x:this.game.rnd.between(0, 10), y:this.game.rnd.between(0,5)}
            recheckRepeat -- ;
            if(recheckRepeat <=0){
                let getEmpty = false;
                //brutfore check
                for(let i =0; i<6; i++){
                    for(let j =0; j<11; j++){
                        if(this.checkEmptyGrid(j, i)){
                            randGrid = {x:j, y:i};
                            getEmpty = true;
                            break;
                        }
                    }
                    if(getEmpty){
                        break;
                    }
                }
                //debugger;
            }
        }
        while(!this.checkEmptyGrid(randGrid.x, randGrid.y));
        //console.log(randGrid);
        this.allGRID[randGrid.y][randGrid.x] = 100+numberShow;
        this.foods.x = 144+randGrid.x *65;
        this.foods.y = 100+randGrid.y*66;
        //tween here

        this.foodEntitiesGroup.add(this.foods);
        this.foods.anchor.set(.5, .5);
        this.foods.body.setSize(30, 30, 14, 16);
    }
    spawnBonus(){
        this.foodBonus = this.game.add.sprite(0,0, 'bonus');
        this.foodBonus.anchor.set(.5);
        this.foodEntitiesGroup.add(this.foodBonus);
        this.foodBonus.visible = false;
    }

    addBonusFoods(){
        let spawnBonusTimer = (Math.random() <.3)?true:false;
        this.timeSpawnBonus = this.gameTimer + 10;
        if(!spawnBonusTimer ||this.foodBonus.visible){
            return;
        }
        this.foodBonus.visible = true;
        this.foodBonus.timeLive = 20;
        let randGrid ={x:0, y:0};
        //let recheckRepeat = 33;
        do{
            randGrid.x = this.game.rnd.between(0, 10); 
            randGrid.y = this.game.rnd.between(0,5);
            /*
            recheckRepeat -- ;
            if(recheckRepeat <=0){
                //brutfore check
                break;
            }*/
        }
        while(!this.checkEmptyGrid(randGrid.x, randGrid.y));

        this.allGRID[randGrid.y][randGrid.x] = 106;
        this.foodBonus.x = 144+randGrid.x *65;
        this.foodBonus.y = 100+randGrid.y *66;
    }

    spawnSnakeBody(x, y, array){
        let numbfriend = this.friendEncounter - 1;
        if(numbfriend==0)numbfriend =5;
        let body = new SnakeBody(game, 144+x*65, 100+y*66, this, numbfriend);
        body.setGrid(x, y);
        body.trackMovement = array.slice();
        this.goodEntitiesGroup.add(body);
        this.tailBody.splice(0,0, body);
        //console.log(this.tailBody);
        //this.tailBody.push(body);
        this.spawnFood();
    }

    removeSnakeBody(){
        let tail = this.tailBody[this.tailBody.length-1];
        tail.destroy();
        this.tailBody.pop();

        ///particle asap
    }

    spawnObstacle(){
        let batu = this.game.add.sprite(0, 0, 'obstacle');
        let randGrid = {x:0, y:0};
        //let recheckRepeat = 33;
        do{
            randGrid = {x:this.game.rnd.between(0, 10), y:this.game.rnd.between(0,5)};
            /*
            recheckRepeat -- ;
            if(recheckRepeat <=0){
                let getEmpty = false;
                //brutfore check
                for(let i =0; i<6; i++){
                    for(let j =0; j<11; j++){
                        if(this.checkEmptyGrid(j, i)){
                            randGrid.x = j;
                            randGrid.y = i;
                            getEmpty = true;
                            break;
                        }
                    }
                    if(getEmpty){
                        break;
                    }
                }
            }
            */
        }
        while(!this.checkEmptyGrid(randGrid.x, randGrid.y));
        this.allGRID[randGrid.y][randGrid.x] = 200;
        batu.x = 144+randGrid.x *65;
        batu.y = 100+randGrid.y*66;
        batu.grid = new Phaser.Point(randGrid.x, randGrid.y);
        batu.anchor.set(.5);

        //create tween when load, after on complete make stone solids
        batu.alpha = 0.1;
        this.setAlphaObs(1, null, batu, 700, true);
        this.timeSpawnObstacle = this.game.rnd.between(8, 15) + this.gameTimer;
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

        this.poofParticle = this.game.add.emitter(0,0, 30);
        this.poofParticle.makeParticles('b-particle', ['b1', 'b2', 'b3', 'b4']); // this._game.rnd) make random particle
        this.poofParticle.maxParticleScale = .4;
        this.poofParticle.minParticleScale = .1;
        this.poofParticle.minParticleSpeed.set(-100, -100);
        this.poofParticle.maxParticleSpeed.set(100, 100);
        this.poofParticle.minRotation = 20;
        this.poofParticle.maxRotation = 80;
    }

    runParticles(x, y) {
        this.particle.x = x;
        this.particle.y = y;
        this.particle.start(true, 1000, null, 20);
    }

    runPoofParticle(x, y){
        this.poofParticle.x = x;
        this.poofParticle.y = y;
        this.poofParticle.start(true, 1000, 100, 20);
    }
    setAlphaObs(alpha, tweener, obj, timer, yoyo){
        timer -= 100;
        let tween = this.game.add.tween(obj).to({alpha:1}, timer, Phaser.Easing.Linear.None, true, 0, 0, yoyo);
        if(timer == 100){
            tween.onComplete.add(this.makeObsSolid, this, 0, obj)
        }
        else{
            tween.onComplete.add(this.setAlphaObs, this, 0, obj, timer, true)
        }
    }

    makeObsSolid(alpha, tweener, obj){
        obj.alpha = 1;
        this.badEntitiesGroup.add(obj);
        //obj.body.setSize(65,66);
        this.allGRID[obj.grid.y][obj.grid.x] = 300;
        this.game.time.events.add(30000, function () {
            this.destroyObs();
        }, this);
    }

    destroyObs(){
        let batuFirst = this.badEntitiesGroup.getFirst("obstacle");
        this.allGRID[batuFirst.grid.y][batuFirst.grid.x] = 0;
        batuFirst.destroy();
        this.timeSpawnObstacle = this.game.rnd.between(8, 15) + this.gameTimer;
    }

    checkEmptyGrid(x, y){
        //check head
        if(this.kid.grid.y == y && this.kid.grid.x == x){
            return false;
        }
        //check body
        for(let i = 0; i < this.tailBody.length; i++){
            let partboady = this.tailBody[i];
            if(partboady.grid.x == x && partboady.grid.y == y){
                return false;
            }
        }
        //else

        return(this.allGRID[y][x] == 0);
    }

    getGridFoodByPosition(x, y){
        let gx = (x-144)/65;
        let gy = (y-100)/66;
        let grid = {x:gx, y:gy};
        return(grid);
    }

    countingDown() {
        var text = parseInt(this.curCD);
        if (this.curCD < 1) {
            text = STRINGS_DATA.data.start;
        }

        this.showCountdown.setText(text);
        this.showCountdown.scale.setTo(2);

        this.showCountdown.alpha = 0

        var tweenScale = this.game.add.tween(this.showCountdown.scale).to({
            x: 1,
            y: 1
        }, 500).start();
        var tween = this.game.add.tween(this.showCountdown).to({
                alpha: 1
            }, 500, Phaser.Easing.Linear.None, true)
            .onComplete.add(function () {
                setTimeout(function () {
                    this.curCD--;
                    if (this.curCD >= 0) {
                        this.countingDown();
                    } else {
                        this.showCountdown.destroy();
                        this.gameState = "play";
                        this.textBoardNumber.visible = true;
                    }
                }.bind(this), 200)
            }, this);
    }

    getScore() {
       
    }

    getTimerScore(){
        if (this.gameTimer < 60) { //1 menit dalam milisecond
            return 1000;
        } else if (this.gameTimer > 360) { // 6 menit dalam milisecond
            return 100;
        } else {
            //return (1000 - (timerelapse * 0.0167));// 1000;
            var timerxxx = this.gameTimer / 60;
            return (1 / timerxxx) * 1000;
        }
    }

    gameUpdate(elapsedMS) {
        if (this.gameState == "play") {
            this.gameTimer += elapsedMS;
            this.timeLimit -= elapsedMS;
            //drawTextTimer
            this.textTimerInGame.text = this.updateTextTimer(this.timeLimit);
            if(this.timeLimit <=0){
                this.kid.animations.stop();
                this.gamescreen.createTalker();
                this.gameState = "end";
            }
            //this.movingChar();
            //spawnAfriend
            if(this.timeSpawnBonus < this.gameTimer){
                this.addBonusFoods();
            }
            if(this.foods){
                if(!this.kid.eating){
                    this.timeLiveFoods -= elapsedMS;
                    this.timebarFood.width = Math.floor(50*(this.timeLiveFoods/this.CONSTTIMEFOODS));
                    if(this.timeLiveFoods<0){
                        let gridFood = this.getGridFoodByPosition(this.foods.x, this.foods.y);
                        this.allGRID[gridFood.y][gridFood.x] = 0;
                        this.runPoofParticle(this.foods.x, this.foods.y);
                        this.spawnFood();
                    }
                }
            }
            if(this.timeSpawnObstacle < this.gameTimer && this.badEntitiesGroup.length  < 5){
                this.spawnObstacle();
            }

            if(this.foodBonus.visible){
                this.foodBonus.timeLive -= elapsedMS;
                if(this.foodBonus.timeLive<0)this.foodBonus.visible = false;
            }
        }
    }

    pushMovement(dir){
        for(let i = 0; i<this.tailBody.length; i++){
            //console.log("pushmovement");
            let b = this.tailBody[i];
            b.trackMovement.push(dir);
        }
    }


    moveChar(pKey, direction){
        let ver = (this.direction == "right" || this.direction == "left");
        let hor = (this.direction == "up" || this.direction == "down");

        if(ver && (direction == "left" || direction == "right"))return;
        if(hor && (direction == "up" || direction == "down"))return;

        //this.nextDirection = direction;
        //this.kid.playAnims(direction);
        this.kid.nextDirection = direction;
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

    checkCollider(x, y){
        //out game area
        if(x<0 || x > 10 || y <0 || y>5){
            this.kid.animations.stop();
            this.gamescreen.createTalker();
            this.gameState = "end";
            //setback position
            let posCrah = {x:144+x*65, y:80+y*66};
            if(x>10){this.kid.x = 144+10*65; posCrah.x = 827;}
            if(x<0){this.kid.x = 144;posCrah.x = 112;}
            if(y<0){this.kid.y = 80;posCrah.y = 67;}
            if(y>5){this.kid.y = 80+5*66;posCrah.y = 463;}
            //spawn crash
            let img = this.game.add.sprite(posCrah.x,posCrah.y, 'crash');
            img.anchor.set(.5);
            this.backUI.add(img);
            return;
            //debugger;
        }
        let check  = this.allGRID[y][x];
        if(check > 100 && check < 107){
            //eat food
            if(check >100 && check < 106){
                this.allGRID[y][x] = 0;
                this.score +=100 ;
                this.textScoreInGame.text = this.score;
                this.kid.eatFood(x, y);
                this.runParticles(144+x*65, 100+y*66);
            }
            else{//bonus
                //this.foodBonus.destroy();
                this.timeLimit += this.BONUSTIMER;
                this.foodBonus.visible = false;
                this.allGRID[y][x] = 0;
                this.runParticles(144+x*65, 100+y*66);
            }
        }
        else if (check == 300){ //collide with obs
            this.kid.animations.stop();
            this.gamescreen.createTalker();
            this.gameState = "end";
            //spawn crash
            let posCrah = {x:144+x*65, y:100+y*66};
            let img = this.game.add.sprite(posCrah.x,posCrah.y, 'crash');
            img.anchor.set(.5);
            this.backUI.add(img);
            return;
        }
    }

    selfCollision(x, y){
        for(let i = 0; i<this.tailBody.length; i++){
            //console.log("selfCollision");
            let tail = this.tailBody[i];
            if(tail.grid.x == x && tail.grid.y ==y){
                //console.log("collide body");
                this.kid.animations.stop();
                this.gamescreen.createTalker();
                this.gameState = "end";
                //spawn crash
                //this.game.add.sprite(0,0, 'crash');
                let posCrah = {x:144+x*65, y:100+y*66};
                let img = this.game.add.sprite(posCrah.x,posCrah.y, 'crash');
                img.anchor.set(.5);
                this.backUI.add(img);
                break;
            }
        }
    }

    renderSpriteBody(){
        this.game.debug.physicsGroup(this.goodEntitiesGroup);
        this.game.debug.physicsGroup(this.badEntitiesGroup);
    }

    onStartClick(obj, pointer){
        if(this.isClicked) return;
        this.isClicked = true;
        this.startClick = {x:game.input.x, y:game.input.y};
    }

    onReleaseClick(obj, pointer){
        if(!this.isClicked) return;
        this.isClicked = false;
        let minDist = 100;
        let dir = {x:this.startClick.x - game.input.x, y:this.startClick.y - game.input.y};
        let ver = (Math.abs(dir.x)>Math.abs(dir.y))?true:false;
        if(ver){
            let checkDist = Math.abs(dir.x);
            if(checkDist >= minDist){
                let right = (dir.x < 0 )?true:false;
                if(right)this.moveChar(null, "right");
                else{ this.moveChar(null, "left");}
            }
        }
        else{
            let checkDist = Math.abs(dir.y);
            if(checkDist >= minDist){
                let up = (dir.y > 0 )?true:false;
                if(up)this.moveChar(null, "up");
                else{ this.moveChar(null, "down");}
            }
        }
    }
}