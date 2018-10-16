class PrologueScreen extends GameScreen
{
    constructor(game)
    {
        super(game);
    }

    preload() 
    {
        game.time.advancedTiming = true;   
    }

    create(){
        console.log("Prologue screen");
        game.input.mouse.capture = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        this.createBG();
        this.createKid();
        var textoption = {font:"20px vag", fill:"#272a4c", align :"center"};
        var num = game.add.text(-20, 0, 1, textoption);

        //group for entity
        this._enGroup = game.add.group();


        this.createTalker();
        this.createLogo();
    }

    createBG(){
        var bgImg = game.add.sprite(0,0, "bg");
    }

    createKid(){
       //add sammy think
       game.add.sprite(42, 354, "sammi-think");
    }

    spawnEntity(enNumber){
        if(this._enGroup.length>0){
            this._enGroup.removeAll(true)
        }
        if(enNumber == 0){
            //console.log("show image 1");
            var sprite  = game.add.sprite(game.width*.5, game.height*.7, "tut1");
            sprite.anchor.set(.5);
            this._enGroup.add(sprite);
        }
        else if(enNumber == 1){
            //console.log("show image 2");
            var sprite  = game.add.sprite(game.width*.5, game.height*.7, "tut2");
            sprite.anchor.set(.5);
            this._enGroup.add(sprite);
        }
    }

    createTalker()
    {
        this.talker = new Talker(game, 0, 200, game.world.width , TALKER_HEIGHT, this); //game.world.height, game.world.width , TALKER_HEIGHT, this);
        game.add.existing(this.talker);
        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.Prologue);
        this.talker.startTalk();
        this.talker.onNext.add(this.checkNext, this);
        this.talker.onFinish.add(function(){game.state.start("Game1Screen");});
    }

    checkNext(){
        if(this.talker.talkIndex == 4){
            this.spawnEntity(0);
        }
        else if(this.talker.talkIndex==5){
            this.spawnEntity(1);
        }
    }

    render(){
        //game.debug.text('FPS: ' + game.time.fps || 'FPS: --', 40, 40, "#00ff00");
    }
}