MoveBtn = function(x, y, frameName, btnType){
	Phaser.Sprite.call(this, game, x, y, 'ingame');
	this.frameName = frameName;
	this.btnType = btnType;

	this.onClick = new Phaser.Signal();
	this.onReleased = new Phaser.Signal();

	this.isClicked = false;
	this.inputEnabled = true;
	this.activePointer  = game.input.activePointer;

	this.events.onInputDown.add(this.clicked, this)
	this.events.onInputOver.add(this.clicked, this);
	this.events.onInputUp.add(this.released, this)
	this.events.onInputOut.add(this.released, this)
};

MoveBtn.inherit({
	clicked:function(obj, pointer){
		// console.log(this.btnType, pointer.id)
		this.activePointer = pointer;
		curState().movePointer = pointer;

        this.isClicked = true;
        if(this.btnType == 'left'){        	
	        this.frameName = 'ingame/btn-left-down'
        } else {
        	this.frameName = 'ingame/btn-right-down'
        }
	},

	released:function(obj, pointer){		
        this.isClicked = false;
        this.activePointer = null;
        if(this.btnType == 'left'){
	        this.frameName = 'ingame/btn-left'
        } else {
        	this.frameName = 'ingame/btn-right'
        }
	},

	update:function(){
		// if(curState().movePointer && curState().movePointer.isDown){
		// 	// console.log(curState().movePointer.circle)
		// 	var bound = this.getBounds();
		// 	if(this.btnType == 'left' && !this.isClicked && curState().rightBtn.isClicked){
		// 		var rightBtn = curState().rightBtn
		// 		// var contain = Phaser.Rectangle.contains(bound, rightBtn.activePointer.x, rightBtn.activePointer.y);
		// 		var contain = Phaser.Circle.intersectsRectangle(curState().movePointer.circle, bound)
		// 		if(contain){
		// 			this.clicked(this, curState().movePointer);
		// 			rightBtn.released();
		// 		}
		// 	} else if(this.btnType == 'right' && !this.isClicked && curState().leftBtn.isClicked){
		// 		var leftBtn = curState().leftBtn;
		// 		// var contain = Phaser.Rectangle.contains(bound, leftBtn.activePointer.x, leftBtn.activePointer.y)
		// 		var contain = Phaser.Circle.intersectsRectangle(curState().movePointer.circle, bound)
		// 		if(contain){
		// 			this.clicked(this, curState().movePointer);
		// 			leftBtn.released();
		// 		}
		// 	}
		// }

		if(this.activePointer){
			if(!this.activePointer.isDown){
				if(this.isClicked){
					this.released();
					// this.isClicked = false;
				}
			} else {
				var bound = this.getBounds();
				var contains = Phaser.Rectangle.contains(bound, this.activePointer.x, this.activePointer.y)
				if(!contains){
					if(this.isClicked){
						this.released();
					}
				}
			}
		}
	},
}, Phaser.Sprite)