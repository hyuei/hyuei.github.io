Endscreen = function(x, y){
	Phaser.Group.call(this, game);
	this.appeared = false;

	this.x = x;
	this.y = y;

	this.bg = game.add.sprite(0, 0, 'grey-bg');
	this.bg.anchor.setTo(0.5);
	this.bg.inputEnabled = true;
	this.add(this.bg);

    this.emitter = new CorrectBurst(0, 0, 100);
    this.add(this.emitter)

	this.gDesc = game.add.group();
	this.add(this.gDesc);

	this.resultText = global.addSprite(0, 0, 'ingame/congrats-title');
	this.resultText.anchor.setTo(0.5);
	this.resultText.y -= this.resultText.height * 0.2

	var names = ['khalid-cheers', 'ammar-cheers', 'sammi-cheers'];
	this.charas = [];
	for(var a = 0; a < 3; a++){
		var chara = global.addSprite(0, this.resultText.y - (this.resultText.height * 0.25), 'ingame/' + names[a]);
		chara.anchor.setTo(0.5, 1);
		chara.id = a;
		chara.x = -(this.bg.width * 0.26) + (a * this.bg.width * 0.26);
		if(a != 1){
			chara.y += this.resultText.height * 0.35
			if(a == 0) chara.angle = -20;
			else chara.angle = 20;
		}
		chara.scale.setTo(0);
		this.gDesc.add(chara);

		this.charas.push(chara)
	}

	this.resultText.y = this.charas[1].y;
	this.gDesc.add(this.resultText)

	this.scoreBox = global.addSprite(0, this.bg.y + (this.bg.height * 0.14), 'ingame/scorebox');
	this.scoreBox.anchor.setTo(0.5);
	this.gDesc.add(this.scoreBox);

	this.showScore = global.addText(this.scoreBox.x, this.scoreBox.y - 7, '0', 50, global.font2);
	this.showScore.anchor.setTo(0.5);
	this.showScore.fill = '#c53a2c';
	this.gDesc.add(this.showScore)

	this.replayBtn = new ClickBtn(0, this.bg.y + (this.bg.height * 0.5), 'ingame/btn-retry');
	this.replayBtn.y -= this.replayBtn.height * 0.7;
	this.replayBtn.onClick.add(function(){
		// curState().changePage('Game1Screen')
		first_timer = false;
		game.input.keyboard.reset(true)
		curState().changePage(game.state.current)
		// game.state.restart()
	}, this);
	this.gDesc.add(this.replayBtn);

	this.bg.scale.x = 0;
	this.gDesc.alpha = 0;
	this.replayBtn.inputEnabled = false;
};

Endscreen.inherit({
	particleBurst:function(obj) {
        this.emitter.x = obj.x;
        this.emitter.y = obj.y;

        this.emitter.start(true, 1000, null, 20);
    },

	tweenIn:function(){
		var score = curState().score;
		if(CustomStorage.data.highScore < score) {
			CustomStorage.data.highScore = score;
			CustomStorage.save('highScore', score)
		}

        var customData = JSON.stringify(CustomStorage.data);

		if(ZIDO_VALIDATION > 0){
			// ZIDO.post(data);
			ZIDO_API.setScore(score);
			// ZIDO_API.setData(CustomStorage.data)
			ZIDO_API.sendData();
		}

		if(!curState().isWin){
			this.resultText.frameName = 'ingame/toobad';
		}
		
		this.appeared = true;
		var score = curState().writeThousands(score);
		this.showScore.setText(score)

		var timer = 500;
		var tweenBg = game.add.tween(this.bg.scale);
		tweenBg.to({x:1}, timer, null, true);

		var tweenBtn = game.add.tween(this.gDesc);
		tweenBtn.to({alpha:1}, timer, null, true);
		tweenBtn.onComplete.add(function(){
			this.replayBtn.inputEnabled = true;
			for(var a = 0; a < this.charas.length; a++){
				if(!curState().isWin) continue;
				var chara = this.charas[a];

				var timer = 150;
				var delay = a * timer * 2;

				var tweenNormal = game.add.tween(chara.scale).to({x:1,y:1}, timer);

				var tween = game.add.tween(chara.scale);
				tween.to({x:1.5, y:1.5}, timer, null, true, delay);
				tween.chain(tweenNormal);
				tween.onComplete.add(function(obj){
					var result = curState().gResult;
					var toX = this.x;
					if(this.id == 0) toX -= 10;
					else if(this.id == 2) toX += 10;
					var pos = {x:toX, y:this.y - (this.height * 0.5)};
					result.particleBurst(pos)
				}, chara)
			}
		}, this)
	},
}, Phaser.Group);