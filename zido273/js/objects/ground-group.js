GroundGroup = function(x, y){
	Phaser.Group.call(this, game);
	this.x = x;
	this.y = y;
	this.speed = 5;
	this._speed = this.speed;
	this.isRunning = false;

	this.init();
};

GroundGroup.inherit({
	init:function(){
		this.gGround = game.add.group();
		this.add(this.gGround);

        this.gEmitter = new CorrectBurst(0, 0, 100);
        this.add(this.gEmitter);

		this.enablePhysic = false;
		this.grounds = [];
		this.trashes = [];
		this.collectibles = [];
		this.airVertices = [{x: -121.50, y: -37.50},{x: 121.50, y: -37.50},{x: 101.63, y: 37.50},{x: -104.22, y: 36.64}];

		this.curCount = 0;
		this.maxCount = game.rnd.realInRange(1, 3)
		this.fromX = 1;

		this.createUnderGround();
		this.createFlyingGround();
		// this.createTrash(curState().gw + 100, curState().centerY)
	},

	createUnderGround:function(){
		for(var a = 0; a < 8; a++){
			var ground = this.createGround(0, 0, 'ground-tile');
			ground.x = (ground.width * 0.5) + (ground.width * a);
			ground.y = curState().gh - (ground.height * 0.5);
			ground.isFlying = false;
			this.gGround.add(ground);

			this.grounds.push(ground)
		}
	},

	createFlyingGround:function(){
		var runnerImg = curState().runnerImg;
		var runner = curState().runner;
		var pickY = [0,1]
		for(var a = 0; a < 2; a++){
			var ground = this.createGround(0, 0, 'ground-air');
			ground.isFlying = true;
			// var minX = (curState().centerX * a) + (ground.width * 0.5);
			var minX = runnerImg.x + (runnerImg.width * 0.5) + (ground.width * 0.6) + ((curState().centerX + (ground.width * 0.5)) * a)
			var maxX = (curState().centerX * (a + 1)) - (ground.width)
			var rndX = game.rnd.realInRange(minX, maxX)

			if(a == 1){
				var prev = this.grounds.length - 1;
				var prevGround = this.grounds[prev];
				var diff = game.math.distance(prevGround.x, prevGround.y, rndX, prevGround.y);
				if(diff - ground.width > runnerImg.width){
					var newDiff = diff - ground.width;
					while(newDiff > this.speed){
						rndX -= runnerImg.width;
						var tempDist = game.math.distance(prevGround.x, prevGround.y, rndX, prevGround.y);
						newDiff = tempDist - ground.width;
						if(newDiff < runnerImg.width){
							var diffSpeed = runnerImg.width - newDiff;
							rndX += diffSpeed;
						}
					}
				}
			}

			var idx = game.rnd.integerInRange(0, pickY.length - 1);
			var upDown = pickY[idx]
			pickY.splice(idx,1);

			var groundBelow = this.grounds[0];
			var minY = (groundBelow.y - (groundBelow.height * 0.5) - (ground.height * 1.5));
			var maxY = minY - ((runner.height + (ground.height * 0)) * upDown)
			var rndY = game.rnd.realInRange(minY, maxY);
			ground.x = rndX;
			ground.y = maxY
			this.gGround.add(ground)

			this.grounds.push(ground)
		}
	},

	createGround:function(x, y, frameName){
		var ground = global.addSprite(x, y, 'ingame/' + frameName);
		ground.anchor.setTo(0.5);
		return ground;
	},

	createTrash:function(x, y){
		// console.log('makin trash')
		x = x ? x : 0;
		y = y ? y : 0;

		var frameName = 'thing-0';
		var rnd = game.rnd.realInRange(0, 100)
		// rnd = 90
		if(rnd <= 80){
			var names = game.rnd.integerInRange(1, 6)
			frameName = frameName + names;
		} else {
			frameName = 'stone'
		}
		var trash = new Trash(x, y, frameName);
		trash.idx = this.trashes.length;
		this.gGround.add(trash);

		this.trashes.push(trash);
	},

	createEmitter:function(obj){
		var pos = new Phaser.Point(obj.x, obj.y)
		var globalPos = obj.parent.toGlobal(pos);
		var localPos = this.gEmitter.parent.toLocal(globalPos);
		this.gEmitter.x = localPos.x;
		this.gEmitter.y = localPos.y;

		this.gEmitter.start(true, 500, null, 10);

		obj.destroy();
	},

	activatePhysic:function(){
		for(var a = 0; a < this.grounds.length; a++){
			var ground = this.grounds[a];
			if(!ground || ground.body) continue;
			game.physics.p2.enable(ground, curState().debugPhysic);
			if(ground.isFlying){
				ground.body.clearShapes();
				ground.body.addPolygon({}, [0.00,0.00, 243.00,0.00, 217.51,73.11, 21.71,71.2])
				// console.log(ground.body)
			}
			ground.body.kinematic = true;
			ground.body.setMaterial(curState().groundMaterial)
			ground.body.setCollisionGroup(curState().objectGroup);
		    ground.body.collides(curState().runnerGroup)
		}
	},

	checkRunner:function(){
		for(var a = 0; a < this.grounds.length; a++){
			var ground = this.grounds[a];
			if(!ground || !ground.alive || !ground.body || !ground.isFlying) continue;
			var runner =  curState().runner;
			if(runner.y - (runner.height * 0.5) > ground.y - (ground.height * 0.5)){
				game.physics.p2.removeBody(ground.body);
			} else if(runner.y + (runner.height * 0.5) < ground.y - (ground.height * 0.5)){
				game.physics.p2.addBody(ground.body);
			}
		}
	},

	update:function(){
		if(!this.enablePhysic){
			this.enablePhysic = true
			this.activatePhysic();
			// this.isRunning = true;
		}

		for(var a = 0; a < this.trashes.length; a++){
			var trash = this.trashes[a];
			if(trash && trash.exists){
				trash.update();
			}
		}

		this.gEmitter.update();

		if(this.isRunning){
			// this.moveGround();
		}

		if(!curState().gameStart) return
		if(curState().gamePaused || curState().gameOver) return;
		var countMs = game.time.physicsElapsedMS * 0.001;
		if(this.curCount < this.maxCount){
			this.curCount += countMs;
			if(this.curCount >= this.maxCount){
				var gap = 100;
				var x = -(gap) + (this.fromX * gap) + (this.fromX * (curState().gw + gap));
				var y =  game.rnd.realInRange(0, curState().gh * 0.7);
				this.createTrash(x, y)

				var tempMax = game.rnd.realInRange(1, 3)
				if(curState().plTime - tempMax > 0){
					this.curCount = 0;
					this.maxCount = tempMax;

					var pickSide = game.rnd.pick([0,1]);
					this.fromX = pickSide;
					if(this.fromX == 0){
						curState().rainCurtain.scale.x = -1;
					} else {
						curState().rainCurtain.scale.x = 1;
					}
				}
			}
		}

		this.checkRunner();

		if(this.speed != this._speed){
			this._speed = this.speed;
		}
	}
}, Phaser.Group)