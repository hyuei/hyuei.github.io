Runner = function(x, y){
	Phaser.Sprite.call(this, game, x, y, 'ingame')
	this.frameName = 'ingame/runner-physic';

	this.animImage = curState().runnerImg;
	this.alpha = 0;
	this.anchor.setTo(0.5);
	this.enablePhysic = false
	this.speed = 350;
	this.jumpHeight = 710;
	this.petrified = false;
	this._petrified = false;

    // this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    // this.moveRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    // this.moveLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.jumpButtons = []
    this.rightButtons = [];
    this.leftButtons = [];
    for(var a = 0; a < 2; a++){
    	var jump = ['UP', 'W'];
    	var jumpBtn = game.input.keyboard.addKey(Phaser.Keyboard[jump[a]])
    	jumpBtn.onUp.add(function(){
    		if(!this.isJumped) return;
    		this.isJumped = false;
    	}, this)
    	this.jumpButtons.push(jumpBtn)

    	var right = ["RIGHT", "D"];
    	var btn = game.input.keyboard.addKey(Phaser.Keyboard[right[a]]);
    	btn.isPressed = false;
    	btn.onDown.add(function(){
    		this.isPressed = true
    	}, btn);
    	btn.onUp.add(function(){
    		this.isPressed = false
    	}, btn)
    	this.rightButtons.push(btn)

    	var left = ["LEFT", 'A'];
    	var btn = game.input.keyboard.addKey(Phaser.Keyboard[left[a]]);
    	btn.onUp.add(function(){
    		this.isPressed = false
    	}, btn)
    	btn.onDown.add(function(){
    		this.isPressed = true
    	}, btn);
    	// btn.onDown.add(function(){
    	// 	if(curState().runnerImg.scale.x > 0){
    	// 		curState().runnerImg.scale.x *= -1;
    	// 	}
    	// }, this);
    	this.leftButtons.push(btn)
    }

    this.isJumped = false;
    this.jumpTimer = 0;
	this.startX = x;
	this.isJumping = false;
	this.init();
};

Runner.inherit({
	init:function(){
		// this.frameRate = 10;
		// var seq = Phaser.Animation.generateFrameNames('ingame/ammar-run-', 1, 4, '', 2);
		// this.animations.add('run', seq, this.frameRate, true);
		// this.animations.play('run')
		// this.frameName = 'ingame/ammar-jump';

		this.yAxis = p2.vec2.fromValues(0, 1);
		this.minX = this.startX - (this.width * 0.5);
		this.maxX = this.startX + (this.width * 0.5);

		this.isRepos = false
	},

	createPhysic:function(){		
		game.physics.p2.enable(this, curState().debugPhysic);
	    this.body.fixedRotation = true;
	    this.body.damping = 0.2;
	    this.body.setRectangle(this.width * 0.4, this.height + 8)
	    this.body.setMaterial(curState().playerMaterial);
	    this.body.setCollisionGroup(curState().runnerGroup)
	    this.body.collides(curState().objectGroup)
	    this.body.collideWorldBounds  = true;
		// this.body.setCircle(this.width/2)
	    // this.body.collideWorldBounds = false;
	},

	checkIfCanJump:function() {
	    var result = false;
	    for (var i=0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++){
	        var c = game.physics.p2.world.narrowphase.contactEquations[i];
	        if (c.bodyA === this.body.data || c.bodyB === this.body.data){
	            var d = p2.vec2.dot(c.normalA, this.yAxis);
	            if (c.bodyA === this.body.data){
	                d *= -1;
	            }

	            if (d > 0.5){
	                result = true;
	            }
	        }
	    }
	    
	    return result;
	},

	checkItems:function(){
		var collectibles = curState().gGround.collectibles;
		for(var a = 0; a < collectibles.length; a++){
			var item = collectibles[a];
			if(!item) continue;
			var bound = item.getBounds();
			var contain = bound.contains(this.body.x, this.body.y);
			if(contain){
				if(item.idx == 2){
					curState().plTrash++;
				} else {
					curState().plBranch++;
				}

				var totItem = curState().plTrash + curState().plBranch;
				if(totItem > 0 && totItem % 10 == 0){
					curState().gGround.speed += 1.5;
				}
				curState().gGround.createEmitter(item)
				collectibles[a] = null
			}
		}
	},

	jumping:function(){
		if(curState().gameOver || curState().gamePaused || !curState().gameStart) return;
		if(!this.body || this.isJumped) return;
		if(game.time.now > this.jumpTimer && this.checkIfCanJump()){			
			this.isJumped = true
			this.body.moveUp(this.jumpHeight);
			this.jumpTimer = game.time.now + 750;
			this.isJumping = true;
			// this.animations.stop('run');
			// this.frameName = 'ingame/ammar-jump';
		}
	},

	moveTo:function(direction){
		if(!this.body) return;
		var speed = this.speed;
		if(direction == "left"){
			if(curState().runnerImg.scale.x > 0){
    			curState().runnerImg.scale.x *= -1;
    		}
			this.body.moveLeft(speed)
		} else {
    		if(curState().runnerImg.scale.x < 0){
    			curState().runnerImg.scale.x *= -1;
    		}

			this.body.moveRight(speed)
		}
	},

	checkButtons:function(){
		// console.log(this.petrified)
		if(this.petrified){
			this._petrified = true
			return;
		} else {
			if(this._petrified != this.petrified){
				var released = true;
				if(!Phaser.Device.desktop){
					if(curState().leftBtn.isClicked) released = false;
					if(curState().rightBtn.isClicked) released = false;
				}
				
				for(var a = 0; a < 2; a++){
					var rightBtn = this.rightButtons[a];					
					var leftBtn = this.leftButtons[a];
					if(rightBtn.isPressed) released = false;
					if(leftBtn.isPressed) released = false;
				}

				if(!released){
					return;
				} else {
					this._petrified = this.petrified;
					this.animations.play('idle')
				}
			}
		}

		var pressed = false;
		if(!Phaser.Device.desktop){
			if(curState().leftBtn.isClicked){
				pressed = true;
				this.moveTo('left')
			}

			if(curState().rightBtn.isClicked){
				pressed = true;
				this.moveTo('right')
			}
		}

		for(var a = 0; a < 2; a++){
			var jumpBtn = this.jumpButtons[a];
			if(jumpBtn.isDown){
				if(!this.isJumped){
					// console.log(jumpBtn)
					// pressed = true;
					this.jumping();
				}
			} 

			var rightBtn = this.rightButtons[a];
			if(rightBtn.isDown){
				pressed = true
				this.moveTo('right')
			}

			var leftBtn = this.leftButtons[a];
			if(leftBtn.isDown){
				pressed = true
				this.moveTo('left')
			}
		}

		if(!pressed){
			if(this.animImage.animations.currentAnim.name != 'idle'){
				this.animImage.animations.play('idle')
			}
		} else {
			if(this.animImage.animations.currentAnim.name != "run"){
				this.animImage.animations.play('run')
			}
		}

		if(this.isJumping){			
			if(!this.animImage.animations.currentAnim.paused){
				this.animImage.animations.currentAnim.paused = true;
				// this.animImage.animations.stop(this.animImage.animations.currentAnim.name);
			}
			// console.log(this.animImage.animations.currentAnim.paused)
		} else {
			if(this.animImage.animations.currentAnim.paused){
				this.animImage.animations.currentAnim.paused = false;
			// 	this.animImage.animations.play(this.animImage.animations.currentAnim.name)
			}
		}
	},

	update:function(){
		Phaser.Sprite.prototype.update.call(this)

		if(!this.enablePhysic){
			this.createPhysic();
			this.enablePhysic = true;
		}

		var shadow = curState().runnerImg;
		if(this.body){
			shadow.x = this.body.x;
			shadow.y = this.body.y - (this.height * 0.5) + (shadow.height * 0.5)
		} else {			
			shadow.x = this.x;
			shadow.y = this.y - (this.height * 0.5) + (shadow.height * 0.5)
		}

		if(curState().gameOver || curState().gamePaused || !curState().gameStart) return;

		this.checkButtons();
		// if(!this.body) return;
		// this.checkItems();

		if(this.checkIfCanJump()){
			if(this.isJumping && game.time.now > this.jumpTimer){
				this.isJumping = false;
			}
		} else {
			if(!this.isJumping){
				// console.log('stop jumping')
				// this.animations.stop('run')
			}
		}
	}
}, Phaser.Sprite)