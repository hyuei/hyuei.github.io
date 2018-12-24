class kidNumber extends Phaser.Sprite{
    constructor(game, x, y, controller){
        super(game, x, y, "kid");
        this.anchor.set(.5);
        this.inputEnabled = true;
        this.controller = controller;
        this.stateMovement = "right";
        //this.events.onInputDown.add(this.picked, this);//, 0, this);
    }
    moving(){
        
    }
    
} 