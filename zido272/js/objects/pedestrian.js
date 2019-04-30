class Pedestrian extends Phaser.Group{
    constructor(game, settings){
        //super(game, x, y, 'ingame', keyFrame);
        super(game);
        this.settings = settings;
        this.y = 600;
        this.sleep = true;
        this.pause = false;
        this.called = false;
        this.requestAsk = false;
        this.init();
    }
    init(){
        //this.x = 200+linePos*150;
        this.itemList = ["can", "wallet", "wrapping", "bottle"];
        let rand = this.game.rnd.integerInRange(1, 8);
        let strPeople = 'guest-0'+rand+'.png';
        this.charTexture = this.game.add.image(0,0, 'ingame', strPeople);
        this.charTexture.anchor.set(.5);
        this.add(this.charTexture);
        this.charTexture.inputEnabled = true;
        this.charTexture.events.onInputDown.add(this.stopBecauseChildCall, this);
        this.bringThings();
        /*
        let setDelay = this.game.rnd.realInRange(0, 5) * Phaser.Timer.SECOND;//, setDelay);
        */

    }
    bringThings(){
        let posibilityBring = this.game.rnd.integerInRange(0, 2);
        if(posibilityBring<2){
            this.nameThing = this.game.rnd.pick(this.itemList);
            let itemName = "item-"+this.nameThing+".png";
            if(this.thing != null || this.thing != undefined){
                this.thing.loadTexture('ingame', itemName);
                this.thing.visible = true;
            }
            else{
                this.thing = this.game.add.image(this.width*.4, 0, 'ingame', itemName);
                this.thing.anchor.set(.5);
                this.add(this.thing);
                this.bringToTop(this.charTexture);
            }
           
        }
        else{
            this.nameThing ="";
            if(this.thing){
                this.thing.visible = false;
            }
        }
        
    }
    stopBecauseChildCall(){
        if(this.requestAsk || this.settings.parent.isQueueAsking) return;
        this.requestAsk = true;
        this.settings.parent.runInPeople(this);
        this.charTexture.inputEnabled = false;
        //this.pause = true;
        //this.called = true;
        //console.log(this.tween);
        //this.tween.pause();
    }
    awake(linePos){
        this.x = 200+linePos*150;
        this.sleep = false;
        //this.tween = this.game.add.tween(this).to({y:-100}, 5000, Phaser.Easing.Linear.None, true).onComplete.add(this.restartCharacter, this);
        //this.tween.onComplete.add(this.restartCharacter, this);
    }
    update(){
        super.update();
        if(!this.sleep){
            if(this.pause || this.called)return;
            this.y -= 1.5;
            if(this.y< -100){
                this.restartCharacter();
            }
        }
    }
    restartCharacter(){
        this.sleep = true;
        this.requestAsk = false;
        this.y = 600;
        this.bringThings();
    }
}