LINE_LENGTH = 181;
LINE_COUNT = LINE_LENGTH;

//2D Arrays to save all previous States and the State of now
let states = [];

let ruleCode = ["1", "0", "1", "1", "1", "1", "0", "0"];
let productions;

function setup(){
    let black = color(0);
    createCanvas(LINE_LENGTH, LINE_COUNT);
    background(150);
    initRuleset(ruleCode);
    setFirstline();
    for(let i = 1; i < LINE_COUNT; i++){
        states.push(initNextLine(states[i - 1]));
    }
    console.log(states)

    for(let linesIdx = 0; linesIdx < LINE_COUNT; linesIdx++){
        for (let elementIdx = 0; elementIdx < LINE_LENGTH; elementIdx++){
            if (states[linesIdx][elementIdx] == "1"){
                set(elementIdx, linesIdx, black);
            }
        }
    }
    updatePixels();
}

function draw(){
    
}

function initNextLine(previousLine){
    nextLine = [];

    for(let i = 0; i < previousLine.length; i++){
        let newPoint = productions.get(getTriplet(previousLine, i));
        nextLine.push(newPoint);
    }

    return nextLine;
}

function setFirstline(){
    let middleIndex = ((LINE_LENGTH - 1) / 2);
    states.push([]);
    for(let i = 0; i < LINE_LENGTH; i++){
        states[0].push("0");
    }

    states[0][middleIndex] = "1"
}

// returns the element at the index and its neighbours as a string.
function getTriplet(lineArray, index){
    if (index >= lineArray.length){
        console.error("Index too big:" + index);
        return "";
    }

    if (index == 0){
        return lineArray[lineArray.length - 1] + lineArray[0] + lineArray[1];
    } else if (index == (lineArray.length - 1)){
        return lineArray[index - 1]  + lineArray[index] + lineArray[0]
    } else {
        return lineArray[index - 1] + lineArray[index] + lineArray[index + 1]
    }
}

function initRuleset(ruleCode){
  productions = new Map();
  productions.set("111", ruleCode[0]);
  productions.set("110", ruleCode[1]);
  productions.set("101", ruleCode[2]);
  productions.set("100", ruleCode[3]);
  productions.set("011", ruleCode[4]);
  productions.set("010", ruleCode[5]);
  productions.set("001", ruleCode[6]);
  productions.set("000", ruleCode[7]);    
}