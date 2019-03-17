// Logic for the game
class TrashGame extends Phaser.Sprite {
    constructor(game) {
        super(game);

        // constants
        this.SCORE_MULTIPLIER = 100;
        this.MAX_TIME = 90000;
        this.MINIMUM_SCORE = 300;

        this.NEXT_RACCOON_TIMEOUT_MIN = 1000;
        this.NEXT_RACCOON_TIMEOUT_MAX = 2300;

        // data
        this.trashData = [
            { binType: "a", spriteKey: "packaging-01" },
            { binType: "a", spriteKey: "packaging-02" },
            { binType: "a", spriteKey: "packaging-03" },
            { binType: "a", spriteKey: "packaging-04" },
            { binType: "a", spriteKey: "packaging-05" },
            { binType: "b", spriteKey: "botol-01" },
            { binType: "b", spriteKey: "botol-02" },
            { binType: "b", spriteKey: "botol-03" },
            { binType: "b", spriteKey: "botol-04" },
            { binType: "b", spriteKey: "botol-05" },
            { binType: "c", spriteKey: "kain-01" },
            { binType: "c", spriteKey: "kain-02" },
            { binType: "c", spriteKey: "kain-03" }
        ];

        this.spawnPosTL = { x: 220, y: 150 };
        this.spawnPosTR = { x: 310, y: 150 };;
        this.spawnPosBL = { x: 220, y: 400 };
        this.spawnPosBR = { x: 310, y: 400 };

        // objects
        this.view = new TrashGameView(game);
        this.view.trashStopDragSignal.add(this.onTrashDragStop, this);
        this.view.trashStartDragSignal.add(this.onTrashDragStart, this);

        this.spawnedTrashArr = [];

        // model format:
        // {sprite: objectXXX, binType: "a"}
        this.trashBinArr = [];

        this.currentScore = 0;
        this.currentTime = 0;

        this.GS_PAUSE = "pause";
        this.GS_PLAY = "play";
        this.GS_GAMEOVER = "gameover";
        this.currentGameState = this.GS_PAUSE; //initial state

        // format {x: , y:}
        this.draggedTrashInitialPos = null;

        this.currentDraggingTrash = null;

        this.lastHoveredBin = null;
        this.hoveredBins = [];

        this.IsPlaying = true;

        this.gameWinSignal = new Phaser.Signal();
        this.gameLoseSignal = new Phaser.Signal();

        this.raccoonSpawned = false;
        this.raccoonArrived = false;
        this.raccoonTrashingTimeout = null;
        this.nextRaccoonSpawnTimeOut = this.NEXT_RACCOON_TIMEOUT_MIN + (Math.random() * this.NEXT_RACCOON_TIMEOUT_MAX);

    }

    startGameAction() {
        console.log("start game");
        this.IsPlaying = true;
        this.enableTrashDrag();
    }

    stopGameAction() {
        this.IsPlaying = false;
        this.disableTrashDrag();
        console.log("stop");
    }

    create() {
        let ref = this;
        this.view.create();

        // setup bin type
        this.trashBinArr = [];
        this.trashBinArr.push({ sprite: ref.view.binA, binType: "a" });
        this.trashBinArr.push({ sprite: ref.view.binB, binType: "b" });
        this.trashBinArr.push({ sprite: ref.view.binC, binType: "c" });

        this.view.raccoon.onDownSignal.add(this.onRaccoonClicked, this);

        // initialize batch
        this.spawnTrashBatch();

        this.startGame();
    }

    update() {

        if (!this.IsPlaying)
            return;

        if (this.currentGameState == this.GS_PLAY) {
            this.updateTime();
        }
        if (this.currentGameState == this.GS_PLAY && this.currentTime <= 0) {
            this.currentGameState = this.GS_GAMEOVER;
            this.onGameOver();
        }

        // detect collision
        if (this.currentDraggingTrash != null) {
            var binHovered = false;
            for (var i = 0; i < this.trashBinArr.length; i++) {
                var trashBinData = this.trashBinArr[i];
                var binSprite = trashBinData.sprite;

                this.game.physics.arcade.collide(this.currentDraggingTrash, binSprite, function () {
                    binHovered = true;
                    binSprite.scale.set(1.05);

                    this.hoveredBins.push(binSprite);
                    this.lastHoveredBin = binSprite;
                }, null, this);

                if (binHovered)
                    break;
            }

            if (!binHovered) {
                for (var i = this.hoveredBins.length - 1; i >= 0; i--) {
                    this.hoveredBins[i].scale.set(1);
                    this.hoveredBins.splice(i, 1);
                }
            } else {
                var i = 0;
                while (i < this.hoveredBins.length) {
                    if (this.hoveredBins[i] != this.lastHoveredBin) {
                        this.hoveredBins[i].scale.set(1);
                        this.hoveredBins.splice(i, 1);
                        i--;
                    }
                    i++;
                }
            }

        }

    }

    startGame() {
        this.currentTime = this.MAX_TIME;
        this.view.timerUI.setMiliSeconds(this.currentTime);
        this.currentGameState = this.GS_PLAY;
    }

    updateTime() {
        this.currentTime -= this.game.time.elapsedMS;
        this.view.timerUI.setMiliSeconds(this.currentTime);

        if (!this.raccoonSpawned && Math.random() < 0.2 && this.nextRaccoonSpawnTimeOut <= 0) {

            // set target trashBin
            let trashBinIndex = Math.floor(Math.random() * this.trashBinArr.length);
            this.currentRaccoonBinTarget = this.trashBinArr[trashBinIndex];
            let trashBinHeight = this.currentRaccoonBinTarget.sprite.height;
            this.spawnRacoon(this.currentRaccoonBinTarget.sprite.position.x, this.currentRaccoonBinTarget.sprite.position.y - trashBinHeight);

            this.nextRaccoonSpawnTimeOut = this.NEXT_RACCOON_TIMEOUT_MIN + (Math.random() * this.NEXT_RACCOON_TIMEOUT_MAX);
            console.log(this.nextRaccoonSpawnTimeOut);
        }

        if (!this.raccoonSpawned) {
            this.nextRaccoonSpawnTimeOut -= this.game.time.elapsed;
        }
    }

    spawnTrash() {
        let targetIndex = Math.floor(Math.random() * this.trashData.length);
        let trashModel = this.trashData[targetIndex];

        let posX = this.spawnPosTL.x + Math.random() * (this.spawnPosTR.x - this.spawnPosTL.x);
        let posY = this.spawnPosTL.y + Math.random() * (this.spawnPosBL.y - this.spawnPosTL.y);

        let trash = this.view.createTrash(trashModel.spriteKey, posX, -100);
        trash.angle = Math.random() * 360;

        trash.model = trashModel;

        this.spawnedTrashArr.push(trash);


        // animate spawn
        this.game.add.tween(trash).to({ y: posY }, 500 + Math.random() * 300, Phaser.Easing.Bounce.Out, true);
    }


    onTrashDragStart(sprite, pointer) {
        console.log("trash drag start");

        this.currentDraggingTrash = sprite;

        this.draggedTrashInitialPos = { x: sprite.position.x, y: sprite.position.y };

        // console.log(this.draggedTrashInitialPos.x + "," + this.draggedTrashInitialPos.y);
        this.game.add.tween(sprite.scale).to({ x: 1.25, y: 1.25 }, 500, Phaser.Easing.Quartic.Out, true);

        // make other trashes opacity lower
        for (var i = 0; i < this.spawnedTrashArr.length; i++) {
            var trash = this.spawnedTrashArr[i];
            if (trash != sprite) {
                trash.alpha = 0.5;
            }
        }
    }

    onTrashDragStop(sprite, pointer) {
        sprite.scale.set(1);

        // console.log(sprite.position.x + ">" + this.spawnPosTR.x + "||" +
        //     sprite.position.x + "<" + this.spawnPosTL.x + "||" +
        //     sprite.position.y + ">" + this.spawnPosBL.y + "||" +
        //     sprite.position.y + "<" + this.spawnPosTL.y);
        // check dragged outside area
        if (sprite.position.x > this.spawnPosTR.x ||
            sprite.position.x < this.spawnPosTL.x ||
            sprite.position.y > this.spawnPosBL.y ||
            sprite.position.y < this.spawnPosTL.y) {

            console.log("END:" + this.draggedTrashInitialPos.x + "," + this.draggedTrashInitialPos.y);
            this.game.add.tween(sprite).to({ x: this.draggedTrashInitialPos.x, y: this.draggedTrashInitialPos.y }, 150, Phaser.Easing.Quartic.Out, true);
            // sprite.position.set(this.draggedTrashInitialPos.x, this.draggedTrashInitialPos.y);
        }

        // make other trashes opacity normal
        for (var i = 0; i < this.spawnedTrashArr.length; i++) {
            var trash = this.spawnedTrashArr[i];
            if (trash != sprite) {
                trash.alpha = 1;
            }
        }

        // detect collision
        for (var i = 0; i < this.trashBinArr.length; i++) {
            var trashBinData = this.trashBinArr[i];
            var binSprite = trashBinData.sprite;

            this.game.physics.arcade.collide(sprite, binSprite, this.trashCollisionHandler, null, this);
        }

    }

    getTrashBinModel(sprite) {
        let trashBinModel = null;
        let i = 0;
        while (i < this.trashBinArr.length) {
            if (this.trashBinArr[i].sprite == sprite) {
                return this.trashBinArr[i];
            }
            i++;
        }

        return trashBinModel;
    }

    trashCollisionHandler(trashSprite, trashBin) {
        let trashBinModel = this.getTrashBinModel(trashBin);

        if (trashSprite.model.binType == trashBinModel.binType) {
            this.onDropTrashCorrect(trashSprite);
        } else {
            this.onDropTrashFalse(trashSprite);
        }

        // animate trash bin
        trashBin.scale.set(1);
        var trashBinAnim = this.game.add
            .tween(trashBin.scale)
            .to({ x: 1.1, y: 1.15 }, 190, Phaser.Easing.Bounce.Out, true);

        trashBinAnim.onComplete.add(function () {
            this.game.add
                .tween(trashBin.scale)
                .to({ x: 1, y: 1 }, 200, Phaser.Easing.Quartic.In, true);
        }, this);
    }

    onDropTrashCorrect(trashSprite) {
        console.log("betul");
        this.removeTrashSprite(trashSprite);
        this.updateTrashCollection();

        this.currentScore++;
        this.view.scoreUI.setScore(this.getScoreValue());
    }

    onDropTrashFalse(trashSprite) {
        console.log("salah");
        this.removeTrashSprite(trashSprite);
        this.updateTrashCollection();

        this.currentScore--;
        this.view.scoreUI.setScore(this.getScoreValue());
    }

    removeTrashSprite(trashSprite) {
        let spriteIndex = this.spawnedTrashArr.indexOf(trashSprite)
        this.spawnedTrashArr.splice(spriteIndex, 1);
        trashSprite.destroy();
    }

    updateTrashCollection() {
        if (this.spawnedTrashArr.length <= 0) {
            // spawn another batch
            this.spawnTrashBatch();
        }
    }

    spawnTrashBatch() {
        for (let i = 0; i < 10; i++) {
            this.spawnTrash();
        }
    }

    getScoreValue() {
        let scoreValue = this.currentScore * this.SCORE_MULTIPLIER;
        return scoreValue;
    }

    onGameOver() {
        if (this.getScoreValue() >= this.MINIMUM_SCORE) {
            this.gameWinSignal.dispatch(this.getScoreValue())
        } else {
            this.gameLoseSignal.dispatch(this.getScoreValue());
        }

        // disable drag input
        for (var i = 0; i < this.view.trashGroup.children.length; i++) {
            this.view.trashGroup.children[i].input.enabled = false;
        }
    }

    enableTrashDrag() {
        for (var i = 0; i < this.spawnedTrashArr.length; i++) {
            this.spawnedTrashArr[i].input.draggable = true;
        }
    }

    disableTrashDrag() {
        for (var i = 0; i < this.spawnedTrashArr.length; i++) {
            this.spawnedTrashArr[i].input.draggable = false;
        }
    }

    spawnRacoon(posX, posY) {
        var ref = this;

        ref.view.raccoon.destroyBroughtTrash();


        this.raccoonSpawned = true;
        this.view.raccoon.scale.x = 1;
        this.view.raccoon.position.set(this.game.width + 100, posY);

        this.view.raccoon.moveTo(posX, posY, 3500, 0,
            function () {

                // raccoon go back
                ref.raccoonArrived = true;
                ref.raccoonTrashingTimeout = setTimeout(function () {

                    console.log("Target Raccoon Bin Type:" + ref.currentRaccoonBinTarget.binType);

                    var trashTargets = ref.getTrashArrayFromBinType(ref.currentRaccoonBinTarget.binType);
                    var trashTargetIndex = Math.floor(Math.random() * trashTargets.length);
                    ref.view.raccoon.createBroughtTrash(trashTargets[trashTargetIndex].spriteKey);

                    if (ref.IsPlaying) {
                        // decrease score
                        ref.currentScore--;
                        ref.view.scoreUI.setScore(ref.getScoreValue());
                    }

                    ref.view.raccoon.scale.x = -1;
                    ref.view.raccoon.moveTo(ref.game.width + 100, ref.view.raccoon.position.y, 1000, 500,
                        function () {
                            ref.raccoonSpawned = false;
                            ref.view.raccoon.destroyBroughtTrash();
                        });

                    // ref.view.raccoon.position.set(ref.game.width + 100, posY);
                }, 1000);


            });
    }

    onRaccoonClicked() {
        var ref = this;

        this.raccoonArrived = false;

        if (ref.raccoonTrashingTimeout != null) {
            clearTimeout(ref.raccoonTrashingTimeout);
            ref.raccoonTrashingTimeout = null;
        }

        this.view.raccoon.scale.x = -1;
        this.view.raccoon.moveTo(this.game.width + 100, this.view.raccoon.position.y, 1000, 0,
            function () {
                ref.raccoonSpawned = false;
            });
    }

    getTrashArrayFromBinType(binType) {
        let trashArr = [];
        for (var i = 0; i < this.trashData.length; i++) {
            if (this.trashData[i].binType === binType) {
                trashArr.push(this.trashData[i]);
            }
        }
        return trashArr;
    }
}