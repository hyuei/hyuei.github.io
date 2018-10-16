class cleanTeethGame {
    constructor(game) {
        this._game = game;
    }

    init(screenTarget) {
        this._screenTarget = screenTarget;
        this._allContent = this._game.add.group();
        this._bgGroup = this._game.add.group();
        this._kidsGroup = this._game.add.group();
        this._badEntityGroup = this._game.add.group();
        this._goodEntityGroup = this._game.add.group();
        this._frontUI = this._game.add.group();
        this._allContent.add(this._bgGroup);
        this._allContent.add(this._kidsGroup);
        this._kidsGroup.add(this._badEntityGroup);
        this._allContent.add(this._goodEntityGroup);
        this._allContent.add(this._frontUI);

        this.curCD = 3;
        this.gameTimer = 0;//60;
        this.score = 0;
        this.changeKids=0;
        this.maxChild = 10;
        this.notstartBursh = true;
        this.gameState = "countingStart";

        this._badEntityGroup.enableBody = true;
        this._goodEntityGroup.enableBody = true;

        //audio
        this.cleanAudio = game.add.audio('clean', 1, true);

        this.badEntitiesPosition = [{
                x: 340,
                y: 145
            }, {
                x: 450,
                y: 145
            }, {
                x: 585,
                y: 140
            },
            {
                x: 260,
                y: 387
            }, {
                x: 350,
                y: 387
            }, {
                x: 450,
                y: 387
            }, {
                x: 570,
                y: 387
            }, {
                x: 670,
                y: 387
            }
        ];

        this.clingPosition = [{
                x: 275,
                y: 92
            }, {
                x: 400,
                y: 197
            }, {
                x: 675,
                y: 205
            },
            {
                x: 475,
                y: 445
            }, {
                x: 512,
                y: 443
            }, {
                x: 273,
                y: 430
            }
        ];

        this.spawnBackground();
        this.spawnKid();

        this.spawnEntities();
        this.spawnUI();

        this.createEmiterCleaner();
        this.createEmitterBrush();
        //hide kids first
        //this.hideKid();
        this.countingDown();
    }

    spawnBackground() {
        var bgImg = this._game.add.sprite(0, 0, "bg");
        this._bgGroup.add(bgImg);
        //this._allContent.sendToBack(bgImg);
    }

    spawnKid() {
        var innerMouth = this._game.add.sprite(this._game.width * .5, this._game.height * .5, 'inner-mouth');
        innerMouth.anchor.set(.53, .5);
        this._kidsGroup.add(innerMouth);

        var bgKidNormal = this._game.add.sprite(this._game.width * .5, 0, 'kid-normal');
        bgKidNormal.anchor.set(.49, 0);
        //bgKidNormal.visible= false;
        this._kidsGroup.add(bgKidNormal);

        var bgKidSmile = this._game.add.sprite(this._game.width * .5, 0, 'kid-smile');
        bgKidSmile.anchor.set(.49, 0);
        bgKidSmile.visible = false;
        this._kidsGroup.add(bgKidSmile);

        this._kidsGroup.bringToTop(this._badEntityGroup);
    }

    hideKid() {
        this._kidsGroup.x = 1200;
    }

    slideKid() {
        var tween = this._game.add.tween(this._kidsGroup).to({
            x: 0
        }, 500);
        tween.start();
    }

    spawnEntities() {
        //add brush
        this.brush = this._goodEntityGroup.create(-30, 195, 'brush-blue');
        this.brushYellow = this._goodEntityGroup.create(705,195, 'brush-yellow');
        //this.brush.inputEnabled = false;
        //this.brush.input.enableDrag(true);
        this.brush.body.setSize(70, 115, 185, 48);
        this.brushYellow.body.setSize(70, 115, 32, 45);

        this.spawnBadEntities();
    }

    spawnBadEntities() {
        var rndBacteria = this._game.rnd.between(1, 3);
        var rndPlaque = this._game.rnd.between(0, 2);
        var clonePositionBadEntites = this.badEntitiesPosition.slice();
        for (var p = 0; p < rndPlaque; p++) {
            var _rndPos = Math.floor(Math.random() * clonePositionBadEntites.length);
            var _vp = clonePositionBadEntites[_rndPos];
            clonePositionBadEntites.splice(_rndPos, 1);
            var _p = new Plaque(this._game, _vp.x, _vp.y, this);
            this._badEntityGroup.add(_p);
        }

        for (var b = 0; b < rndBacteria; b++) {
            var _rndPos = Math.floor(Math.random() * clonePositionBadEntites.length);
            var _vp = clonePositionBadEntites[_rndPos];
            clonePositionBadEntites.splice(_rndPos, 1);
            var _randColor = Math.floor(Math.random()*2);
            if(this.changeKids<Math.floor(this.maxChild*.5))_randColor =0;
            var _color = "blue";
            if(_randColor == 1) _color = "yellow";
            var _b = new Bacteria(this._game, _vp.x, _vp.y, this, _color);
            this._badEntityGroup.add(_b);
        }
    }

    spawnUI() {
        this.balloonTime = this._game.add.sprite(0, 0, 'balloon');
        this._frontUI.add(this.balloonTime);

        //this.textScore = this._game.add.text(this.balloonScore.x + this.balloonScore.width * .5, 50, this.score);
        //this.textScore.anchor.set(.5, 0);
        //this.textScore.fill = '#00668a';
        //this.textScore.align = 'center';
        //this._frontUI.add(this.textScore);

        //this.balloonTime = this._game.add.sprite(this._game.width - 80, 0, 'balloon');
        //this.balloonTime.scale.x = -1;
        //this._frontUI.add(this.balloonTime);

        var timerLogo = this.balloonTime.addChild(this._game.add.sprite(this.balloonTime.width * .24, this.balloonTime.height * .5, 'time-logo'));
        timerLogo.anchor.set(.5);
        //drawTimerText
        this.textTimer = this._game.add.text(this.balloonTime.x + 110, this.balloonTime.y+this.balloonTime.width*.18, this.gameTimer, {fontSize:35});
        this.textTimer.fill = '#00668a';
        this._frontUI.add(this.textTimer);

        this.showCountdown = this._game.add.text(this._game.width*.5, this._game.height*.5, '', {fontSize:100});
        this.showCountdown.anchor.set(.5);
        this.showCountdown.fill = 'red';
        this.showCountdown.stroke = 'yellow';
        this.showCountdown.strokeThickness = 5;
        this._frontUI.add(this.showCountdown);
    }

    createEmitterBrush() {
        this.brushParticle = this._game.add.emitter(0, 0, 20);
        this.brushParticle.makeParticles('b-particle', ['b1', 'b2', 'b3', 'b4']); // this._game.rnd) make random particle
        this.brushParticle.maxParticleScale = 1;
        this.brushParticle.minParticleScale = .5;
        this.brushParticle.minParticleSpeed.set(-100, -100);
        this.brushParticle.maxParticleSpeed.set(100, 100);
        this.brushParticle.minRotation = 20;
        this.brushParticle.maxRotation = 80;
        //
    }

    runParticlesBrush(x, y) {
        this.brushParticle.x = x + 220;
        this.brushParticle.y = y + 100;
        this.brushParticle.start(false, 1000, 100); //, 100); //(true, 1000, null, 20);
        this.notstartBursh = false;
        this.brushParticle.on = true;
        this.cleanAudio.play();
        ///please adding some timer
        this._game.time.events.add(500, function () {
            this.notstartBursh = true;
            this.brushParticle.on = false;
            this.cleanAudio.stop();
        }, this);
    }

    updateEmiterBrush() {
        this.brushParticle.forEachAlive(function (particle) {
            particle.alpha = game.math.clamp(particle.lifespan / 1000, 0, 1);
        }, this);
    }


    createEmiterCleaner() {
        this.particle = this._game.add.emitter(0, 0, 50);
        this.particle.makeParticles('star-particle');
        this.particle.maxParticleScale = 0.5;
        this.particle.minParticleScale = 0.2;
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

    checkingBadEntitiesLeft() {
        if (this._badEntityGroup.length < 1) {
            this.cloneClingPos = this.clingPosition.slice();
            this._game.time.events.repeat(700, 3, this.doneCleanTeeth, this);
            this._game.time.events.add(700, this.changeSmileKids, this, true);
            this.changeKids ++;
            if(this.changeKids < this.maxChild){
                this._game.time.events.add(2500, this.changeAnotherKids, this);
            }
            else{
                //console.log("endgame");
                //this.timeLimit = true;
                //adding last dialog
                this.gameState = "end";
                this.brush.destroy();
                this.brushYellow.destroy();
                //this.brush.inputEnabled = false;
                //this.brush.x = 20;
                //this.brush.y = 120;
                this._screenTarget.endGame();
            }
        }
    }

    doneCleanTeeth() {
        //this.runParticles(this._game.rnd.between(100, 300), this._game.rnd.between(100, 300));
        ///find fix position for cling(at least make 6 and will choose random by machine)
        var _rndPos = Math.floor(Math.random() * this.cloneClingPos.length);
        var _vp = this.cloneClingPos[_rndPos];
        this.cloneClingPos.splice(_rndPos, 1);
        this.cling = this._game.add.sprite(_vp.x, _vp.y, 'cling', 'c1');
        this.cling.anchor.set(.5);
        this.cling.animations.add("blink", Phaser.Animation.generateFrameNames('c', 1, 3), 6);
        this.cling.animations.play("blink", 12, false, true);
    }

    changeSmileKids(isSmile) {
        //still rough from normal to smile, will try change with tween  alpha image
        //this._game.add.twee
        var normal = this._kidsGroup.getAt(1);
        normal.visible = !isSmile;

        var kidsSmile = this._kidsGroup.getAt(2);
        kidsSmile.visible = isSmile;
    }

    changeAnotherKids() {
        if (this.timeLimit) return;
        var tween1 = this._game.add.tween(this._kidsGroup).to({
            x: -1200
        }, 500);
        tween1.onComplete.add(function () {
            this._kidsGroup.x = 1200;
            this.changeSmileKids(false);
            //adding another bacteria
            this.spawnBadEntities();
        }, this);
        var tween2 = this._game.add.tween(this._kidsGroup).to({
            x: 0
        }, 500);
        //adding another bacteria when done(or just adding onComplete tween);

        tween1.chain(tween2);

        tween1.start();
    }

    checkCollider() {
        //if(this.brush.input){
        if(this.gameState == "play"){
            this._game.physics.arcade.overlap(this._goodEntityGroup, this._badEntityGroup, this.cleanDirty, null, this);
        }
        //}
    }

    cleanDirty(brush, entity) {
        if (brush.input.isDragged) {
            entity.cleanUp(brush.key);
            if(entity.key != 'rest-food'){
                var bKey = brush.key.split('-');
                var eKey = entity.key.split('-');
                if(bKey[1] == eKey[1]){
                    if (this.notstartBursh) {
                        if(brush.key == "brush-yellow"){
                            this.runParticlesBrush(brush.x-brush.width*.55, brush.y);
                        }
                        else{
                            this.runParticlesBrush(brush.x, brush.y);
                        }
                    }
                }
            }
            else{
                if (this.notstartBursh) {
                    if(brush.key == "brush-yellow"){
                        this.runParticlesBrush(brush.x-brush.width*.55, brush.y);
                    }
                    else{
                        this.runParticlesBrush(brush.x, brush.y);
                    }
                }
            }
        }
    }

    updateScore() {
        //this.textScore.text = this.score;
    }

    countingDown(){
        var text = parseInt(this.curCD);
        if(this.curCD < 1) {
            text = STRINGS_DATA.data.start;
        }

        this.showCountdown.setText(text);
        this.showCountdown.scale.setTo(2);

        this.showCountdown.alpha = 0

        var tweenScale = game.add.tween(this.showCountdown.scale).to({x:1, y:1}, 500).start();
        var tween = game.add.tween(this.showCountdown).to({alpha:1}, 500, Phaser.Easing.Linear.None, true)
        .onComplete.add(function(){
            setTimeout(function(){
                this.curCD--;
                if(this.curCD >= 0){
                    this.countingDown();
                } else {
                    this.showCountdown.destroy();
                    this.gameState = "play";
                    this.brush.inputEnabled=true;
                    this.brush.input.enableDrag(true);
                    this.brush.events.onInputUp.add(function(){this.brush.x = -30;this.brush.y = 195}, this);

                    this.brushYellow.inputEnabled = true;
                    this.brushYellow.input.enableDrag(true);
                    this.brushYellow.events.onInputUp.add(function(){this.brushYellow.x = 705;this.brushYellow.y = 195}, this);

                }
            }.bind(this), 200)
        }, this);
    }

    timerCountDown(elapsedMS) {
        if (this.gameState == "play") {
            //this.gameTimer -= elapsedMS;
            this.gameTimer += elapsedMS;
        }
            /*
            if (this.gameTimer <= 0) {
                if (!this.timeLimit) {
                    this.timeLimit = true;
                    //adding last dialog
                    this.brush.destroy();
                    this.brushYellow.destroy();
                    //this.brush.inputEnabled = false;
                    //this.brush.x = 20;
                    //this.brush.y = 120;
                    this._screenTarget.endGame();
                }
                this.gameTimer = 0;
            }
        }
        */
        this.updateTextTimer();
    }

    updateTextTimer() {
        var min = parseInt(this.gameTimer / 60);
        var sec = parseInt(this.gameTimer - (min * 60));
        var minString = String(min)
        var secString = String(sec);
        if (sec < 10) {
            secString = "0" + String(sec);
        }
        if (min < 10) {
            minString = "0" + String(min);
        }
        this.textTimer.text = minString + ":" + secString;
    }



    renderSpriteBody() {
        this._game.debug.body(this.brush);
        this._game.debug.body(this.brushYellow);
        //this._game.debug.body(this._badEntityGroup);
    }
}