/// <reference path="../defs/phaser.d.ts" />

class numberCallingGame {
    constructor(game) {
        this.game = game;
        this.gameState = "idle";
        this.gamescreen = null;
        this.gameTimer = 0;
        this.curCD = 3;
        this.kidsPos = [{
            x: 130,
            y: 325
        }, {
            x: 220,
            y: 440
        }, {
            x: 270,
            y: 300
        }, {
            x: 360,
            y: 400
        }, {
            x: 425,
            y: 280
        }, {
            x: 520,
            y: 380
        }, {
            x: 590,
            y: 270
        }, {
            x: 720,
            y: 350
        }, {
            x: 830,
            y: 260
        }, {
            x: 870,
            y: 400
        }];

        this.kidsChoose = [];
        this.strRand = "";
        this.lengthAnswer = 0;
        this.repeatQuestion = 0;
        this.manyQuestion = 10;
        this.textBoardNumber = null;
    }


    init(gamescreen) {
        this.gamescreen = gamescreen;

        this.allContent = this.game.add.group();
        this.backcgroundGroup = this.game.add.group();
        this.kidsGroup = this.game.add.group();
        this.frontUI = this.game.add.group();

        this.allContent.add(this.backcgroundGroup);
        this.allContent.add(this.kidsGroup);
        this.allContent.add(this.frontUI);

        this.spawnBackground();
        this.spawnBoard();
        this.spawnTeacher();
        this.spawnAnswer();
        //this.spawnNumber();
        this.spawnKids();
        this.spawnUI();
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

    spawnBoard() {
        let board = this.game.add.sprite(272, 108, "board");
        let style = {
            font:"25px vag",
            fill: "white"
        };
        this.strRand = this.randomNumberBoard();
        //
        this.lengthAnswer = 4;

        //create string variation in board
        //let strShow = "";
        //end comment
        this.textBoardNumber = this.game.add.text(0, 0, this.strRand, style);
        this.textBoardNumber.anchor.set(.5);
        this.textBoardNumber.visible = false;
        board.anchor.set(.5);
        board.addChild(this.textBoardNumber);
        this.backcgroundGroup.add(board);
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

    randomNumberBoard() {
        let numToNine = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        Phaser.ArrayUtils.shuffle(numToNine);
        let str = "";
        for (let i = 0; i < 4; i++) {
            str += numToNine[i];
        }
        return str;
    }

    mathQuestion() {
        let ans, r, s = 0;
        do {
            r = this.game.rnd.between(1, 5);
            s = this.game.rnd.between(0, 9);
            ans = r * 10 + s;
        } while (r == s);

        let mFloor = Math.floor(ans * .5);
        let randNum = this.game.rnd.between(1, mFloor);
        let isPlus = (Math.random() > .5) ? 1 : 0;
        if (isPlus) {
            let quest = ans - randNum;
            this.textBoardNumber.text = quest + "+" + randNum + "=";
        } else {
            let quest = ans + randNum;
            this.textBoardNumber.text = quest + "-" + randNum + "=";
        }
        this.strRand = ans.toString();
    }

    spawnTeacher() {
        let teacher = game.add.sprite(46, 70, "teacher");
        this.backcgroundGroup.add(teacher);
    }

    spawnKids() {
        let noShirt = this.game.rnd.between(0, 9);
        Phaser.ArrayUtils.shuffle(this.kidsPos);
        for (let i = 0; i < this.kidsPos.length; i++) {
            let pos = this.kidsPos[i];
            let kid = new kidNumber(this.game, pos.x, pos.y, this);
            this.kidsGroup.add(kid);
            kid.setNumber(i);
            if (noShirt == i) {
                kid.changeNoShirt();
                continue;
            }
        }
        //this.kidsPos
    }

    spawnAnswer() {
        this.wrongLogo = this.game.add.sprite(this.game.width * .7, this.game.height * .2, 'wrong');
        this.rightLogo = this.game.add.sprite(this.game.width * .7, this.game.height * .2, 'right');
        this.wrongLogo.anchor.set(.5);
        this.rightLogo.anchor.set(.5);
        this.wrongLogo.visible = false;
        this.rightLogo.visible = false;

        this.rightAudio = this.game.add.audio("choice-right", true);
        this.wrongAudio = this.game.add.audio("choice-wrong", true);
    }

    randomPosKids() {
        let noShirt = this.game.rnd.between(0, 9);
        Phaser.ArrayUtils.shuffle(this.kidsPos);
        for (let i = 0; i < 10; i++) {
            let pos = this.kidsPos[i];
            let kid = this.kidsGroup.getAt(i);
            kid.x = pos.x;
            kid.y = pos.y;
            kid.setNumber(i);
            if (noShirt == i) {
                kid.changeNoShirt();
                continue;
            }
        }
    }

    setBackPosKids() {
        for (let i = 0; i < 10; i++) {
            let pos = this.kidsPos[i];
            let kid = this.kidsGroup.getAt(i);
            kid.x = pos.x;
            kid.y = pos.y;
        }
    }

    pickedKids(kid) {
        //kid.x = 500;
        if (this.gameState != "play") return;
        //var l = this.kidsChoose.length;
        //if(this.strRand.charAt(l) == kid.childNumber){
        kid.x = 480 + this.kidsChoose.length * 110;
        kid.y = 110;
        if(kid.key == "kid-n"){
            kid.numText.visible = true;
        }
        this.kidsChoose.push(kid);
        if (this.lengthAnswer == this.kidsChoose.length) {
            this.checkAnswer();
            //this.strRand = this.randomNumberBoard();
            //this.textBoardNumber.text = this.strRand;
            //this.randomPosKids();
            //this.kidsChoose.splice(0,4);
        }
        //}
    }

    checkAnswer() {
        let answer = true;
        for (let i = 0; i < this.lengthAnswer; i++) {
            if (this.strRand.charAt(i) != this.kidsChoose[i].childNumber) {
                answer = false;
            }
        }

        if (answer) {
            this.rightLogo.visible = true;
            this.rightAudio.play();
        } else {
            this.wrongLogo.visible = true;
            this.wrongAudio.play();
        }

        this.game.time.events.add(Phaser.Timer.SECOND * 1, this.nextQuestion, this, answer);
    }

    nextQuestion(lastAnswer) {
        if (lastAnswer) {
            let isMath = (Math.random() < .3) ? true : false;
            this.strRand = this.randomNumberBoard();
            if (isMath) {
                this.mathQuestion();
                this.lengthAnswer = 2;
            } else {
                this.textBoardNumber.text = this.strRand;
                this.lengthAnswer = 4;
            }
            this.randomPosKids();
            this.kidsChoose.splice(0, 4);
            this.repeatQuestion = 0;
            this.manyQuestion -- ;
            if(this.manyQuestion <=0){
                this.textBoardNumber.visible =false;
                this.gamescreen.createTalker();
                this.gameState = "end";
            }
        } else {
            this.repeatQuestion += 1;
            this.setBackPosKids();
            this.kidsChoose.splice(0, 4);
        }
        this.wrongLogo.visible = false;
        this.rightLogo.visible = false;
    }

    scaleUp(dots) {
        if (this.gameState != "play") return;
        dots.scale.setTo(2);
    }

    scaleDown(dots) {
        dots.scale.setTo(1);
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

    timeCount(elapsedMS) {
        if (this.gameState == "play") {
            this.gameTimer += elapsedMS;
        }
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