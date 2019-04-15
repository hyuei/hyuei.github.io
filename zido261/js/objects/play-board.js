PlayBoard = function(x, y){
	Phaser.Group.call(this, game);
	this.x = x;
	this.y = y;

	this.create();
};

PlayBoard.inherit({
	create:function(){
		this.isReady = false;
		this.changeStage = false;
		this.correctMatch = 0;
		this.gw = curState().gw;
		this.gh = curState().gh;

		this.gLines = new LineLegs(this.gw * 0.05, 0);
		this.gLines.y -= this.gLines.height * 0.5
		this.add(this.gLines)

		var lines = this.gLines.mainLines;
		this.startPoints = [];
		for(var a = 0; a < lines.length; a++){
			var point = global.addSprite(0, 0, 'ingame/platform');
			point.anchor.setTo(0.5);
			point.idx = a;
			point.user = -1;
			this.add(point);

			this.startPoints.push(point)
		}

		this.endPoints = [];
		var usedLines = [];
		for(var a = 0; a < 3; a++){
			var type = ['igloo', 'tent', 'tropical'];
			var point = global.addSprite(0, 0, 'ingame/house-' + type[a]);
			point.anchor.setTo(0.5)
			this.add(point);

			var lineId = null;
			while(lineId == null){
				var temp = game.rnd.integerInRange(0, lines.length - 1);
				if(usedLines.indexOf(temp) < 0){
					lineId = temp
				}
			}

			usedLines.push(lineId)
			point.lineId = lineId;
			point.endType = a;
			this.endPoints.push(point)
		}

		for(var a = this.endPoints.length; a < lines.length; a++){
			var point = global.addSprite(0, 0, 'ingame/hole');
			point.anchor.setTo(0.5);
			this.add(point);

			var lineId = null;
			while(lineId == null){
				var temp = game.rnd.integerInRange(0, lines.length - 1);
				if(usedLines.indexOf(temp) < 0){
					lineId = temp
				}
			}

			usedLines.push(lineId)
			point.lineId = lineId;
			point.endType = -1;
			this.endPoints.push(point)	
		}

	    this.emitter = new CorrectBurst(0, 0, 100);
	    this.add(this.emitter)

		this.gWalkers = game.add.group();
		this.add(this.gWalkers);

		this.walkers = [];
		for(var a = 0; a < 3; a++){
			var walker = new Walker(0, 0, a);
			walker.idx = a;
			this.gWalkers.add(walker)

			var localPos = this.toLocal(new Phaser.Point())
			walker.x = localPos.x - (walker.width * 0.6);
			var border = 1.1;
			walker.y = (walker.height * 0.5) - (walker.height * border) + (walker.height * border * a);
			walker.tweenWalking();

			this.walkers.push(walker)
		}
		// this.tempWalker = new Walker(0, 0, 0);
		// this.add(this.tempWalker);
		// this.tempWalker.tweenWalking();
	},

	particleBurst:function(obj) {
        this.emitter.x = obj.x;
        this.emitter.y = obj.y;

        this.emitter.start(true, 1000, null, 20);
    },

	rePosStart:function(){
		var lines = this.gLines.mainLines;
		for(var a = 0; a < this.startPoints.length; a++){
			var boundLine = lines[a].getBounds();
			var localPos = this.toLocal(new Phaser.Point(boundLine.x, boundLine.centerY));
			var start = this.startPoints[a];
			start.x = localPos.x - (start.width * 0.6);
			start.y = localPos.y;
		}

		for(var a = 0; a < this.endPoints.length; a++){
			var point = this.endPoints[a];
			var end = this.startPoints[point.lineId];

			var boundLine = lines[point.lineId].getBounds();
			var localPos = this.toLocal(new Phaser.Point(boundLine.right, boundLine.centerY));
			point.x = localPos.x + (point.width * 0.51);
			if(point.endType < 0) point.x += point.width * 0.35
			point.y = localPos.y;
		}
	},

	update:function(){
		this.rePosStart()
		this.gWalkers.update();
		this.gWalkers.sort('y', Phaser.Group.SORT_ASCENDING)

		var finished = true;
		for(var a = 0; a < this.walkers.length; a++){
			var walker = this.walkers[a];
			if(!walker.isFinished || walker.isTweening || walker.isMoving){
				finished = false;
			}
		}

		if(finished && !this.changeStage){
			this.changeStage = true;
			game.time.events.add(1000, function(){
				this.nextStage()
			}, curState())
		}
		// this.tempWalker.update();
	},
}, Phaser.Group)