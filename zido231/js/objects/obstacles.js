class Obstacles extends Phaser.Group{
	constructor(x, y){
		super(game);
		this.x = x;
		this.y = y;

		this.coins = [[],[],[]];
		this.boxes = [[],[],[]];
	}

	createCoins(obj){
        // console.log('create coins')
		if(!curState().placeSave) return
		var bgGroup = curState().bgs[0];
		var grounds = bgGroup.grounds;
		var rockCount = 2;

		for(var a = 0; a < grounds.length; a++){
			var rockAppear = false
			var minLine = 0;
			if(curState().tutorId <= 1){
				minLine = 1;
			}
			var lines = game.rnd.integerInRange(minLine, 3);
			var oriLine = this.coins[a].length;
			for(var b = 0; b < lines; b++){
				var roadPos = bgGroup.toGlobal(grounds[a])
				var x = roadPos.x;

				var typeCoin = '';
				var imgFolder = 'ingame/coin';
				var rnd = game.rnd.realInRange(0, 100);
				var isRock = false;
				var fill = curState().showPoint.fill;
				if(rnd > 90) {
					if(curState().tutorId <= 1){
						typeCoin = '-big'
					} else {
						typeCoin = '-big'
						var rndRock = game.rnd.realInRange(0, 100);
						if(rndRock > 50 && !rockAppear && rockCount > 0){
							rockAppear = true;
							typeCoin = 'rock';
							imgFolder = 'ingame/';
							isRock = true;
							fill = '#eb3110';
							rockCount++;
						}
					}
				}
				var coin = global.addSprite(x, 0, imgFolder + typeCoin);
				coin.anchor.setTo(0.5);
				coin.isRock = isRock;
				this.add(coin);

				var curLine = this.coins[a].length;
				var l = (curLine + b) - oriLine;
				var border = obj.y - (coin.height * 0.5) - 5;
				if(l > 0){
					var prevCoin = this.coins[a][curLine - 1];
					border = prevCoin.y - (prevCoin.height * 0.5) - (coin.height * 0.6);
				}

				coin.y = border;
				coin.col = a;
				coin.row = this.coins[a].length;
				coin.isActive = true;

				if(typeCoin == ''){
					coin.point = 1;
					var fontSize = 40;
				} else {
					coin.point = 5
					var fontSize = 60
				}

				var text = global.addText(0, 5, '' + coin.point, fontSize, global.font2);
				text.anchor.setTo(0.5);
				text.fontWeight = 'bold'
				text.fill = fill;
				text.stroke = 'white';
				text.strokeThickness = 5;
				coin.addChild(text);					
				coin.text = text;

				coin.scale.setTo(0.8);
				this.coins[a].push(coin)
			}
		}
	}

	createBox(obj){
        // console.log('create boxes')
		if(!curState().placeSave) return
		var bgGroup = curState().bgs[0];
		var grounds = bgGroup.grounds;
		var goals = curState().gGoals;
		var lessThanCurPoint = false;
		for(var a = 0; a < 3; a++){
			var roadPos = bgGroup.toGlobal(grounds[a])
			var box = global.addSprite(roadPos.x, 0, 'ingame/box-01');
			box.anchor.setTo(0.5);
			this.add(box);

			box.y = obj.y - (box.height * 0.6);
			box.isActive = true;
			box.col = a;
			box.row = this.boxes[a].length;

			var max = curState().curPoint + 5;
			var min = curState().curPoint - 5;
			if(min <= 0) min = 1;
			box.boxPoint = game.rnd.integerInRange(min, max);
			if(box.boxPoint < curState().curPoint){
				lessThanCurPoint = true;
				if(curState().tutorMinBoxPoint == null) curState().tutorMinBoxPoint = box.boxPoint;
				else if(curState().tutorMinBoxPoint > box.boxPoint) curState().tutorMinBoxPoint = box.boxPoint;
			}

			var text = global.addText(0, 5, box.boxPoint + '', 75, global.font2);
			text.anchor.setTo(0.5);
			text.fill = '#e55c00';
			text.stroke = 'white';
			text.fontWeight = 'bold'
			text.strokeThickness = 10;
			box.addChild(text);
			box.text = text;

			box.scale.setTo(0.7)

			this.boxes[a].push(box)
		}

		// console.log(lessThanCurPoint)
		if(!lessThanCurPoint){
			var rndCol = game.rnd.integerInRange(0, this.boxes.length - 1);
			var newest = this.boxes[rndCol].length - 1;
			var box = this.boxes[rndCol][newest];
			var min = curState().curPoint - 5;
			var max = curState().curPoint - 1;
			if(min <= 0) min = 1;
			if(max <= 0) max = 2;
			box.boxPoint = game.rnd.integerInRange(min, max);
			box.text.setText(box.boxPoint)
			if(curState().tutorMinBoxPoint == null) curState().tutorMinBoxPoint = box.boxPoint;
			else if(curState().tutorMinBoxPoint > box.boxPoint) curState().tutorMinBoxPoint = box.boxPoint;
		}
	}

    particleBurst(obj) {
    	if(!obj.isActive) return;
        curState().gEffect.x = obj.x;
        curState().gEffect.y = obj.y;

        curState().gEffect.start(true, 900, null, 10);
    }

    hitText(obj){
    	var point = 0;
    	if(obj.isRock) point = obj.point;
    	else point = obj.boxPoint
    	var text = global.addText(obj.x, obj.y, '-' + point, 60, global.font2);
    	text.anchor.setTo(0.5);
    	text.fill = obj.text.fill;
    	text.stroke = obj.text.stroke;
    	text.strokeThickness = obj.text.strokeThickness;
    	this.add(text);

    	var tween = game.add.tween(text)
    	tween.to({y:text.y - (obj.height * 0.2), alpha:0}, 500);
    	tween.onComplete.add(text.destroy, text);
    	tween.start();
    }

	moveCoins(){
		var speed = curState().speed;
		for(var a = 0; a < this.coins.length; a++){
			for(var b = 0; b < this.coins[a].length; b++){
				var coin = this.coins[a][b];
				if(!coin || !coin.exists) continue;
				coin.y += speed
				if(coin.y - (coin.height * 0.5) > curState().gh){
					coin.destroy();
					this.coins[a][b] = null;
				} else {
					var coinBound = coin.getBounds();
					if(coinBound.y > 0){
						if(curState().tutorId == 1 && !curState().gamePaused){
							curState().prepareTutor();
						}
					}
				}
			}
		}
	}

	moveBox(){
		var speed = curState().speed;
		for(var a = 0; a < this.boxes.length; a++){
			for(var b = 0; b < this.boxes[a].length; b++){
				var box = this.boxes[a][b];
				if(!box || !box.exists) continue;
				box.y += speed;
				if(box.y - (box.height * 0.5) > curState().gh){
					box.destroy();
					this.boxes[a][b] = null;
				} else {
					var boxBound = box.getBounds();
					if(boxBound.y > 0){
						if(curState().tutorId == 2 && !curState().gamePaused){
							curState().prepareTutor();
						}
					}
				}
			}
		}
	}

	checkRunner(){
		var plBound = curState().plChara.getBounds();
		for(var a = 0; a < this.coins.length; a++){
			for(var b = 0; b < this.coins[a].length; b++){
				var coin = this.coins[a][b];
				if(!coin || !coin.exists || !coin.isActive) continue;
				var intersect = plBound.contains(coin.x, coin.y);
				if(intersect){
					if(!coin.isRock){
						SoundData.sfxPlay('pick')
						this.particleBurst(coin);
						curState().curPoint += coin.point;
						curState().totalCoin += coin.point;
						coin.destroy();
					} else {
						if(!curState().plAvailable) continue;
						SoundData.sfxPlay('break')
						this.hitText(coin);
						curState().plHitBox();
						curState().curPoint -= coin.point;

						if(curState().curPoint < 0){
							curState().lose();
						} else {
							var tween = game.add.tween(coin);
							tween.to({alpha:0}, 200);
							tween.onComplete.add(function(){
								this.destroy();
							}, coin);
							tween.start();
						}						
					}

					coin.isActive = false;
					this.coins[a][b] = null;
				}
			}
		}

		for(var a = 0; a < this.boxes.length; a++){
			for(var b = 0; b < this.boxes[a].length; b++){
				var box = this.boxes[a][b];
				if(!curState().plAvailable) continue;
				if(!box || !box.exists || !box.isActive) continue;
				var intersect = plBound.contains(box.x, box.y);
				if(intersect){
					SoundData.sfxPlay('break')
					curState().plHitBox();
					curState().curPoint -= box.boxPoint;
					box.frameName = 'ingame/box-02';
					box.isActive = false;
					box.text.setText('')
					this.hitText(box)

					if(curState().curPoint < 0){
						curState().lose();
					}
				}
			}
		}
	}

	update(){
		super.update();

		if(curState().gameOver || !curState().gameStart || curState().gamePaused || !curState().isMoving) return;
		this.moveCoins();
		this.moveBox();

		this.checkRunner();
	}
}