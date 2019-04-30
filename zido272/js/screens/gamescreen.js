///<reference path = "../../defs/phaser.d.ts" />
///<reference path = "../../defs/phaser.comments.d.ts" />
class GameScreen extends Phaser.State
{
    constructor(game){
        super(game);
    }

    preload(){
        
    }
    create(){
        //declare
        console.log("Game screen");
        this.contrainer = this.game.add.group();
        this.BGGroup = this.game.add.group();
        this.binsGroup = this.game.add.group();
        this.wasteGroup = this.game.add.group();
        this.objGroup = this.game.add.group();
        this.UIgroup = this.game.add.group();
        this.frontUIgroup = this.game.add.group();

        this.contrainer.name = "contrainer";
        this.BGGroup.name = "background";
        this.objGroup.name = "allObjectCollide";
        this.UIgroup.name = "UI";
        this.frontUIgroup.name = "frontUI";
        this.wasteGroup.name = "waste-group";
        this.binsGroup.name = "bin-group";


        this.FULL_LIMIT = 5;
        this.FONTSTYLE_H1 = {
            font: "30px vag", 
            fill: "#ffffff"
        };

        this.gameState = "run";
        this.ITEMLIST = ["trash-01", "trash-02", "trash-03", "trash-04", "fert-01", "fert-02"];
        this.FERTILIST = ["fert-01", "fert-02"];
        this.timeLimit = 90.3;
        this.score = 0;

        //ADD PHYSIC
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //add info
        this.game.input.mouse.capture = true;
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }


        //init all
        this.regroup();
        this.spawnLogo();
        this.spawnBG();
        this.spawnObjs();
        this.spawnUI();

        //endgame
        this.endgameoverlay = new EndGameOverlay(game);
        this.endgameoverlay.onRetryButtonDown.add(this.onRetryButtonDown);
        this.game.add.existing(this.endgameoverlay);

        //random time urgent item
        //this.game.time.events.add(randomTimer*Phaser.Timer.SECOND, this.requestUrgent, this);

        this.clingSound = this.game.add.sound('cling');
        this.clickPass = this.game.add.sound('pass');
    }

    regroup(){
        this.contrainer.add(this.BGGroup);
        this.objGroup.add(this.binsGroup);
        this.objGroup.add(this.wasteGroup);
        this.contrainer.add(this.objGroup);
        this.contrainer.add(this.UIgroup);
        this.contrainer.add(this.frontUIgroup);
    }
    createCustomPointer()
    {
        this.customPointer = new CustomPointer(game, -100, -100);
        this.game.add.existing(this.customPointer);
    }

    spawnLogo()
    {
        let logo = game.add.sprite(game.world.width-90, 30, "zido-logo");
        this.frontUIgroup.add(logo);
    }

    spawnBG(){
        let bg = game.add.image(0,0, 'bg');
        this.BGGroup.add(bg);
    }

    spawnObjs(){
        //active group physics
        this.wasteGroup.enableBody = true;
        this.wasteGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.binsGroup.enableBody = true;
        this.binsGroup.physicsBodyType = Phaser.Physics.ARCADE;

        //spawn bin
        for(let i = 0; i< 3; i++){
            let bin = this.game.add.sprite(110+i*150, 120, 'ingame', 'bin-ferti');
            if(i==1)bin.y -= 20;
            bin.anchor.set(0.5);
            let timerIndicator = this.game.add.sprite(0,0, 'ingame', 'timebar-base');
            bin.timerIndicator = bin.addChild(timerIndicator);
            bin.timerIndicator.anchor.set(.5);
            bin.timerIndicator.y += 100;

            let brownindicator = this.game.add.sprite(0,0, 'ingame', 'brownbar');
            bin.timerIndicator.addChild(brownindicator);
            brownindicator.x = -40;
            brownindicator.y = -2;

            let greenIndicator = this.game.add.sprite(0,0, 'ingame', 'greenbar');
            bin.timerIndicator.addChild(greenIndicator);
            bin.greenIndicator = greenIndicator; //make alias object
            greenIndicator.x = -40;
            greenIndicator.y = -2;
            greenIndicator.width = 1;
            this.binsGroup.add(bin);

            let iconReady = this.game.add.sprite(0,0, 'ingame', 'icon-ready');
            bin.addChild(iconReady);
            iconReady.anchor.set(.5);
            iconReady.y +=88;
            iconReady.visible = false;

            let binText = this.game.add.text(0,0, "5/5", this.FONTSTYLE_H1);
            binText.anchor.set(.5);
            binText.y -= 45;
            binText.visible=false;
            bin.addChild(binText);

            bin.binText = binText;
            bin.iconReady = iconReady;//alias 

            bin.timerIndicator.visible = false;
            bin.fullLimit = this.FULL_LIMIT;

            bin.events.onInputDown.add(this.startDragBinFerti, this);
            bin.events.onInputUp.add(this.endDragBinFerti, this);
        }

        //spawn waste
        for(let j =0; j<10; j++){
            let nameItem = this.rnd.pick(this.ITEMLIST);
            let randomPosibilityTrash = Math.random();
            if(randomPosibilityTrash < .5){
                nameItem = this.rnd.pick(this.FERTILIST);
            }
            let randomPos = {x:this.game.rnd.between(180, 450), y:this.game.rnd.between(250, 400)};
            let waste = this.game.add.sprite(randomPos.x, randomPos.y, 'ingame', nameItem, this.wasteGroup);
            waste.body.setSize(65, 65,( waste.width-65)*.5, (waste.height-65)*.5);
            waste.anchor.set(0.5);
            waste.flagCollide = false;
            waste.inputEnabled =true;
            waste.input.enableDrag(false, true);
            waste.events.onInputUp.add(this.releaseWaste, this);
            waste.events.onInputDown.add(this.clickWaste, this);
        }

        let inorganicBin = this.game.add.sprite(this.game.width*.68, this.game.height*.8, 'ingame', 'bin-recycle');
        inorganicBin.anchor.set(.5);
        this.binsGroup.add(inorganicBin);
    }

    spawnUI(){
        this.spawnTimer();
        this.spawnScore();
    }

    spawnTimer(){
        let UIBox = this.game.add.image(0,0, 'uibox', 'scorebox2');
        let iconTimer = this.game.add.image(23, 18, 'uibox', 'icon-timer');
        this.fontStle = {font: "30px vag", fill: "#d6433c"};
        this.timerText =  this.game.add.text(0, 0, '', this.fontStle);
        this.timerText.text = "00:00";
        this.timerText.anchor.set(.5, .5);
        UIBox.y = this.game.height -  UIBox.height;
        this.timerText.position = {x:108, y :UIBox.y+45};

        UIBox.addChild(iconTimer);
        this.UIgroup.add(UIBox);
        this.UIgroup.add(this.timerText);
    }

    spawnScore(){
        let UIBox = this.game.add.image(0,0, 'uibox', 'scorebox2');

        UIBox.position.x = this.game.width - UIBox.width *.6;
        UIBox.position.y = this.game.height - UIBox.height + (UIBox.height*.5);

        let newColorFontStyle = this.FONTSTYLE_H1;
        newColorFontStyle.fill =  "#00aeef";
        this.scoreText = this.game.add.text(0,0, '200', newColorFontStyle);

        UIBox.anchor.set(.5);
        this.scoreText.anchor.set(.45, .55);
        UIBox.addChild(this.scoreText);
        this.scoreText.text = this.score;
        
        this.UIgroup.add(UIBox);
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

    createTalker()
    {
        this.talker = new Talker(game, 10, 530, game.world.width , TALKER_HEIGHT, this);
        this.game.add.existing(this.talker);
        
        if(this.score > 0){
            this.talker.loadTalkingArray(TALKING_DATA.talkingdata.EndFinish);
        }
        else{
            this.talker.loadTalkingArray(TALKING_DATA.talkingdata.EndFailed);
        }
        this.talker.startTalk();

        this.talker.onNext.add(this.nextTalker, this);
        this.talker.onFinish.add(function(){
            this.endGame();

            //add scoreing
            ZIDO_API.setScore(this.score);
        }, this);

        this.game.tweens.pauseAll();
    }

    nextTalker(){
        /*
        if(this._enGroup.length>0){
            this._enGroup.removeAll(true)
        }
        */
    }

    endGame(){
        //let score = this.carnavalMarchGame.score;
        let score = this.score;
        let windcondition = (score > 0)?true:false;
        this.endgameoverlay.setTextScore(score);
        this.endgameoverlay.show(windcondition);

        //stop all movement
    }

    onRetryButtonDown(){
        game.state.start("GameScreen");
    }

    clickWaste(sprite, pointer){
        sprite.posBefore = new Phaser.Point(sprite.x, sprite.y);;
    }

    releaseWaste(sprite, pointer){
        this.game.physics.arcade.overlap(this.wasteGroup, this.binsGroup, this.checkOverlap, null, this);
    }

    startDragBinFerti(sprite, pointer){
        console.log("dragable bin");
        sprite.angle = 45;
        sprite.firstPos = {x:sprite.x, y:sprite.y};
        sprite.iconReady.visible = false;
    }
    endDragBinFerti(sprite, pointer){
        console.log("release able bin");
        sprite.angle = 0;
        if(sprite.x > 550){
            let plant = this.game.add.sprite(sprite.x, sprite.y, 'ingame', 'plant');
            plant.anchor.set(.5);
            plant.scale.setTo(0.01, 0.01);
            this.objGroup.add(plant);
            this.game.add.tween(plant.scale).to({x:1, y:1}, 700, Phaser.Easing.Linear.None, true);
        }

        sprite.x = sprite.firstPos.x;
        sprite.y = sprite.firstPos.y;
        sprite.fullLimit = this.FULL_LIMIT;
        sprite.inputEnabled = false;
        sprite.greenIndicator.width = 1;
        sprite.timerIndicator.visible = false;
        sprite.iconReady.visible = false;
    }

    checkOverlap(waste, bin){
        let stringSepatareWaste = waste.frameName.split("-");
        let stringSeparateBin = bin.frameName.split("-");
        let wasteName = stringSepatareWaste[0];
        let binName = stringSeparateBin[1];
        if(binName == "ferti" && wasteName == "fert" && waste.flagCollide == false && bin.fullLimit >0){
            waste.kill();
            waste.flagCollide = true;
            bin.fullLimit -= 1;
            bin.binText.text = this.FULL_LIMIT-bin.fullLimit+"/"+this.FULL_LIMIT;
            bin.binText.visible = true;
            if(bin.fullLimit <=0 ){
                bin.timerIndicator.visible = true;
                this.game.add.tween(bin.greenIndicator).to({width:101}, 3000, Phaser.Easing.Linear.None, true).onComplete.add(this.completeBinFertilizer, this);
            }

            //tween bin
            let tweenBump = this.game.add.tween(bin.scale).to({x:1.2, y:.8}, 200, Phaser.Easing.Linear.None, false);
            let tweenTall = this.game.add.tween(bin.scale).to({x:.9, y:1.3}, 100, Phaser.Easing.Linear.None);
            let tweenBackScale = this.game.add.tween(bin.scale).to({x:1, y:1}, 200, Phaser.Easing.Linear.None);

            tweenBump.chain(tweenTall);
            tweenTall.chain(tweenBackScale);
            tweenBump.start();
            this.score +=100;
        }
        else{
            
        }
        if(binName == "recycle" && wasteName  == "trash"){
            console.log("recyle waste");
            waste.kill();
            this.score +=100;
            let tweenBump = this.game.add.tween(bin.scale).to({x:1.2, y:.8}, 200, Phaser.Easing.Linear.None, false);
            let tweenTall = this.game.add.tween(bin.scale).to({x:.9, y:1.3}, 100, Phaser.Easing.Linear.None);
            let tweenBackScale = this.game.add.tween(bin.scale).to({x:1, y:1}, 200, Phaser.Easing.Linear.None);
            tweenBump.chain(tweenTall);
            tweenTall.chain(tweenBackScale);
            tweenBump.start();
        }
        if(binName == "recycle" && wasteName == "fert" ||binName == "ferti" && wasteName == "trash" ){
            waste.position.x = waste.posBefore.x;
            waste.position.y = waste.posBefore.y;
            this.wasteRedTint(waste);
        }
        //console.log(waste.frameName);
        //console.log(bin.frameName);

        let testAlive =this.wasteGroup.getFirstAlive(false);
        if(testAlive == null){
            this.resetAndSpawnAgainWaste();
        }
        this.scoreText.text = this.score;
    }

    wasteRedTint(sprite){
        this.game.time.events.repeat(150, 10, ()=>{
            if(sprite.tint == 0xFFFFFF){
                sprite.tint = 0xd93218;
            }
            else{
                sprite.tint = 0xFFFFFF;
            }
        }, this);
    }

    resetAndSpawnAgainWaste(){
        this.wasteGroup.forEach((wasteItem)=>{
            let nameItem = this.rnd.pick(this.ITEMLIST);
            let randomPosibilityTrash = Math.random();
            if(randomPosibilityTrash < .5){
                nameItem = this.rnd.pick(this.FERTILIST);
            }
            let randomPos = {x:this.game.rnd.between(180, 450), y:this.game.rnd.between(250, 400)};
            wasteItem.flagCollide = false;
            wasteItem.reset(randomPos.x, randomPos.y);
            wasteItem.body.reset(randomPos.x, randomPos.y);
            wasteItem.frameName = nameItem;
            wasteItem.body.setSize(65, 65, (wasteItem.width-65)*.5, (wasteItem.height-65)*.5);
        }, this);
    }

    completeBinFertilizer(sprite, tween){
        console.log("complete bin and now you can be dragged");
        let Grandparent = sprite.parent.parent;
        console.log(Grandparent.frameName);
        console.log(tween);
        
        sprite.parent.visible = false;//this is time indicator
        Grandparent.iconReady.visible = true;
        Grandparent.binText.visible = false;
        Grandparent.inputEnabled = true;
        Grandparent.input.enableDrag(true);
    }

    showEndScore(){
        console.log("Endscoring");

        this.game.tweens.pauseAll();
        this.createTalker();
        /*
        this.endScoring = this.game.add.image(this.game.width*.5, 0, 'endscreen', 'base-result');
        this.endScoring.y = - (this.endScoring.height*.6);
        this.endScoring.anchor.set(.5);

        //this.score.total = totalScore;

        this.UIgroup.add(this.endScoring);

        this.game.add.tween(this.endScoring).to({y:this.game.height*.4}, 300, Phaser.Easing.Bounce.Out, true).onComplete.add(this.animationScore, this)
        this.game.add.tween(this.endScoring).to({y:this.game.height*.4}, 300, Phaser.Easing.Bounce.Out, true).onComplete.add(this.createTalker, this);
        */
    }

    animationScore(){
        let  trash1 = this.game.add.sprite(-this.endScoring.width*.4, -40, 'ingame', "trash-01");
        can.anchor.set(.5);
        can.scale.set(0.01, 0.01);
        this.trash2Animated = this.game.add.sprite(-this.endScoring.width*.051, -40, 'ingame', "trash-02");
        this.trash2Animated.anchor.set(.5);
        this.trash2Animated.scale.set(0.01, 0.01);
        this.trash3Animated = this.game.add.sprite(this.endScoring.width*.3, -40, 'ingame', "trash-03");
        this.trash3Animated.anchor.set(.5);
        this.trash3Animated.scale.set(0.01, 0.01);

        this.trash4Animated = this.game.add.sprite(this.endScoring.width*.3, -40, 'ingame', "trash-04");
        this.trash4Animated.anchor.set(.5);
        this.trash4Animated.scale.set(0.01, 0.01);
        
        this.endScoring.addChild(can);
        this.endScoring.addChild(this.trash2Animated);
        this.endScoring.addChild(this.trash3Animated);
        this.endScoring.addChild(this.trash4Animated);

        this.textScore1 = this.game.add.text(-this.endScoring.width*.3, -40, 'x 0', this.fontStle);
        this.textScore1.anchor.set(.5);

        this.textScore2 = this.game.add.text(this.endScoring.width*.051, -40, 'x 0', this.fontStle);
        this.textScore2.anchor.set(.5);

        this.textScore3 = this.game.add.text(this.endScoring.width*.4, -40, 'x 0', this.fontStle);
        this.textScore3.anchor.set(.5);

        this.totalScore = this.game.add.text(0, this.endScoring.height*.4, 'x 0', this.fontStle);
        this.totalScore.anchor.set(.5);

        this.endScoring.addChild(this.textScore1);
        this.endScoring.addChild(this.textScore2);
        this.endScoring.addChild(this.textScore3);
        this.endScoring.addChild(this.totalScore);

        this.game.add.tween(can.scale).to({x:1.5, y:1.5}, 300, Phaser.Easing.Elastic.Out, true).onComplete.add(this.tweenScore, this, 0, "can");

        this.game.add.tween(this.buffScore).to({total:this.score.total}, 300, Phaser.Easing.Linear.None, true, 1900).onComplete.add(this.createTalker, this);
    }

    tweenObjScore(objBuffScore, tween, textPass){
        if(textPass == "wrapping"){
            this.game.add.tween(this.trash2Animated.scale).to({x:1.5, y:1.5}, 300, Phaser.Easing.Elastic.Out, true).onComplete.add(this.tweenScore, this, 0, textPass);
        }
        else if(textPass == "bottle"){
            this.game.add.tween(this.trash3Animated.scale).to({x:1.5, y:1.5}, 300, Phaser.Easing.Elastic.Out, true).onComplete.add(this.tweenScore, this, 0, textPass);
        }
        
    }

    tweenScore(scale, tween, scoring){
        this.clingSound.play();
        if(scoring == "can"){
            this.game.add.tween(this.buffScore).to({can:this.score.can}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.tweenObjScore, this, 0, "wrapping");
        }
        else if(scoring == "wrapping"){
            this.game.add.tween(this.buffScore).to({wrapping:this.score.wrapping}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.tweenObjScore, this, 0, "bottle");
        }
        else if(scoring == "bottle"){
            this.game.add.tween(this.buffScore).to({bottle:this.score.bottle}, 300, Phaser.Easing.Linear.None, true);
        }
        
    }

    update(){
        if(this.gameState == "end"){
            if(this.textScore1){
                this.textScore1.text = "x "+  Math.floor(this.buffScore.can);
            }
            if(this.textScore2){
                this.textScore2.text = "x "+  Math.floor(this.buffScore.wrapping);
            }
            if(this.textScore3){
                this.textScore3.text = "x "+ Math.floor(this.buffScore.bottle);
            }
            if(this.totalScore){
                this.totalScore.text = STRINGS_DATA.data.totalScore+  Math.floor(this.buffScore.total);
            }
            return;
        }
        this.timeLimit -= this.game.time.physicsElapsed;
        if(this.timeLimit<=0.1){
            this.timeLimit = 0;
            console.log("end");
            this.gameState = "end";
            //this.createTalker();
            this.showEndScore();

            //this.endGame();
        }
        this.timerText.text = this.updateTextTimer(this.timeLimit);
        
    }
    render(){
        //this.game.debug.physicsGroup(this.wasteGroup);
        //this.game.debug.physicsGroup(this.binsGroup);
    }
}