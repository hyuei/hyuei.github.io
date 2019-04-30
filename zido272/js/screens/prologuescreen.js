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
        //this.spawnUI();

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
            this.objGroup.add(bin);

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
        }

        let inorganicBin = this.game.add.sprite(this.game.width*.62, this.game.height*.75, 'ingame', 'bin-recycle');
        this.objGroup.add(inorganicBin);
    }

    spawnEntity(enNumber){
        if(this.UIgroup.length>0){
            this.UIgroup.removeAll(true);
        }
        if(enNumber == 1){
            //console.log("show image 1");
            var sprite  = game.add.sprite(game.width*.5, game.height*.3, "uibox", "tutorial-1");
            sprite.anchor.set(.5);
            this.UIgroup.add(sprite);
        }
        else if(enNumber == 2){
            //console.log("show image 2");
            var sprite  = game.add.sprite(game.width*.5, game.height*.3,"uibox", "tutorial-2");
            sprite.anchor.set(.5);
            this.UIgroup.add(sprite);
        }
        else if(enNumber == 3){
            var sprite  = game.add.sprite(game.width*.5, game.height*.3, "uibox", "tutorial-3");
            sprite.anchor.set(.5);
            this.UIgroup.add(sprite);
        }
        else if(enNumber == 4){
            //console.log("show image 2");
            var sprite  = game.add.sprite(game.width*.5, game.height*.3, "uibox", "tutorial-4");
            sprite.anchor.set(.5);
            this.UIgroup.add(sprite);
        }
        else if(enNumber == 5){
            //console.log("show image 2");
            var sprite  = game.add.sprite(game.width*.5, game.height*.3, "uibox", "tutorial-5");
            sprite.anchor.set(.5);
            this.UIgroup.add(sprite);
        }
    }

    spawnUI(){
        this.lockUI = {
            //wallet : this.game.add.sprite(800, 70, 'ingame', "item-wallet.png"),
            can : this.game.add.sprite(800, 150, 'ingame', "item-can.png"),
            wrapping : this.game.add.sprite(800, 270, 'ingame', "item-wrapping.png"),
            bottle : this.game.add.sprite(800, 380, 'ingame', "item-bottle.png")
        };
        //this.objGroup.add(this.lockUI.wallet);
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
            this.spawnEntity(5);
        }
        else if(this.talker.talkIndex == 9){
            this.UIgroup.removeAll(true);
        }
    }

    render(){
        //game.debug.text('FPS: ' + game.time.fps || 'FPS: --', 40, 40, "#00ff00");
    }
}