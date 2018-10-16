class PartConnection {
    constructor(id, sourceArray, targetArray) {
        this.id = id;
        this.sourceParts = sourceArray;
        this.targetParts = targetArray;
    }

    break() {
        console.log("break " + this.sourceParts[0].id + " and " + this.targetParts[0].id);
    }

    addSourceOffset(x, y){
        for (var i = 0; i < this.sourceParts.length; i++) {
            var part = this.sourceParts[i];
            part.position.set(part.position.x + x, part.position.y + y);
        }
    }

    addSourceAngle(angle){
        for (var i = 0; i < this.sourceParts.length; i++) {
            var part = this.sourceParts[i];
            part.angle = angle;
        }
    }
}