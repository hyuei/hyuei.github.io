import { StateManager } from "./StateManager";

class Startup {
    public static main(): number {
        console.log('Update gak sih asd  asd asdadad');

        const config: GameConfig = {
            title: "Hello World",
            parent: "game",
            input:{
                keyboard: true,
                mouse: true
            },
            width: 320,
            height: 480
        }

        var game = new Phaser.Game(config);
       
        var sm:StateManager = new StateManager(game);
        sm.startGame();

        return 0;
    }
}

Startup.main();