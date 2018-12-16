Flashlight = function(x, y){
	Phaser.Group.call(this, game);

	this.offX = 0;
	this.offY = 0;
	this.isClicked = false;
	this.x = x;
	this.y = y;

	this.init();
};

Flashlight.inherit({
	init:function(){
		this.lightMask = game.add.graphics(0, 0);
        this.lightMask.beginFill("#000");
        this.lightMask.drawCircle(0, 0, 140);
        // this.lightMask.alpha = 0;
        this.add(this.lightMask);

		this.lightUp = global.addSprite(-20, 10, 'ingame/flashlight-shine');
		this.lightUp.anchor.setTo(1, 1);
		// this.lightUp.visible = false;
		this.add(this.lightUp);

		this.lightMask.x = this.lightUp.x - (this.lightUp.width * 1.1);
		this.lightMask.y = this.lightUp.y - (this.lightUp.height * 0.6);

		this.flashlight = global.addSprite(0, 0, 'ingame/flashlight');
		this.flashlight.anchor.setTo(0.5);
		this.flashlight.inputEnabled = true;
		this.flashlight.events.onInputDown.add(this.onClick, this);
		this.flashlight.events.onInputUp.add(this.onUp, this);
		this.add(this.flashlight);
	},

	onClick:function(events, pointer){
		if(!curState().gameStart || curState().gamePaused || curState().gameOver) return;
		if(this.isClicked) return;
		var localPos = this.parent.toLocal(pointer.position)
		var startX = this.x;
		var startY = this.y;
		this.offX = localPos.x - startX;
		this.offY = localPos.y - startY;
		// console.log(localPos.x - this.x, this.offX)
		this.isClicked = true;
		this.lightUp.visible = true;

		this.checkObjects(true)
	},

	onUp:function(events, pointer){
		if(!this.isClicked) return;
		this.isClicked = false;
	},

	reposFlashLight:function(){
		this.lightUp.visible = false;

		this.checkObjects(false);

		var toX = curState().flashBase.x;
		var toY = curState().flashBase.y;
		var tween = game.add.tween(this);
		tween.to({x:toX, y:toY}, 100);
		tween.start();
	},

	checkObjects:function(visible){
		for(var objName in curState()){
			var obj = curState()[objName];
			if(!obj) continue;
			if(obj.mask && obj.mask == this.lightMask){
				obj.visible = visible;
			}

			if(obj.children && obj.children.length > 0){
				this.checkChildren(obj, visible)
			}
		}
	},

	checkChildren:function(parent, visible){
		for(var a = 0; a < parent.children.length; a++){
			var obj = parent.children[a];
			if(obj.mask && obj.mask == this.lightMask){
				obj.visible = visible;
			}

			if(obj.children && obj.children.length > 0){
				this.checkChildren(obj, visible)
			}
		}
	},

	update:function(){
		if(curState().gameOver || curState().gamePaused || !curState().gameStart) return;
		if(this.isClicked){
			var localPos = this.parent.toLocal(game.input.position)
			// console.log(localPos)
			// var localPos = game.input.position;
			this.x = localPos.x - this.offX;
			this.y = localPos.y - this.offY;
		}
	}
}, Phaser.Group)