class PrologueScreen extends GameScreen
{
    constructor(game)
    {
        super(game);
        this.kidsPos = [{x:130, y:325}, {x:220, y:440}, {x:270, y:300}, {x:360, y:400}, {x:425, y:280}, {x:520, y:380} ,{x:590, y:270}, {x:720, y:350}, {x:830, y:260}, {x:870, y:400}];
    }

    preload() 
    {
        game.time.advancedTiming = true;   
    }

    create(){
        console.log("Prologue screen");
        game.input.mouse.capture = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        this.spawnBG();
        this.spawnBoard();
        this.spawnKid();
        this.spawnTeacher();
        var textoption = {font:"20px vag", fill:"#272a4c", align :"center"};
        var num = game.add.text(-20, 0, 1, textoption);

        //group for entity
        this._enGroup = game.add.group();


        this.createTalker();
        this.createLogo();
    }

    spawnBG(){
        var bgImg = game.add.sprite(0,0, "bg");
    }

    spawnBoard(){
        let board = game.add.sprite(272, 108, "board");
        board.anchor.set(.5);
    }

    spawnTeacher(){
        let teacher = game.add.sprite(46, 70, "teacher");
    }

    spawnKid(){
       for(let i = 0; i<this.kidsPos.length; i++){
        let pos = this.kidsPos[i];
        let kid = game.add.sprite(pos.x, pos.y, "kid-s");
        kid.anchor.set(.5);
        //let kid = new kidNumber(this.game, pos.x, pos.y, this);
        //kid.setNumber(i);
       }
    }

    spawnEntity(enNumber){
        if(this._enGroup.length>0){
            this._enGroup.removeAll(true)
        }
        if(enNumber == 0){
            //console.log("show image 1");
            var sprite  = game.add.sprite(game.width*.5, game.height*.3, "tut1");
            sprite.anchor.set(.5);
            this._enGroup.add(sprite);
        }
        else if(enNumber == 1){
            //console.log("show image 2");
            var sprite  = game.add.sprite(game.width*.5, game.height*.3, "tut2");
            sprite.anchor.set(.5);
            this._enGroup.add(sprite);
        }
        else if(enNumber == 2){
            var sprite  = game.add.sprite(game.width*.5, game.height*.3, "tut3");
            sprite.anchor.set(.5);
            this._enGroup.add(sprite);
        }
        else if(enNumber == 3){
            //console.log("show image 2");
            var sprite  = game.add.sprite(game.width*.5, game.height*.3, "tut4");
            sprite.anchor.set(.5);
            this._enGroup.add(sprite);
        }
    }

    createTalker()
    {
        this.talker = new Talker(game, 10, 530, game.world.width , TALKER_HEIGHT, this); //game.world.height, game.world.width , TALKER_HEIGHT, this);
        game.add.existing(this.talker);
        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.Prologue);
        this.talker.startTalk();
        this.talker.onNext.add(this.checkNext, this);
        this.talker.onFinish.add(function(){game.state.start("Game1Screen");});
    }

    checkNext(){
        if(this.talker.talkIndex == 3){
            this.spawnEntity(0);
        }
        else if(this.talker.talkIndex==5){
            this.spawnEntity(1);
        }
        else if(this.talker.talkIndex==6){
            this.spawnEntity(2);
        }
        else if(this.talker.talkIndex==8){
            this.spawnEntity(3);
        }
    }

    render(){
        //game.debug.text('FPS: ' + game.time.fps || 'FPS: --', 40, 40, "#00ff00");
    }
}