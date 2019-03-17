import { GameScene } from "./GameScene";

export class HelloScene extends Phaser.Scene {

    score: integer = 0;
    image: Phaser.GameObjects.Image = null;
    text: Phaser.GameObjects.Text = null;

    viewKlikMouse: Phaser.GameObjects.Text = null;
    totalKlikMouse: integer = 0;

    viewTouch: Phaser.GameObjects.Text = null;
    totalTouch: integer = 0;

    fsSprite: Phaser.GameObjects.Sprite = null;    

    fullscreenFunc:Function = null;

    public constructor() {
        
        super({key: "HelloScene"});

        console.log("constructed");
    }

    preload() {
        this.load.image("fs_btn", "assets/fs_btn.png");
    }

    init() {
        // this.input.on('pointerdown', this.mouseDown, this);
        this.input.addPointer(1);
    }

    create() {
        console.log("init");

        var style = { color: '#df0000', fontSize: 30 };
        this.text = this.add.text(0, 0, "halo dunia", style);

        this.viewKlikMouse = this.add.text(0, 50, this.totalKlikMouse.toString());
        this.viewTouch = this.add.text(0, 100, this.totalTouch.toString());


    }

    update() {

        if(this.input.mousePointer.justDown){
            this.totalKlikMouse++;
        }

        if(this.input.pointer1.justDown)
        {
            this.totalTouch++;
        }

        this.viewKlikMouse.setText("diklik:" + this.totalKlikMouse);
        this.viewTouch.setText("ditouch:" + this.totalTouch);
    }

    // mouseDown(e:PointerEvent):void {
    //     this.totalKlikMouse++;
    // }

}   