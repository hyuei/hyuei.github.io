class PopBoard extends Phaser.Sprite {
    constructor(game) {
        super(game);

        this.inputEnabled = true;

        this.ROW = 6;
        this.COL = 7;

        this.XOFFSET = 210;
        this.YOFFSET = 45;

        this.MINIMUM_MATCH = 3;

        this.SUPER_ITEM_PERCENTAGE = 5;

        this.scoreMultiplier = 99;

        this.superVegTypes = ["bomb"];
        this.vegTypes = ["veg-01", "veg-02", "veg-03", "veg-04"];

        this.itemArr = [];
        // this.targetPopArr = [];

        this.currentColHollowCount = [];
        for (var i = 0; i < this.COL; i++) {
            this.currentColHollowCount[i] = 0;
        }

        this.MAX_CREATE_BOARD_RETRY = 100;
        this.currentCreateBoardRetry = 0;

        this.isDestroying = false;

        this.onItemPopped = new Phaser.Signal();
        this.onBombPopped = new Phaser.Signal();

        this.popItemGroup = this.game.add.group();
        this.particleGroup = this.game.add.group();
        this.scoreParticleGroup = this.game.add.group();
    }

    createItem(x, y, itemIndex) {
        var item = new PopItem(this.game);

        var vegTarget;

        if (itemIndex !== undefined) {
            vegTarget = this.vegTypes[itemIndex];
        } else {

            var randomSuper = Math.random() * 100;
            var superItem = randomSuper < this.SUPER_ITEM_PERCENTAGE;
            if (superItem) {
                var index = Math.floor(Math.random() * this.superVegTypes.length);
                vegTarget = this.superVegTypes[index];
            } else {
                var index = Math.floor(Math.random() * this.vegTypes.length);
                vegTarget = this.vegTypes[index];
            }

        }

        item.create(vegTarget);
        item.xOffset = this.XOFFSET;
        item.yOffset = this.YOFFSET;
        item.posRow = y;
        item.posCol = x;

        this.popItemGroup.add(item);



        item.onDownSignal.add(this.itemOnClicked, this);
        return item;
    }


    recreateBoard() {
        this.isDestroying = true;
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                if (this.itemArr[i] !== undefined && this.itemArr[i] !== null) {
                    let prevItem = this.itemArr[i][j];
                    if (prevItem !== undefined && prevItem !== null) {

                        this.game.add.tween(prevItem).to({ alpha: 0 }, 300, Phaser.Easing.Quartic.Out, true, i * 50);
                        var tween = this.game.add.tween(prevItem.scale).to({ x: 1.5, y: 1.5 }, 300, Phaser.Easing.Quartic.Out, true, i * 50);
                        tween.onComplete.add(function () {
                            prevItem.destroy();
                        }, this);
                    }
                }
            }
        }

        var ref = this;
        setTimeout(function () {

            ref.createBoard();

            ref.isDestroying = false;
        }, (this.ROW * 50) + 50);

    }

    createBoard() {

        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                if (this.itemArr[i] !== undefined && this.itemArr[i] !== null) {
                    let prevItem = this.itemArr[i][j];
                    if (prevItem !== undefined && prevItem !== null) {
                        prevItem.destroy();
                    }
                }
            }
        }

        this.itemArr = [];



        for (var i = 0; i < this.ROW; i++) {
            let rowArr = [];
            for (var j = 0; j < this.COL; j++) {
                var item = this.createItem(j, i);

                rowArr.push(item);

                item.initializeSpritePos(j, i - this.ROW);
                item.updatePos();
            }
            this.itemArr.push(rowArr);
        }

        // unavailable movement test
        // var idx = 0;
        // for (var i = 0; i < this.ROW; i++) {
        //     let rowArr = [];

        //     for (var j = 0; j < this.COL; j++) {
        //         var item = this.createItem(j, i, idx);

        //         rowArr.push(item);

        //         item.initializeSpritePos(j, i - this.ROW);
        //         item.updatePos();

        //         idx++;
        //         if (idx >= this.vegTypes.length) {
        //             idx = 0;
        //         }
        //     }
        //     this.itemArr.push(rowArr);
        // }

        if (this.isMoveAvailable()) {
            console.log("Move available");
            this.currentCreateBoardRetry = 0;
        } else {
            console.log("Move unavailable");
            console.log(this.currentCreateBoardRetry);

            if (this.currentCreateBoardRetry < this.MAX_CREATE_BOARD_RETRY) {
                this.currentCreateBoardRetry++;
                this.createBoard();
            } else {
                console.log("Wow, no luck creating playable board");
                console.log("Devs, consider create hardcoded initial board");
            }
            console.log(this.currentCreateBoardRetry);
        }
    }

    itemOnClicked(popItem) {

        if (!this.inputEnabled)
            return;

        if (this.isDestroying) {
            console.log("Board is destroying. Please wait");
            return;
        }


        switch (popItem.Key) {
            case "bomb":
                console.log("BOMB CLICKED");
                this.popBomb(popItem);
                break;
            default:
                this.popAdjacents(popItem);
                break;
        }




    }


    traverseDFS(x, y, itemArr, targetPopArr) {

        if (targetPopArr === null || targetPopArr === undefined) {
            targetPopArr = [];
        }

        if (y >= 0 && y < this.ROW &&
            x >= 0 && y < this.COL) {
            var item = itemArr[y][x];
            if (item == null) {
                // console.log("Item[" + y + "]" + "[" + x + "] is null");
                return targetPopArr;
            }
            if (!targetPopArr.includes(item)) {

                let currentKey = null;
                if (targetPopArr.length > 0) {
                    currentKey = targetPopArr[0].Key;
                }
                if ((currentKey !== null && item.Key === currentKey && this.superVegTypes.indexOf(item.Key) == -1) ||
                    (currentKey === null)
                ) {

                    targetPopArr.push(item);

                    // check in four direction
                    // up 
                    this.traverseDFS(x, y - 1, itemArr, targetPopArr);
                    // down
                    this.traverseDFS(x, y + 1, itemArr, targetPopArr);
                    // left
                    this.traverseDFS(x - 1, y, itemArr, targetPopArr);

                    // right
                    this.traverseDFS(x + 1, y, itemArr, targetPopArr);
                }
            }
        }

        return targetPopArr;
    }

    reindexItems() {
        for (let i = this.ROW - 1; i >= 0; i--) {
            for (let j = 0; j < this.COL; j++) {

                // check above is hollow
                var itHollowRow = i;
                var neighbourFound = false;
                var hasHollow = false;
                while (itHollowRow >= 0 && !neighbourFound) {
                    if (this.itemArr[itHollowRow][j] == null) {
                        itHollowRow--;
                        hasHollow = true;
                    } else {
                        neighbourFound = true;
                    }
                }

                if (neighbourFound && hasHollow) {
                    var neighbour = this.itemArr[itHollowRow][j];
                    this.itemArr[i][j] = neighbour;
                    this.itemArr[itHollowRow][j] = null;

                    neighbour.posRow = i;
                    neighbour.posCol = j;
                    neighbour.updatePos();

                }
            }
        }
    }

    pushNewItems() {

        this.currentColHollowCount = [];
        for (var i = 0; i < this.COL; i++) {
            this.currentColHollowCount[i] = 0;
        }

        // count hollow on each row
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                if (this.itemArr[i][j] == null) {
                    this.currentColHollowCount[j] = this.currentColHollowCount[j] + 1;
                }
            }
        }

        console.log(this.currentColHollowCount);

        // fill with new item
        for (var itCol = 0; itCol < this.currentColHollowCount.length; itCol++) {
            var hollowCount = this.currentColHollowCount[itCol];
            for (var itHollow = 0; itHollow < hollowCount; itHollow++) {
                var item = this.createItem(itCol, itHollow);

                item.initializeSpritePos(itCol, -hollowCount);
                item.updatePos();

                this.itemArr[itHollow][itCol] = item;
            }
        }
    }

    isMoveAvailable() {
        var checkArr = [];
        var output = "";
        for (var i = 0; i < this.ROW; i++) {
            checkArr[i] = [];
            for (var j = 0; j < this.COL; j++) {
                checkArr[i][j] = this.itemArr[i][j];
                output += this.vegTypes.indexOf(this.itemArr[i][j].Key);
            }
            output += "\n";
        }
        console.log(output);


        var arr = "";
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {

                if (this.superVegTypes.indexOf(checkArr[i][j].Key) !== -1) {
                    console.log("super item:" + checkArr[i][j].Key);
                    return true;
                }

                var popArr = this.traverseDFS(j, i, checkArr);

                console.log(i + "," + j + ":" + popArr.length);

                if (popArr.length >= this.MINIMUM_MATCH)
                    return true;

            }
        }

        return false;

    }

    popAdjacents(popItem) {
        var ref = this;
        this.isDestroying = true;
        var popArr = this.traverseDFS(popItem.posCol, popItem.posRow, this.itemArr);
        if (popArr.length >= this.MINIMUM_MATCH) {
            for (var i = 0; i < popArr.length; i++) {
                let targetItem = popArr[i];
                this.itemArr[targetItem.posRow][targetItem.posCol] = null;

                this.game.add.tween(targetItem).to({ alpha: 0 }, 300, Phaser.Easing.Quartic.Out, true, i * 50);
                var tween = this.game.add.tween(targetItem.scale).to({ x: 1.5, y: 1.5 }, 300, Phaser.Easing.Quartic.Out, true, i * 50);

                tween.onStart.add(function () {
                    ref.onStartPop(targetItem);
                    ref.onItemPopped.dispatch(targetItem);
                });
                tween.onComplete.add(function () {
                    targetItem.destroy();
                }, this);
            }
        }

        setTimeout(function () {
            ref.reindexItems();
            ref.pushNewItems();

            if (ref.isMoveAvailable()) {
                console.log("Move available");
            } else {
                console.log("Move unavailable");
                console.log("RECREATE new board");
                ref.recreateBoard();
            }

            ref.isDestroying = false;
        }, (popArr.length * 50) + 50);
    }

    popBomb(popItem) {
        this.onBombPopped.dispatch();
        var ref = this;
        this.isDestroying = true;

        var bombTarget =
            [[-1, -1], [0, -1], [1, -1],
            [-1, 0], [0, 0], [1, 0],
            [-1, 1], [0, 1], [1, 1]];

        var popArr = [];

        for (var i = 0; i < bombTarget.length; i++) {
            var x = bombTarget[i][0] + popItem.posCol;
            var y = bombTarget[i][1] + popItem.posRow;

            if (x >= 0 && x < this.COL &&
                y >= 0 && y < this.ROW) {
                popArr.push(this.itemArr[y][x]);
            }
        }

        for (var i = 0; i < popArr.length; i++) {
            let targetItem = popArr[i];
            this.itemArr[targetItem.posRow][targetItem.posCol] = null;

            this.game.add.tween(targetItem).to({ alpha: 0 }, 300, Phaser.Easing.Quartic.Out, true, i * 50);
            var tween = this.game.add.tween(targetItem.scale).to({ x: 1.5, y: 1.5 }, 300, Phaser.Easing.Quartic.Out, true, i * 50);
            tween.onStart.add(function () {
                ref.onStartPop(targetItem);
                ref.onItemPopped.dispatch(targetItem);
            });
            tween.onComplete.add(function () {
                targetItem.destroy();
            }, this);
        }

        setTimeout(function () {
            ref.reindexItems();
            ref.pushNewItems();

            if (ref.isMoveAvailable()) {
                console.log("Move available");
            } else {
                console.log("Move unavailable");
                console.log("RECREATE new board");
                ref.recreateBoard();
            }

            ref.isDestroying = false;
        }, (popArr.length * 50) + 50);
    }

    onStartPop(targetItem) {
        this.showScoreParticle(targetItem.position.x, targetItem.position.y);
        this.showParticle(targetItem.position.x, targetItem.position.y);
    }

    showScoreParticle(posX, posY) {
        var nameTextOption = { font: "40px Vag", fill: "#07abf8", align: "center", wordWrap: true };
        var text = this.game.add.text(posX, posY, this.scoreMultiplier, nameTextOption);
        text.anchor.set(0.5);

        text.stroke = '#000000';
        text.strokeThickness = 6;

        this.scoreParticleGroup.add(text);

        var delay = 400;
        text.scale.set(0);
        var show = this.game.add.tween(text.scale).to({ x: 1, y: 1 }, delay, Phaser.Easing.Bounce.Out, true);
        var moveTween = this.game.add.tween(text).to({ y: posY - 50 }, 300, Phaser.Easing.Quartic.Out, true, delay);
        var alphaTween = this.game.add.tween(text).to({ alpha: 0 }, 300, Phaser.Easing.Quartic.Out, true, delay);
        alphaTween.onComplete.add(function () {
            text.destroy();
        });
    }

    showParticle(posX, posY) {
        var time = 1000;

        var emitter = game.add.emitter(posX, posY, 30);
        emitter.makeParticles("star-particle");
        emitter.gravity = 0;
        emitter.minParticleSpeed.setTo(-300, -300);
        emitter.maxParticleSpeed.setTo(300, 300);
        emitter.minParticleScale = 0.6;
        emitter.maxParticleScale = 0.75 ;
        emitter.minRotation = -500;
        emitter.maxRotation = 500;



        this.particleGroup.add(emitter);

        emitter.start(true, time, null, 5);

        emitter.forEach(function (target) {
            this.game.add.tween(target).to({ alpha: 0}, 400, Phaser.Easing.Exponential.In, true);
            this.game.add.tween(target.scale).to({ x: 0.1, y: 0.1 }, 400, Phaser.Easing.Linear.None, true);
        }, this, true);

    }

}