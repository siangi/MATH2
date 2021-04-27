let CANVASSIDE = 800;


function setup() {
  createCanvas(CANVASSIDE, CANVASSIDE);
  background(220);
  // ownPolygon(3, 150, 400, 400);
  // ownPolygon(4, 50, 400, 400)
  // ownPolygon(5, 200, 400, 400);
  // ownPolygon(80, 160, 400, 400);
  // ownCircle(100, 400, 400);
  ownSpiral(20, 1.0016, 2200, 300, 350)
}

function draw() {
  let Radius = 100;
  let MittelpunktX = 400;
  let MittelpunktY = 400;

  
}

function ownCircle(radius, middleX, middleY){
  pixelCount = Math.ceil(2*radius*Math.PI);
  ownPolygon(pixelCount, radius, middleX, middleY);
}


function ownPolygon(sides, radius, middleX, middleY){
  let hasPrevious = false;
  let previousX = -1;
  let previousY = -1;
  let firstX = -1;
  let firstY = -1;
  for(let i = 0; i < sides; i++){
    // the angle has to be converted from degrees to radians for the Math.sin and Math.cos
    let angle = i*((360/sides)*Math.PI/180); 

    let distanceY = radius*Math.sin(angle);
    let distanceX = radius*Math.cos(angle);
    
    if (hasPrevious){
      line(middleX + distanceX, middleY + distanceY,previousX, previousY)
    } else {
      firstX = middleX + distanceX;
      firstY = middleY + distanceY
    }

    hasPrevious = true;
    previousX = middleX + distanceX;
    previousY = middleY + distanceY
  }

  line(previousX, previousY, firstX, firstY)
}

function ownSpiral(startradius, expansionrate, length, middleX, middleY){
  let radius = startradius;

  let hasPrevious = false;
  let previousX = -1;
  let previousY = -1;
  for(let i = 0; i < length; i++){
    radius *= expansionrate;
    // the angle has to be converted from degrees to radians for the Math.sin and Math.cos
    let angle = i*Math.PI/180; 

    let distanceY = radius*Math.sin(angle);
    let distanceX = radius*Math.cos(angle);
    
    if (hasPrevious){
      ownPolygon(3, radius*0.15, middleX + distanceX, middleY + distanceY);
      // line(middleX + distanceX, middleY + distanceY,previousX, previousY)
    } else {
      firstX = middleX + distanceX;
      firstY = middleY + distanceY
    }

    hasPrevious = true;
    previousX = middleX + distanceX;
    previousY = middleY + distanceY
  }


  
}


