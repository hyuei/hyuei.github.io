class SnakeHead extends Phaser.Sprite{
    constructor(game, x, y, controller){
        super(game, x, y, 'char');
        this.controller = controller;
        this.anchor.set(.5);
        this.addAnims();
        this.maxSpeed = 2;
        this.speed = {x:0, y:0};
        this.grid = {x:0, y:0};
        this.direction = "right";
        this.nextDirection = "";
        this.eating =false;
        this.process = {x:0, y:0};
        this.recMovement = new Array();
    }
    addAnims(){
        this.animations.add("down",  ["chara-down-01.png", "chara-down-02.png", "chara-down-03.png", "chara-down-02.png"], 6, true, false);
        this.animations.add("side",  ["chara-side-01.png", "chara-side-02.png", "chara-side-03.png", "chara-side-02.png"], 6, true, false);
        this.animations.add("up",  ["chara-up-01.png", "chara-up-02.png", "chara-up-03.png", "chara-up-02.png"], 6, true, false);
    }
    setGrid(x, y){
        this.grid = {x:x, y:y};
    }
    setSpeed(x, y){
        this.speed = {x:x, y:y};
    }
    setMovementSpeed(){
        let nextGrid = {x:0, y:0};
        let s = {x:0, y:0};
        if(this.direction == "left"){
            nextGrid.x = -1;
        }
        else if(this.direction == "right"){
            nextGrid.x = 1;
        }
        else if(this.direction == "up"){
            nextGrid.y = -1;
        }
        else if(this.direction == "down"){
            nextGrid.y = 1;
        }

        if(nextGrid.x != 0){
            let nx = 144 + (this.grid.x+nextGrid.x)*65;
            let checkPosX = Math.abs(this.x - nx);
            s.x = (checkPosX>this.maxSpeed)?this.maxSpeed*nextGrid.x:checkPosX*nextGrid.x;
        }
        if(nextGrid.y != 0){
            let ny = 80 + (this.grid.y+nextGrid.y)*66;
            let checkPosY = Math.abs(this.y - ny);
            s.y = (checkPosY>this.maxSpeed)?this.maxSpeed*nextGrid.y:checkPosY*nextGrid.y;
        }
        this.setSpeed(s.x, s.y);
    }
    playAnims(anims){
        if(anims == "left"){
            this.scale.x = -1;
            this.animations.play("side");
        }
        else if(anims == "right"){
            this.scale.x = 1;
            this.animations.play("side");
        }
        else if(anims == "up"){
            this.animations.play("up");
        }
        else if(anims == "down"){
            this.animations.play("down");
        }
        this.direction = anims;
    }
    update(){
        if(this.controller.gameState != "play")return;
        this.setMovementSpeed();
        this.x += this.speed.x;
        this.y += this.speed.y;
        if(this.reachGrid()){
            //this.setGrid()
            let gx = (this.x-144)/65;
            let gy = (this.y-80)/66;
            this.setGrid(gx, gy);
            if(this.nextDirection != ""){
                this.playAnims(this.nextDirection);
                this.direction = this.nextDirection;
                this.controller.direction = this.nextDirection;
                this.nextDirection = "";
            }
            if(this.eating){
                this.controller.spawnSnakeBody(this.process.x, this.process.y, this.recMovement);
                this.eating = false;
                this.recMovement.shift();
            }
            this.controller.pushMovement(this.direction);
            this.controller.checkCollider(gx, gy);
            this.controller.selfCollision(gx, gy);
            //this.controller.updateHeadReachgread(gx, gy);
        }
    }
    eatFood(x, y){
        this.process = {x:x, y:y};
        this.eating = true;
        this.recMovement.push(this.direction);
    }
    reachGrid(){
        let checkX = ((this.x-144)%65==0);
        let checkY = ((this.y-80)%66==0);
        return (checkX&&checkY);
    }
}