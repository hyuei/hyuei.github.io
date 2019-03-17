class PrologueScreen extends Phaser.State
{
    constructor(game)
    {
        super(game);
    }

    preload() 
    {
        //game.time.advancedTiming = true;   
    }

    create(){
        //declare
        console.log("Prologue screen");
        this.contrainer = this.game.add.group();
        this.BGGroup = this.game.add.group();
        this.objGroup = this.game.add.group();
        this.UIgroup = this.game.add.group();
        this.frontUIgroup = this.game.add.group();

        //add info
        game.input.mouse.capture = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        this.regroup();
        this.spawnLogo();
        this.spawnBG();
        this.spawnObjs();
        this.spawnUI();

        //group for entity
        this.createTalker();
    }

    regroup(){
        this.contrainer.add(this.BGGroup);
        this.contrainer.add(this.objGroup);
        this.contrainer.add(this.UIgroup);
        this.contrainer.add(this.frontUIgroup);
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
        for(var i = 1; i < 4; i++){
            let s = 'chara-0'+i+'.png';
            let char = this.game.add.sprite(60, 120+i*80, 'ingame',s);
            char.anchor.set(.5);
            char.fPos = new Phaser.Point(char.x, char.y);
            this.objGroup.add(char);
        }
    }

    spawnEntity(enNumber){
        if(this.UIgroup.length>0){
            this.UIgroup.removeAll(true);
        }
        if(enNumber == 0){
            //console.log("show image 1");
            var sprite  = game.add.sprite(game.width*.5, game.height*.3, "uibox", "tutorial-1");
            sprite.anchor.set(.5);
            this.UIgroup.add(sprite);
        }
        else if(enNumber == 1){
            //console.log("show image 2");
            var sprite  = game.add.sprite(game.width*.5, game.height*.3,"uibox", "tutorial-2");
            sprite.anchor.set(.5);
            this.UIgroup.add(sprite);
        }
        else if(enNumber == 2){
            var sprite  = game.add.sprite(game.width*.5, game.height*.3, "uibox", "tutorial-3");
            sprite.anchor.set(.5);
            this.UIgroup.add(sprite);
        }
        else if(enNumber == 3){
            //console.log("show image 2");
            var sprite  = game.add.sprite(game.width*.5, game.height*.3, "uibox", "tutorial-4");
            sprite.anchor.set(.5);
            this.UIgroup.add(sprite);
        }
        else if(enNumber == 4){
            //console.log("show image 2");
            var sprite  = game.add.sprite(game.width*.5, game.height*.3, "uibox", "tutorial-5");
            sprite.anchor.set(.5);
            this.UIgroup.add(sprite);
        }
    }

    spawnUI(){
        this.lockUI = {
            wallet : this.game.add.sprite(800, 70, 'ingame', "item-wallet.png"),
            can : this.game.add.sprite(800, 150, 'ingame', "item-can.png"),
            wrapping : this.game.add.sprite(800, 270, 'ingame', "item-wrapping.png"),
            bottle : this.game.add.sprite(800, 380, 'ingame', "item-bottle.png")
        };
        this.objGroup.add(this.lockUI.wallet);
        this.objGroup.add(this.lockUI.can);
        this.objGroup.add(this.lockUI.wrapping);
        this.objGroup.add(this.lockUI.bottle);
    }
    createTalker()
    {
        this.talker = new Talker(game, 10, 530, game.world.width , TALKER_HEIGHT, this); //game.world.height, game.world.width , TALKER_HEIGHT, this);
        game.add.existing(this.talker);
        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.Prologue);
        this.talker.startTalk();
        this.talker.onNext.add(this.checkNext, this);
        this.talker.onFinish.add(function(){game.state.start("GameScreen");});
    }

    checkNext(){
        if(this.talker.talkIndex == 3){
            this.spawnEntity(0);
        }
        else if(this.talker.talkIndex==4){
            this.spawnEntity(1);
        }
        else if(this.talker.talkIndex==5){
            this.spawnEntity(2);
        }
        else if(this.talker.talkIndex==6){
            this.spawnEntity(3);
        }
        else if(this.talker.talkIndex==7){
            this.spawnEntity(4);
        }
        else if(this.talker.talkIndex == 8){
            this.UIgroup.removeAll(true);
        }
    }

    render(){
        //game.debug.text('FPS: ' + game.time.fps || 'FPS: --', 40, 40, "#00ff00");
    }
}