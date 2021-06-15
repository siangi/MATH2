const PLAYFIELD_HEIGHT = 500;
const PLAYFIELD_WIDTH = PLAYFIELD_HEIGHT;
const LEVELS = 2;


// the old states to base the new ones on 
// true means the cell is alive, false means it is not.
let colors = new Array(LEVELS);
let oldBoard = new Array(LEVELS);
// coordinates of the live cells at start
let startCells = new Array(LEVELS);
// all currently alive cells, so we dont have to loop the whole array constantly
let oldAliveCells = new Array(LEVELS);
let newAliveCells = new Array(LEVELS);
let ticks = 0;
function startCellsFromForm(){
    // return pointCircle(20, 50, 50).concat(pointCircle(20, 20, 50)).concat(pointCircle(20, 70, 50));
    return pointCircle(20, 50, 50).concat(pointCircle(21, 50, 50));
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
    startCells[0] = randomStartCells(0, 0, 100, 100);
    startCells[1] = startCellsFromForm();
    colors[0] = color(195);
    colors[1] = color(255, 0, 0);
    console.log(startCells);
    oldAliveCells[0] = startCells[0];
    oldAliveCells[1] = startCells[1];
    newAliveCells[0] = startCells[0]
    newAliveCells[1] = startCells[1];
    frameRate(8);
}

function draw(){
    background(150);
    scale(5);
    initBoard();

    for(let z = 0; z < LEVELS; z++){
        for (let i = 0; i < oldAliveCells[z].length; i++){
            push();
            stroke(colors[z]);
            point(oldAliveCells[z][i][0], oldAliveCells[z][i][1]);
            pop();
        }
        // wieso beide??
        for (let i = 0; i < newAliveCells[z].length; i++){
            push();
            stroke(colors[z]);
            point(newAliveCells[z][i][0], newAliveCells[z][i][1]);
            pop();
        }
    }   

    updatePixels();
    tick(0);
    if (ticks % 3 == 0){
        tick(1);
    }
    
    ticks++;
    initBoard();
}

function tick(level){
    oldAliveCells[level] = null;
    oldAliveCells[level] = newAliveCells[level];
    newAliveCells[level] = [];

    oldAliveCells[level].forEach(coords => {
        setNextStateOfCell(coords[0] - 1, coords[1] - 1, level); // NW
        setNextStateOfCell(coords[0], coords[1] - 1, level); // N
        setNextStateOfCell(coords[0] + 1, coords[1] - 1, level); // NE
        setNextStateOfCell(coords[0] - 1, coords[1], level); //W
        setNextStateOfCell(coords[0], coords[1], level); // Center
        setNextStateOfCell(coords[0] + 1, coords[1], level); //E
        setNextStateOfCell(coords[0] - 1, coords[1] + 1, level); // SW
        setNextStateOfCell(coords[0] , coords[1] + 1, level); //S
        setNextStateOfCell(coords[0] + 1, coords[1] + 1, level); //SE
    });
}

function setNextStateOfCell(x, y, z){
    if (x < 0 || y < 0 || z < 0 || x >= PLAYFIELD_WIDTH || y >= PLAYFIELD_HEIGHT || z >= LEVELS){
        return;
    }

    if (isCellinAliveArray(x, y, z)){
        return;
    }

    let liveNeighbourCount = getNeighbouringLiveCellCount(x, y, z);
    let isAlive = cellAlive(x, y, z);
    // console.log(liveNeighbourCount);
    
    if((liveNeighbourCount == 2 && isAlive)){
        newAliveCells[z].push([x, y]);
    } else if ((liveNeighbourCount == 3)){
        newAliveCells[z].push([x, y]);
    }
}

function isCellinAliveArray(x, y, z){
    for(let i = 0; i < newAliveCells[z].length; i++){
        if (newAliveCells[z][i][0] == x && newAliveCells[z][i][1] == y){
            return true;
        }
    }
    return false;
}

function getNeighbouringLiveCellCount(x , y, z){
    let liveNeighbourCount =  0;

    if (cellAlive(x - 1, y -1, z)) { liveNeighbourCount++}
    if (cellAlive(x, y -1, z)) { liveNeighbourCount++}
    if (cellAlive(x + 1, y -1, z)) { liveNeighbourCount++}
    if (cellAlive(x - 1, y, z)) { liveNeighbourCount++}
    if (cellAlive(x + 1, y, z)) { liveNeighbourCount++}
    if (cellAlive(x - 1, y + 1, z)) { liveNeighbourCount++}
    if (cellAlive(x, y + 1, z)) { liveNeighbourCount++}
    if (cellAlive(x + 1, y + 1, z)) { liveNeighbourCount++}

    return liveNeighbourCount;
}

function cellAlive(x, y, z){
    if (x < 0 || y < 0 || z < 0 || x >= PLAYFIELD_WIDTH || y >= PLAYFIELD_HEIGHT || z >= LEVELS){
        return false;
    } 

    return oldBoard[z][x][y] === true;
}

function initBoard(){
    for(let z = 0; z < LEVELS; z++){
        oldBoard[z] = new Array(PLAYFIELD_WIDTH);
        for (let x = 0; x < PLAYFIELD_WIDTH; x++){
            oldBoard[z][x] = new Array(PLAYFIELD_HEIGHT);
        }

        oldAliveCells[z].forEach(coords => {
            oldBoard[z][coords[0]][coords[1]] = true;
        });
    }    
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