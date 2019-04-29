Trash = function(x, y, frameName){
	Phaser.Sprite.call(this, game, x, y, 'ingame');

	this.frameName = 'ingame/' + frameName;

	this.isTrash = true
	if(frameName == "stone") this.isTrash = false;

	this.anchor.setTo(0.5);

	this.enableBody = false;
	this.init();
};

Trash.inherit({
	init:function(){
		this.inScreen = false
		var minX = -this.width * 0.5;
		var maxX = curState().gw + this.width;
		var minY = curState().gh * 0.3;
		var maxY = curState().gh * 0.7;
		var minDist = curState().gw * 0.7;
	    this.speed = minDist;
		var toAngle = null;
		while(toAngle == null){
			var tempX = game.rnd.realInRange(minX, maxX);
			var tempY = game.rnd.realInRange(minY, maxY);
			var tempDist = game.math.distance(this.x, this.y, tempX, tempY);
			if(tempDist >= minDist){
				toAngle = game.math.angleBetween(this.x, this.y, tempX, tempY)
			}
		}

		var angle = game.math.radToDeg(toAngle);
		this.toAngle = angle + 90

		// console.log(angle)
		// var rndmX = game.rnd.realInRange()
	},

	createPhysic:function(){
		game.physics.p2.enable(this, curState().debugPhysic);
	    this.body.damping = 0.2;
	    // this.body.collideWorldBounds = false;
	    var radius = this.width * 0.5;
	    if(this.height > this.width) radius = this.height * 0.5
	    this.body.setCircle(radius)
	    this.body.setMaterial(curState().trashMaterial);

	    this.body.kinematic = true;
	    this.body.angle = this.toAngle;
		// console.log('trash made', this.toAngle, this.body.angle)
		var speed = game.rnd.realInRange(500, 600)
	    this.body.moveForward(speed)
	    this.body.angularDamping = 0.5;
	    this.body.angularVelocity  = 8;
	},

	checkCatch:function(){
		if(!this.body) return;
		var thisBound = this.getBounds();
		var circle = new Phaser.Circle(thisBound.centerX, thisBound.centerY, this.width * 0.4)
		var runnerBound = curState().runnerImg.getBounds();
		var intersect = Phaser.Circle.intersectsRectangle(circle, runnerBound)
		if(intersect){
			// game.physics.p2.removeBody(this.body)
			this.body.destroy();

			var tween = game.add.tween(this.scale);
			tween.to({x:0, y:0}, 100);

			if(this.isTrash){
				this.catched();

				tween.onComplete.add(function(){
					curState().gGround.trashes[this.idx] = null;
					this.destroy();
				}, this);
			} else {
				curState().runner.petrified = true;
				curState().runner.body.setZeroVelocity();
				curState().runner.body.moveDown(this.speed)
				curState().showTime.oriFill = curState().showTime.fill;
				curState().showTime.fill = 'red';
				curState().plLife--;
				if(curState().plTime > 1){
					curState().plTime -= 10;
					if(curState().plTime <= 0){
						curState().plTime = 0.1;
					}
				}

				var runner = curState().runnerImg
				runner.animations.stop(runner.animations.currentAnim.name);
				runner.frameName = 'ingame/chara-fail';
				game.time.events.add(500, function(){
					curState().runnerImg.animations.play('idle')
					this.petrified = false;
					curState().showTime.fill = curState().showTime.oriFill;
					if(curState().plLife <= 0){
						curState().gameEnd();
					}
				}, curState().runner);
			} 

			tween.start();
		}	
	},

	catched:function(){
		// CustomStorage.data.score
		curState().score += 100;
        curState().gGround.gEmitter.x = this.x;
        curState().gGround.gEmitter.y = this.y;

        curState().gGround.gEmitter.start(true, 300, null, 20);
	},

	update:function(){
		if(!this.enableBody){
			this.enableBody = true;
			this.createPhysic();
		}

		var worldBound = new Phaser.Rectangle(0, 0, game.width, game.height);
		var thisBound = this.getBounds()
		var inBound = worldBound.containsRect(thisBound);
		if(!this.inScreen){
			if(inBound){
				this.inScreen = true;
			}
		} else {
			var intersect = worldBound.intersects(thisBound)
			if(!intersect){
				curState().gGround.trashes[this.idx] = null;
				this.destroy();
			}
		}

		this.checkCatch();
	}
}, Phaser.Sprite)