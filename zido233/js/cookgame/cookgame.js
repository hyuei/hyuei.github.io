class CookGame {
    constructor(game) {
        this._foods = [];

        this._game = game;

        this._slicer = null;

        this._foodData = new FoodData();
        this._bonusFoodData = new BonusFoodData();


        this.food = null;

        this._bonuses = [];
        this._splittedBonuses = [];

        this.isInteractable = true;

        this._bonusTypes = [
            this._bonusFoodData.TOMATO,
            this._bonusFoodData.ONION,
            this._bonusFoodData.CHILLI,
            this._bonusFoodData.CINNAMON,
            this._bonusFoodData.PAPRIKA];

        this._foodTypes = [
            this._foodData.MEAT,
            this._foodData.BAWANG_DAUN,
            this._foodData.CARROT,
            this._foodData.FISH,
            this._foodData.LOBAK
        ];

        this.OnScoreAdded = new Phaser.Signal();

        this.bonusCount = 0;

    }

    init() {
        this.playerScore = 0;

        this._game.input.addPointer();

        this._foodGroup = this._game.add.group();
        this._bonusGroup = this._game.add.group();

        this._slicer = this._game.add.sprite(500, 200, "circle");
        this._slicer.scale.set(5);
        this._slicer.alpha = 0;
        this._game.physics.enable(this._slicer, Phaser.Physics.ARCADE);
        this._slicer.body.kinematic = true;

        this._isFoodSpawned = false;

        this.sliceSound = this._game.add.audio("knife-cut", true);

        this.spawnFood();
    }

    setScore(score) {
        this.playerScore = score;
    }

    addScore(delta) {
        this.playerScore += delta;

        this.OnScoreAdded.dispatch(this.playerScore);
    }

    setInteractable(value) {
        this.isInteractable = value;
    }

    spawnFood() {

        // testing spawn food
        // this.food = new Food(this._game, 250, 170);
        this.food = new Food(this._game, 1000, 170);

        this.food.loadFoodData(this.getRandomFoodModel());

        this.food.init();

        this.food.setGroup(this._foodGroup);

        this.food.setSlicer(this._slicer);
        this.food.tween({ x: 250, y: 170 }, 500);

        this._isFoodSpawned = true;

        // action when food cleared
        var ref = this;
        this.food.onClear.add(function () {

            ref.addScore(1);

            var outTime = 500;
            var delayTime = 250;
            ref.food.tween({ x: -1000, y: 170 }, outTime, delayTime);

            setTimeout(function () {
                ref.food.clear();
                ref.spawnBonuses(function () { ref._isFoodSpawned = false; });
            }, outTime + delayTime);
        });

        this.food.onSliced.add(function () {
            ref.sliceSound.play();
        });
    }

    moveFoodOut() {
        if (this.food !== null)
            this.food.tween({ x: -1000, y: 170 }, 1000, 0);
    }

    spawnBonusFood(bonusFoodModel, startPos, velocity, gravity) {
        var bonusFood = this._game.add.sprite(startPos.x, startPos.y, bonusFoodModel.whole);
        bonusFood.scale.set(0.35);

        bonusFood.bonusFoodModel = bonusFoodModel;

        this._game.physics.enable(bonusFood, Phaser.Physics.ARCADE);
        bonusFood.body.velocity.x = velocity.x;
        bonusFood.body.velocity.y = velocity.y;

        if (velocity.x < 0) {
            bonusFood.body.angularVelocity = CusRand.randomRange(-100, -150);
        } else {
            bonusFood.body.angularVelocity = CusRand.randomRange(100, 150);
        }
        bonusFood.body.gravity.y = gravity;

        this._bonuses.push(bonusFood);
    }

    createParticles() {
        this.emitter = game.add.emitter(this.game.world.centerX, this.game.world.centerY, 30);
        this.emitter.makeParticles("star-particle");
        this.emitter.gravity = 500;
        this.emitter.minParticleSpeed.setTo(-500, -500);
        this.emitter.maxParticleSpeed.setTo(500, 500);
        this.emitter.minParticleScale = 0.5;
        this.emitter.maxParticleScale = 0.75;

        this.group.add(this.emitter);
    }

    getRandomBonusModel() {
        var randomIndex = Math.ceil(Math.random() * this._bonusTypes.length - 1);
        return this._bonusTypes[randomIndex];
    }

    getRandomFoodModel() {
        var randomIndex = Math.ceil(Math.random() * this._foodTypes.length - 1);
        return this._foodTypes[randomIndex];
    }

    spawnBonusPos(indexPos) {
        console.log("bonus pos spawn: " + indexPos);
        if(indexPos == 0 ) {
            this.spawnBonusFood(this.getRandomBonusModel(), { x: 0, y: 500 }, { x: 550, y: -1200 }, 1500), CusRand.randomRange(1000, 1000);
        }else if(indexPos == 1) {
            this.spawnBonusFood(this.getRandomBonusModel(), { x: 900, y: 500 }, { x: -550, y: -900 }, 1500), CusRand.randomRange(100, 1200);
        }else if(indexPos == 2) {
            this.spawnBonusFood(this.getRandomBonusModel(), { x: 300, y: 500 }, { x: 250, y: -1300 }, 1500), CusRand.randomRange(200, 1500);
        }
    }

    spawnBonuses(onSpawned) {

        this.bonusCount = 0;
        var ref = this;

        var pos = [0, 1, 2];
        for (var i = 0; i < pos.length; i++) {
            let randIndex = Math.random * pos.length;
            var tmp = pos[randIndex];
            pos[randIndex] = pos[i];
            pos[i] = tmp;
        }

        for (let i = 0; i < pos.length; i++) {
            setTimeout(function() { ref.spawnBonusPos(i);}, i * 550 + (Math.random() * 500));

            this.bonusCount++;
        }

        onSpawned();
    }

    update() {

        if (this._game.input.activePointer.isMouse) {
            this._slicer.body.x = this._game.input.mousePointer.x;
            this._slicer.body.y = this._game.input.mousePointer.y;
        } else {
            this._slicer.body.x = this._game.input.pointer1.x;
            this._slicer.body.y = this._game.input.pointer1.y;
        }
        if (this.isInteractable) {
            this.food.update();
            this.checkBonusOutBound();
            this.checkBonusHitSlicer();
        }

        this.checkSplittedBonusOutBound();

    }

    checkBonusOutBound() {
        // check hit ground
        for (var i = this._bonuses.length - 1; i >= 0; i--) {
            var bonus = this._bonuses[i];

            if (bonus != null) {
                if (bonus.position.y >= this._game.height) {
                    this._bonuses.splice(this._bonuses.indexOf(bonus), 1);
                    this.bonusCount--;
                }
            }
        }
    }

    checkBonusHitSlicer() {

        var isPointerDown = false;

        if (this._game.input.activePointer.isMouse) {
            isPointerDown = this._game.input.mousePointer.isDown;
        } else {
            isPointerDown = this._game.input.pointer1.isDown;
        }

        var ref = this;
        // check hit ground
        for (var i = this._bonuses.length - 1; i >= 0; i--) {
            var bonus = this._bonuses[i];
            if (bonus != null) {
                if (isPointerDown) {
                    this._game.physics.arcade.overlap(this._slicer, bonus, function (a, b) {
                        ref._bonuses.splice(ref._bonuses.indexOf(bonus), 1);
                        ref.spawnSplittedBonus(bonus.bonusFoodModel, bonus.position.x, bonus.position.y);

                        bonus.destroy();

                        ref.addScore(1);
                        ref.sliceSound.play();
                        ref.bonusCount--;
                    });
                }
            }
        }
    }

    spawnSplittedBonus(bonusFoodModel, x, y) {
        console.log(bonusFoodModel.parts);
        for (var i = 0; i < bonusFoodModel.parts.length; i++) {
            var splittedBonus = this._game.add.sprite(x, y, bonusFoodModel.parts[i]);
            splittedBonus.scale.set(1);
            this._game.physics.enable(splittedBonus, Phaser.Physics.ARCADE);
            splittedBonus.body.gravity.y = 1500;

            var direction = Math.random();
            if (direction < 0.5) {
                splittedBonus.body.velocity.x = CusRand.randomRange(-700, -600);
                splittedBonus.body.angularVelocity = 200;
            } else {
                splittedBonus.body.velocity.x = CusRand.randomRange(600, 700);
                splittedBonus.body.angularVelocity = -200;
            }
            splittedBonus.body.velocity.y = CusRand.randomRange(-300, -250);



            this._splittedBonuses.push(splittedBonus);
        }
    }

    checkSplittedBonusOutBound() {
        // check hit ground
        for (var i = this._splittedBonuses.length - 1; i >= 0; i--) {
            var splittedBonus = this._splittedBonuses[i];

            if (splittedBonus != null) {
                if (splittedBonus.position.y >= this._game.height) {
                    this._splittedBonuses.splice(this._splittedBonuses.indexOf(splittedBonus), 1);
                }
            }
        }


        if (!this._isFoodSpawned) {
            if (this._splittedBonuses.length <= 0 && this._bonuses.length <= 0 && this.bonusCount <= 0) {
                this.spawnFood();
            }
        }
    }


    render() {

        this.food.render();
    }
}