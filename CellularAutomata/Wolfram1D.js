LINE_LENGTH = 55;
LINE_COUNT = LINE_LENGTH;

//2D Arrays to save all previous States and the State of now
let states = [];

let ruleCode = ["0", "1", "0", "1", "0", "1", "0", "1"];
let productions;

function setup(){
    createCanvas(LINE_LENGTH, LINE_COUNT);
    background(150);
    setFirstline();
    //initNextLine until enough Lines
    //set the pixels on the Canvas
}

function draw(){
    
}

function initNextLine(){
    productions.get("111");
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