// contains several sprites
class Food {

    constructor(game, x, y) {
        this._game = game;

        this._sliceMarks = [];
        this._foodParts = [];
        this._partConnections = [];

        this._foodPartsPositions = [];

        this._slicer = null;

        this.onClear = new Phaser.Signal();

        this.position = { x: x, y: y };

        this._currentActiveSliceIndex = 0;

        this.onSliced = new Phaser.Signal();
    }

    init() {
        var ref = this;
        for (var i = 0; i < this._sliceMarks.length; i++) {
            let sliceMark = this._sliceMarks[i];
            sliceMark.init();

            sliceMark.onSliced.add(function (data) {

                console.log("sliced intersections" + data.IntersectedConnections);
                ref.removeConnections(data.IntersectedConnections)

                let startXPos = sliceMark._startPos.x;
                let startYPos = sliceMark._startPos.y;
                let endXPos = sliceMark._endPos.x;
                let endYPos = sliceMark._endPos.y;

                let xPos = startXPos + ((endXPos - startXPos) / 2);
                let yPos = startYPos + ((endYPos - startYPos) / 2);

                console.log(sliceMark.id + "====x:" + xPos + ",y:" + yPos)
                
                ref.createParticles(xPos, yPos);

                ref.onSliced.dispatch();
            });
        }

        // mark only first index
        this.setActiveSliceMarkAt(this._currentActiveSliceIndex);
    }

    createParticles(xPos, yPos) {

        this.emitter = this._game.add.emitter(xPos, yPos, 30);
        this.emitter.makeParticles("star-particle");
        this.emitter.gravity = 500;
        this.emitter.minParticleSpeed.setTo(-500, -500);
        this.emitter.maxParticleSpeed.setTo(500, 500);
        this.emitter.minParticleScale = 0.5;
        this.emitter.maxParticleScale = 0.75;

        this.emitter.start(true, 1000, null, 30);
    }

    updateActiveSliceMark() {
        this._currentActiveSliceIndex++;
        this.setActiveSliceMarkAt(this._currentActiveSliceIndex);
    }

    setGroup(group) {
        var ref = this;
        for (var i = 0; i < this._foodParts.length; i++) {
            group.add(this._foodParts[i]);
        }

        for (var i = 0; i < this._sliceMarks.length; i++) {
            this._sliceMarks[i].setGroup(group);
        }
    }

    loadFoodData(data) {

        var foodParts = data.parts;
        var connections = data.connections;
        var sliceMarks = data.sliceMarks;

        // create sprite
        for (var i = 0; i < foodParts.length; i++) {
            var foodPart = foodParts[i];
            var xPos = foodPart.position.x + this.position.x;
            var yPos = foodPart.position.y + this.position.y;

            var partSprite = this._game.add.sprite(xPos, yPos, foodPart.sprite);
            partSprite.scale.set(foodPart.scale);

            // if (i % 2 == 0) {
            //     partSprite.alpha = 0.5;
            // }

            // add part to list
            this.addFoodPart(partSprite, foodPart.id);

            this._foodPartsPositions.push(foodPart.position);
        }

        // create connections
        for (var i = 0; i < connections.length; i++) {
            var connection = connections[i];

            var connectionSourceArr = this.getFoodParts(connection.sources);
            var connectionTargetArr = this.getFoodParts(connection.targets);

            var partConnectionObject = new PartConnection(connection.id, connectionSourceArr, connectionTargetArr);

            this.addConnection(partConnectionObject);
        }

        // create slicemarks
        for (var i = 0; i < sliceMarks.length; i++) {
            var sliceMark = sliceMarks[i];
            var startPos = { x: sliceMark.startPos.x + this.position.x, y: sliceMark.startPos.y + this.position.y };
            var endPos = { x: sliceMark.endPos.x + this.position.x, y: sliceMark.endPos.y + this.position.y };
            var intersectedConnections = sliceMark.intersectedConnections;

            var sliceMarkObject = new SliceMark(this._game, startPos, endPos);
            sliceMarkObject.setId(sliceMark.id);
            sliceMarkObject.setIntersectedConnections(this.getConnections(intersectedConnections));

            this.addSliceMark(sliceMarkObject);
        }
    }

    setActiveSliceMarkAt(sliceMarkIndex) {
        // set only selected slice mark is active
        for (var i = 0; i < this._sliceMarks.length; i++) {
            if (i == sliceMarkIndex) {
                this._sliceMarks[i].setActive(true);
            } else {
                this._sliceMarks[i].setActive(false);
            }
        }
    }

    setInteractable(value) {
        if (value) {
            console.log("CURRENT ACTIVE" + this._currentActiveSliceIndex);
            this.setActiveSliceMarkAt(this._currentActiveSliceIndex);
        } else {
            for (var i = 0; i < this._sliceMarks.length; i++) {
                this._sliceMarks[i].setActive(false);
            }
        }
    }

    getFoodParts(partIdArray) {
        var foodParts = [];
        for (var i = 0; i < partIdArray.length; i++) {
            var searchId = partIdArray[i];
            var isFound = false;
            var itFoodParts = 0;
            while (itFoodParts < this._foodParts.length && !isFound) {
                var foodSprite = this._foodParts[itFoodParts];
                if (foodSprite.id === searchId) {
                    foodParts.push(foodSprite);
                    isFound = true;
                }

                itFoodParts++;
            }
        }

        return foodParts;
    }

    getConnections(connectionIdArray) {
        var connections = [];
        for (var i = 0; i < connectionIdArray.length; i++) {
            var searchId = connectionIdArray[i];
            var isFound = false;
            var itConnection = 0;

            while (itConnection < this._partConnections.length && !isFound) {
                var connection = this._partConnections[itConnection];
                if (connection.id === searchId) {
                    connections.push(connection);
                    isFound = true;
                }

                itConnection++;
            }
        }
        return connections;
    }

    // set knife that hit upon to
    setSlicer(slicer) {
        this._slicer = slicer;
    }

    addFoodPart(sprite, id) {
        sprite.id = id;
        this._foodParts.push(sprite);
    }

    addConnection(partConnection) {
        this._partConnections.push(partConnection);
    }

    addSliceMark(sliceMark) {
        this._sliceMarks.push(sliceMark);
    }

    removeConnections(connectionArr) {
        for (var i = 0; i < connectionArr.length; i++) {
            var connection = connectionArr[i];

            // var xPos = CusRand.randomRange(-10, 10);
            // var yPos = CusRand.randomRange(-10, 10);
            var xPos = CusRand.randomRange(-20, -10);
            var yPos = 0;
            connection.addSourceOffset(xPos, yPos);

            var angle = CusRand.randomRange(-10, 10);

            connection.addSourceAngle(angle);

            this._partConnections.splice(this._partConnections.indexOf(connection), 1);
        }

        this.updateConnectionCount();
    }

    update() {
        for (var i = 0; i < this._sliceMarks.length; i++) {
            this._sliceMarks[i].checkHit(this._slicer);
        }
    }

    tween(endPos, time = 100, delay = 0) {
        this.setInteractable(false);

        for (var i = 0; i < this._foodParts.length; i++) {

            var foodPartPos = this._foodPartsPositions[i];
            var targetXPos = foodPartPos.x + endPos.x;
            var targetYPos = foodPartPos.y + endPos.y;


            var foodPart = this._foodParts[i];
            var tween = this._game.add.tween(foodPart).to({ x: targetXPos, y: targetYPos }, time, Phaser.Easing.Quartic.InOut, true, delay);
            tween.onComplete.add(function () {
                console.log("COMPLETE");
            });

        }

        var ref = this;
        setTimeout(function () {
            // update positions

            var deltaX = endPos.x - ref.position.x;
            var deltaY = endPos.y - ref.position.y;

            ref.position.x = endPos.x;
            ref.position.y = endPos.y;

            for (var i = 0; i < ref._sliceMarks.length; i++) {
                let sliceMark = ref._sliceMarks[i];
                sliceMark.addOffset({ x: deltaX, y: deltaY });
            }


            ref.setInteractable(true);

        }, time);

    }

    render() {
        for (var i = 0; i < this._sliceMarks.length; i++) {
            this._sliceMarks[i].render();
        }
    }

    updateConnectionCount() {
        var connectionCount = this._partConnections.length;

        this.updateActiveSliceMark();

        if (connectionCount <= 0) {
            this.onConnectionClear();
        }
    }

    onConnectionClear() {
        this.onClear.dispatch();
    }

    clear() {
        // remove food parts
        for (var i = 0; i < this._foodParts.length; i++) {
            this._foodParts[i].destroy();
        }

        // remove slice marks
        for (var i = 0; i < this._sliceMarks.length; i++) {
            this._sliceMarks[i].clear();
        }
    }

}