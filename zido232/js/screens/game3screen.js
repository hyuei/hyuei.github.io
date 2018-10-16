class Game3Screen extends GameScreen
{

    constructor(game)
    {
        super(game);
    }
    
    preload() 
    {
        game.time.advancedTiming = true;   
    }
    
    create()
    {
        /*TODO*/
        // kasih number (terutama bagian awal2) > done
        // harus sesuai urutan > done
        // tiap beberapa detik ada alpha yang naik turun (mudahkan pemain) >done
        //
        //tambahan
        // buat obstacle (random dots, warna berbeda) > done
        // jika tidak sesuai dengan urutan / klik obs akan ada suara aneh >> tingal cari suara
        // fixing tutorial example >> done
        // start game with "start" >> sedang dikerjakan (copy couting down)
        // end game dan berubah scene >> sedang dikerjakan

        console.log("game 3 screen");
        
        game.input.mouse.capture = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        this.memoryChain = new memoryChainGame(game);
        this.memoryChain.init(this);

        //car dots
        this.memoryChain.posdots = [[345, 170], [305, 256], [233,259], [207,355], [293,355], [336,306], [403,311], [432,369],[549,366], [580,316], [667,319], [710, 366], [797, 362], [743, 254], [631, 250], [573, 152], [364,146], [364, 251], [451,253], [452,164],[484, 165], [490,251], [580,245], [552, 174], [384, 172]];

        this.numarray = [[325, 170], [305, 226], [233,229], [187,325], [293,325], [336,266], [403,281], [432,329],[549,326], [580,276], [667,289], [710, 346], [797, 342], [723, 234], [631, 230], [573, 132], [364,126], [364, 231], [451,233], [452,144],[484, 145], [490,231], [580,225], [552, 154], [384, 152]];

        //booth
        //this.memoryChain.posdots = [[309,137], [296,400], [416,444], [647, 383], [643, 322], [584, 278], [320,343], [316,257], [408, 227], [412, 271], [657, 217], [668,169], [561, 94], [348, 130]];

        //house
        //this.memoryChain.posdots = [[262, 293], [296, 158], [627,151], [623,104], [688,104], [680,155], [726,284], [296,291],[388,326], [386,401], [311,403], [306, 356], [271, 353], [275, 434], [425, 438], [427, 325], [552,324], [555, 433], [711,431], [714,311],[604, 315], [602,403], [679,404], [677, 334], [613, 334]];

        //pond
        //this.memoryChain.posdots = [[605, 207], [461,204], [329,238], [359,260], [249,277], [296,304], [376,299], [390,328], [689,327], [650,290], [699,258], [610,241]];

        //rock
        //this.memoryChain.posdots = [[609,216], [603,164], [534, 113], [433,142], [409,213], [369,240], [355,206], [286,230], [277,310], [245,366], [284,411], [383,405], [420,425], [677,429], [710,399], [664,283], [582, 344], [521, 330], [522,214], [575,237]];

        //tree
        //this.memoryChain.posdots = [[320,434], [452,259], [390,240],[360,209], [305,200], [321,168],[397,152],[422,177], [401,206], [461,216],[458,184], [437,142],[371,110], [516,93], [661,107], [603,203], [645,222], [591,263], [496,310], [548,441], [442,422], [360, 444]];


        
        this.memoryChain.spawnDots(this.memoryChain.posdots);
        this.memoryChain.spawnObstacleDots();
        this.memoryChain.spawnCar();
        this.memoryChain.spawnNumber(this.numarray);
        this.memoryChain.gameState = "play";
        //this.memoryChain.countingDown();

        //this.memoryChain.spawnCar();
        //this.memoryChain.spawnBooth();
        //this.memoryChain.spawnHouse();
        //this.memoryChain.spawnPond();
        //this.memoryChain.spawnRock();
        //this.memoryChain.spawnTree();

        this._enGroup = game.add.group();

        this.endgameoverlay = new EndGameOverlay(game);
        this.endgameoverlay.onRetryButtonDown.add(this.onRetryButtonDown);
        this.game.add.existing(this.endgameoverlay);

        this.createLogo();
    }
    
    createTalker()
    {

        this.talker = new Talker(game, 0, game.world.height, game.world.width , TALKER_HEIGHT, this);
        this.game.add.existing(this.talker);
        this.talker.loadTalkingArray(TALKING_DATA.talkingdata.ImageLockThree);
        this.talker.startTalk();

        this.talker.onNext.add(this.nextTalker, this);
        this.talker.onFinish.add(function(){
            this.waitAndNext();
        }, this);
    }

    nextTalker(){
        if(this._enGroup.length>0){
            this._enGroup.removeAll(true)
        }
    }

    onRetryButtonDown(){
        game.state.start("PrologueScreen");
    }

    update() {
        this.memoryChain.timeCount(game.time.physicsElapsed);
    }

    render(){
        //game.debug.text('FPS: ' + game.time.fps || 'FPS: --', 40, 40, "#00ff00");
        //this.cleanTeethGame.renderSpriteBody();
    }

    waitAndNext() {
        game.state.start("Game4Screen");
    }

    endGame(){
        console.log("endgame");
        this.createTalker();

        /*== you can call API score here ==*/
         var userData = JSON.stringify({
            "score":this.cleanTeethGame.gameTimer
        });
        
        ZIDO.post(userData, 
            function(result){
                //console.log("Succeed post watched data" + result);
            }, 
            function(error){
                //console.log("Error post watched data:" + error);
            }
        );
    }

    createCurtains(){
        // var curtainLeft = this.game.add.sprite(0, 0, 'curtain-halfright');
        // curtainLeft.anchor.set(0,0);
        // curtainLeft.scale.set(0.5, 1);

        // var curtainRight = this.game.add.sprite(0, 0, 'curtain-halfright');
        // curtainRight.position.set(game.width, 0);
        // curtainRight.anchor.set(1,0);
        // curtainRight.scale.set(0.5, 1);

        // // animate curtains
        // this.game.add.tween(curtainLeft.scale).to({x:0}, 800, Phaser.Easing.Exponential.Out, true, 200);
        // this.game.add.tween(curtainRight.scale).to({x:0}, 800, Phaser.Easing.Exponential.Out, true, 200);


        var graphics = game.add.graphics(0,0);
        graphics.beginFill(0x000000, 1);
        graphics.drawRect(0,0,game.width, game.height);

        game.add.tween(graphics).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0);   
    }
}
