const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = CANVAS_HEIGHT;
const GENERATION_COUNT = 5;
const TURN_ANGLE = 20;
const START_LENGTH = 300;
const LENGTH_FACTOR = 0.6;
const STARTPOS = [400, 800];

let position;
let length;
let angle = 90;
let savedStates = [];

function setup(){
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    background(0);
    angleMode(DEGREES);
    const REPLACE_RULE = "|[-F][+F]";
    const TO_REPLACE = "F";
    let makerString = "F"
    position = STARTPOS;
    length = START_LENGTH;
    console.log(makerString);
    

    for(i = 0; i < GENERATION_COUNT; i++){
        makerString = updateMakerString(makerString, TO_REPLACE, REPLACE_RULE);
        console.log(makerString);
    }

    drawString(makerString);
}

function draw(){
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
                angle += TURN_ANGLE;
                break;
            case "-":
                angle -= TURN_ANGLE;
                break;
            case "[":
                newState = [position[0], position[1], angle, length];
                savedStates.push(newState);
                break;
            case "]":
                let loadedState = savedStates.pop();
                position[0] = loadedState[0];
                position[1] = loadedState[1];
                angle = loadedState[2];
                length = loadedState[3];
                console.log(length);
                break;
            case "|":
                drawLine(false);
                length *= LENGTH_FACTOR;
                break;
            default:
                console.error("ungültiges Zeichen: " + character);
                break;
        }
    }
}

function drawLine(reverse){
    stroke(255);
    distanceX = Math.cos(radians(angle)) * length;
    distanceY = Math.sin(radians(angle)) * length;
    newPos = [position[0] - distanceX, position[1] - distanceY];
    line(position[0], position[1], newPos[0], newPos[1]);
    circle(newPos[0], newPos[1], 10);
    position = newPos;
}