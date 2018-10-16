class DesignerScreen
{
    constructor(game)
    {
        this.platforms = [];
        this.wasDown = false;
    }

    preload() {
        game.load.image("stone-idle","assets/stone-idle.png");
        game.load.image("stone-red", "assets/stone-red.png");
        game.load.image("stone-shine", "assets/stone-shine.png");
        game.load.image('play-btn', 'assets/play-btn.png');
        game.load.bitmapFont('arabnumbers', 'assets/fonts/arabnumber.png', 'assets/fonts/arabnumber.fnt');
    }

    create() {
        console.log("designer screen");
        game.input.mouse.capture = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        // draw button
        var button = game.add.button(0, 0, 'play-btn', this.actionOnClick, this);
             this.spawnRock(200,200);
    }

    onDown(avatar) {

    }

    update() {
        if(game.input.activePointer.isDown && !this.wasDown){
            if(game.input.activePointer.leftButton.isDown)
            {
                var x = game.input.mousePointer.x;
                var y = game.input.mousePointer.y;

                if(y > 80)
                {
                    console.log("x:" + x + " y:" + y);
                    this.wasDown = true;
                    this.spawnRock(x, y);

                }
            }
        }else if(game.input.activePointer.isUp){
            this.wasDown = false;
        }
    }

    spawnRock(x, y) {
        var platform = new Platform(this.game, x,y);
        platform.inputEnabled = true;
        
        this.game.add.existing(platform);
        
        platform.events.onInputDown.add(this.rockClickListener, this);
        
        this.platforms.push(platform);
        this.updateText();
        
    }

    rockClickListener(sprite, pointer){
        
        if(pointer.rightButton.isDown)
        {
            this.platforms = this.platforms.filter(function(el) {
                return el !== sprite;
            });
            sprite.destroy();
            this.updateText();
        }

    }

    writePositions() {

    }

    actionOnClick() {
        var positionArr = [];

        for (var i = 0; i < this.platforms.length; i++) {
            var x = this.platforms[i].x;
            var y = this.platforms[i].y;
            positionArr.push([x,y]);
        }
        var arrString = JSON.stringify(positionArr);
        console.log(arrString);
    }

    updateText()
    {
        for (var i = 0; i < this.platforms.length; i++) {
            var platform = this.platforms[i];
            platform.setNumber(i.toString());
        }
        
    }

}