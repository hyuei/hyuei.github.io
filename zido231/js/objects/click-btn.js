class ClickBtn extends Phaser.Sprite{
	constructor(x, y, frameName){
		super(game, x, y, 'ingame');
		this.frameName = frameName;

		this.anchor.setTo(0.5);
		this.isClicked = false;
		this.inputEnabled = true;

		this.onClick = new Phaser.Signal();
		this.onRelease = new Phaser.Signal();
		
		this.events.onInputDown.add(this.btnClick, this);
		// this.events.onInputUp.add(this.btnRelease, this);
	}

	btnClick(){
		if(this.isClicked) return;
		this.isClicked = true;
		var tween = game.add.tween(this.scale);
		tween.to({x:0.8, y:0.8}, 100, Phaser.Easing.Bounce.InOut, true);
		tween.onComplete.add(function(){
			this.onClick.dispatch(this);
			this.btnRelease();
		}, this);
	}

	btnRelease(){
		if(!this.isClicked) return;
		var tween = game.add.tween(this.scale);
		tween.to({x:1, y:1}, 100, Phaser.Easing.Bounce.InOut, true);
		tween.onComplete.add(function(){
			this.isClicked = false;
			this.onRelease.dispatch(this);
		}, this);
	}
}