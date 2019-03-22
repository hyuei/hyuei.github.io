///<reference path = "../../defs/phaser.d.ts" />
///<reference path = "../../defs/phaser.comments.d.ts" />
class PopupQuestion extends Phaser.Sprite
{
    constructor(game, x, y, settings)
	{
        super(game, x, y, 'uibox', 'ask-base');
        this.anchor.set(.5);
        this.visible =false;
        this.settings = settings;
        this.languange = askThing.languange;
        this.init();
    }

    init(){
        this.arrayGoodRequests = TALKING_DATA.talkingdata.GoodAsking;
        this.arrayBadRequests = TALKING_DATA.talkingdata.BadAsking;
        this.arrayAnswer = [];
        this.intAnswer = 0;
        this.nameItem="";
        this.charInDuty=null;

        this.boxGoodChoice = this.game.add.image(0,0, 'uibox', 'box-choice');
        this.boxBadChoice = this.game.add.image(0,0, 'uibox', 'box-choice');

        this.boxBadChoice.anchor.set(.5);
        this.boxGoodChoice.anchor.set(.5);

        let boxWidth = this.boxGoodChoice.width*.9;
        let fontStle = {font: "20px vag", fill: "#000000"};
        this.textGoodRequest = this.game.add.text(0, 0, "_", fontStle);
        this.textBadRequest = this.game.add.text(0, 0, "_", fontStle);

        this.textGoodRequest.wordWrap= true;
        this.textGoodRequest.wordWrapWidth = boxWidth;
        this.textGoodRequest.anchor.set(0.5);
        this.textBadRequest.wordWrap= true;
        this.textBadRequest.wordWrapWidth = boxWidth;
        this.textBadRequest.anchor.set(.5);
        if(this.languange == "ar"){
            this.textGoodRequest.align = "right";
            this.textBadRequest.align = "right";
        }
        else{
            //this.textGoodRequest.x = -(boxWidth*.5);
            //this.textGoodRequest.y = -(this.boxGoodChoice.height*.9)*.45;
        }
        this.textReply = this.game.add.text(0, 0, "_", fontStle);
        this.textReply.anchor.set(.5);
        this.textReply.wordWrap = true;
        this.textReply.wordWrapWidth = this.width*.9;
        if(this.languange == "ar"){
            this.textReply.align = "right";
        }

        this.sndGoodChoice = this.game.add.sound('choice-right');
        this.sndBadhoice = this.game.add.sound('choice-wrong');
        this.addChild(this.boxBadChoice);
        this.addChild(this.boxGoodChoice);
        this.boxBadChoice.addChild(this.textBadRequest);
        this.boxGoodChoice.addChild(this.textGoodRequest);
        this.addChild(this.textReply);
        this.boxGoodChoice.inputEnabled = true;
        this.boxBadChoice.inputEnabled = true;
        this.events.onInputDown.add(this.nextAnswer, this);
        this.boxGoodChoice.events.onInputDown.add(this.pickGoodQuestion, this);
        this.boxBadChoice.events.onInputDown.add(this.pickBadQuestion, this);
    }

    disableInput(){
        this.inputEnabled = false;
        this.boxBadChoice.inputEnabled = false;
        this.boxGoodChoice.inputEnabled = false;
    }

    showQuestion(people, char){
        this.intAnswer = 0;
        this.visible = true;
        this.boxBadChoice.visible = true;
        this.boxGoodChoice.visible = true;
        this.textReply.visible = false;
        this.inputEnabled =false;
        //setup movement char (in game)
        this.nameItem = people.nameThing;
        if(people.thing){
            if(people.thing.visible == false)this.nameItem = "";
        }
        this.peopleInDuty = people;
        this.charInDuty = char;
        //good question
        let rnd = this.game.rnd.integerInRange(0, 4);
        let string = this.checkLang(this.arrayGoodRequests[rnd][this.languange], this.languange);
        this.textGoodRequest.text = string;
        //let ns = this.textGoodRequest.precalculateWordWrap(string);
        //let bsww = this.textGoodRequest.basicWordWrap(string);
        //console.log(ns);
        //console.log(bsww);
        
        //bad question
        rnd = this.game.rnd.integerInRange(0, 4);
        string = this.checkLang(this.arrayBadRequests[rnd][this.languange], this.languange);
        this.textBadRequest.text = string;//this.arrayBadRequests[rnd][this.languange];
        //console.log(this.textBadRequest.precalculateWordWrap(string));
        //random question in up
        let goodQuestionFirst  = (this.game.rnd.frac()>.51)?true:false;
        if(goodQuestionFirst){
            //this.textGoodRequest.x = this.textBadRequest.x = 90;
            this.boxGoodChoice.x = this.boxBadChoice.x = 0;
            this.boxGoodChoice.y = -90;
            this.boxBadChoice.y = 25;
        }
        else{
            this.boxGoodChoice.x = this.boxBadChoice.x =  0;
            this.boxBadChoice.y = -90;
            this.boxGoodChoice.y = 25;
        }
        //create transparant collider
        //add input enable text question
    }

    checkLang(string, languange){
        let str = string;
        if(languange == "ar"){
            str = string+"\u200F";
            return str;
        }
        return str;
    }

    nextAnswer(){
        let checkLength = this.arrayAnswer.length;
        this.intAnswer++;
        if(this.intAnswer < checkLength){
            let string = this.checkLang(this.arrayAnswer[this.intAnswer][this.languange], this.languange);
            this.textReply.text = string;
        }
        else{
            this.charInDuty.bringItem = this.nameItem;
            //add sprite for item
            this.settings.parent.hideQuestion(this.charInDuty, this.peopleInDuty);
        }
    }

    pickGoodQuestion(){
        //console.log("good question");
        this.sndGoodChoice.play();
        this.boxBadChoice.visible = false;
        this.boxGoodChoice.visible = false;
        this.textReply.visible = true;
        //console.log(this.nameItem);
        if(this.nameItem == "wallet"){
            this.arrayAnswer = TALKING_DATA.talkingdata.BringWallet;
        }
        else if(this.nameItem == ""){
            this.arrayAnswer  = TALKING_DATA.talkingdata.EmptyHand;
        }
        else{
            this.arrayAnswer =TALKING_DATA.talkingdata.AcceptQuestion;
        }
        let string = this.checkLang(this.arrayAnswer[0][this.languange], this.languange);
        this.textReply.text = string;
        //this.textReply.x = 90;
        //this.textReply.y = 50;

        this.inputEnabled =true;
    }


    
    pickBadQuestion(){
        this.nameItem = "";
        this.sndBadhoice.play();
        this.boxBadChoice.visible = false;
        this.boxGoodChoice.visible = false;
        this.textReply.visible = true;
        this.arrayAnswer  = TALKING_DATA.talkingdata.RefuseQuestion;
        let string = this.checkLang(this.arrayAnswer[0][this.languange], this.languange);
        this.textReply.text = string;
        //this.textReply.x = 90;
        //this.textReply.y = 50;
        this.inputEnabled =true;
    }
}