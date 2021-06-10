const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = CANVAS_WIDTH;

const MIN = -2;
const MAX = 2;
const STEP_INC = 0.01;
const TEST_COUNT = 200;
const SUB_CONST = 1.2;
const THRESHOLD = 50;
function setup(){
    let colorstart = color(50, 0,0);
    let colorend = color(255, 0, 0);
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    background(255);
    translate(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    let scaleFactor = CANVAS_WIDTH/Math.abs(MAX-MIN);
    scale(scaleFactor);
    strokeWeight(2/scaleFactor);
     
    let inRange = 0;
    let loops = 0;
    point(0,0);
    for (let pntX = MIN; pntX < MAX; pntX += STEP_INC){
        for(let pntY = MIN; pntY < MAX; pntY += STEP_INC){
            let complexNum = {imaginary: {factor: pntY}, real: pntX};
            let neededLoops = isComplexInJuliaRange(complexNum, THRESHOLD)
            if (neededLoops > 10){
                push();
                stroke(lerpColor(colorstart, colorend, neededLoops/50));
                point(pntX, pntY);
                pop();
            }
            
        }        
    }
    console.log("done");
}

function complexAddition(val1, val2){
    let result = {};
    result.real = val1.real + val2.real;
    result.imaginary = {value: val1.imaginary.value, 
        factor: val1.imaginary.factor + val2.imaginary.factor}

    return result;
}

function complexSubstraction(val1, val2){
    let result = {};
    result.real = val1.real - val2.real;
    result.imaginary = {value: val1.imaginary.value, 
        factor: val1.imaginary.factor - val2.imaginary.factor}

    return result;
}

function complexMultiplication(val1, val2){
    let result = {};
    result.real = val1.real * val2.real - val1.imaginary.factor * val2.imaginary.factor;
    result.imaginary = {};
    result.imaginary.factor = val1.real * val2.imaginary.factor + val2.real * val1.imaginary.factor;
    result.imaginary.value = val1.imaginary.value;

    return result;
}

function lengthOfComplex(complexNum){
    return Math.sqrt(Math.pow(complexNum.real, 2) + Math.pow(complexNum.imaginary.factor, 2));
}

function isComplexInJuliaRange(complexNum, threshold){
    value = complexNum;
    let i = 0;
    for(i = 0; i <= TEST_COUNT; i++){
        let complex1 = { imaginary:{factor: 0 }, real: SUB_CONST};
        value = complexSubstraction(complexMultiplication(value, value), complex1);

        if (lengthOfComplex(value) >= threshold){
            return i;
        }
    }

    return i;
}

function testJuliaRange(min, max, threshold){
    const TEST_COUNT = 50;
    result = [];
    for (let startValue = min; startValue <= max; startValue++){
        let value = startValue;
    
        for(let i = 0; i < TEST_COUNT; i++){
            value = Math.pow(value, 2);
        }

        if (value <= threshold){
            result.push(startValue);
        }
    }

    return result;
}