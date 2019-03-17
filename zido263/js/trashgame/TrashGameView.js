// Logic for the game
class TrashGameView extends Phaser.Sprite {
    constructor(game) {
        super(game);

        this.ammarSprite = null;
        this.khalidSprite = null;
        this.sammiSprite = null;

        this.binA = null;
        this.binB = null;
        this.binC = null;

        this.trashGroup = null;

        this.trashStartDragSignal = new Phaser.Signal();
        this.trashStopDragSignal = new Phaser.Signal();

        this.scoreUI = null;
        this.timerUI = null;
        this.background = null;

        this.raccoon = null;

    }

    create() {
        console.log("CREATED");

        this.createBackground();
        // this.createCharacters();
        this.createTrashBins();

        this.trashGroup = this.game.add.group();
        this.trashGroup.inputEnableChildren = true;

        this.createRaccoon();


        this.createUI();
    }




    createBackground() {
        this.background = this.game.add.sprite(0, 0, "trash_bg");
        this.background.y = -56;
    }

    createUI() {
        this.scoreUI = new ScoreUI();
        this.scoreUI.create();
        this.scoreUI.x = 700;
        this.scoreUI.y = this.game.height - 50;

        this.timerUI = new TimerUI();
        this.timerUI.create();
        this.timerUI.x = 870;
        this.timerUI.y = this.game.height - 50;
    }

    createCharacters() {
        // ammar
        this.ammarSprite = new Character();
        this.ammarSprite.create("ammar-idle");

        this.ammarSprite.x = 50;
        this.ammarSprite.y = 50;

        // khalid
        this.khalidSprite = new Character();
        this.khalidSprite.create("khalid-idle");

        this.khalidSprite.x = 50;
        this.khalidSprite.y = 200;

        // sammi
        this.sammiSprite = new Character();
        this.sammiSprite.create("sammi-idle");

        this.sammiSprite.x = 50;
        this.sammiSprite.y = 350;
    }

    createRaccoon() {
        this.raccoon = new Raccoon();
        this.raccoon.create();

        this.raccoon.position.set(this.game.width + 500, this.game.height + 500);

    }

    createTrashBins() {
        // bin A
        this.binA = new TrashBin();
        this.binA.create("keranjang-merah");

        var yOffset = 70;

        this.binA.position.set(670, 170 + yOffset);

        // bin B
        this.binB = new TrashBin();
        this.binB.create("keranjang-biru");

        this.binB.position.set(470, 305 + yOffset);

        // bin C
        this.binC = new TrashBin();
        this.binC.create("keranjang-putih");

        this.binC.position.set(670, 390 + yOffset);
    }

    createTrash(type, posX, posY) {
        let trash = new TrashItem();
        trash.create(type, posX, posY);

        trash.inputEnabled = true;
        trash.input.enableDrag();
        trash.events.onDragStart.add(this.onTrashDragStart, this);
        trash.events.onDragStop.add(this.onTrashDragStop, this);

        this.trashGroup.add(trash);

        return trash;
    }

    onTrashDragStart(sprite, pointer) {
        this.trashGroup.bringToTop(sprite);
        this.trashStartDragSignal.dispatch(sprite, pointer);
    }

    onTrashDragStop(sprite, pointer) {
        this.trashStopDragSignal.dispatch(sprite, pointer);
    }

}