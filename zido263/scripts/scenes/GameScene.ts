import { GunkerbatGame } from "../GunkerbatGame";

export class GameScene extends Phaser.Scene {

    btnImage:Phaser.GameObjects.Image = null;

    public constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        this.load.image("fs_btn", "assets/fs_btn.png");
    }

    create() {
        var gunkerbatGame: GunkerbatGame = new GunkerbatGame(this);
        this.add.group(gunkerbatGame);

        this.btnImage = this.add.image(0, 0, "fs_btn");
    }

    update() {
        this.btnImage.x += 1;
        this.btnImage.y += 1;
    }

}