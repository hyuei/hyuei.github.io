BaseState = function(game)	{
}

BaseState.prototype = {
	ctr:0,
	isActive: true,
	init: function() {
		this.gw = BasicGame.gameWidth;
		this.gh = BasicGame.gameHeight;
		this.centerX = this.gw*0.5;
		this.centerY = this.gh*0.5;
		this.nm = "BaseState";
	},
	preload: function () {
		// Asset.png('loading_bar');
		game.load.onFileComplete.add(this.fileComplete, this);
	},

	fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {
		// trace("FILE COMPLETE:",progress,cacheKey,success,totalLoaded,totalFiles);
		this.createPreloader();
		if (this.loading_hati){
	  		this.loading_hati.width = this.loading_hati.temp_width * (progress/100)
	  		if(progress == 100) this.loading_hati.destroy();
		}
			
	  	if (this.text_loading){
	    	this.text_loading.setText(progress+"%")
	    	if(progress == 100) this.text_loading.destroy();
	  	}

	    if (progress == 100){
	    	if(this.text_wait) this.text_wait.destroy();
	    	transition.open();
			game.load.onFileComplete.remove(this.fileComplete, this);
	    }
	},

	createPreloader: function() {
		if (this.preloaderCreated) return;
		this.preloaderCreated = true;

        this.loading_hati = game.add.sprite(0,0,'loading_bar');
        this.loading_hati.x = BasicGame.viewWidth/2-this.loading_hati.width/2;       
        this.loading_hati.y = BasicGame.viewY + BasicGame.viewHeight/2;

        this.text_wait = game.add.text( this.loading_hati.x+this.loading_hati.width/2,this.loading_hati.y-25, "loading..", {
            font:"31px Times New Roman", fill:"#FFFFFF",fontWeight:"bold", align:"center"});  
        this.text_wait.anchor.set(0.5);

        this.text_loading = game.add.text( this.loading_hati.x+this.loading_hati.width/2,this.loading_hati.y+this.loading_hati.height+25, "0%", {
            font:"31px Times New Roman", fill:"#FFFFFF",fontWeight:"bold", align:"center"});  
        this.text_loading.anchor.set(0.5);

        this.loading_hati.temp_width = this.loading_hati.width;
        this.loading_hati.width = 0;
	},

	create: function() {
		this.gBG = game.add.group();
		this.gCont = game.add.group();
		this.gFront = game.add.group();
		this.gFG = game.add.group();
		this.g0 = game.add.group();
	},

	loadingAnim: function() {
		if (!this.loading_0) return;
		this.ctr--;
		if (this.ctr>0) return;
		this.ctr = 3;

		var tx = this.loading_0.x;
		for (i = 0; i<7; i++) {
			this["loading_"+i].x = this["loading_"+(i+1)].x;
		}
		this.loading_7.x = tx;
	},
	loadUpdate: function() {
		// trace("loadUpdate");
		// this.loadingAnim();
	},
	update: function() {
		// trace("update");
		// this.loadingAnim();
	},
	shutdown: function() {

	},
	onResize: function() {
		global.init();
		var isLandscape = (global.viewHeight < global.viewWidth);
		if  (isLandscape != global.landscape) {
			// incorrect orientation
			// document.getElementById('orientation').style.display = 'block';
		}
		else {
			// correct orientation
			document.getElementById('orientation').style.display = 'none';
		}

		if (this.gPreloader){
			this.gPreloader.fitToCenter(BasicGame.gameWidth, BasicGame.gameHeight, global.viewWidth, global.viewHeight);
		}
		
		if (this.gCont){
			this.gCont.fitToCenter(BasicGame.gameWidth, BasicGame.gameHeight, global.viewWidth, global.viewHeight);
			// trace("SCALE GCONT",this.gCont.scale.x, this.gCont.scale.y);
		}

		if(this.gBG){
			this.gBG.fitToCenter(BasicGame.gameWidth, BasicGame.gameHeight, global.viewWidth, global.viewHeight);
		}

		if(this.gFront){
			this.gFront.fitToCenter(BasicGame.gameWidth, BasicGame.gameHeight, global.viewWidth, global.viewHeight);
		}

		if (this.gSkillBtn){
			// this.gSkillBtn.fitToCenter(BasicGame.gameWidth, BasicGame.gameHeight, global.viewWidth, global.viewHeight);
		}

		if (this.bg){
			if (this.bg.isStretch)
				this.bg.stretch(this.world.width, this.world.height);
		}

		if (this.gFG){
			this.gFG.fitToCenter(BasicGame.gameWidth, BasicGame.gameHeight, global.viewWidth, global.viewHeight);
		}

		if (this.g0){
			this.g0.fitToCenter(BasicGame.gameWidth, BasicGame.gameHeight, global.viewWidth, global.viewHeight);
		}

		if (this.black80) {
			this.black80.stretch(this.world.width*1.1, this.world.height*1.1);
			this.black80.x = this.world.width*-0.05;
			this.black80.y = this.world.height*-0.05;
		}
	},
};