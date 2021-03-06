

const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 1600;
const GENERATION_COUNT = 4;
const END_TURN_ANGLE = 50;
const LENGTH_FACTOR = 0.5;
const WEIGHT_FACTOR = 0.6;
const STARTPOS = [800, 800];

let startWeight = 5;
let startLength = 300;

let weight;
let position;
let length;
let angle = 90;
let savedStates = [];
let turnAngle = 30;


function setup(){
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    angleMode(DEGREES);
    frameRate(10);

    background("#71d6ed");
    makeTree(STARTPOS, "|[--F][-F][F][+F][++F]", startLength, startWeight);
}

function draw(){
}

function makeTree(startPos, rule, beginLength, beginWeight){
    const REPLACE_RULE = rule;
    const TO_REPLACE = "F";
    let makerString = "F"
    position = [startPos[0] - 20, startPos[1]];
    length = beginLength;
    weight = beginWeight;
    

    for(i = 0; i < GENERATION_COUNT; i++){
        makerString = updateMakerString(makerString, TO_REPLACE, REPLACE_RULE);
    }
    let mainTree = new Tree(startLength, turnAngle, position, makerString, 25, color(255), color(0,180, 0), 5);

    for(i = 7; i > 0; i--){
        let position2 =[(8 - i)*100, startPos[1]];
        let sideTree = new Tree(startLength*(1/i), turnAngle, position2, makerString, 
            startWeight*(2/i), color(255*i/7), color(0, 0, 0), 0);
        drawString(sideTree);
    }
    drawString(mainTree);
}

function updateMakerString(startString, toReplace, replaceWith){
    return startString.replaceAll(toReplace, replaceWith);
}

function drawString(tree){
    let localTree = tree;
    for(let character of localTree.generatorString){
        switch (character) {
            case "F":
                localTree = drawLine(false, tree);
                break;
            case "G": 
                localTree = drawLine(true, tree);
                break;
            case "+":
                localTree.addAngle();
                break;
            case "-":
                localTree.subtractAngle();
                break;
            case "[":
                localTree.saveState();
                break;
            case "]":
                localTree.loadPreviousState();
                break;
            case "|":
                localTree = drawLine(false, tree);
                localTree.alterLengthAndWeight();
                break;
            default:
                console.error("ung??ltiges Zeichen: " + character);
                break;
        }
    }
}

function drawLine(reverse, tree){
    push();
    
    distanceX = Math.cos(radians(tree.currentAngle)) * tree.length;
    distanceY = Math.sin(radians(tree.currentAngle)) * tree.length;
    newPos = [tree.currentPos[0] - distanceX, tree.currentPos[1] - distanceY];
    
      
    if (tree.weight >= tree.leafCutoff){
        stroke(tree.branchColor);
        strokeWeight(tree.weight);
        line(tree.currentPos[0], tree.currentPos[1], newPos[0], newPos[1]);
    } else {
        noStroke();
        fill(tree.leafColor);
        circle(newPos[0], newPos[1], random(8, 22));
    }
    tree.currentPos = newPos;
    pop();
    return tree;
}