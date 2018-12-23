class TreeGame {
    constructor(game) {
        this.Score = 0;
        this.IsPlaying = true;

        this.OnScoreAdded = new Phaser.Signal();


        this._game = game;
        this._trunkHeight = 303;
        this._offset = (this._game.height/2) - this._trunkHeight;

        this._goodBranchRightPos = 525;
        this._goodBranchLeftPos = 435;

        this._badBranchRightPos = 665;
        this._badBranchLeftPos = 295;

        this._treeGroup = null;
        this._branchGroup = null;
        this._characterGroup = null;

        this._trunks = [];
        this._branches = [];

        this._leftBranches = [];
        this._rightBranches = [];

        this._lastTrunkIndex = 0;

        this._isButtonDown = false;

        this._movingTime = 0;
        this._treeSpeed = 1200;
        this._targetMovement = 0;
        this._treeDirection = 1;
        this._targetCharacterPos = {x:0, y:0};

        this._isLastBranchRight = true;
        this._isLastBranchGood = true;
        this._isLastLastBranchGood = true;
        
        this._isTreeMoving = false;
        this._isCharacterArrived = false;
        this._isCharacterOnAir = false;


        this._character = null;

        this._currentTargetBranch = null;
        this._currentTargetBranchIndex = 0;

        this._previousTargetBranch = null;
        this._previousTargetBranchIndex = 0;
        this._previousTargetCharacterPos = {x:0, y:0};
        this._isFallback = false;

        this._maxDistance = 250;

        this._leftBranchOffset = {x:-100, y: -30};
        this._rightBranchOffset = {x:100, y: -30};

        this._yNewBranchDistance = 120;
    }

    AddScore(value) {
        this.Score += value;
        this.OnScoreAdded.dispatch(this.Score);

    }

    init() {
        this._game.input.mouse.capture = true;
        this.createGame();

        this.jumpSound = this._game.add.audio("jump-branch", true);
        this.breakSound = this._game.add.audio("break-branch", true);
    }

    createGame() {
        this._treeGroup = this._game.add.group();
        this._branchGroup = this._game.add.group();
        this._characterGroup = this._game.add.group();

        this.createTree();

        // initial branches
        let initRight = false;
        let initGood = true;
        for (var i = 0; i < 12; i++) {
            this.spawnBranch(initRight, initGood);

            initRight = !initRight;
        }

        this.createCharacter();


        var keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        keyLeft.onDown.add(this.jumpLeft, this);

        var keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        keyRight.onDown.add(this.jumpRight, this);
    }

    createCharacter() {
        this._targetCharacterPos.x = this._game.width/2;
        this._targetCharacterPos.y = this._game.height - 100;

        this._character = this._game.add.sprite(this._targetCharacterPos.x, this._targetCharacterPos.y, "bilal-jump-2");
        this._character.anchor.set(0.5, 0.5);
        this._characterGroup.add(this._character);

        this._characterJump = this._game.add.sprite(this._targetCharacterPos.x, this._targetCharacterPos.y, "bilal-jump");
        this._characterJump.anchor.set(0.5, 0.5);
        this._characterGroup.add(this._characterJump);
        this._characterJump.visible = false;

    }

    createTree() {
        for (var i = -2; i < 4; i++) {
            var yPosition = -(i * this._trunkHeight) + (this._game.height/2) + this._offset;

            var trunk = this._game.add.sprite(this._game.width/2, yPosition, "trunk");
            trunk.anchor.set(0.5, 0);
            this._treeGroup.add(trunk);

            this._trunks.push(trunk);
        }

        this._lastTrunkIndex = this._trunks.length-1;
    }
    

    spawnBranch(isRightPos, isGoodBranch) {
        this._isLastBranchRight = isRightPos;
        this._isLastLastBranchGood = this._isLastBranchGood;
        this._isLastBranchGood = isGoodBranch;
        
        var branchData = {
            sprites: [],
            isGood: true,
            isRight: isRightPos,
            visited: false
        }
        
        if (isGoodBranch) {
            branchData.isGood = true;

            var xPos = 0;
            if(isRightPos) {
                xPos = this._goodBranchRightPos;
            }else{
                xPos = this._goodBranchLeftPos;
            }

            // good branch
            var branch = this._game.add.sprite(xPos, 0, "branch");
            branch.anchor.set(0,0);
            this._branchGroup.add(branch);
            
            branchData.sprites.push(branch);
            
            if(!isRightPos) {
                branch.scale.x = -1;



                // get last branch
                if(this._rightBranches.length > 0) {
                    var lastBranch = this._rightBranches[this._rightBranches.length-1].sprites[0];
                    branch.position.y = lastBranch.position.y - this._yNewBranchDistance;
                }else{
                    branch.position.y = this._game.height - this._yNewBranchDistance;
                }

                this._leftBranches.push(branchData);
            }else{

                // get last branch 
                if(this._leftBranches.length > 0) {
                    var lastBranch = this._leftBranches[this._leftBranches.length-1].sprites[0];
                    branch.position.y = lastBranch.position.y - this._yNewBranchDistance;
                }else{
                    branch.position.y = this._game.height - this._yNewBranchDistance;
                }

                this._rightBranches.push(branchData);
            }



        }else{

            branchData.isGood = false;
            
            var xPos = 0;
            if(isRightPos) {
                xPos = this._badBranchRightPos;
            }else{
                xPos = this._badBranchLeftPos;
            }

            // bad branch
            var branch1 = this._game.add.sprite(xPos, 0, "branch-snap-a");
            branch1.anchor.set(0,0);
            this._branchGroup.add(branch1);
            branchData.sprites.push(branch1);

            var branch2 = this._game.add.sprite(xPos, 0 + 60, "branch-snap-b");
            branch2.anchor.set(0,0);
            this._branchGroup.add(branch2);
            branchData.sprites.push(branch2);

            if(isRightPos) {
                branch1.scale.x = -1;

                branch2.scale.x = -1;
                branch2.position.x += 165;

                // get last branch
                if(this._leftBranches.length > 0) {
                    var lastBranch = this._leftBranches[this._leftBranches.length-1].sprites[0];
                    branch1.position.y = lastBranch.position.y - this._yNewBranchDistance;
                    branch2.position.y = branch1.position.y + 60;
                }else{
                    branch.position.y = this._game.height - this._yNewBranchDistance;
                }

                this._rightBranches.push(branchData);
            }else{
                branch2.position.x -= 165;

                

                // get last branch
                if(this._rightBranches.length > 0) {
                    var lastBranch = this._rightBranches[this._rightBranches.length-1].sprites[0];
                    branch1.position.y = lastBranch.position.y - this._yNewBranchDistance;
                    branch2.position.y = branch1.position.y + 60;
                }else{
                    branch.position.y = this._game.height - this._yNewBranchDistance;
                }

                this._leftBranches.push(branchData);
            }
        }

        this._branches.push(branchData);
    }

    prepareNewBranch() {
        var random = Math.floor((Math.random() * 2));

        if(this._isLastBranchRight) 
        {
            if(this._isLastLastBranchGood) {
                if(random == 0) {
                    this.spawnBranch(false, true);
                }else{

                    if(this._isLastBranchGood) {
                        this.spawnBranch(false, false);
                    }else{
                        this.spawnBranch(false, true);
                    }

                }
            }else {
                this.spawnBranch(false, true);
            }

            
        }else{
            if(this._isLastLastBranchGood) {
                if(random == 0) {
                    this.spawnBranch(true, true);
                }else{

                    if(this._isLastBranchGood) {
                        this.spawnBranch(true, false);
                    }else{
                        this.spawnBranch(true, true);
                    }
                }
            }else {
                this.spawnBranch(true, true);
            }
        }
    }

    update() {

        if (!this.IsPlaying) {
            return;
        }
        

        var posX = 0;
        var posY = 0;
        if (this._game.input.activePointer.isMouse) {
            posX = this._game.input.mousePointer.x;
            posY = this._game.input.mousePointer.y;

            // if(this._game.input.activePointer.rightButton.isDown) {
            //     this._targetMovement = 100;
            //     this._isTreeMoving = true;
            //     this._treeDirection = -1;
            //     console.log("MOVE");
            // }

            if(this._game.input.activePointer.leftButton.isDown && !this._isButtonDown) {
                this._isButtonDown = true;

                if(posX < this._game.width/2) {
                    this.jumpLeft();
                }else{
                    this.jumpRight();
                }
            }
        } else {
            posX = this._game.input.pointer1.x;
            posY = this._game.input.pointer1.y;

            if(this._game.input.pointer1.isDown && !this._isButtonDown) {
                this._isButtonDown = true;
                if(posX < this._game.width/2) {
                    this.jumpLeft();
                }else{
                    this.jumpRight();
                }
            }
        }
        
        if(this._game.input.activePointer.leftButton.isUp) {
            this._isButtonDown = false;
        }

        
        if(this._isTreeMoving) {
            this.updateTreeMove();
        }

        if(this._isCharacterOnAir) {
            this._character.visible = false;
            this._characterJump.visible = true;

            this._characterJump.position.x = this._character.position.x;
            this._characterJump.position.y = this._character.position.y;
        }else{
            this._character.visible = true;
            this._characterJump.visible = false;
        }


        this.updateCharacterMove();

        
    }

    jumpLeft() {
        if(this._isTreeMoving || this._isCharacterOnAir)
            return;

        this.evaluateBranchToSelect(this._leftBranches, this._leftBranchOffset );

        this.triggerMove();
    }

    jumpRight() {
        if(this._isTreeMoving || this._isCharacterOnAir)
            return;

        this.evaluateBranchToSelect(this._rightBranches, this._rightBranchOffset);

        this.triggerMove();
    }

    evaluateBranchToSelect(branchArray, characterOffset){
        
        var isBranchFound = false;
        
        this._previousTargetBranch = this._currentTargetBranch;
        this._previousTargetBranchIndex = this._currentTargetBranchIndex;
        this._previousTargetCharacterPos = {x: this._targetCharacterPos.x, y:this._targetCharacterPos.y};

        var currentCharPos = this._targetCharacterPos;
        var selectedTargetPosY = currentCharPos.y;
        var selectedTargetPosX = 1000;

        // get nearest branch position
        for (var i = 0; i < branchArray.length; i++) {
            var branch = branchArray[i];
            let position = branch.sprites[0].position; 

            
            var distance = currentCharPos.y - position.y;

            if(position.y < selectedTargetPosY){

                if(distance < this._maxDistance) {
                    this._currentTargetBranch = branch;
                    this._currentTargetBranchIndex = i;
    
                    selectedTargetPosY = position.y;
                    selectedTargetPosX = position.x;
                    
                    isBranchFound = true;
                    break;
                }else{
                    console.log("Distance:" + distance);
                }
            }
        }
        
        if(isBranchFound) {
            this._targetCharacterPos = {x: selectedTargetPosX + characterOffset.x, y: selectedTargetPosY + characterOffset.y};
        }else{
            console.log("branch not found");
        }
    }

    triggerMove() {
        var deltaPos = this._game.height - this._targetCharacterPos.y - (this._trunkHeight * 0.65);
        this._targetMovement = deltaPos;
        this._treeDirection = 1;

        this._isCharacterOnAir = true;

        this.jumpSound.play();
    }

    updateTreeMove() {
        var timeElapsed = this._game.time.elapsed/1000;
        var movement = this._treeSpeed * timeElapsed;

        if(this._targetMovement > 0) {

            this.moveTrunks(movement * this._treeDirection);
            this.moveBranches(movement * this._treeDirection);

            this.moveCharacter(0, movement * this._treeDirection);

            this._targetMovement -= movement;
        }else{
            this._isTreeMoving = false;
        }
    }


    updateCharacterMove() {
        var deltaY = Math.abs(this._character.position.y - this._targetCharacterPos.y);

        if(deltaY > 20) {
            this._character.position.x = this._character.position.x - (this._character.position.x - this._targetCharacterPos.x)/ 15;
            this._character.position.y = this._character.position.y - (this._character.position.y - this._targetCharacterPos.y)/ 5;
        }else{
            this._character.position.x = this._character.position.x - (this._character.position.x - this._targetCharacterPos.x)/ 8;
            this._character.position.y = this._character.position.y - (this._character.position.y - this._targetCharacterPos.y)/ 2;
        }

        if(deltaY < 4) {
            if(this._isCharacterOnAir) {
                

                this.characterStepOnBranch();
                
                this._isCharacterOnAir = false;
            }
            this._isCharacterArrived = true;
        }else{
            this._isCharacterArrived = false;
            
        }

    }

    characterStepOnBranch() {

        
        if(this._currentTargetBranch.isGood){
            
            console.log("Step succeed");

            // if(!this._isFallback) {
                this._isTreeMoving = true;
            // }

            this._isFallback = false;

            if(!this._currentTargetBranch.visited) {
                this._currentTargetBranch.visited = true;
                this.AddScore(1);
            }
        }else{

            // this._isCharacterOnAir = true;

            this.breakSound.play();
            console.log("Branch break");

            // remove branch
            for(var i = 0; i < this._currentTargetBranch.sprites.length; i++ ){
                this._currentTargetBranch.sprites[i].visible = false;
            }

            
            var position = this._currentTargetBranch.sprites[0].position;
            this.spawnFallBranch(this._currentTargetBranch.isRight, position.x, position.y);

            

            // this._currentTargetBranch = this._previousTargetBranch;
            // this._currentTargetBranchIndex = this._previousTargetBranchIndex;
            // this._targetCharacterPos = this._previousTargetCharacterPos;
            
            // fall under
            if(this._currentTargetBranch.isRight) {
                // get branch under it
                for (var i = this._rightBranches.length-1; i >= 0 ; i--) {
                    if(this._rightBranches[i] === this._currentTargetBranch){
                        var targetIndex = i-1;

                        this._currentTargetBranch = this._rightBranches[targetIndex];
                        this._currentTargetBranchIndex = targetIndex;

                        this._targetCharacterPos = {x: this._currentTargetBranch.sprites[0].position.x, y: this._currentTargetBranch.sprites[0].position.y};
                        this._targetCharacterPos.x += this._rightBranchOffset.x;
                        this._targetCharacterPos.y += this._rightBranchOffset.y;

                        // remove bad branch
                        this._rightBranches.splice(i, 1);
                        break;
                    }
                }
            }else{
                console.log("cari bawahnya");
                for (var i = this._leftBranches.length-1; i >= 0; i--) {
                    console.log(i);
                    console.log(this._leftBranches[i]);
                    if(this._leftBranches[i] === this._currentTargetBranch){
                        console.log("yang ini:" + i);
                        var targetIndex = i-1;

                        this._currentTargetBranch = this._leftBranches[targetIndex];
                        this._currentTargetBranchIndex = targetIndex;

                        this._targetCharacterPos = {x: this._currentTargetBranch.sprites[0].position.x, y:  this._currentTargetBranch.sprites[0].position.y};
                        this._targetCharacterPos.x += this._leftBranchOffset.x;
                        this._targetCharacterPos.y += this._leftBranchOffset.y;

                        // remove bad branch
                        this._leftBranches.splice(i, 1);
                        break;  
                    }
                }
            }

            // move tree back
            var deltaPos = Math.abs(this._game.height - this._targetCharacterPos.y - (this._trunkHeight * 0.65));
            console.log(deltaPos);
            if(deltaPos > 15) {
                this._targetMovement = deltaPos;            
                this._treeDirection = -1;
            }else{
                this._targetMovement = 0;
            }
            this._isTreeMoving = true;
            this._isFallback = true;

        }
    }

    moveCharacter(xDistance, yDistance) {
        this._targetCharacterPos.x += xDistance;
        this._targetCharacterPos.y += yDistance;
    }

    moveTrunks(yDistance) {
        for (var i = 0; i < this._trunks.length; i++) {
            var trunk = this._trunks[i];
            
            if(trunk.position.y >= this._game.height + (this._trunkHeight * 2) ) {
                var index = this._trunks.length-1;
                var yPosition = this._trunks[this._lastTrunkIndex].position.y - this._trunkHeight;

                if(i == 0) {
                    trunk.position.set(trunk.position.x,  yPosition + yDistance);
                }else{
                    trunk.position.set(trunk.position.x,  yPosition);
                }
                
                this._lastTrunkIndex++;
                if(this._lastTrunkIndex >= this._trunks.length)
                {
                    this._lastTrunkIndex = 0;
                }
            }else{
                trunk.position.set(trunk.position.x, trunk.position.y + yDistance);
            }
        }
    }

    moveBranches(yDistance) {
        for (var i = this._branches.length-1; i >= 0 ; i--) {
            var branch = this._branches[i];
            
            var branchSprites = branch.sprites;
            for (var itSprite = branchSprites.length-1; itSprite >=0; itSprite--) {
                var branchSprite = branchSprites[itSprite];
                branchSprite.position.set(branchSprite.position.x, branchSprite.position.y + yDistance);
            
                if(branchSprite.position.y > this._game.height + 200) {

                    branchSprites.splice(itSprite, 1);
                    branchSprite.destroy();
                    
                    // check on left branches
                    for (var itLeftBranch = this._leftBranches.length-1; itLeftBranch >= 0; itLeftBranch--) {
                        if(this._leftBranches[itLeftBranch] == branch) {
                            this._leftBranches.splice(itLeftBranch, 1);
                        }
                    }

                    // check on right branches
                    for (var itRightBranch = this._rightBranches.length-1; itRightBranch >= 0; itRightBranch--) {
                        if(this._rightBranches[itRightBranch] == branch) {
                            this._rightBranches.splice(itRightBranch, 1);
                        }
                    }

                    if(branchSprites.length <= 0) {
                        this._branches.splice(i, 1);
                        this.prepareNewBranch();
                    }
                }
            }
        }
    }

    spawnFallBranch(isRightPos, xPos, yPos) {

        var branch1 = this._game.add.sprite(xPos, yPos, "branch-snap-a");
        branch1.anchor.set(0,0);
        
        var branch2 = this._game.add.sprite(xPos, yPos + 60, "branch-snap-b");
        branch2.anchor.set(0,0);

        if(isRightPos)
        {
            branch1.scale.x = -1;
            branch2.scale.x = -1;

            branch2.position.x += 165;
        }else{
            branch2.position.x -= 165;
        }

        var tween1 = this._game.add.tween(branch1).to( {y: 800}, 3000, Phaser.Easing.Quartic.Out, true );
        var tween2 = this._game.add.tween(branch2).to( {y: 800}, 1000, Phaser.Easing.Quartic.Out, true );

        tween1.onComplete.add(function(){
            branch1.destroy();
        }, this);

        tween2.onComplete.add(function(){
            branch2.destroy();
        }, this);
    }
}