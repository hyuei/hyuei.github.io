Runner = function(x, y){
	Phaser.Sprite.call(this, game, x, y, 'ingame')
	this.frameName = 'ingame/ammar-run-01';

	this.anchor.setTo(0.5);
	this.enablePhysic = false

    this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.jumpTimer = 0;
	this.startX = x;
	this.isJumping = false;
	this.init();
};

Runner.inherit({
	init:function(){
		this.frameRate = 10;
		var seq = Phaser.Animation.generateFrameNames('ingame/ammar-run-', 1, 4, '', 2);
		this.animations.add('run', seq, this.frameRate, true);
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
	    this.body.setMaterial(curState().playerMaterial);
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
		if(game.time.now > this.jumpTimer && this.checkIfCanJump()){			
			this.body.moveUp(950);
			this.jumpTimer = game.time.now + 750;
			this.isJumping = true;
			this.animations.stop('run');
			this.frameName = 'ingame/ammar-jump';
		}
	},

	update:function(){
		Phaser.Sprite.prototype.update.call(this)

		if(!this.enablePhysic){
			this.createPhysic();
			this.enablePhysic = true;
		}

		if(curState().gameOver || curState().gamePaused || !curState().gameStart) return;
		if(!this.body) return;
		// if(!curState().gGround.isRunning) return;
		this.checkItems();
		if(this.jumpButton.isDown){
			this.jumping();
		}

		if(this.checkIfCanJump()){
			if(this.isJumping && game.time.now > this.jumpTimer){
				this.isJumping = false;
				this.animations.play('run')
			} else {
				if(game.time.now > this.jumpTimer){
					this.animations.play('run')
				}
			}
		} else {
			if(!this.isJumping){
				this.animations.stop('run')
			}
		}
		// if(this.isJumping && game.time.now > this.jumpTimer && this.checkIfCanJump()){
		// 	this.isJumping = false;
		// 	this.animations.play('run')
		// }

		if(!this.isRepos){
			if(this.body.x < this.minX || this.body.x > this.maxX){
				this.isRepos = true;
			}
		} else {
			if(this.body.x < this.startX){
				this.body.x += 2
				if(this.body.x >= this.startX){
					this.body.x = this.startX;
					this.isRepos = false;
				}
			} else if(this.body.x > this.startX){
				this.body.x -= 2;
				if(this.body.x <= this.startX){
					this.body.x = this.startX;
					this.isRepos = false;
				}
			}
		}

		if(this.body && this.body.y - (this.height * 0.5) > curState().gh) {
			if(curState().gGround.isRunning){
				curState().gGround.isRunning = false;
				curState().checkScore();
			}
		}
	}
}, Phaser.Sprite)