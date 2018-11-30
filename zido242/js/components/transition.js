transition = {
	isClosed : false,
	isAnimating : false,
	easing:Phaser.Easing.Circular.Out,
	easing2:Phaser.Easing.Linear.None,
	timer:300,
};

transition.loadAsset = function(){
	Asset.png('bg-transition');
}

transition.create = function(){
	var group = game.add.group(null, 'screentransition', true);
	transition.gw = game.world.width;
	transition.gh = game.world.height;
	transition.centerX = transition.gw * 0.5;
	transition.centerY = transition.gh * 0.5;

	var bg = game.add.sprite(0, 0, 'bg-transition');
	transition.bg = bg;

	// var left = global.addSprite(0, 0, 'preloader/curtain-halfright')
	// left.anchor.setTo(1, 0);
	// left.x += left.width;
	// transition.leftCurtain = left;

	// var right = global.addSprite(left.x, left.y, 'preloader/curtain-halfright');
	// transition.rightCurtain = right;

	// var logo = global.addSprite(transition.centerX, transition.centerY, 'preloader/zido-logo')
	// logo.anchor.setTo(0.5)
	// transition.logo = logo;

	// left.x = 0;
	// right.x = game.width;
	bg.alpha = 0;

	group.add(bg)
	// group.add(right)
	// group.add(logo)

	transition.group = group;
}

transition.close = function(pageName, callback){
	// console.log('close', transition.isAnimating, transition.isClosed)
	if(transition.isAnimating) return;
	if(!transition.isClosed){
		transition.isAnimating = true;

		game.stage.addChild(transition.group);
		game.input.keyboard.reset();

		// var tweenLogo = game.add.tween(transition.logo)
		// .to({alpha:1}, 500, transition.easing2, true, 500)

		var tween = game.add.tween(transition.bg);
		tween.to({alpha:1}, transition.timer, transition.easing2, true);
		tween.onComplete.add(function(){
			transition.isAnimating = false;
			transition.isClosed = true;
			if(pageName){
				// console.log(pageName)
				game.state.start(pageName);
				if(callback) callback();
			}
		}, this);	
		// .chain(tweenLogo);

		// var tween2 = game.add.tween(transition.rightCurtain)
		// tween2.to({x:transition.centerX}, 500, transition.easing, true);	

		// console.log(tween)
	}
}

transition.open = function(callback){
	// console.log(curState().key)
	if(transition.isAnimating || !transition.isClosed) return;
	transition.isAnimating = true;

	// if(curState().key == 'PreloadScreen'){
	// 	transition.isClosed = false;
	// 	transition.isAnimating = false;
	// } else {
		var tween = game.add.tween(transition.bg);
		tween.to({alpha:0}, transition.timer, transition.easing2, true);
		tween.onComplete.add(function(){
			transition.isAnimating = false;
			transition.isClosed = false;
			// console.log('open', transition.isAnimating, transition.isClosed)
			game.stage.removeChild(transition.group);
			if(callback) callback();
		}, this);	
	// }
}