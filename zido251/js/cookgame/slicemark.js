class SliceMark {
    
    constructor(game, startPos, endPos) {
        this._game = game;
        this._startPos = startPos;
        this._endPos = endPos;

        this.sliceTargetRadius = 30;
        this.scale = 1;

        this.sliceDots = [];
        
        this._nextTouchedIndex = -1;
        this._isKnifeDown = false;
        this._touchedCount = 0;
        this._slicingStarted = false;

        this._direction = 1;    // 1 = from top, -1 = from bottom

        this._wasPointerDown = false;

        this.allCutted = false;

        this.onSliced = new Phaser.Signal();

        this.IntersectedConnections = [];

        this._isActive = true;

        this.id = "";
    }

    setId(id) {
        this.id = id;
    }

    setActive(isActive) {
        this._isActive = isActive;

        for (var i = 0; i < this.sliceDots.length; i++) {
            this.sliceDots[i].visible = isActive;
        }
    }

    setGroup(group) {
        for (var i = 0; i < this.sliceDots.length; i++) {
            group.add(this.sliceDots[i]);
        }
    }

    init() {

        var angleDirection = this.getDirection() * (Math.PI / 180);
        var xDirection = Math.cos(angleDirection);
        var yDirection = Math.sin(angleDirection);

        var distance = this.getDistance();
        var targetNum = distance / (this.sliceTargetRadius * this.scale);

        for (var i = 0; i < targetNum; i++) {
            var sliceDot = this._game.add.sprite(100,0,"slicedot");
            sliceDot.alpha = 1;
            sliceDot.scale.set(this.scale);
            this.sliceDots.push(sliceDot);
            
            var xPos = this._startPos.x + (xDirection * i * this.sliceTargetRadius * this.scale);
            var yPos = this._startPos.y + (yDirection * i * this.sliceTargetRadius * this.scale);
            sliceDot.position.set(xPos, yPos);

            // custom members
            sliceDot.indexId = i;
            sliceDot.touched = false;
            
            this._game.physics.enable(sliceDot, Phaser.Physics.ARCADE);
            sliceDot.body.kinematic = true;
            sliceDot.body.setCircle(this.sliceTargetRadius);
        }
    }

    addOffset(position) {
        console.log(this._startPos);
        for (var i = 0; i < this.sliceDots.length; i++) {
            var sliceDot = this.sliceDots[i];
            var prevX = sliceDot.position.x;
            var prevY = sliceDot.position.y;
            sliceDot.position.set(prevX + position.x, prevY + position.y);
        }
        
        this._startPos.x += position.x;
        this._startPos.y += position.y;
        
        this._endPos.x += position.x;
        this._endPos.y += position.y;
        console.log(this._startPos);
    }

    setIntersectedConnections(intersectedConnections) {
        this.IntersectedConnections = intersectedConnections;
    }

    getDistance() {
        var x1 = this._startPos.x;
        var x2 = this._endPos.x;
        var y1 = this._startPos.y;
        var y2 = this._endPos.y

        var xDist = x2 - x1;
        var yDist = y2 - y1;

        var distance = Math.sqrt( (xDist * xDist) + (yDist * yDist) );
        return distance;
    }

    getDirection(){
        // get direction
        var x1 = this._startPos.x;
        var x2 = this._endPos.x;
        var y1 = this._startPos.y;
        var y2 = this._endPos.y

        var deltaX = x2 - x1;
        var deltaY = y2 - y1;
        var angle = Math.atan(deltaY/deltaX);

        if(x2 < x1) angle = angle + Math.PI;
        if(angle < 0) angle = angle + (2 * Math.PI);

        angle = angle * (180 /  Math.PI);

        return angle;
    }

    checkHit(slicer) {

        if (this.allCutted)
            return;

        if (!this._isActive)
            return;


        var ref = this;
        for (var i = 0; i < this.sliceDots.length; i++) {
            var sliceTarget = this.sliceDots[i];
            this._game.physics.arcade.overlap(slicer, sliceTarget, function(a, b){


                if(ref._isKnifeDown)
                {

                    if(!ref._slicingStarted)
                    {
                        if (sliceTarget.indexId == 0) {
                            // from top
        
                            ref._direction = 1;
                            ref._nextTouchedIndex = -1 + ref._direction;
                            ref._slicingStarted = true;
                        }else if(sliceTarget.indexId == ref.sliceDots.length-1 ){
                            // from bottom
        
                            ref._direction = -1;
                            ref._nextTouchedIndex = ref.sliceDots.length + ref._direction;
                            ref._slicingStarted = true;
                        }
                    }
    
                    if(sliceTarget.indexId == ref._nextTouchedIndex && !b.touched) {
                        b.visible = false;
                        b.touched = true;
                        ref._nextTouchedIndex += ref._direction;
    
                        ref._touchedCount++;
                    }
                }

            });
        }
        ref.checkAllSliced();
    }

    checkAllSliced(){

        var isPointerDown = false;
        var isPointerUp = false;

        if(this._game.input.activePointer.isMouse) {
            isPointerDown = this._game.input.mousePointer.isDown;
            isPointerUp = this._game.input.mousePointer.isUp
        }else{
            isPointerDown = this._game.input.pointer1.isDown;
            isPointerUp = this._game.input.pointer1.isUp;
        }

        if(isPointerDown)
        {
            this._wasPointerDown = true;
            this._isKnifeDown = true;
        }

        if(isPointerUp && this._wasPointerDown && this._touchedCount > 0) {
            if(this._touchedCount >= this.sliceDots.length-1){
                for (var i = 0; i < this.sliceDots.length; i++) {
                    var sliceTarget = this.sliceDots[i];
                    sliceTarget.destroy();
                }

                this.allCutted = true;

                this.sliceComplete();
            }else{
                // reset when not all hit
                for (var i = 0; i < this.sliceDots.length; i++) {
                    var sliceTarget = this.sliceDots[i];
                    sliceTarget.visible = true;

                    sliceTarget.touched = false;
                }
                this._nextTouchedIndex = -1;
                this._touchedCount = 0;
            }

            this._isKnifeDown = false;
            this._slicingStarted = false;
            this._wasPointerDown = false;
        }

    }

    sliceComplete() {
        this.onSliced.dispatch(this);
    }


    render() {
        // for (var i = 0; i < this.slicePos.length; i++) {
        //     this._game.debug.body(this.slicePos[i]);
        // }
    }

    clear() {
        for (var i = 0; i < this.sliceDots.length; i++) {
            this.sliceDots[i].destroy();
        }
    }
    

}