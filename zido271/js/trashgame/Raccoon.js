class Raccoon extends Phaser.Group {
    constructor() {
        super(game);

        this.FRAME_ELAPSED = 100;
        this.HUSH_TIME_VISIBLE = 100;

        this.raccoon01 = null;
        this.raccoon02 = null;
        this.hush = null;

        this.moveTween = null;

        this.onDownSignal = new Phaser.Signal();

        this.elapsedTime = 0;
        this.currentFrame = 0;
        this.hushedTime = 0;

        this.isHushed = false;

        this.broughtTrash = null;


        this.stepSound = null;
        this.smallStepSound = null
        this.slapSound = null;
        this.pickedTrashSound = null
    }

    create() {
        this.raccoon01 = this.game.add.sprite(0, 0, "raccoon-01");
        this.raccoon01.anchor.set(0.5);

        this.raccoon02 = this.game.add.sprite(0, 0, "raccoon-02");
        this.raccoon02.anchor.set(0.5);

        this.hush = this.game.add.sprite(0, 0, "hush");
        this.hush.anchor.set(0.5);

        this.hush.visible = false;

        this.raccoon01.inputEnabled = true;
        this.raccoon01.events.onInputDown.add(this.onDown, this);
        this.raccoon01.events.onInputUp.add(this.onUp, this);

        this.raccoon02.inputEnabled = true;
        this.raccoon02.events.onInputDown.add(this.onDown, this);
        this.raccoon02.events.onInputUp.add(this.onUp, this);


        this.add(this.raccoon01);
        this.add(this.raccoon02);
        this.add(this.hush);

        this.stepSound = this.game.add.sound("jump");
        this.smallStepSound = this.game.add.sound("pick-up");
        this.slapSound = this.game.add.sound("slap");
        this.pickedTrashSound = this.game.add.sound("break-branch");
    }

    moveTo(posX, posY, time, delay, onComplete) {
        // this.speed = speed;

        if (this.moveTween != null) {
            this.moveTween.stop();
        }
        // var deltaX = this.position.x - posX;
        // var deltaY = this.position.y - posY;
        // var distance = (deltaX * deltaX) + (deltaY * deltaY);
        // var duration = distance / this.speed;
        var duration = time;
        this.moveTween = this.game.add.tween(this).to({ x: posX, y: posY }, duration, Phaser.Easing.Linear.None, true, delay);
        this.moveTween.onUpdateCallback(this.onMoving, this);
        this.moveTween.onComplete.add(function () {
            if (onComplete != null) {
                onComplete();
                this.moveTween.onComplete.remove(onComplete);
            }
        }, this);
    }

    onMoving() {
        this.elapsedTime += this.game.time.elapsed;

        if (this.elapsedTime >= this.FRAME_ELAPSED) {
            this.elapsedTime = 0;

            this.currentFrame++;

            this.onFrameChanged();
        }

        if (this.currentFrame > 1) {
            this.currentFrame = 0;
        }

        if (this.currentFrame == 0) {
            this.raccoon01.visible = true;
            this.raccoon02.visible = false;
        } else {
            this.raccoon02.visible = true;
            this.raccoon01.visible = false;
        }

        if (this.isHushed) {
            this.hushedTime += this.game.time.elapsed;
            if (this.hushedTime > this.HUSH_TIME_VISIBLE) {
                this.hush.visible = false;
                this.hushedTime = 0;
            }
        }
    }


    onDown() {
        this.hushedTime = 0;
        this.hush.visible = true;
        this.isHushed = true;
        this.onDownSignal.dispatch();
        this.onHushed();
    }

    onUp() {
        // this.hush.visible = false;
    }

    createBroughtTrash(trashKey) {
        this.broughtTrash = this.game.add.sprite(-50, -10, trashKey);
        this.broughtTrash.anchor.set(0.5);
        this.add(this.broughtTrash);

        this.broughtTrash.scale.set(0.5, 0.1);
        this.game.add.tween(this.broughtTrash.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Bounce.Out, true);

        this.pickedTrashSound.play();
    }

    destroyBroughtTrash() {
        if (this.broughtTrash != null) {
            this.broughtTrash.destroy();
        }
    }

    onFrameChanged() {
        if (!this.isHushed) {
            this.stepSound.play();
        } else {
            this.smallStepSound.play();
        }
    }

    onHushed() {
        this.slapSound.play();
    }

    reset() {
        this.isHushed = false;
    }
}