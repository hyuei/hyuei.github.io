class kidNumber extends Phaser.Sprite{
    constructor(game, x, y, controller){
        super(game, x, y, "kid-s");
        this.anchor.set(.5);
        this.childNumber =0;
        this.inputEnabled = true;
        this.controller = controller;
        this.events.onInputDown.add(this.picked, this);//, 0, this);
    }
    setNumber(number){
        this.childNumber = number;
        this.loadTexture("kid-s", 0);
        if(this.numText == null){
            let style = {font:"30px vag", fill:"red"};
            this.numText = this.game.add.text(0,20, number, style);
            this.numText.anchor.set(.5);
            this.addChild(this.numText);
        }
        else{
            this.numText.text = number;
            this.numText.visible = true;
            this.numText.x = 0;
            this.numText.y = 20;
        }
    }

    changeNoShirt(){
        this.loadTexture("kid-n", 0);
        this.numText.x = -15;
        this.numText.y = -75;
        this.numText.visible = false;
        //console.log(this.numText.visible);
    }

    picked(){
        //this.x = 400;
        //this.y = 100;
        this.controller.pickedKids(this);
        //console.log(this.controller);
    }
} 