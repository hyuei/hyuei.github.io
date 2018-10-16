class CorrectBurst extends Phaser.Particles.Arcade.Emitter{
	constructor(x, y, maxParticles){
		super(game, x, y, maxParticles)
		
		this.i = 0;
		this.update_interval = 4 * 60;

        this.makeParticles('ingame', 'ingame/star-particle');
        this.gravity = 0;
        this.maxParticleScale = 0.5;
        this.minParticleScale = 0.2;
        this.minParticleSpeed.set(-200, -200);
        this.maxParticleSpeed.set(200, 200);
        this.minRotation = 20;
        this.maxRotation = 80;
	}

	start(explode, lifespan, frequency, total, forceQuantity){
		super.start(explode, lifespan, frequency, total, forceQuantity);
		this.forEachAlive(function(particle){
			particle.curTime = 0;
			particle.isTweening = false;
		}, this)
	}

	update(){
		super.update();
        this.forEachAlive(this.checkLifeSpan, this);
		// this.i++;

	 //    if (this.i === this.update_interval){
	 //        this.update_interval = Math.floor(Math.random() * 20) * 60; // 0 - 20sec @ 60fps
	 //        this.i = 0;
	 //    }
	}

	checkLifeSpan(particle){
		var countMs = game.time.physicsElapsedMS;
		particle.curTime += countMs;
		if(particle.curTime >= this.lifespan * 0.5 && !particle.isTweening){
			// console.log(particle.curTime, this.lifespan)			
			particle.isTweening = true;
			var tween = game.add.tween(particle).to({alpha:0}, 200, Phaser.Easing.Linear.None, true)
		}
	}
}