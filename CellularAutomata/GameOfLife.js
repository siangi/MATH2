const PLAYFIELD_HEIGHT = 600;
const PLAYFIELD_WIDTH = PLAYFIELD_HEIGHT;


// the old states to base the new ones on 
// true means the cell is alive, false means it is not.
let oldBoard;

// coordinates of the live cells at start
let startCells = [
    [100, 100],
    [99, 99],
    [99, 98],
    [99, 97],
    [100, 97],
    [101, 97],
    [102, 97],
    [103, 98],
    [103, 100],
    [200, 200],
    [199, 199],
    [199, 198],
    [199, 197],
    [200, 197],
    [201, 197],
    [202, 197],
    [203, 198],
    [203, 200],
    [180, 180],
    [179, 181],
    [181, 181],
    [178, 182],
    [182, 182],
    [178, 183],
    [182, 183],
    [178, 184],
    [182, 184],
    [178, 185],
    [182, 185],
    [178, 186],
    [182, 186],
    [178, 187],
    [182, 187],
    [179, 188],
    [181, 188],
    [180, 189]
];

// all currently alive cells, so we dont have to loop the whole array constantly
let oldAliveCells = startCells;
let newAliveCells = startCells;

function setup(){
    createCanvas(PLAYFIELD_WIDTH, PLAYFIELD_HEIGHT);
    frameRate(15);
}

function draw(){
    background(150);
    initBoard();

    for (let i = 0; i < oldAliveCells.length; i++){
        set(oldAliveCells[i][0], oldAliveCells[i][1], color(150));
    }

    for (let i = 0; i < newAliveCells.length; i++){
        set(newAliveCells[i][0], newAliveCells[i][1], color(0));
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