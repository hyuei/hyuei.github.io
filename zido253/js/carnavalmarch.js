/// <reference path="../defs/phaser.d.ts" />

class carnavalMarchGame {
    constructor(game) {
        this.game = game;
        this.gameState = "play";
        this.gamescreen = null;
        this.gameTimer = 0;
        this.curCD = 3;
        this.direction = "right";
        this.nextDirection = "";
        this.maxSpeed = 2; 
        this.moveSpeedKid = {x:0, y:0};
        this.tailBody = [];
        this.recordMovement = [];
        this.foods = null;
        this.lastSpawnFood = 0;
        this.timeSpawnObstacle = 0;
        this.countObsInGame = 0;
        this.testGridBug = 5;
        
        /* BUG LIST
            - using getintersect, need to change with pysic arcarde or manual set getbox
            * why : collider to big, when foods in up head, and the other food still process
        */

    }


    init(gamescreen) {
        this.gamescreen = gamescreen;

        this.allContent = this.game.add.group();
        this.backcgroundGroup = this.game.add.group();
        this.entityGroup = this.game.add.group();
        this.goodEntitiesGroup = this.game.add.group();
        this.badEntitiesGroup = this.game.add.group();
        this.frontUI = this.game.add.group();

        this.allContent.add(this.backcgroundGroup);
        this.allContent.add(this.entityGroup);
        this.allContent.add(this.frontUI);

        this.entityGroup.add(this.goodEntitiesGroup);
        this.entityGroup.add(this.badEntitiesGroup);

        this.goodEntitiesGroup.enableBody = true;
        this.badEntitiesGroup.enableBody = true;

        this.spawnBackground();
        this.spawnEntities();
        //this.spawnObstacle();
        this.spawnUI();
        this.spawnGraphics();

        let mRight = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        let mLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        let mUp = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        let mDown = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

        mRight.onDown.add(this.moveChar, this, 0, "right");
        mLeft.onDown.add(this.moveChar, this, 0, "left");
        mUp.onDown.add(this.moveChar, this, 0, "up");
        mDown.onDown.add(this.moveChar, this, 0, "down");

        this.timeSpawnObstacle = this.game.rnd.between(8, 15);
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


    spawnBackground() {
        let bg = this.game.add.sprite(0, 0, "bg");
        this.backcgroundGroup.add(bg);
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
    }


    spawnEntities() {
        this.kid = this.game.add.sprite(0,0, "char", "chara-down-01.png");
        this.kid.grid = {x:0, y:0};
        this.kid.x = 144 + this.kid.grid.x *65;
        this.kid.y = 34 + this.kid.grid.y * 66; 
        this.kid.anchor.set(.5, 0);
        this.kid.animations.add("down",  ["chara-down-01.png", "chara-down-02.png", "chara-down-03.png", "chara-down-02.png"], 6, true, false);
        this.kid.animations.add("side",  ["chara-side-01.png", "chara-side-02.png", "chara-side-03.png", "chara-side-02.png"], 6, true, false);
        this.kid.animations.add("up",  ["chara-up-01.png", "chara-up-02.png", "chara-up-03.png", "chara-up-02.png"], 6, true, false);
        this.kid.ready = true;
        //push head into tail body
        this.tailBody.push(this.kid);

        //push movement and dirr
        let newObjcRecord = {grid:{x:this.kid.grid.x, y:this.kid.grid.y}, dir:this.direction};
        this.recordMovement.push(newObjcRecord);

        this.goodEntitiesGroup.add(this.kid);
        this.kid.body.setSize(30, 30, 15, 50);

        //rect manual
        this.kid.rect = {w:30, h:30, x:this.kid.x-15,  y:this.kid.y+55};


        //this.spawnObstacle();
    }

    spawnFood(){
        let randFriend = "friend-"+this.game.rnd.between(1, 5);
        this.foods = this.game.add.sprite(0, 0, randFriend);
        let randGrid = {x:this.game.rnd.between(0, 10), y:this.game.rnd.between(0,5)};
        //randGrid = {x:5, y:this.testGridBug--};
        this.foods.grid = randGrid;
        this.foods.x = 144+randGrid.x *65;
        this.foods.y = 100+randGrid.y*66;
        this.foods.scale.setTo(.1, .1);
        this.foods.anchor.set(.5, .5);
        this.game.add.tween(this.foods.scale).to({
            x: 1,
            y: 1
        }, 800, Phaser.Easing.Elastic.Out).start();
        this.lastSpawnFood = this.gameTimer;
        this.goodEntitiesGroup.add(this.foods);
        this.foods.body.setSize(30, 30, 14, 16);

    }

    spawnGraphics(){
        this.graphicRenderBody = this.game.add.graphics(0,0);
    }

    spawnObstacle(){
        this.timeSpawnObstacle = game.rnd.between(8, 15) + this.gameTimer;
        let randGrid = {x:this.game.rnd.between(0, 10), y:this.game.rnd.between(0,5)};
        let batu = this.game.add.sprite(144 + randGrid.x*65, 100+randGrid.y*66, 'obstacle');
        batu.anchor.set(.5);
        batu.alpha = 0.1;
        this.setAlphaObs(1, null, batu, 600, true);
        this.countObsInGame ++;
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
        obj.body.setSize(65,66);
    }

    checkEmptyPos(){
        //still think about algorithm empty pos (maybe use a bruteforce)
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
            this.movingChar();
            //spawnAfriend
            if(this.lastSpawnFood+1 < this.gameTimer && this.foods == null){
                this.spawnFood();
            }
            if(this.timeSpawnObstacle < this.gameTimer && this.countObsInGame < 2){
                this.spawnObstacle()
            }
        }
    }

    

    movingChar(){
        //set speed
        //when have a tail
        let i = 0;
        while(i<this.tailBody.length){
            let tail = this.tailBody[i];
            let headPos = i-1;
            let dir = (headPos > -1)?this.recordMovement[headPos].dir:this.direction;
            let nextGrid =  (headPos > -1)?this.recordMovement[headPos].grid:null;
            if(tail.ready){
                this.moveBySpeed(tail, dir, nextGrid);
            }
            i++;
        }
        //set anims
        if(this.direction == "right"){
            //this.kid.x += 2;
            this.kid.animations.play("side");
            if(this.kid.scale.x != 1) this.kid.scale.x = 1;
        }
        else if(this.direction == "left"){
            //this.kid.x -= 2;
            this.kid.animations.play("side");
            if(this.kid.scale.x != -1) this.kid.scale.x = -1;
        }
        else if(this.direction == "up"){
            //this.kid.y -= 2;
            this.kid.animations.play("up");
        }
        else if(this.direction == "down"){
            //this.kid.y += 2;
            this.kid.animations.play("down");
        }

        //check next direction
        if(this.checkGridMovement()){
            this.kid.grid.x = (this.kid.x-144)/65;
            this.kid.grid.y = (this.kid.y-34)/66;
            if(this.nextDirection != "") {
                this.direction = this.nextDirection;
                this.nextDirection = "";
            }
            let newObjcRecord = {grid:{x:this.kid.grid.x, y:this.kid.grid.y}, dir:this.direction};
            this.recordMovement.push(newObjcRecord);
            if(this.recordMovement.length > this.tailBody.length){
                this.recordMovement.shift();
            }
        }

        //updateCollider
        /*
        this.kid.rect.x = this.kid.x-15;
        this.kid.rect.y = this.kid.y+55;
        */
        

        //check collide
        //food
        if(this.foods){
            this.game.physics.arcade.overlap(this.kid, this.foods, this.eatFoods, null, this);
        }
        

        //END GAME
        this.game.physics.arcade.overlap(this.goodEntitiesGroup, this.badEntitiesGroup, function(){
            this.gameState = "end";
            this.gamescreen.endGame();
            this.kid.animations.stop();
        }, null, this);

        if(this.kid.x > 828){ //desiredWidthRatio - this.kid.width){
            this.kid.x = 828;//desiredWidthRatio - this.kid.width;
            if(this.gameState == "play"){
                this.gameState = "end";
                this.gamescreen.endGame();
                this.kid.animations.stop();
            }
        }
        if(this.kid.x < 111){
            this.kid.x = 111;
            if(this.gameState == "play"){
                this.gameState = "end";
                this.gamescreen.endGame();
                this.kid.animations.stop();
            }
        }
        if(this.kid.y < 1){
            this.kid.y = 1;
            if(this.gameState == "play"){
                this.gameState = "end";
                this.gamescreen.endGame();
                this.kid.animations.stop();
            }
        }
        if(this.kid.y > 397){ //desiredHeightRatio- this.kid.height){
            this.kid.y = 397; //desiredHeightRatio - this.kid.height;
            if(this.gameState == "play"){
                this.gameState = "end";
                this.gamescreen.endGame();
                this.kid.animations.stop();
            }
        }
    }

    eatFoods(){
        this.tailBody.push(this.foods);
        this.game.add.tween(this.foods.scale).to(
            {x:0, y:0}, 
            500, 
            Phaser.Easing.Cubic.Out, true)
        .onComplete.add(this.spawnTails, this, 0, this.foods);
        //this.foods = null;//adding new foods
        this.spawnFood();
    }

    spawnTails(scale, tween, tails){//scale, tween, //rest you can add any argument
        //debugger;
        //tails.y-=20;
        this.game.add.tween(tails.scale).to({x:1, y:1},200,Phaser.Easing.Cubic.Out, true).onComplete.add(function(){
            tails.ready = true;
        }.bind(this));
        console.log(this.tailBody.length);
    }

    moveChar(pKey, direction){
        this.nextDirection = direction;
    }

    moveBySpeed(obj, dir, grid){
        //read movement
        let p = {x:0, y:0};
        let s = {x:0, y:0};
        if(dir == "down"){
            p.y = 1;
        }
        else if(dir == "up"){
            p.y = -1;
        }
        else if(dir == "left"){
            p.x = -1;
        }
        else if(dir == "right"){
            p.x = 1;
        }

        if(p.x != 0){
            let nextGridX = 144 + (obj.grid.x+p.x)*65;
            if(grid != null) nextGridX = 144 + (grid.x+p.x)*65;
            let checkPosX = Math.abs(obj.x - nextGridX);

            s.x = (checkPosX>this.maxSpeed)?this.maxSpeed*p.x:checkPosX*p.x;
        }
        if(p.y != 0){
            let nextGridY = 34 + (obj.grid.y+p.y)*66;
            if(grid != null) nextGridY = 100 + (grid.y+p.y)*66;
            let checkPosY = Math.abs(obj.y - nextGridY);
            s.y = (checkPosY>this.maxSpeed)?this.maxSpeed*p.y:checkPosY*p.y;
        }
        //note if(sx == 0 || sy = 0 ) that mean collide with ending || collide with something
        obj.x += s.x;
        obj.y += s.y;
    }

    checkGridMovement(){
        let checkX = ((this.kid.x-144)%65==0)?1:0;
        let checkY = ((this.kid.y-34)%66==0)?1:0;
        return (checkX&&checkY);
    }

    /*
    checkCollider(obj1, obj2){
        obj1.x+obj1.w >  
    }
    */

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

    renderSpriteBody(){
        this.game.debug.physicsGroup(this.goodEntitiesGroup);
        this.game.debug.physicsGroup(this.badEntitiesGroup);
        //this.entityGroup.forEachAlive(function(member){
                //console.log(member);

        //});
        /*
        this.graphicRenderBody.clear();
        this.graphicRenderBody.alpha = .5;
        this.graphicRenderBody.beginFill(0xFF3300);
        this.graphicRenderBody.drawRect(this.kid.rect.x, this.kid.rect.y, this.kid.rect.w, this.kid.rect.h);
        if(this.foods){
            this.graphicRenderBody.drawRect(this.foods.x-15, this.foods.y-10, 30, 30);
        }
        */
    }
}