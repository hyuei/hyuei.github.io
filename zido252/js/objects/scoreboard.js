ScoreBoard = function(x, y){
	Phaser.Group.call(this, game)
	this.x = x;
	this.y = y;

	this.init();
};

ScoreBoard.inherit({
	init:function(){
		this.bg = global.addSprite(0, 0, 'ingame/base-result');
		this.bg.anchor.setTo(0.5);
		this.add(this.bg)

		this.gDesc = game.add.group();
		this.add(this.gDesc);

		this.gBranch = game.add.group();
		this.gDesc.add(this.gBranch);

		var branch = global.addSprite(0, 0, 'ingame/branch');
		branch.anchor.setTo(0, 0.5);
		branch.scale.setTo(0.8)
		this.gBranch.add(branch)

		var showBranch = global.addText(branch.width + 10, 5, 'x '+ curState().plBranch, 30, global.font2);
		showBranch.anchor.setTo(0, 0.5);
		showBranch.fill = '#dd6118';
		this.gBranch.add(showBranch)
		this.showBranch = showBranch

		this.gTrash = game.add.group();
		this.gTrash.x = this.gBranch.width + 50
		this.gDesc.add(this.gTrash);

		var trash = global.addSprite(0, 0, 'ingame/trash');
		trash.anchor.setTo(0, 0.5);
		trash.scale.setTo(0.8);
		this.gTrash.add(trash)

		this.showTrash = global.addText(trash.width + 10, 5, 'x ' + curState().plTrash, 30, global.font2);
		this.showTrash.anchor.setTo(0, 0.5);
		this.showTrash.fill = showBranch.fill;
		this.gTrash.add(this.showTrash)

		this.gDesc.y = -(this.bg.height * 0.1)
		this.gDesc.x -= this.gDesc.width * 0.5

		this.showTotal = global.addText(0, this.bg.height * 0.37, _t(STRINGS_DATA.data.totalscore, 0), 32, global.font2);
		this.showTotal.anchor.setTo(0.5);
		this.showTotal.fill = showBranch.fill;
		this.add(this.showTotal)

		this.cdTimer = 0.05;
		this.curTimer = 0;
		this.startCount = false;
		this.totScore = 0;
		this.branchScore = 30;
		this.trashScore = 50;

		this.prepare();
	},

	prepare:function(){
		this.y = -this.height * 0.6
	},

	tweenIn:function(){
		this.showBranch.setText('x ' + curState().plBranch);
		this.showTrash.setText('x ' + curState().plTrash);

		var tween = game.add.tween(this);
		tween.to({y:curState().centerY}, 300);
		tween.onComplete.add(this.countScore, this)
		tween.start();
	},

	countScore:function(){
		this.startCount = true;
	},

	update:function(){
		this.gDesc.x = -this.gDesc.width * 0.5;
		this.showBranch.setText('x ' + curState().plBranch);
		this.showTrash.setText('x ' + curState().plTrash);
		this.showTotal.setText(_t(STRINGS_DATA.data.totalscore, this.totScore));

		if(this.startCount){
			var countMs = game.time.physicsElapsedMS * 0.001;
			this.curTimer += countMs;
			if(this.curTimer >= this.cdTimer){
				this.curTimer = 0;
				if(curState().plBranch > 0){
					this.totScore += this.branchScore;
					curState().plBranch--;
				}

				if(curState().plTrash > 0){
					this.totScore += this.trashScore;
					curState().plTrash--;
				}

				if(curState().plBranch <= 0 && curState().plTrash <= 0){
					// console.log('win')
					this.startCount = false;
					game.time.events.add(1000, function(){
						curState().isWin = true;
						curState().score = this.totScore;
						curState().gameEnd();
					}, this)
				}
			}
		}
	}
}, Phaser.Group);