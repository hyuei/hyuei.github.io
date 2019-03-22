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
        this.objGroup = this.game.add.group();
        this.UIgroup = this.game.add.group();
        this.frontUIgroup = this.game.add.group();

        this.chars = [];
        this.peoples = [];
        this.gameState = "run";
        this.URGENTITEMLIST = ["can", "bottle", "wrapping"];
        this.urgentName = "";
        this.timeLimit = 60.3;
        this.score = {can:0, bottle:0, wrapping:0, urgent:0, total:0};
        this.buffScore = {can:0, bottle:0, wrapping:0, total:0};

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

        //spawn every half sec
        this.game.time.events.loop(500, this.spawnPedestrian, this);

        //random time urgent item
        let randomTimer = this.rnd.integerInRange(5, 15);
        //this.game.time.events.add(randomTimer*Phaser.Timer.SECOND, this.requestUrgent, this);
    }

    regroup(){
        this.contrainer.add(this.BGGroup);
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
        /*
        this.chars = {
            one : this.game.add.sprite(120, 150, 'player1'),
            two : this.game.add.sprite(120, 210, 'player2'),
            three : this.game.add.sprite(120, 270, 'player3')
        }; 
        */
        for(var i = 1; i < 4; i++){
            let s = 'chara-0'+i+'.png';
            let char = this.game.add.sprite(60, 120+i*80, 'ingame',s);
            char.anchor.set(.5);
            char.fPos = new Phaser.Point(char.x, char.y);
            this.chars.push(char);
            this.objGroup.add(char);
        }
       
        for(var i = 0; i < 10; i++){
            let people = this.game.add.existing(new Pedestrian(this.game, {parent:this}));
            this.peoples.push(people);
            this.objGroup.add(people);
        }

        
    }

    spawnPedestrian(){
        if(this.gameState != "run")return;
        let howMuchLineUsed = this.rnd.integerInRange(0, 3);
        let arrayLine = [0,1,2,3];
        let arrayEmpty = Phaser.ArrayUtils.shuffle(arrayLine);
        if(howMuchLineUsed>0){
            let newPeoples = [];
            let peoples = this.peoples.length;
            //searh sleep first
            for(var j =0; j < peoples; j++){
                let people = this.peoples[j];
                if(people.sleep){
                    people.awake(arrayEmpty[newPeoples.length]);
                    newPeoples.push(people);
                    if(newPeoples.length<howMuchLineUsed){
                        continue;
                    }
                    else{
                        break;
                    }
                }
                if(j+1 >= peoples){
                    for(var i=newPeoples.length; i<howMuchLineUsed; i++){
                        people =  this.game.add.existing(new Pedestrian(this.game, {parent:this}));
                        people.awake(arrayEmpty[newPeoples.length]);
                        newPeoples.push(people);
                        this.peoples.push(people);
                        this.objGroup.add(people);
                    }
                }
            }
        }
        //console.log(this.peoples.length);
    }

    runInPeople(people){
        for(var i = 0;i < 3; i++){
            let char = this.chars[i];
            if(char.busy){
                continue;
            }
            else{
                //char move toward
                char.busy = true;
                people.pause = true;
                people.called = true;
                let checkDistance = this.game.math.distance(char.x, char.y, people.x, people.y);
                let mSpeed = Math.floor(checkDistance*3);
                let tween = this.game.add.tween(char).to({x:people.x, y:people.y}, mSpeed, Phaser.Easing.Linear.None, true).onComplete.add(this.showQuestion, this, 0, people, char);
                break;
                //char
            }
        }
    }

    showQuestion(sprite, tween, people, char){
        this.gameState = "showQuestion";
        this.questionBox.showQuestion(people, char);
        for(let i=0; i<this.peoples.length; i++){
            var people = this.peoples[i];
            people.charTexture.inputEnabled = false;
            if(!people.pause){
                //people.tween.pause();
                people.pause = true;
            }
        }

        this.game.tweens.pauseAll();
        /*
        for(let i=0; i<this.chars.length; i++){
            var char = this.chars[i];
            let charTween = this.game.tweens.isTweening(char);
            if(charTween){

            }
        }
        */
    }
    hideQuestion(char, people){
        this.gameState = "run";
        this.questionBox.visible =false;
        this.questionBox.intAnswer = 0;
        people.called = false;
        if(char.bringItem == "" || char.bringItem == "wallet"){
            //back to your post
            let checkDistance = this.game.math.distance(char.x, char.y, char.fPos.x, char.fPos.y);
            let mSpeed = Math.floor(checkDistance*3);
            this.game.add.tween(char).to({x:char.fPos.x, y:char.fPos.y}, mSpeed, Phaser.Easing.Linear.None, true).onComplete.add(this.charEndDuty, this, 0, char);
        }
        else{
            //goto right
            let nameChar = char.frameName;
            let queuePos = 0;
            if(nameChar == "chara-01.png"){
                queuePos = 0;
            }
            else if(nameChar == "chara-02.png"){
                queuePos = 1;
            }
            else if(nameChar == "chara-03.png"){
                queuePos = 2;
            }
            let pos = {x:780+queuePos*80, y:500};
            let itemName = "item-"+char.bringItem+".png";
            people.thing.visible = false;
            if(char.item){
                char.item.loadTexture('ingame', itemName);
            }
            else{
                char.item = this.game.add.image(char.width*.4, 0, 'ingame', itemName);
                char.item.anchor.set(.5);
                char.addChild(char.item);
            }
            char.item.visible = true;
            let checkDistance = this.game.math.distance(char.x, char.y, pos.x, pos.y);
            let mSpeed = Math.floor(checkDistance*3);
            this.game.add.tween(char).to({x:pos.x, y:pos.y}, mSpeed, Phaser.Easing.Linear.None, true).onComplete.add(this.charEndDuty, this, 0, char);;
        }

        for(var i=0; i<this.peoples.length; i++){
            var people = this.peoples[i];
            if(!people.called){
                people.charTexture.inputEnabled = true;
            }
            if(people.pause){//if(people.tween.isPaused ){
                //people.tween.resume();
                people.pause = false;
            }
        }

        this.game.tweens.resumeAll();
    }

    charEndDuty(sprite, tween, char){
        char.busy = false;
        if(char.item){
            if(char.item.visible == false)return;
            char.item.visible = false;
            //this.score.total += 1;
            if(char.bringItem == "wrapping"){
                this.score.wrapping += 1;
                this.textWrappingCollect.text = this.score.wrapping;
            }
            else if(char.bringItem == "bottle"){
                this.score.bottle += 1;
                this.textBottleCollect.text = this.score.bottle;
            }
            else if(char.bringItem == "can"){
                this.score.can += 1;
                this.textCanCollect.text = this.score.can;
            }
            if(char.bringItem == this.urgentName){
                console.log("urgent");
                this.score.urgent +=1;
            }
        }
    }

    spawnUI(){
        this.lockUI = {
            //wallet : this.game.add.sprite(800, 70, 'ingame', "item-wallet.png"),
            can : this.game.add.sprite(800, 150, 'ingame', "item-can.png"),
            wrapping : this.game.add.sprite(800, 270, 'ingame', "item-wrapping.png"),
            bottle : this.game.add.sprite(800, 380, 'ingame', "item-bottle.png")
        };
        //this.UIgroup.add(this.lockUI.wallet);
        this.UIgroup.add(this.lockUI.can);
        this.UIgroup.add(this.lockUI.wrapping);
        this.UIgroup.add(this.lockUI.bottle);

        this.textCanCollect = this.game.add.text(game.width*.92, 170, '0', askThing.fontGlobal, this.UIgroup);
        this.textCanCollect.anchor.set(.5);
        this.textBottleCollect = this.game.add.text(game.width*.92,400, '0', askThing.fontGlobal, this.UIgroup);
        this.textBottleCollect.anchor.set(.5);
        this.textWrappingCollect = this.game.add.text(game.width*.92,290, '0', askThing.fontGlobal, this.UIgroup);
        this.textWrappingCollect.anchor.set(.5);

        this.urgentBoxUI = this.game.add.image(this.game.width*.45, 40, 'uibox', 'urgent-ui', this.UIgroup);
        this.urgentBoxUI.anchor.set(0.5, 0);
        this.urgentBoxUI.scale.set(.45);
        this.urgentBoxUI.visible = false;
        this.urgentItem = this.game.add.image(0,this.urgentBoxUI.width*.75, 'ingame', 'item-can.png');
        this.urgentItem.anchor.set(.5);
        this.urgentItem.scale.set(3);
        this.urgentBoxUI.addChild(this.urgentItem);
        this.spawnTimer();
        this.spawnQuestion();
    }

    spawnTimer(){
        let UIBox = this.game.add.image(20,20, 'uibox', 'scorebox2');
        let iconTimer = this.game.add.image(23, 18, 'uibox', 'icon-timer');
        this.fontStle = {font: "30px vag", fill: "#d6433c"};
        this.timerText =  this.game.add.text(125, 65, '', this.fontStle);
        this.timerText.text = "00:00";
        this.timerText.anchor.set(.5, .5);
        UIBox.addChild(iconTimer);
        this.UIgroup.add(UIBox);
        this.UIgroup.add(this.timerText);
    }

    spawnQuestion(){
        this.questionBox = this.game.add.existing(new PopupQuestion(this.game, this.game.width*.5, this.game.height*.5, {parent:this}));
        this.questionBox.visible = false;
        this.UIgroup.add(this.questionBox);
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
        //let totalScore = (this.score.urgent*2+this.score.can+this.score.wrapping+this.score.bottle)*100;
        //this.score.total = totalScore;
        if(this.score.total > 0){
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
            ZIDO_API.setScore(this.score.total);
        }, this);

        for(let i=0; i<this.peoples.length; i++){
            var people = this.peoples[i];
            people.charTexture.inputEnabled = false;
            if(!people.pause){
                //people.tween.pause();
                people.pause = true;
            }
        }

        this.game.tweens.pauseAll();
        this.questionBox.visible = false;
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
        let score = this.score.total;
        let windcondition = (score > 0)?true:false;
        this.endgameoverlay.setTextScore(score);
        this.endgameoverlay.show(windcondition);

        //stop all movement
    }

    onRetryButtonDown(){
        game.state.start("GameScreen");
    }

    requestUrgent(){
        if(this.gameState == "end")return;
        this.game.time.events.add(5*Phaser.Timer.SECOND, this.removeRequestUrgent, this);
        this.urgentBoxUI.visible=true;
        this.urgentName = this.rnd.pick(this.URGENTITEMLIST);
        let fullFrameName = "item-"+this.urgentName+".png";
        this.urgentItem.loadTexture('ingame', fullFrameName);
    }

    removeRequestUrgent(){
        this.urgentBoxUI.visible = false;
        this.urgentName = "nourgent";
        let randomTimer = this.rnd.integerInRange(5, 15);
        this.game.time.events.add(randomTimer*Phaser.Timer.SECOND, this.requestUrgent, this);
    }

    showEndScore(){
        console.log("Endscoring");
        for(let i=0; i<this.peoples.length; i++){
            var people = this.peoples[i];
            people.charTexture.inputEnabled = false;
            if(!people.pause){
                //people.tween.pause();
                people.pause = true;
            }
        }

        this.game.tweens.pauseAll();
        this.questionBox.visible = false;
        this.questionBox.disableInput();
        this.endScoring = this.game.add.image(this.game.width*.5, 0, 'endscreen', 'base-result');
        this.endScoring.y = - (this.endScoring.height*.6);
        this.endScoring.anchor.set(.5);

        let totalScore = (this.score.urgent*2+this.score.can+this.score.wrapping+this.score.bottle)*100;
        console.log(this.score);
        this.score.total = totalScore;

        this.UIgroup.add(this.endScoring);

        this.game.add.tween(this.endScoring).to({y:this.game.height*.4}, 300, Phaser.Easing.Bounce.Out, true).onComplete.add(this.animationScore, this);
    }

    animationScore(){
        let  can = this.game.add.sprite(-this.endScoring.width*.4, -40, 'ingame', "item-can.png");
        can.anchor.set(.5);
        can.scale.set(0.01, 0.01);
        let wrapping = this.game.add.sprite(-this.endScoring.width*.051, -40, 'ingame', "item-wrapping.png");
        wrapping.anchor.set(.5);
        wrapping.scale.set(0.01, 0.01);
        let bottle = this.game.add.sprite(this.endScoring.width*.3, -40, 'ingame', "item-bottle.png");
        bottle.anchor.set(.5);
        bottle.scale.set(0.01, 0.01);
        
        this.endScoring.addChild(can);
        this.endScoring.addChild(wrapping);
        this.endScoring.addChild(bottle);

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

        let tween1 = this.game.add.tween(can.scale).to({x:1.5, y:1.5}, 300, Phaser.Easing.Elastic.Out);
        let tween1a = this.game.add.tween(this.buffScore).to({can:this.score.can}, 300, Phaser.Easing.Linear.None);
        let tween2 = this.game.add.tween(wrapping.scale).to({x:1.5, y:1.5}, 300, Phaser.Easing.Elastic.Out);
        let tween2a = this.game.add.tween(this.buffScore).to({wrapping:this.score.wrapping}, 300, Phaser.Easing.Linear.None);
        let tween3 = this.game.add.tween(bottle.scale).to({x:1.5, y:1.5}, 300, Phaser.Easing.Elastic.Out);
        let tween3a = this.game.add.tween(this.buffScore).to({bottle:this.score.bottle}, 300, Phaser.Easing.Linear.None);

        this.game.add.tween(this.buffScore).to({total:this.score.total}, 300, Phaser.Easing.Linear.None, true, 1900).onComplete.add(this.createTalker, this);

        tween1.chain(tween1a);
        tween1a.chain(tween2);
        tween2.chain(tween2a);
        tween2a.chain(tween3);
        tween3.chain(tween3a);
        tween1.start();
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

    }
}