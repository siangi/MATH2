function setup(){
    createCanvas(400, 400, WEBGL);
    createEasyCam();
    document.oncontextmenu = function() {
      return false;
    }
    
    document.onmousedown = function() {
      return false;
    }
    draw();
}

function draw(){
  let allVertices = [];
  let previousVertices = [];
  let vertices = [];

  background(255);
  const DONUT_STEPS = 15;
  const DONUT_MIDDLE_X = 0;
  const DONUT_MIDDLE_Y = 0;
  const DONUT_RADIUS = 120;
  // let startpoint_y = -height/2.0;
  
  let steps_num = 30;
  let radius = 70;
  let rec_width_half = (DONUT_RADIUS-radius)*Math.tan(radians(360/DONUT_STEPS))/2;
  let outerRecWidthHalf = (DONUT_RADIUS+radius)*Math.tan(radians(360/DONUT_STEPS))/2;
  let ringStartPointX = 0;
  let ringStartPointY = 0;
  for (let i = 0; i < DONUT_STEPS; i++){
    let angle = radians(i*(360/DONUT_STEPS)); 
    
    let distanceY = DONUT_RADIUS*Math.sin(angle);
    let distanceX = DONUT_RADIUS*Math.cos(angle);
    ringStartPointX = DONUT_MIDDLE_X + distanceX;
    ringStartPointY = DONUT_MIDDLE_Y + distanceY;
       
    // translate(ringStartPointX, ringStartPointY, i*10);
    push();
    translate(ringStartPointX, ringStartPointY);
    rotateX(radians(90));
    rotateY(angle);
    beginShape(TRIANGLE_STRIP);
    vertices = getVertexRingVector(ringStartPointX, ringStartPointY, steps_num, radius);
    if (previousVertices != null && previousVertices.length != 0){
      for(let i = 0; i < previousVertices.length; i++)        {
        vertex(previousVertices[i].x, previousVertices[i].y, 0)
        vertex(vertices[i].x, vertices[i].y, 0);
      }
    }
    endShape();
    pop();
    previousVertices = vertices;
    
  }   
  console.log(vertices);
}

function drawAllVertices(vertices){
  console.log(vertices);
  beginShape(POINTS);
  vertices.forEach(vector => {
    vertex(vector.x, vector.y, 0);
  });
  endShape();
}

/* alternatingly adds the elements of the inputArrays one by one to the finalArray 
firstInput and second Input must have same length!*/
function zipperJoin(firstInput, secondInput, goalArray){
  console.log("zipperJoin entered");
  if (firstInput.length != secondInput.length){
    return goalArray;
  }

  for (let i = 0; i < firstInput.length; i++){
    goalArray.push(firstInput[i]);
    goalArray.push(secondInput[i]);
  }

  return goalArray;
}

/* creates Posistion Vectors for a Ring */
function getVertexRingVector(startpointX, startpointY, steps, radius){
  console.log("vertexRingVectors entered " + steps);
  let returnArray = [];
  for(let i = 0; i < steps; i++){
    console.log(i);
    let angle = radians(i*(360/steps));

    let distanceY = radius*Math.sin(angle);
    let distanceX = radius*Math.cos(angle);

    returnArray.push(createVector(startpointX + distanceX, startpointY + distanceY));
  }
  return returnArray;
}

function drawVertexRing(startpoint_x, startpoint_y, steps_num, rec_width_half, outerRecWidthHalf, radius) {
  let firstDistanceX = 0;
  let firstDistanceY = 0;

  beginShape(TRIANGLE_STRIP);  
  for (let i = 1; i <= steps_num; i++){
    halfWidth = i*(outerRecWidthHalf - rec_width_half)/steps_num
    let angle = radians(i*(360/steps_num));

    let distanceY = radius*Math.sin(angle);
    let distanceX = radius*Math.cos(angle);

    if (i == 0){
      firstDistanceX = distanceX;
      firstDistanceY = distanceY; 
    }

    vertex(startpoint_x + distanceX, startpoint_y + distanceY, -halfWidth);
    vertex(startpoint_x + distanceX, startpoint_y + distanceY, +halfWidth);
  }
  vertex(startpoint_x + firstDistanceX, startpoint_y + firstDistanceY, -rec_width_half);
  vertex(startpoint_x + firstDistanceX, startpoint_y + firstDistanceY, +rec_width_half);
  endShape();
}