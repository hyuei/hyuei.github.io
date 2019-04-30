class Avatar extends Phaser.Sprite{
	constructor(game, x, y, idleImage, runImage, cheersImage)
	{
		super (game, x, y, idleImage);
		this.anchor.set(0.5);
		// this.scale.set(0.5);

		this._idleImage = idleImage;
		this._runImage = runImage;
		this._cheersImage = cheersImage;

		this._waitDuration = 400;
		this._currentWaitDuration = 0;
		this._isHoping = false;
		this._hopIndex = 0;
		this._hopPositions = [];
		this._hopOffset = {x: 0, y: -50};
		
		this._onFinishJump = null;

		var ref = this;

		// animation
		this._jumpingAnim = {
			name: "jumping",
			isLooping: false,
			keyframes:[
				{key:ref._idleImage, duration:20},
				{key:ref._runImage, duration:280},
				{key:ref._idleImage, duration:0},
			]
		};

		this._cheersAnim = {
			name: "cheers",
			isLooping: true,
			keyframes:[
				{key:ref._cheersImage, duration:200},
				{key:ref._idleImage, duration:100}
			]
		};

		this._currentAnimation = null;
		this._currentAnimKeyframe = null;
		this._currentAnimationTime = 0;
		this._currentKeyframeIdx = 0;

		this._jumpAudio = game.add.audio("jump", true);
		this._cheerAudio = game.add.audio("choice-right", true);
	}

	jump(positions, onFinishJump)
	{
		// this.game.add.tween(this).from( { y: -200 }, 2000, Phaser.Easing.Bounce.Out, true);
		this._isHoping = true;
		this._hopPositions = positions;
		this._hopIndex = 0;
		console.log(this._isHoping);

		this._currentWaitDuration = this._waitDuration;
		this._onFinishJump = onFinishJump;
	}

	cheer()
	{
		
	}

	update()
	{
		this.updateJump();
		this.updateAnimation();
	}

	updateJump()
	{
		if(!this._isHoping)
		{
			return;

		}

		this._currentWaitDuration += game.time.elapsedMS;
		if(this._currentWaitDuration >= this._waitDuration)
		{
			var xPos = this._hopPositions[this._hopIndex][0];
			var yPos = this._hopPositions[this._hopIndex][1];
			
			console.log("hop :" + xPos + " " + yPos);
			this.setAnimation(this._jumpingAnim);
			this.game.add.tween(this).to({x: xPos, y: yPos}, 300, Phaser.Easing.Exponential.Out, true);

			this._hopIndex++;
			if(this._hopIndex >= this._hopPositions.length)
			{
				this._isHoping = false;
				if(this._onFinishJump != null)
				{
					this.setAnimation(this._cheersAnim);
					this.onFinishJump();

					this._onFinishJump();
				}
			}else{
				this.onJump();	
			}
			this._currentWaitDuration = 0;
		}
	}


	onJump()
	{
		this._jumpAudio.play();
	}

	onFinishJump()
	{
		this._cheerAudio.play();
	}

	// ------------ REGION: Animations

	setAnimation(animation)
	{
		this._currentAnimation = animation;
	}

	updateAnimation()
	{
		if (this._currentAnimation != null)
		{
			if(this._currentAnimKeyframe != null)
			{

				if(this._currentAnimationTime >= this._currentAnimKeyframe.duration)
				{
					this._currentAnimationTime = 0;

					this._currentKeyframeIdx++;
					if(this._currentKeyframeIdx >= this._currentAnimation.keyframes.length)
					{
						if(this._currentAnimation.isLooping)
						{
							this._currentKeyframeIdx = 0;
						}
					}

					// out of frame, stop animation
					if(this._currentKeyframeIdx >= this._currentAnimation.keyframes.length){
						this._currentAnimKeyframe = null;
						this._currentAnimation = null;
					}else{
						// Animate
						this._currentAnimKeyframe = this._currentAnimation.keyframes[this._currentKeyframeIdx];
						this.loadTexture(this._currentAnimKeyframe.key);
					}

				}

				this._currentAnimationTime += game.time.elapsed;

			}
			else{
				this._currentKeyframeIdx = 0;
				this._currentAnimKeyframe = this._currentAnimation.keyframes[this._currentKeyframeIdx];
			}
		}
	}

	// ------------ END REGION: Animations

	addOffsetPos(arrPos)
	{
		for (var i = 0; i < arrPos.length; i++) {
			arrPos[i][0] += this._hopOffset.x;
			arrPos[i][1] += this._hopOffset.y;
		}
		return arrPos;
	}
}