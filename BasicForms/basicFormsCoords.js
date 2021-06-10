let CANVASSIDE = 800;

function setup(){
    createCanvas(CANVASSIDE, CANVASSIDE);
    background(220);
    let points = pointCircle(150, 400, 400);
    console.log(points);
    push();
    strokeWeight(10);
    points.forEach(pnt => {
        point(pnt[0], pnt[1]);
    });
    pop();
}

function draw(){
}

function pointCircle(radius, middleX, middleY){
  pixelCount = Math.ceil(2*radius*Math.PI)/15;
  return pointPolygon(pixelCount, radius, middleX, middleY);
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
  
      let distanceY = radius*Math.sin(angle);
      let distanceX = radius*Math.cos(angle);
      
      if (hasPrevious){
        points.push([middleX + distanceX, middleY + distanceY]);
        // points = lerpPoints(previousX, previousY, middleX + distanceX, middleY + distanceY, 20, points);
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
    // points = lerpPoints(previousX, previousY, firstX, firstY, 20, points);
    return points;
}



function lerpPoints(startX, startY, endX, endY, amountOfPoints, arrayToInsert){
    for (i = 0; i < amountOfPoints; i++){
        t = map(i, 0, amountOfPoints, 0, 1);
        console.log(t);
        newX = lerp(startX, endX, t);
        newY = lerp(startY, endY, t);
        arrayToInsert.push([newX, newY]);
    }

    return arrayToInsert;
}