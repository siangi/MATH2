const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = CANVAS_HEIGHT;
const GENERATION_COUNT = 4;
const END_TURN_ANGLE = 50;
const LENGTH_FACTOR = 0.5;
const WEIGHT_FACTOR = 0.6;
const STARTPOS = [400, 800];

let startWeight = 20;
let startLength = 300;

let weight;
let position;
let length;
let angle = 90;
let savedStates = [];
let turnAngle = 0;

function setup(){
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    angleMode(DEGREES);
    frameRate(10);
    startLength -= END_TURN_ANGLE * 3;
}

function draw(){
    if (turnAngle <= END_TURN_ANGLE){
        background("#71d6ed");
        turnAngle += 1;
        startLength += 3;
        makeTree(STARTPOS, "|[--F][-F][F][+F][++F]", startLength, startWeight);
    }    
}

function makeTree(startPos, rule, beginLength, beginWeight){
    const REPLACE_RULE = rule;
    const TO_REPLACE = "F";
    let makerString = "F"
    position = startPos;
    length = beginLength;
    weight = beginWeight;
    console.log(makerString);
    

    for(i = 0; i < GENERATION_COUNT; i++){
        makerString = updateMakerString(makerString, TO_REPLACE, REPLACE_RULE);
    }

    drawString(makerString);
}

function updateMakerString(startString, toReplace, replaceWith){
    return startString.replaceAll(toReplace, replaceWith);
}

function drawString(makerString){
    for(let character of makerString){
        switch (character) {
            case "F":
                drawLine(false);
                break;
            case "G": 
                drawLine(true);
                break;
            case "+":
                angle += turnAngle;
                break;
            case "-":
                angle -= turnAngle;
                break;
            case "[":
                newState = [position[0], position[1], angle, length, weight];
                savedStates.push(newState);
                break;
            case "]":
                let loadedState = savedStates.pop();
                position[0] = loadedState[0];
                position[1] = loadedState[1];
                angle = loadedState[2];
                length = loadedState[3];
                weight = loadedState[4];
                break;
            case "|":
                drawLine(false);
                length *= LENGTH_FACTOR;
                weight *= WEIGHT_FACTOR;
                break;
            default:
                console.error("ungültiges Zeichen: " + character);
                break;
        }
    }
}

function drawLine(reverse){
    push();
    strokeWeight(weight);
    distanceX = Math.cos(radians(angle)) * length;
    distanceY = Math.sin(radians(angle)) * length;
    newPos = [position[0] - distanceX, position[1] - distanceY];
    line(position[0], position[1], newPos[0], newPos[1]);  
    position = newPos;
    pop();
}