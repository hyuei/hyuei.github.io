OtherChara = function(x, y, frameName){
	Phaser.Sprite.call(this, game, x, y, 'ingame')

	this.frameName = frameName;
	this.anchor.setTo(0.5, 1);
	this.inputEnabled = true;

	this.countNow = 0;
	this.maxCount = 2;

	this.isShaking = false;
};

OtherChara.inherit({
	shakeTween:function(){
		var toX = this.x + 10
		var tween = game.add.tween(this);
		tween.to({x:toX}, 50);
		tween.yoyo(true);
		tween.onComplete.add(function(){
			if(this.isShaking){
				this.shakeTween();
			}
		}, this);
		tween.start();
	},

	shakeShadow:function(){
		var toX = this.x + 10
		var tween = game.add.tween(this);
		var shadow = curState().gObjects.otherChara.b;
		var tweenShadow = game.add.tween(shadow);
		tweenShadow.to({x:toX}, 50);
		tweenShadow.yoyo(true);
		tweenShadow.onComplete.add(function(){
			if(this.isShaking){
				this.shakeShadow();
			}
		}, this);
		tweenShadow.start();
	},

	jumping:function(){
		this.frameName = 'ingame/friend-angry';
		this.parent.remove(this);
		curState().gFound.add(this)
		var otherChara = curState().gObjects.otherChara;
		var chara = otherChara.a;
		var shadow = otherChara.b;
		var timer = 100;

		var toX = 1.2;
		var toY = 0.8;
		var preJump1 = game.add.tween(chara.scale);
		preJump1.to({x:toX, y:toY}, timer);
		preJump1.onComplete.add(function(){
			var otherChara = curState().gObjects.otherChara;
			this.jumpTween(otherChara.a, function(){				
				curState().tutorId = 5;
				curState().prepareTutor();
				this.isShaking = false;
			});
		}, this);
		preJump1.start();

		var preJump2 = game.add.tween(shadow.scale);
		preJump2.to({x:toX, y:toY}, timer);
		preJump2.onComplete.add(function(){
			var otherChara = curState().gObjects.otherChara;
			this.jumpTween(otherChara.b);
		}, this);
		preJump2.start();
	},

	jumpTween:function(obj, onComplete){
		var oriY = obj.y;
		var toY = obj.y - 50;
		var timer = 150;

		var tweenScale = game.add.tween(obj.scale);
		tweenScale.to({x:1, y: 1}, timer);
		tweenScale.start();

		var tweenLand = game.add.tween(obj);
		tweenLand.to({y:oriY}, timer);
		if(onComplete) tweenLand.onComplete.add(onComplete, this);

		var tween = game.add.tween(obj);
		tween.to({y:toY}, timer);
		tween.chain(tweenLand);
		tween.start();
	},

	checkBound:function(){
		var lightMask = curState().flashlight.lightMask;
		var maskPos = curState().flashlight.toGlobal(new Phaser.Point(lightMask.x, lightMask.y))
		var maskBound = new Phaser.Circle(maskPos.x, maskPos.y, 140)
		var thisBound = this.getBounds();
		var contains = maskBound.contains(thisBound.centerX, thisBound.centerY);
		if(contains){
			var countMs = game.time.physicsElapsedMS * 0.001
			this.countNow += countMs;
			if(this.countNow >= this.maxCount){
				if(!curState().gameOver){
					this.isShaking = false;
					curState().gameOver = true;
					this.jumping();
					return;
				}
			} else {
				if(!this.isShaking){
					this.isShaking = true;
					this.shakeTween();
					this.shakeShadow();
				}
			}

		} else {
			if(this.isShaking){
				this.countNow = 0;
				this.isShaking = false;
			}
		}
	},

	update:function(){
		Phaser.Sprite.prototype.update.call(this)
		if(curState().gameOver || curState().gamePaused || !curState().gameStart) return;
		if(curState().clickCover.visible) return;
		this.checkBound();
	},
}, Phaser.Sprite);