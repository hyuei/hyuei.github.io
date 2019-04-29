ClickBtn = function(x, y, frameName){
	Phaser.Sprite.call(this, game, x, y, 'ingame');

	this.frameName = frameName;

	this.anchor.setTo(0.5);
	this.isClicked = false;
	this.inputEnabled = true;

	this.onClick = new Phaser.Signal();
	this.onRelease = new Phaser.Signal();
	
	this.events.onInputDown.add(this.btnClick, this);
};

ClickBtn.inherit({
	btnClick:function(){
		if(this.isClicked) return;
		this.isClicked = true;
		var tween = game.add.tween(this.scale);
		tween.to({x:0.8, y:0.8}, 100, Phaser.Easing.Bounce.InOut, true);
		tween.onComplete.add(function(){
			this.onClick.dispatch(this);
			this.btnRelease();
		}, this);
	},

	btnRelease:function(){
		if(!this.isClicked) return;
		var tween = game.add.tween(this.scale);
		tween.to({x:1, y:1}, 100, Phaser.Easing.Bounce.InOut, true);
		tween.onComplete.add(function(){
			this.isClicked = false;
			this.onRelease.dispatch(this);
		}, this);
	},
}, Phaser.Sprite);