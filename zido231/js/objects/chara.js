class Chara extends Phaser.Sprite{
	constructor(x, y, frameName){
		super(game, x, y, 'ingame');
		this.frameName = frameName;
		this.name = this.frameName.split('-');
		this.name = this.name[0];

		this.anchor.setTo(0.5, 1);		
		this.repeatCheers = 0;
		var frames = [this.name + '-idle', this.name + '-cheers'];
		// var tryFrame = Phaser.Animation.generateFrameNames('shine/00', 0, 14, '', 2)
		// console.log(tryFrame)
		var anim = this.animations.add('cheer', frames, 5)
		anim.onComplete.add(function(){
			this.repeatCheers++;
			if(this.repeatCheers >= 3 && !curState().gameOver && !curState().gResult.appeared){
				this.repeatCheers = 0
				this.frameName = this.name + '-idle';
			} else {
				this.animations.play('cheer')
			}
		}, this)

		// this.animations.play('cheer')

		// this.idle();
	}

	idle(){
		var toAngle = -10;
		if(this.angle < 0) toAngle = 10;
		var delay = game.rnd.realInRange(1000, 2000);
		var tween = game.add.tween(this);
		tween.to({angle:toAngle}, 300);
		// console.log(tween.delay)
		tween.delay(delay);
		tween.onComplete.add(this.idle, this);
		tween.start()
	}

	cheering(){

	}
}