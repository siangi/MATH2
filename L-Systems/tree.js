class Tree {
    constructor(startLength, turnAngle, startPos, generatorString, startWeight){
        this.length = startLength;
        this.turnAngle = turnAngle;
        this.startPos = startPos;
        this.generatorString = generatorString;
        this.weight = startWeight;
        this.lengthFactor = 0.5;
        this.weightFactor = 0.6;
        this.states = new Array();
        this.currentPos = startPos;
        this.currentAngle = 90;
    }

    saveState(){
        let toSave = {
            angle: this.currentAngle,
            position: this.currentPos,
            weight: this.weight,
            length: this.length,
        }

        this.states.push(toSave);
    }

    loadPreviousState(){
        let state = this.states.pop();
        this.currentAngle = state.angle;
        this.currentPos = state.position;
        this.weight = state.weight;
        this.length = state.length;
    }

    alterLengthAndWeight(){
        
        this.length *= this.lengthFactor;
        this.weight *= this.weightFactor;
    }

    addAngle(){
        this.currentAngle += turnAngle;
    }

    subtractAngle(){
        this.currentAngle -= turnAngle;
    }
}