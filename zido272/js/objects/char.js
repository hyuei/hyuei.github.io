class CharObject extends Phaser.Group{
    constructor(game, settings){
        super(game);
        this.settings = settings;
        this.pause = false;
        this.speed = 100;
        this.init();
    }
    init(){
        //this.
        let charName = 'chara-0'+this.settings.numberChar+'.png';
        this.char = this.game.add.image(0, 0, 'ingame', charName);
        this.char.anchor.set(.5);
        this.add(this.char);
        this.itemName = 'item-wallet.png';
        this.bringItem = this.game.add.image(this.char.width*.4,0, 'ingame', this.itemName);
        this.bringItem.anchor.set(.5);
        this.add(this.bringItem);
        this.bringToTop(this.char);

        this.tweenManager = new Phaser.TweenManager(this.game);
    }

    setPos(x, y){
        this.position = new Phaser.Point(x, y);
    }

    update(){
        //this.x += Math.cos(angle)*this.speed;
    }
}