const PLAYFIELD_HEIGHT = 500;
const PLAYFIELD_WIDTH = PLAYFIELD_HEIGHT;


// the old states to base the new ones on 
// true means the cell is alive, false means it is not.
let oldBoard;

// coordinates of the live cells at start
let startCells;
// all currently alive cells, so we dont have to loop the whole array constantly
let oldAliveCells;
let newAliveCells;
function startCellsFromForm(){
    return pointCircle(20, 50, 50).concat(pointCircle(20, 20, 50)).concat(pointCircle(20, 70, 50));
    // return pointCircle(20, 50, 50).concat(pointCircle(21, 50, 50));
    // return pointLine(0, 50, 100, 50, 100)
    //         .concat(pointLine(0, 20, 100, 20, 100))
    //         .concat(pointLine(0, 80, 100, 80, 100));
    // return pointLine(0, 0, 100, 100, 100)
    //         .concat(pointLine(100, 0, 0, 100, 100))
    //         .concat(pointLine(0, 50, 100, 50, 100))
    //         .concat(pointLine(50, 0, 50, 100, 100));
    // return pointCircle(50, 50, 50)
    //         .concat(pointCircle(49, 50, 50))
    //         .concat(pointCircle(48, 50, 50))
    //         .concat(pointCircle(47, 50, 50))
    //         .concat(pointCircle(49, 50, 50))
    // return pointPolygon(3, 40, 50, 50);
}
function randomStartCells(minX, minY, maxX, maxY){
    let points = new Array();
    for(let x = minX; x < maxX; x++){
        for(let y = minY; y < maxY; y++){
            let rnd = random(0.0, 1.0);
            if (rnd >= 0.5){
                points.push([x, y]);
            }
        }
    }
    return points
}

function setRandomAmountOfCells(amount, minX, minY, maxX, maxY){
    let points = new Array();

    for (let i = 0; i < amount; i++){
        x = Math.floor(random(minX, maxX));
        y = Math.floor(random(minY, maxY));
        points.push([x, y]);
    }
    return points;
}

function setup(){
    createCanvas(PLAYFIELD_WIDTH, PLAYFIELD_HEIGHT);
    // startCells = randomStartCells(0, 0, 100, 100);
    startCells = startCellsFromForm();
    console.log(startCells);
    oldAliveCells = startCells;
    newAliveCells = startCells;
    frameRate(1);
}

function draw(){
    background(150);
    scale(5);
    initBoard();

    for (let i = 0; i < oldAliveCells.length; i++){
        point(oldAliveCells[i][0], oldAliveCells[i][1]);
    }

    for (let i = 0; i < newAliveCells.length; i++){
        point(newAliveCells[i][0], newAliveCells[i][1]);
    }

    updatePixels();
    tick();
    initBoard();
}

function tick(){
    oldAliveCells = null;
    oldAliveCells = newAliveCells;
    newAliveCells = [];

    oldAliveCells.forEach(coords => {
        setNextStateOfCell(coords[0] - 1, coords[1] - 1); // NW
        setNextStateOfCell(coords[0], coords[1] - 1); // N
        setNextStateOfCell(coords[0] + 1, coords[1] - 1); // NE
        setNextStateOfCell(coords[0] - 1, coords[1]); //W
        setNextStateOfCell(coords[0], coords[1]); // Center
        setNextStateOfCell(coords[0] + 1, coords[1]); //E
        setNextStateOfCell(coords[0] - 1, coords[1] + 1); // SW
        setNextStateOfCell(coords[0] , coords[1] + 1); //S
        setNextStateOfCell(coords[0] + 1, coords[1] + 1); //SE
    });
}

function setNextStateOfCell(x, y){
    if (x < 0 || y < 0 || x >= PLAYFIELD_WIDTH || y >= PLAYFIELD_HEIGHT){
        return;
    }

    if (isCellinAliveArray(x, y)){
        return;
    }

    let liveNeighbourCount = getNeighbouringLiveCellCount(x, y);
    let isAlive = cellAlive(x, y);
    // console.log(liveNeighbourCount);
    
    if((liveNeighbourCount == 2 && isAlive)){
        newAliveCells.push([x, y]);
    } else if ((liveNeighbourCount == 3)){
        newAliveCells.push([x, y]);
    }
}

function isCellinAliveArray(x, y){
    for(let i = 0; i < newAliveCells.length; i++){
        if (newAliveCells[i][0] == x && newAliveCells[i][1] == y){
            return true;
        }
    }
    return false;
}

function getNeighbouringLiveCellCount(x , y){
    let liveNeighbourCount =  0;

    if (cellAlive(x - 1, y -1 )) { liveNeighbourCount++}
    if (cellAlive(x, y -1 )) { liveNeighbourCount++}
    if (cellAlive(x + 1, y -1 )) { liveNeighbourCount++}
    if (cellAlive(x - 1, y)) { liveNeighbourCount++}
    if (cellAlive(x + 1, y)) { liveNeighbourCount++}
    if (cellAlive(x - 1, y  + 1 )) { liveNeighbourCount++}
    if (cellAlive(x, y + 1 )) { liveNeighbourCount++}
    if (cellAlive(x + 1, y + 1 )) { liveNeighbourCount++}

    return liveNeighbourCount;
}

function cellAlive(x, y){
    if (x < 0 || y < 0 || x >= PLAYFIELD_WIDTH || y >= PLAYFIELD_HEIGHT){
        return false;
    } 

    return oldBoard[x][y] === true;
}

function initBoard(){
    oldBoard = new Array(PLAYFIELD_WIDTH);
    for (let i = 0; i < PLAYFIELD_WIDTH; i++){
        oldBoard[i] = new Array(PLAYFIELD_HEIGHT);
    }

    oldAliveCells.forEach(coords => {
        oldBoard[coords[0]][coords[1]] = true;
    });
}


function pointCircle(radius, middleX, middleY){
    pixelCount = Math.ceil(2*radius*Math.PI);

    let hasPrevious = false;
    let previousX = -1;
    let previousY = -1;
    let previousDistance = -1;
    let firstX = -1;
    let firstY = -1;
    let points = new Array();
    for(let i = 0; i < pixelCount; i++){
    // the angle has to be converted from degrees to radians for the Math.sin and Math.cos
    let angle = i*((360/pixelCount)*Math.PI/180); 

    let distanceY = Math.round(radius*Math.sin(angle));
    let distanceX = Math.round(radius*Math.cos(angle));
    
    if (hasPrevious){
        points.push([middleX + distanceX, middleY + distanceY]);
        points = lerpPoints(previousX, previousY, middleX + distanceX, middleY + distanceY, 50, points);
    } else {
        points.push([middleX + distanceX, middleY + distanceY]);        
        firstX = middleX + distanceX;
        firstY = middleY + distanceY;
    }

    hasPrevious = true;
    previousX = middleX + distanceX;
    previousY = middleY + distanceY
    previousDistance = distanceX;
    }

    points.push([firstX, firstY]);
    points = lerpPoints(previousX, previousY, firstX, firstY, 50, points);
    return points;
}  
 
function lerpPoints(startX, startY, endX, endY, amountOfPoints, arrayToInsert){
    for (i = 0; i < amountOfPoints; i++){
        t = map(i, 0, amountOfPoints, 0, 1);
        console.log(t);
        newX = Math.round(lerp(startX, endX, t));
        newY = Math.round(lerp(startY, endY, t));
        arrayToInsert.push([newX, newY]);
    }

    return arrayToInsert;
}

function pointPolygon(sides, radius, middleX, middleY){
    let hasPrevious = false;
    let previousX = -1;
    let previousY = -1;
    let previousDistance = -1;
    let firstX = -1;
    let firstY = -1;
    let points = new Array();
    for(let i = 0; i < sides; i++){
    // the angle has to be converted from degrees to radians for the Math.sin and Math.cos
    let angle = i*((360/sides)*Math.PI/180); 

    let distanceY = Math.round(radius*Math.sin(angle));
    let distanceX = Math.round(radius*Math.cos(angle));
    
    if (hasPrevious){
        points.push([middleX + distanceX, middleY + distanceY]);
        points = lerpPoints(previousX, previousY, middleX + distanceX, middleY + distanceY, 50, points);
    } else {
        points.push([middleX + distanceX, middleY + distanceY]);        
        firstX = middleX + distanceX;
        firstY = middleY + distanceY;
    }

    hasPrevious = true;
    previousX = middleX + distanceX;
    previousY = middleY + distanceY
    previousDistance = distanceX;
    }

    points.push([firstX, firstY]);
    points = lerpPoints(previousX, previousY, firstX, firstY, 50, points);
    return points;
}  

function pointLine(startX, startY, endX, endY, amountOfPoints){
    let result = new Array();

    result = lerpPoints(startX, startY, endX, endY, amountOfPoints, result);

    return result;
};
 
function lerpPoints(startX, startY, endX, endY, amountOfPoints, arrayToInsert){
    for (i = 0; i < amountOfPoints; i++){
        t = map(i, 0, amountOfPoints, 0, 1);
        newX = Math.round(lerp(startX, endX, t));
        newY = Math.round(lerp(startY, endY, t));
        arrayToInsert.push([newX, newY]);
    }

    return arrayToInsert;
}