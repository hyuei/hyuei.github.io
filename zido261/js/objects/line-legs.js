LineLegs = function(x, y, maxLegs){
	Phaser.Group.call(this, game);
	this.x = x;
	this.y = y;

	this.maxLegs = maxLegs;
	this.create();
}

LineLegs.inherit({
	create:function(){
		var maxLines = curState().maxLines;
		this.mainLines = [];
		for(var a = 0; a < maxLines; a++){
			var line = global.addSprite(0, 0, 'ingame/amida-base');
			line.anchor.setTo(0.5);
			line.idx = a;
			this.add(line);

			line.y = (line.height * 0.5) + (128 * a);
			this.mainLines.push(line);
		}

		this.gLegs = game.add.group();
		this.add(this.gLegs)
		this.createLegs();
	},

	createLegs:function(){		
		var maxLegs = curState().maxLegs;
		var maxCons = curState().maxCons;
		var maxAll = maxLegs + maxCons;
		var maxLines = this.mainLines.length;
		this.legs = [];
		this.conLegs = [];
		for(var a = 0; a < maxAll; a++){
			var rndLeg = game.rnd.realInRange(0, 100);
			var typeLeg = 1
			if(rndLeg <= 50){
				if(this.legs.length < maxLegs)typeLeg = 0;
				else typeLeg = 1;
			} else {
				if(this.conLegs.length < maxCons) typeLeg = 1;
				else typeLeg = 0;
			}
				
			if(typeLeg == 0){
				var leg = global.addSprite(0, 0, 'ingame/amida-branch');
				leg.idx = this.legs.length;
				this.legs.push(leg);
			} else {
				var leg = global.addSprite(0, 0, 'ingame/amida-fake');
				leg.idx = this.conLegs.length;
				this.conLegs.push(leg)
			}
				
			leg.anchor.setTo(0.5, 0)

			var idx = game.rnd.integerInRange(0, maxLines - 1);
			var line = this.mainLines[idx];
			var border = 0.8
			var baseWidth = (line.width * border) / maxAll;
			var minX = (line.x - (line.width * line.anchor.x) + (line.width * ((1 - border) / 2))) + (a * baseWidth) + leg.width;
			var maxX = minX + baseWidth - leg.width;
			var x = game.rnd.realInRange(minX, maxX)
			leg.x = x;

			var direction = 'right';
			if(idx == 0) direction = 'right';
			else if(idx == maxLines - 1) direction = 'left';
			else {
				direction = game.rnd.pick(['left', 'right']);
			}

			// leg.direction = direction;
			leg.y = line.y;
			leg.lineId = {left:idx, right:idx+1};

			if(direction == 'left'){
				leg.y -= leg.height;
				leg.lineId = {left:idx-1,right:idx}
			}

			this.gLegs.add(leg)
		}

		if(!this.checkLegs()){
			this.gLegs.destroy();
			this.gLegs = game.add.group();
			this.add(this.gLegs)
			this.createLegs();
		}
	},

	checkLegs:function(){
		var ends = [];
		var checkPosLeft = [];
		var checkPosRight = [];
		for(var a = 0; a < this.mainLines.length; a++){
			var charaIdx = a;
			for(var b = 0; b < this.legs.length; b++){
				var data = this.legs[b].lineId;
				if(data.left == charaIdx) charaIdx = data.right;
				else if(data.right == charaIdx) charaIdx = data.left;

				if(checkPosLeft.indexOf(data.left) < 0) checkPosLeft.push(data.left);
				if(checkPosRight.indexOf(data.right) < 0) checkPosRight.push(data.right);
			}

			var check = ends.indexOf(charaIdx);
			if(check < 0) ends.push(charaIdx);
		}

		if(ends.length == this.mainLines.length && checkPosLeft.length == this.mainLines.length - 1 && checkPosRight.length == this.mainLines.length - 1) return true;
		else return false;
	},

	update:function(){
		Phaser.Group.update.call(this);
	}
}, Phaser.Group)