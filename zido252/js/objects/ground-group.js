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
		this.gClound = game.add.group();
		this.add(this.gClound);

		this.gTree = game.add.group();
		this.add(this.gTree);

		this.gBush = game.add.group();
		this.add(this.gBush);

		this.gGround = game.add.group();
		this.add(this.gGround);

        this.gEmitter = new CorrectBurst(0, 0, 100);
        this.add(this.gEmitter);

		this.normalGrounds = [];
		this.enablePhysic = false;
		this.grounds = [];
		this.bushes = [];
		this.trees = [];
		this.clouds = [];
		this.collectibles = [];

		for(var a = 0; a < 20; a++){
			var isFloating = false;
			var pos = game.rnd.realInRange(1, 100);
			if(pos >= 75) isFloating = true;
			if(a < 8) isFloating = false;
			if(a > 2){
				if(isFloating){
					var prevGround = this.grounds[a-1];
					var prev2Ground = this.grounds[a-2];
					if(!prevGround.isFloating && prev2Ground.isFloating){
						isFloating = false;
					}
				}
			}
			this.addGround(isFloating)
		}

		for(var a = 0; a < 5; a++){
			this.createCloud();
		}
	},

	addGround:function(isFloating){
		var y = curState().gh;
		var frameName = 'tile'
		if(isFloating) {
			y = curState().gh * 0.55;
			frameName = 'flying-tile'
			this.normalGrounds = [];
		}

		var ground = this.createGround(0, y, frameName)
		ground.isFloating = isFloating;

		var sideGround = null;
		var lastGround = this.grounds[this.grounds.length - 1];
		var x = 0;
		if(lastGround){
			x = lastGround.x + (lastGround.width * 0.5)
			if(!lastGround.isFloating && isFloating){
				x += (lastGround.width * 2);

				var sideX = lastGround.x + (lastGround.width * 0.5);
				var sideY = lastGround.y;
				sideGround = global.addSprite(sideX, sideY, 'ingame/tile-end');
				sideGround.anchor.setTo(0.5);
				sideGround.x += sideGround.width * 0.5;

				ground.x = x + ground.width * 0.5;
				ground.y -= ground.height * 0.5;
			} else if(lastGround.isFloating && !isFloating){
				x += (ground.width * 2)
				ground.x = x + ground.width * 0.5;
				ground.y -= ground.height * 0.5;

				var sideX = ground.x - (ground.width * 0.5);
				var sideY = ground.y;
				sideGround = global.addSprite(sideX, sideY, 'ingame/tile-end2');
				sideGround.anchor.setTo(0.5);
				sideGround.x -= sideGround.width * 0.5;
				// sideGround.scale.x = -1;
			} 
		} 

		if(sideGround){
			sideGround.isFloating = true
			this.grounds.push(sideGround)
			this.gGround.add(sideGround)
		} else {			
			ground.x = x + ground.width * 0.5;
			ground.y -= ground.height * 0.5;
		}

		this.gGround.add(ground);
		this.grounds.push(ground)

		if(!isFloating){
			this.normalGrounds.push(ground);
			if(this.normalGrounds.length == 3){
				this.decideBush(this.normalGrounds[1]);	
				this.normalGrounds = [];
			} else if(this.normalGrounds.length == 2){
				this.decideTree(this.normalGrounds[1])
			}
		}

		var rndmItem = game.rnd.realInRange(1, 100);
		if(rndmItem > 50 && this.grounds.length > 5){
			this.createCollectible(ground.x, ground.y - (ground.height * 0.5))
		}
	},

	decideBush:function(ground){
		var rndBush = game.rnd.realInRange(0, 100);
		if(rndBush > 30){
			this.createBush(ground.x, ground.y - (ground.height * 0.5))
		}
	},

	decideTree:function(ground){
		var rndTree = game.rnd.realInRange(0, 100)
		if(rndTree > 10){
			this.createTree(ground.x - (ground.width * 0.5), ground.y - (ground.height * 0.5))
		}
	},

	createBush:function(x, y){
		var bushId = game.rnd.integerInRange(1, 3)
		var spriteName = 'ingame/bg-bush-' + bushId
		var bush = global.addSprite(x, y, spriteName);
		bush.anchor.setTo(0.5, 1);
		this.gBush.add(bush);

		this.bushes.push(bush);
	},

	createTree:function(x, y){
		var treeId = game.rnd.integerInRange(1, 3)
		var spriteName = 'ingame/bg-tree-' + treeId;
		var tree = global.addSprite(x, y, spriteName);
		tree.anchor.setTo(0.5, 1);
		this.gTree.add(tree);

		this.trees.push(tree)
	},

	createCloud:function(){
		if(this.clouds.length == 0){
			var x = game.rnd.realInRange(1, curState().gw * 0.15);			
		} else {
			var prevCloud = this.clouds[this.clouds.length - 1];
			var minX = prevCloud.x + (prevCloud.width * 1.1);
			var maxX = minX + (curState().gw * 0.15)
			var x = game.rnd.realInRange(minX, maxX)
		}

		var minY = curState().gh * 0.1;
		var maxY = curState().gh * 0.5;
		var y = game.rnd.realInRange(minY, maxY);

		var cloud = global.addSprite(x, y, 'ingame/bg-cloud');
		cloud.anchor.setTo(0.5);
		this.gClound.add(cloud);

		this.clouds.push(cloud)
	},

	createGround:function(x, y, frameName){
		var ground = global.addSprite(x, y, 'ingame/' + frameName);
		ground.anchor.setTo(0.5);
		return ground;
	},

	createCollectible:function(x, y){
		var id = game.rnd.pick([1, 2]);
		if(id == 1){
			var frameName = 'ingame/branch';
		} else {
			var frameName = 'ingame/trash';
		}

		var item = global.addSprite(x, y, frameName);
		item.anchor.setTo(0.5);
		item.idx = id
		item.y -= item.height * 0.5
		this.gGround.add(item);
		this.collectibles.push(item)
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
			ground.body.kinematic = true;
			ground.body.setMaterial(curState().groundMaterial)
		}
	},

	moveGround:function(){
		for(var a = 0; a < this.grounds.length; a++){
			var ground = this.grounds[a];
			if(!ground || !ground.body) continue;
			ground.body.x -= this._speed

			if(ground.body.x + (ground.width * 0.5) < 0){
				ground.destroy();
				this.grounds[a] = null;

				var isFloating = false;
				var pos = game.rnd.realInRange(1, 100);
				if(pos >= 75) isFloating = true;
				if(a < 8) isFloating = false;
				if(a > 2){
					if(isFloating){
						var lastGround = this.grounds.length - 1;
						var prevGround = this.grounds[lastGround];
						var prev2Ground = this.grounds[lastGround-1];
						if(!prevGround.isFloating && prev2Ground.isFloating){
							isFloating = false;
						}
					}
				}
				this.addGround(isFloating);
				this.activatePhysic();
			}
		}

		for(var a = 0; a < this.bushes.length; a++){
			var bush = this.bushes[a];
			if(!bush) continue;
			bush.x -= this._speed;
			if(bush.x + (bush.width * 0.5) < 0){
				bush.destroy();
				this.bushes[a] = null;
			}	
		}

		for(var a = 0; a < this.trees.length; a++){
			var tree = this.trees[a];
			if(!tree) continue;
			tree.x -= this._speed;
			if(tree.x + (tree.width * 0.5) < 0){
				tree.destroy();
				this.trees[a] = null;
			}	
		}

		for(var a = 0; a < this.clouds.length; a++){
			var cloud = this.clouds[a];
			if(!cloud) continue;
			cloud.x -= this._speed;
			if(cloud.x + (cloud.width * 0.5) < 0){
				cloud.destroy();
				this.clouds[a] = null;
				this.createCloud();
			}	
		}

		for(var a = 0; a < this.collectibles.length; a++){
			var item = this.collectibles[a];
			if(!item) continue;
			item.x -= this._speed;
			if(item.x + (item.width * 0.5) < 0){
				item.destroy();
				this.collectibles[a] = null;
			}	
		}
	},

	update:function(){
		if(!this.enablePhysic){
			this.enablePhysic = true
			this.activatePhysic();
			// this.isRunning = true;
		}

		if(this.isRunning){
			this.moveGround();
		}

		if(this.speed != this._speed){
			this._speed = this.speed;
		}
	}
}, Phaser.Group)