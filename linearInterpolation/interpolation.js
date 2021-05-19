
function setup(){
    let x1 = 150;
    let y1 = 150;
    let x2 = 150;
    let y2 = 100;

    let black = color(0);
    let red = color(255, 0, 0);

    createCanvas(200, 200);
    background(150);
    
    set(x1, y1, black);
    set(x2, y2, black);
    let pixelCount = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    for(i = 0; i <= pixelCount; i++){
        let t = i/pixelCount;
        let newX = ownLerp(x1, x2, t);
        let newY = ownLerp(y1, y2, t);

        set(newX, newY, red);
    }

    updatePixels();
}

function draw(){

}

function ownLerp(val1, val2, t){
    if (t > 1 || t < 0){
        return -1;
        console.error("invalid")
    }

    return (1 - t) * val1 + t * val2;
}