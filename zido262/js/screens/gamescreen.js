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
        this.timeLimit = 120.3;
        this.score = {can:0, bottle:0, wrapping:0, urgent:0, total:0};

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
        }
    }

    spawnUI(){
        this.lockUI = {
            wallet : this.game.add.sprite(800, 70, 'ingame', "item-wallet.png"),
            can : this.game.add.sprite(800, 150, 'ingame', "item-can.png"),
            wrapping : this.game.add.sprite(800, 270, 'ingame', "item-wrapping.png"),
            bottle : this.game.add.sprite(800, 380, 'ingame', "item-bottle.png")
        };
        this.UIgroup.add(this.lockUI.wallet);
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
        this.spawnTimer();
        this.spawnQuestion();
    }

    spawnTimer(){
        let UIBox = this.game.add.image(20,20, 'uibox', 'scorebox2');
        let iconTimer = this.game.add.image(23, 18, 'uibox', 'icon-timer');
        let fontStle = {font: "30px vag", fill: "#d6433c"};
        this.timerText =  this.game.add.text(125, 65, '', fontStle);
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
        let totalScore = (this.score.urgent*2+this.score.can+this.score.wrapping+this.score.bottle);//*100;
        this.score.total = totalScore;
        if(totalScore > 0){
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
            ZIDO_API.setScore(totalScore);
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

    update(){
        if(this.gameState == "end")return;
        this.timeLimit -= this.game.time.physicsElapsed;
        if(this.timeLimit<=0.1){
            this.timeLimit = 0;
            console.log("end");
            this.gameState = "end";
            this.createTalker();

            //this.endGame();
        }
        this.timerText.text = this.updateTextTimer(this.timeLimit);
        
    }
    render(){

    }
}