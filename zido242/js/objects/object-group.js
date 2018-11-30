ObjectGroup = function(){
	Phaser.Group.call(this, game);
	this.init();
}

ObjectGroup.inherit({
	init:function(){
		this.upperY = curState().gh * 0.45;
		this.downY = curState().gh * 0.86;
		this.corY = [this.upperY, this.downY];

		this.gHuntShadow = game.add.group();
		this.add(this.gHuntShadow);

		this.gHunt = game.add.group();
		this.add(this.gHunt);

		this.gObjShadow = game.add.group();
		this.add(this.gObjShadow);

		this.gObj = game.add.group();
		this.add(this.gObj);
	},

	createObject:function(){
		var flash = curState().flashlight.lightMask;
		this.objects = [];
		this.trashes = [];
		this.secretChara = null;
		var curStage = curState().curStage;
		for(var a = 0; a < 2; a++){
			var y = this.corY[a];
			var minCount = 2 + (curStage - 1);
			if(minCount > 3) minCount = 3;
			var maxCount = minCount + 1 + (curStage - 1);
			if(maxCount > 4) maxCount = 4;
			// if(a == 1 && maxCount == 5) maxCount = 4;
			var countFloor = game.rnd.integerInRange(minCount, maxCount);
			var colExist = [];
			for(var b = 0; b < countFloor; b++){
				var col = null;
				var maxCol = 6
				while(col == null){
					var min = 0;
					var max = maxCol - 2;
					var rndmCol = game.rnd.integerInRange(min, max);
					var checkExist = colExist.indexOf(rndmCol);
					if(checkExist < 0) {
						col = rndmCol;
						colExist.push(col)
					}
				}

				var colWidth = curState().gw / maxCol;
				var x = (col * colWidth) + (colWidth * 0.5);
				var rndmObj = game.rnd.integerInRange(1, 5);

				var tryObj = global.addSprite(x, y, 'ingame/obj-' + rndmObj + '-a');
				tryObj.anchor.setTo(0.5, 1)
				tryObj.mask = flash;
				this.gObj.add(tryObj);

				var shadowObj = global.addSprite(tryObj.x, tryObj.y, 'ingame/obj-' + rndmObj + '-b');
				shadowObj.anchor.setTo(tryObj.anchor.x, tryObj.anchor.y);
				this.gObjShadow.add(shadowObj)

				this.objects.push({a:tryObj, b:shadowObj});

				var trashPos = game.rnd.realInRange(0, 100);
				if(trashPos >= 70){
					this.createTrash(shadowObj);
				}
			}
		}

		var idx = game.rnd.integerInRange(0, this.objects.length - 1);
		var hideObj = this.objects[idx].a;
		this.createChara(hideObj);
	},

	createTrash:function(obj){
		var x = obj.x + (obj.width * 0.5);
		var y = obj.y;
		var trashId = game.rnd.integerInRange(1, 4)
		var shadow = global.addSprite(x, y, 'ingame/trash-' + trashId + '-b');
		shadow.anchor.setTo(0.5, 1);
		shadow.x -= (shadow.width * 0.35);
		this.gHuntShadow.add(shadow);

		var trash = global.addSprite(shadow.x, shadow.y, 'ingame/trash-' + trashId + '-a');
		trash.anchor.setTo(0.5, 1);
		trash.inputEnabled = true;
		trash.idx = trashId;
		trash.events.onInputDown.add(this.collectTrash, this)
		trash.mask = curState().flashlight.lightMask;
		this.gHunt.add(trash);

		this.trashes.push({a:trash, b:shadow})
	}, 

	createChara:function(obj){
		var x = obj.x - (obj.width * 0.5);
		var y = obj.y;

		var shadow = global.addSprite(x, y, 'ingame/bilal-b');
		shadow.anchor.setTo(0.5, 1);
		shadow.x += (shadow.width * 0.3)
		this.gHuntShadow.add(shadow);

		var chara = global.addSprite(shadow.x, shadow.y, 'ingame/bilal-a');
		chara.anchor.setTo(0.5, 1);
		chara.inputEnabled = true;
		chara.events.onInputDown.add(this.checkChara, this);
		chara.mask = curState().flashlight.lightMask;
		this.gHunt.add(chara);

		this.secretChara = {a:chara, b:shadow};
	},

	checkChara:function(){
		if(!curState().gameStart || curState().gamePaused || curState().gameOver) return;
		var lightBound = curState().flashlight.lightMask.getBounds();
		var charaBound = this.secretChara.a.getBounds();
		var contains = lightBound.containsRect(charaBound);
		if(contains){
			this.caughtChara();
			this.createEmitter(this.secretChara.a);
		}
	},

	collectTrash:function(obj){
		if(!curState().gameStart || curState().gamePaused || curState().gameOver) return;
		var lightBound = curState().flashlight.lightMask.getBounds();
		var objBound = obj.getBounds();
		var contains = lightBound.containsRect(objBound);
		if(contains){
			var idx = null;
			for(var a = 0; a < this.trashes.length; a++){
				var trash = this.trashes[a];
				if(trash.a == obj){
					idx = a;
					trash.b.destroy();
				}
			}

			this.trashes.splice(idx, 1);

			this.createEmitter(obj)
			obj.inputEnabled = false;
			var mask = obj.mask;
			obj.mask = null;
			mask.isMask = true;

			var idx = obj.idx - 1;
			var objTo = curState().trashIcons[idx];
			objTo.countTrash++;
			curState().score += 500;
			objTo.showCount.setText('x ' + objTo.countTrash)
			var tweenTo = game.add.tween(obj);
			tweenTo.to({x:objTo.x, y:objTo.y}, 300);
			tweenTo.onComplete.add(function(obj){
				obj.destroy();
			}, this);

			var tween = game.add.tween(obj.scale);
			tween.to({x:1.1, y:1.1}, 200);
			tween.yoyo(true);
			tween.chain(tweenTo);
			tween.start();
		}		
	},

	createEmitter:function(obj){
		var pos = new Phaser.Point(obj.x, obj.y - (obj.height * 0.5))
		var globalPos = obj.parent.toGlobal(pos);
		var localPos = curState().gEmitter.parent.toLocal(globalPos);
		curState().gEmitter.x = localPos.x;
		curState().gEmitter.y = localPos.y;

		curState().gEmitter.start(true, 500, null, 20);

		obj.parent.remove(obj);
		curState().gFound.add(obj)
	},

	caughtChara:function(){
		curState().clickCover.visible = true;
		curState().score += 750;

		var chara = this.secretChara.a;
		var shadow = this.secretChara.b;
		var timer = 100;

		var toX = 1.2;
		var toY = 0.8;
		var preJump1 = game.add.tween(chara.scale);
		preJump1.to({x:toX, y:toY}, timer);
		preJump1.onComplete.add(function(){
			this.jumpTween(this.secretChara.a, function(){
				curState().upgradeStage();
			});
		}, this);
		preJump1.start();

		var preJump2 = game.add.tween(shadow.scale);
		preJump2.to({x:toX, y:toY}, timer);
		preJump2.onComplete.add(function(){
			this.jumpTween(this.secretChara.b);
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
}, Phaser.Group)