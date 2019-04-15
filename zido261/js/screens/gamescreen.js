GameScreen = function(game){

};

GameScreen.inherit({
	create:function(){
		BaseState.prototype.create.call(this);

		this.preReady = false;
		this.isReady = false;
		
		this.clickCover = game.add.sprite(this.centerX, this.centerY, 'bg');
		this.clickCover.anchor.setTo(0.5);
		this.clickCover.alpha = 0;
		this.clickCover.inputEnabled = true;
		this.gFG.add(this.clickCover);
	},

	changePage:function(namePage){		
		this.clickCover.visible = true;
		transition.close(namePage);
	},

	createCustomPointer:function(){
        this.customPointer = new CustomPointer(game, -100, -100);
        this.game.add.existing(this.customPointer);
    },

    createLogo:function(){
        this.logo = game.add.sprite(game.world.width-90, 0 + 10, "ingame");
        this.logo.frameName ='ingame/zido-logo'
    },

	countMin:function(time){
		time = this.countSec(time);

		var minute = parseInt(time / 60);
		var sec = parseInt(time - (minute * 60));

		var minTxt = minute + '';
		if(minute < 10) minTxt = '0' + minute;

		var secTxt = sec + '';
		if(sec < 10) secTxt = '0' + sec;

		var showTime = minTxt + ':' + secTxt;
		return showTime;
	},

	countSec:function(time){
		var tempTime = Math.floor(time);
		var showTime = tempTime;

		if(tempTime > 0){
			var checkTime = time % tempTime;

			if(checkTime > 0){
				// console.log(checkTime)
				showTime = tempTime + 1;
			}
		} else {
			if(time > tempTime){
				showTime += 1;
			} else {
				showTime = 0;
			}
		}

		return showTime;
	},

	writeThousands:function(score){
		var showScore = score + '';

		if(score >= 1000){
			var count = 0;
			var countScore = showScore;
			showScore = '';
			for(var a = countScore.length - 1; a >= 0; a--){
				var toShow = countScore[a];
				if(count % 3 == 0 && a < countScore.length - 1){
					toShow += ',';
					count = 0;
				}

				var tempShow = toShow + showScore;
				showScore = tempShow;

				count++;
			}
		}

		return showScore;
	},

    update:function(){
    	if(!this.preReady){
    		this.preReady = true;
    	}
    	
    	if(transition){
	    	if(!transition.isAnimating && transition.isClosed){
    			transition.open();
	    	}	

	    	if(!transition.isClosed && !this.isReady){
	    		this.isReady = true;
	    		this.clickCover.visible = false;
	    	}
    	} 
    }
}, BaseState);