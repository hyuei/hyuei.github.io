class Tutorial extends Phaser.Group {
	constructor(x, y, tutorData){
		super(game);
		this.x = x;
		this.y = y;

		this.tutorData = tutorData;
		this.create();
	}

	create(){
        this.onNext = new Phaser.Signal();
        this.onFinish = new Phaser.Signal();
        this.onStart = new Phaser.Signal();

        this.tutorIdx = 0;
        this.tutorVer = 'en'

		this.box = game.add.sprite(0, 0, 'dialogue-box');
		this.box.anchor.setTo(0.5);
		this.add(this.box)

        var x = -this.box.width * 0.43;
        var y = -this.box.height * 0.35;
        var name = this.tutorData[this.tutorIdx].char;
		this.showName = global.addText(x, y, name, 30, global.fonts1);
		this.showName.anchor.setTo(1, 0)
		this.showName.x += this.showName.width;
		this.showName.align = 'right';
		this.add(this.showName);

        var textAreaWidth = this.box.width * 0.86;
        var x = this.box.width * 0.43;
        var y = this.showName.y + this.showName.height - 5;
        // var txt = TALKING_DATA.talkingdata.Game1Screen.part1[0].en;
        var txt = this.tutorData[this.tutorIdx][this.tutorVer];
		this.showTutor = global.addText(x, y, txt, 20, global.font1);
		this.showTutor.anchor.setTo(1, 0);
		this.showTutor.wordWrap = true;
		this.showTutor.wordWrapWidth = textAreaWidth;
		this.showTutor.fill = '#834711';
		this.showTutor.align = 'right';
		this.showTutor.boundsAlignH = 'right'
		// this.showTutor.x += this.showTutor.width;
		this.add(this.showTutor)

        game.input.onDown.add(this.onDown, this);
	}

	onDown(){		
        if(transition && transition.isClosed) return;
        this.checkNext();
	}

	loadTutor(){
		var name = this.tutorData[this.tutorIdx].char;
		this.showName.setText(name);

		var tutor = this.tutorData[this.tutorIdx][this.tutorVer];
		this.showTutor.setText(tutor);
	}

	checkNext(){
		this.tutorIdx++;
		if(this.tutorIdx < this.tutorData.length){
			this.onNext.dispatch(this);
			this.loadTutor();
		} else {
            game.input.onDown.remove(this.onDown, this);
            curState().checkAfterTutor();
            // this.onNext.dispatch(this);

            // this.visible = false;
            // if(this.currentAudio != null)
            // {
            //     this.currentAudio.stop();    
            // }

            this.onFinish.dispatch(this);

            this.destroy();
		}
	}
}