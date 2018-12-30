class SnakeBody extends Phaser.Sprite{
    constructor(game, x, y, controller, num){
        let texture = 'friend-'+num;
        super(game, x, y, texture);
        this.game = game;
        this.controller = controller;
        this.anchor.set(.5);
        this.maxSpeed = 2;
        this.speed = {x:0, y:0};
        this.grid = {x:0, y:0};
        this.trackMovement = new Array();//["up", "right"];
        this.childNumber = 0;

    }
    setGrid(x, y){
        this.grid = {x:x, y:y};
    }
    setSpeed(x, y){
        this.speed = {x:x, y:y};
    }
    setMovementSpeed(){
        let direction = this.trackMovement[0];
        let nextGrid = {x:0, y:0}
        let s = {x:0, y:0};
        if(direction == "left"){
            nextGrid.x = -1;
        }
        else if(direction == "right"){
            nextGrid.x = 1;
        }
        else if(direction == "up"){
            nextGrid.y = -1;
        }
        else if(direction == "down"){
            nextGrid.y = 1;
        }

        if(nextGrid.x != 0){
            let nx = 144 + (this.grid.x+nextGrid.x)*65;
            let checkPosX = Math.abs(this.x - nx);
            s.x = (checkPosX>this.maxSpeed)?this.maxSpeed*nextGrid.x:checkPosX*nextGrid.x;
        }
        if(nextGrid.y != 0){
            let ny = 100 + (this.grid.y+nextGrid.y)*66;
            let checkPosY = Math.abs(this.y - ny);
            s.y = (checkPosY>this.maxSpeed)?this.maxSpeed*nextGrid.y:checkPosY*nextGrid.y;
        }
        this.setSpeed(s.x, s.y);
    }
    update(){
        if(this.controller.kid.eating || this.controller.gameState != "play")return;
        this.setMovementSpeed();
        this.x += this.speed.x;
        this.y += this.speed.y;
        if(this.reachGrid()){
            //this.setGrid()
            this.trackMovement.shift();
            //console.log(this.trackMovement.length);
            let gx = (this.x-144)/65;
            let gy = (this.y-100)/66;
            this.setGrid(gx, gy);
        }
    }
    reachGrid(){
        let checkX = ((this.x-144)%65==0);
        let checkY = ((this.y-100)%66==0);
        return (checkX&&checkY);
    }
}