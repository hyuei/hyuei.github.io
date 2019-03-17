CorrectBurst = function(x, y, maxParticles){
	Phaser.Particles.Arcade.Emitter.call(this, game, x, y, maxParticles);
	// console.log(this)

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
};

CorrectBurst.inherit({	
	start:function(explode, lifespan, frequency, total, forceQuantity){
		Phaser.Particles.Arcade.Emitter.prototype.start.call(this, explode, lifespan, frequency, total, forceQuantity);
		this.forEachAlive(function(particle){
			particle.curTime = 0;
			particle.isTweening = false;
		}, this)
	},

	update:function(){
		Phaser.Particles.Arcade.Emitter.prototype.update.call(this);
        this.forEachAlive(this.checkLifeSpan, this);
	},

	checkLifeSpan:function(particle){
		var countMs = game.time.physicsElapsedMS;
		particle.curTime += countMs;
		if(particle.curTime >= this.lifespan * 0.5 && !particle.isTweening){
			// console.log(particle.curTime, this.lifespan)			
			particle.isTweening = true;
			var tween = game.add.tween(particle).to({alpha:0}, 200, Phaser.Easing.Linear.None, true)
		}
	},
}, Phaser.Particles.Arcade.Emitter);