class Platform extends Phaser.Sprite{
	constructor(game, x, y) {
		super (game, x, y, 'stone-idle');
		
        // this.scale.set(0.5);
        this.anchor.set(0.5);
		
		this.index = 0;
		this.answered = false;
		
		this.text = null;
		// this.textShadow = null;

		this.createCorrectPlatform();
		this.createFalsePlatform();
		this.createText();

		this.playWrongTimes=4;
		this._isPlayWrong = false;
		this._wrongWaitDuration = 100;
		this._currentWrongWaitDuration = 0;
		this._itPlayWrong = 0;
	}

	createCorrectPlatform()
	{
		this._platformShine = this.game.add.sprite(0,0,"stone-shine");
		this._platformShine.anchor.set(0.5);
		this._platformShine.position.y -= 0;
		this._platformShine.position.x += 0;

		this.addChild(this._platformShine);
		this._platformShine.bringToTop(this._platformShine);
		this._platformShine.visible = false;
	}

	createFalsePlatform()
	{
		this._platformRed = this.game.add.sprite(0,0,"stone-red");
		this._platformRed.anchor.set(0.5);
		this._platformRed.position.y -= 0;
		this._platformRed.position.x += 0;

		this.addChild(this._platformRed);
		this._platformRed.bringToTop(this._platformRed);
		this._platformRed.visible = false;				
	}

	createText()
	{
		// this.textShadow = this.game.add.bitmapText(0, -22, "arabnumbers", "0", 30);
		// this.textShadow.tint = 0x000000;
		// this.textShadow.alpha = 0.7;
		// this.textShadow.updateTransform();
		// this.textShadow.position.x = -20 + this.textShadow.textWidth / 2;
		// this.addChild(this.textShadow);

		// this.text = this.game.add.bitmapText(0, -25, "arabnumbers", "0", 30);
		// this.text.tint = 0xffffff;
		// this.text.updateTransform();
		// this.text.position.x = -20 + this.text.textWidth / 2;
		// this.addChild(this.text);

		var style = {font: "Arial", fontSize: 22, fontWeight: "bold",  boundsAlignH: 'center', stroke: "#e0e0e0", strokeThickness: 2};
		this.text = this.game.add.text(-25, -25,"", style);
		this.text.setTextBounds(0,0, 50, 50);
		this.addChild(this.text);
		this.text.updateTransform();

	}
	
	update(){
		this.updateWrong();
	}

	setNumber(number)
	{
		this.text.text = number;
		this.text.updateTransform();

		// this.text.position.x = - (this.text.textWidth / 2);

		// this.textShadow.text = number;
		// this.textShadow.updateTransform();
		// this.textShadow.position.x = - (this.textShadow.textWidth / 2);
	}

	showCorrect()
	{
		this._platformShine.visible = true;
		this.answered = true;
	}

	showWrong()
	{
		if(this._isPlayWrong)
			return;
		this._itPlayWrong = 0;
		this._isPlayWrong = true;
		this._currentWrongWaitDuration = this._wrongWaitDuration;
	}

	updateWrong()
	{
		if(!this._isPlayWrong)
			return;

		this._currentWrongWaitDuration += game.time.elapsedMS;
		if(this._currentWrongWaitDuration >= this._wrongWaitDuration)
		{

			if(this._itPlayWrong%2 == 0)
			{
				this._platformRed.visible = true;
			}else{
				this._platformRed.visible = false;
			}

			this._itPlayWrong++;
			if(this._itPlayWrong >= this.playWrongTimes*2)
			{
				this._isPlayWrong = false;
			}

			this._currentWrongWaitDuration = 0;
		}
	}
}