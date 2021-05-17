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
    [103, 100]
];

// all currently alive cells, so we dont have to loop the whole array constantly
let oldAliveCells = startCells;
let newAliveCells = startCells;

async function setup(){
    createCanvas(PLAYFIELD_WIDTH, PLAYFIELD_HEIGHT);
    background(150);
    initBoard();

    console.log(newAliveCells);
    newAliveCells.forEach(coords => {
        set(coords[0], coords[1], color(0));
    });

    for(let i = 0; i < 3; i++){
        updatePixels();
        tick();
        initBoard();
        console.log(newAliveCells);
        await new Promise(r => setTimeout(r, 1000));
    }
}

async function draw(){
   
}

function tick(){
    oldAliveCells = null;
    oldAliveCells = newAliveCells;
    newAliveCells = [];
    console.log("length after reset " + newAliveCells.length)

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

    let liveNeighbourCount = getNeighbouringLiveCellCount(x, y);
    let isAlive = cellAlive(x, y);

    if((liveNeighbourCount == 2 && isAlive)){
        newAliveCells.push([x, y]);
    } else if ((liveNeighbourCount == 3)){
        newAliveCells.push([x, y]);
    }
}

function getNeighbouringLiveCellCount(x , y){
    let liveNeighbourCount =  0;

    if (cellAlive(x - 1, y -1 )) { liveNeighbourCount++}
    if (cellAlive(x, y -1 )) { liveNeighbourCount++}
    if (cellAlive(x + 1, y -1 )) { liveNeighbourCount++}
    if (cellAlive(x - 1, y)) { liveNeighbourCount++}
    if (cellAlive(x, y)) { liveNeighbourCount++}
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