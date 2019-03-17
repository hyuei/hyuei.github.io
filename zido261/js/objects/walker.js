Walker = function(x, y, typeId){
	Phaser.Sprite.call(this, game, x, y, 'ingame');

	var types = ['winter', 'hiking', 'aloha']
	this.frameName = 'ingame/chara-' + types[typeId];
	this.anchor.setTo(0.5, 1);
	this.typeId = typeId;

	this.isWalking = false;
	this.isReady = false;
	this.isClicked = false;
	this.lineIdx = -1;
	this.speed = 3;
	this.passedLeg = [];
	this.isFinished = false
	this.isTweening = false
	this.isMoving = false;

	this.direction = 'right';

	this.offSet = new Phaser.Point();

	// this.inputEnabled = true;
	this.events.onInputDown.add(this.onClick, this);
	this.events.onInputUp.add(this.onRelease, this)
};

Walker.inherit({
	walkingIn:function(){
		if(!this.isWalking || this.isReady || this.isMoving) return;		
		if(!curState().gameStart || curState().gameOver) return
		var localPos = this.parent.toLocal(new Phaser.Point(curState().gw * 0.1, 0))
		var rad = game.math.angleBetween(this.x, this.y, localPos.x, this.y);
		var distance = game.math.distance(this.x, this.y, localPos.x, this.y);
		if(distance < this.speed){
			this.x = localPos.x;
			this.oriPos = new Phaser.Point(this.x, this.y);
			this.isWalking = false;
			this.isReady = true;
			this.inputEnabled = true
		} else {
			var toX = this.x + (this.speed * Math.cos(rad));
			var toY = this.y + (this.speed * Math.sin(rad));
			this.x = toX;
			this.y = toY;
		}
	},

	tweenWalking:function(){
		if(this.isTweening) return;
		this.isTweening = true
		var toY = this.scale.y * 0.9;
		var toX = this.scale.x * 1.1;
		var tween = game.add.tween(this.scale);
		tween.to({x:toX, y:toY}, 400, Phaser.Easing.Quadratic.Out, true);
		tween.yoyo(true);
		tween.onComplete.add(function(){
			this.isTweening = false;
			if(this.isWalking){
				this.tweenWalking();
			}
		}, this);
	},

	tweenMove:function(toX, toY, onComplete, timer){
		if(this.isMoving) return;
		this.isMoving = true;
		toX = toX ? toX : this.x;
		toY = toY ? toY : this.y;
		timer = timer ? timer : 300;
		this.inputEnabled = false;
		this.tweenComplete = onComplete ? onComplete : new Phaser.Signal();
		var tween = game.add.tween(this);
		tween.to({x:toX, y:toY}, timer, Phaser.Easing.Quadratic.Out, true);
		tween.onComplete.add(function(){
			this.isMoving = false;
			this.tweenComplete.dispatch(this);
		}, this);
	},

	onClick:function(obj, pointer){
		if(this.isClicked) return;
		if(!curState().gameStart || curState().gamePaused || curState().gameOver) return
		this.isClicked = true;

		var bound = this.getBounds();
		this.offSet.x = pointer.x - bound.centerX;
		this.offSet.y = pointer.y - bound.bottom;
	},

	onRelease:function(obj, pointer){
		if(!this.isClicked) return;
		if(!curState().gameStart || curState().gamePaused || curState().gameOver) return
		this.isClicked = false;
		var points = curState().gPlay.startPoints;
		if(this.lineIdx >= 0){
			points[this.lineIdx].user = -1;
		}

		var onComplete = new Phaser.Signal();
		onComplete.add(function(){
			this.inputEnabled = true;
		}, this);
		var thisBound = this.getBounds();
		var inBound = {x:this.oriPos.x, y:this.oriPos.y};
		for(var a = 0; a < points.length; a++){
			var point = points[a];
			var bound = point.getBounds();
			var contains = bound.contains(thisBound.centerX, thisBound.bottom);
			var pointerContains = bound.contains(game.input.x, game.input.y)
			if(contains || pointerContains){
				if(point.user >= 0){
					var user = curState().gPlay.walkers[point.user];
					var otherComplete = new Phaser.Signal();
					otherComplete.add(function(){
						this.inputEnabled = true;
					}, user);

					if(this.lineIdx >= 0){
						var toPoint = points[this.lineIdx]
						user.tweenMove(toPoint.x, toPoint.y + 7, otherComplete)
						user.lineIdx = toPoint.idx;
						toPoint.user = user.idx;
					} else {
						user.tweenMove(user.oriPos.x, user.oriPos.y, otherComplete);
						user.lineIdx = -1;
					}
				}

				point.user = this.idx;
				this.lineIdx = point.idx;

				inBound.x = point.x;
				inBound.y = point.y + 7;
			} 
		}

		this.tweenMove(inBound.x, inBound.y, onComplete)
	},

	startWalking:function(){
		this.inputEnabled = false;
		this.pathIdx = 0;
		this.paths = [];
		var direction = "";
		var lineIdx = this.lineIdx;
		var legs = curState().gPlay.gLines.legs;
		for(var a = 0; a < legs.length; a++){
			var leg = legs[a];
			var data = leg.lineId;
			if(data.left == lineIdx){
				this.paths.push(leg.idx);
				lineIdx = data.right;
			} else if(data.right == lineIdx){
				this.paths.push(leg.idx);
				lineIdx = data.left;
			}
		}

		var onComplete = new Phaser.Signal();
		onComplete.add(function(){
			this.isWalking = true;
			this.tweenWalking();
			this.speed = 5;
		}, this);

		var line = curState().gPlay.gLines.mainLines[this.lineIdx]
		var bound = line.getBounds();
		var localPos = this.parent.toLocal(new Phaser.Point(bound.x, bound.centerY + 7))
		this.tweenMove(localPos.x, localPos.y, onComplete, 250)
	},

	walkOnLine:function(){
		if(!this.isWalking || !this.isReady || this.isMoving) return;
		if(!curState().gameStart || curState().gameOver) return
		var thisBound = this.getBounds();

		if(this.direction == 'right'){
			if(this.pathIdx < this.paths.length){
				var destId = this.paths[this.pathIdx];
				var dest = curState().gPlay.gLines.legs[destId]
				var boundDest = dest.getBounds();
				var localPos = this.parent.toLocal(new Phaser.Point(boundDest.centerX, thisBound.bottom))
				var distance = game.math.distance(this.x, this.y, localPos.x, this.y);
				var toX = this.x + this.speed;
				if(distance < this.speed){
					toX = localPos.x;
					if(dest.lineId.left == this.lineIdx){
						this.direction = 'down';
					} else if(dest.lineId.right == this.lineIdx){
						this.direction = 'up';
					}
				}

				this.x = toX;
			} else {
				var endPoints = curState().gPlay.endPoints;
				for(var a = 0; a < endPoints.length; a++){
					var point = endPoints[a];
					var bound = point.getBounds();
					var contains = bound.contains(thisBound.centerX, thisBound.bottom);
					if(contains){
						this.isWalking = false;
						this.isFinished = true;
						var localPos = this.parent.toLocal(new Phaser.Point(bound.centerX, bound.centerY));
						var onComplete = new Phaser.Signal();
						onComplete.add(function(obj){
							if(obj.typeId == this.endType){
								var addScore = 100;
								curState().score += addScore;
								
								curState().gPlay.particleBurst(this);

								obj.isTweening = true;
								var toX = obj.scale.x * 1.1;
								var toY = obj.scale.y * 0.9;
								var tween = game.add.tween(obj.scale);
								tween.to({x:toX, y:toY}, 300, Phaser.Easing.Quadratic.Out, true);
								tween.yoyo(true)
								tween.onRepeat.add(function(){
									var toY = this.y - 20;
									var tween = game.add.tween(this)
									tween.to({y:toY}, 300, Phaser.Easing.Quadratic.Out, true);
									tween.onComplete.add(function(){
										this.isTweening = false;
									}, this);
									tween.yoyo(true);
								}, obj);
							} else if(this.endType < 0){
								obj.isTweening = true;
								var tween = game.add.tween(obj.scale);
								tween.to({x:0, y:0}, 300, Phaser.Easing.Quadratic.Out, true);
								tween.onComplete.add(function(){
									this.isTweening = false;
								}, obj);
							}

							if(obj.typeId != this.endType){
								var decTime = 45;
								var x = curState().showTime.x + curState().showTime.width;
								var y = curState().showTime.y - 10;
								var showDec = global.addText(x, y, '-' + decTime, curState().showTime.fontSize, global.font1);
								showDec.anchor.setTo(1, 0.5);
								showDec.fill = 'red';
								showDec.align = 'right'
								curState().showTime.parent.add(showDec);

								var tween = game.add.tween(showDec);
								tween.to({y:y - 10, alpha:0}, 1000);
								tween.onComplete.add(function(){
									this.destroy();
								}, showDec);
								tween.start();

								if(!curState().showTime.onGoing){
									curState().showTime.onGoing = true;
									curState().showTime.oriFill = curState().showTime.fill;
									curState().showTime.fill = 'red'
									var tween2 = game.add.tween(curState().showTime);
									tween2.to({x:curState().showTime.x + 5}, 100);
									tween2.yoyo(true);
									tween2.repeat(2);
									tween2.onComplete.add(function(){
										this.onGoing = false
										this.fill = this.oriFill
									}, curState().showTime)
									tween2.start();
								}

								curState().plTime -= decTime;
								if(curState().plTime < 0){
									curState().plTime = 0
				                    // curState().tutorId = 1;
				                    // curState().prepareTutor();   
								}
							}
						}, point)

						var toY = localPos.y + (this.height * 0.5);
						if(point.endType < 0){
							toY = localPos.y;
						}
						this.tweenMove(localPos.x, toY, onComplete)
						return;
					} 
				}

				this.x += this.speed;
			}
		} else {
			var destId = this.paths[this.pathIdx];
			var dest = curState().gPlay.gLines.legs[destId]
			var bound = dest.getBounds();

			if(this.direction == 'up'){
				var localPos = this.parent.toLocal(new Phaser.Point(bound.centerX, bound.top));
				var distance = game.math.distance(this.x, this.y, localPos.x, localPos.y);
				if(distance < this.speed){
					this.y = localPos.y;
					this.direction = 'right';
					this.lineIdx = dest.lineId.left;
					this.pathIdx++;
				} else {
					this.y -= this.speed;
				}
			} else if(this.direction == 'down'){
				var localPos = this.parent.toLocal(new Phaser.Point(bound.centerX, bound.bottom));
				var distance = game.math.distance(this.x, this.y, localPos.x, localPos.y);
				if(distance < this.speed){
					this.y = localPos.y;
					this.direction = 'right';
					this.lineIdx = dest.lineId.right
					this.pathIdx++;
				} else {
					this.y += this.speed;
				}
			}
		}
	},

	update:function(){
		this.walkingIn();
		this.walkOnLine();
		if(!this.isReady && !this.isWalking){
			// console.log('start')
			var localPos = this.parent.toLocal(new Phaser.Point());
			this.x = localPos.x - (this.width * 0.7)
			if(curState().stageReady){
				this.isWalking = true;
				this.tweenWalking();
			}
		}

		if(this.isClicked){
			var x = game.input.x - this.offSet.x;
			var y = game.input.y - this.offSet.y;
			var localPos = this.parent.toLocal(new Phaser.Point(x,y));
			this.x = localPos.x;
			this.y = localPos.y;
		}
	},
}, Phaser.Sprite)