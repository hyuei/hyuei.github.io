import { GameScene } from "./scenes/GameScene";
import { HelloScene } from "./scenes/HelloScene"

export class StateManager {
    game: Phaser.Game = null;

    states: Array<GameScene> = new Array<GameScene>();

    public constructor(game: Phaser.Game) {
        this.game = game;

        // var helloScene:HelloScene = new HelloScene()
        // this.game.scene.add("HelloScene", helloScene);
        // this.game.scene.start("HelloScene");

        var gameScene: GameScene = new GameScene();
        this.game.scene.add("GameScene", gameScene);
    }

    public startGame(): void {
        this.game.scene.start("GameScene");
    }
}