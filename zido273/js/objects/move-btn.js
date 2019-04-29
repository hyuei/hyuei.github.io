MoveBtn = function(x, y, frameName, btnType){
	Phaser.Sprite.call(this, game, x, y, 'ingame');
	this.frameName = frameName;
	this.btnType = btnType;

	this.onClick = new Phaser.Signal();
	this.onReleased = new Phaser.Signal();

	this.isClicked = false;
	this.inputEnabled = true;
	this.activePointer  = null;

	this.events.onInputDown.add(this.clicked, this)
	this.events.onInputOver.add(this.clicked, this);
	this.events.onInputUp.add(this.released, this)
	this.events.onInputOut.add(this.released, this)
};

MoveBtn.inherit({
	clicked:function(obj, pointer){
		console.log(pointer)
		this.activePointer = pointer;
        this.isClicked = true;
        if(this.btnType == 'left'){        	
	        this.frameName = 'ingame/btn-left-down'
        } else {
        	this.frameName = 'ingame/btn-right-down'
        }
	},

	released:function(obj, pointer){		
        this.isClicked = false;
        if(this.btnType == 'left'){
	        this.frameName = 'ingame/btn-left'
        } else {
        	this.frameName = 'ingame/btn-right'
        }
	},

	update:function(){
		// Phaser.Sprite.prototype.update.call(this)
		if(this.activePointer && !this.activePointer.isDown){
			if(this.isClicked){
				this.released();
				// this.isClicked = false;
			}
		}
	},
}, Phaser.Sprite)