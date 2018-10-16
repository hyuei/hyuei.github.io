class bgGroup extends Phaser.Group{
	constructor(x, y){
		super(game);

		this.x = x;
		this.y = y;

		this.grounds = [];
		for(var a = 0; a < 3; a++){
			var ground = global.addSprite(0, 0, 'ingame/road-1');
			ground.anchor.setTo(0.5, 1);
			this.add(ground)

			var gap = 0.88;
			ground.x = (-ground.width * gap) + (a * ground.width * gap);

			this.grounds.push(ground);
		}

		// this.bushes = [];
		// for(var a = 0; a < 2; a++){
		// 	var bush = global.addSprite(0, 0, 'ingame/bush');
		// 	bush.anchor.setTo(0.5, 1);
		// 	this.add(bush);

		// 	bush.x = (-curState().centerX + (bush.width * 0.5)) + (a * (curState().gw - (bush.width)));
		// 	if(a == 1) bush.scale.x = -1;

		// 	this.bushes.push(bush)
		// }
	}
}