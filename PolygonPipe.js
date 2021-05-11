function setup(){
    createCanvas(400, 400, WEBGL);
    createEasyCam();
    // noFill();
    document.oncontextmenu = function() {
      return false;
    }
    
    document.onmousedown = function() {
      return false;
    }
    draw();
}

function draw(){
    background(180);
    push();
    stroke(255, 0, 0, 1);
    beginShape(LINE_STRIP);
    vertex(0,0,0);
    vertex(500, 0, 0);
    endShape();
    pop();
    push();
    stroke(0, 255, 0, 1);
    beginShape(LINE_STRIP);
    vertex(0,0,0);
    vertex(0, 500, 0);
    endShape();
    pop();
    push();
    stroke(0, 0, 255, 1);
    beginShape(LINE_STRIP);
    vertex(0,0,0);
    vertex(0, 0, 500);
    endShape();
    pop();

    drawSpiral();
}

function drawTube(){
    const TUBE_START = createVector(0,0,0);
    const TUBE_LENGTH = 300;
    const TUBE_RADIUS = 70;
    const TUBE_STEPS = 5;
    const RING_STEPS = 15;

    // all vertices in the order they shall be connected
    let allVertices = [];
    // the vertices of the previous iteration
    let oldVertices;
    let firstVertices;
    
    for(let i = 0; i < TUBE_STEPS; i++){     
        let middleZ = TUBE_START.x + (TUBE_LENGTH/TUBE_STEPS)*i;
        let newVertices = getVertexRingVectors(TUBE_START.x, TUBE_START.y, middleZ, RING_STEPS, TUBE_RADIUS);
        
        if (oldVertices == null){
            firstVertices = newVertices;            
        } else {
            let joinedVertices = zipperJoin(oldVertices, newVertices);
            joinedVertices.forEach(coords => {
                allVertices.push(coords);    
            });
        }

        oldVertices = newVertices;
    }

    beginShape(TRIANGLE_STRIP);
    // console.log(allVertices);
    allVertices.forEach(coords => {
        vertex(coords.x, coords.y, coords.z);
    });
    endShape();
}

function getVertexRingVectors(middleX, middleY, middleZ, steps, radius){
  let returnArray = [];
  for(let i = 0; i < steps; i++){
    let angle = radians(i*(360/steps));

    let distanceY = radius*Math.sin(angle);
    let distanceX = radius*Math.cos(angle);
    
    returnArray.push(createVector(middleX + distanceX, middleY + distanceY, middleZ));
  }
  return returnArray;
}

function getVertexRingVectorsAtAngle(middleX, middleY, middleZ, steps, radius, atAngle){
    let returnArray = [];
  for(let i = 0; i < steps; i++){
    let angle = radians(i*(360/steps));

    let distanceY = radius*Math.sin(angle);
    let distanceX = radius*Math.cos(angle);
    let distanceZ = 0;
    // let distanceZ = radius*Math.cos(atAngle);
    
    // 2 Mal sinus und cosinus berechnen!! einmal für die Verschiebung im kleinen Kreis
    // und ein mal für die Verschiebung im grossen Kreis!

    returnArray.push(createVector(middleX + distanceX, middleY + distanceY, middleZ+distanceZ));
  }
  return returnArray;
}

function drawSpiral(){
    const SPIRAL_CENTER = createVector(0,0,0);
    const MAX_ANGLE = 400;
    const STEPS = 15;
    const HEIGHT_GROWTH = 0.5;
    const SPIRAL_GROWTH = 0.5;
    const THICKNESS_GROWTH = 0.5;

    let radius = SPIRAL_GROWTH;
    let thickness = THICKNESS_GROWTH;

    let allVertices = [];
    let oldVertices;
    let firstVertices;
    for(let i = 0; i < STEPS; i++){
        let angle = radians(i * MAX_ANGLE/STEPS);

        radius = exp(angle * SPIRAL_GROWTH);
        thickness = exp(angle * THICKNESS_GROWTH);

        let x = SPIRAL_CENTER.x + radius * sin(angle);
        let y = SPIRAL_CENTER.y + radius * cos(angle);
        let z = SPIRAL_CENTER.z + exp(angle * HEIGHT_GROWTH);

        let newVertices = getVertexRingVectors(SPIRAL_CENTER.x, SPIRAL_CENTER.y, SPIRAL_CENTER.z, STEPS, thickness);

        newVertices.forEach(coords => {
            coords.x = coords.x + x;
            coords.y = coords.y + y;
            coords.z = coords.z + z;
        });  

        if (oldVertices == null){
            firstVertices = newVertices;
        } else
        {
            let joinedVertices = zipperJoin(oldVertices, newVertices);
            joinedVertices.forEach(coords => {
                allVertices.push(coords);
            })
        }

        oldVertices = newVertices
    }

    // let joinedLastVertices = zipperJoin(oldVertices, firstVertices);
    // joinedLastVertices.forEach(coords => {
    //     allVertices.push(coords);
    // })

    beginShape(TRIANGLE_STRIP);
    // console.log(allVertices);
    allVertices.forEach(coords => {
        vertex(coords.x, coords.y, coords.z);
    });
    endShape()
}


function drawDonut(){
    const DONUT_START = createVector(0,0,0);
    const DONUT_RADIUS = 200;
    const DONUT_STEPS = 16;
    const RING_RADIUS = 40;

    let allVertices = [];

    let oldVertices;
    let firstVertices;

    for(let i = 0; i < DONUT_STEPS; i++){
        let angle = radians(i*360/DONUT_STEPS);
        // let newVertices = getVertexRingVectors(DONUT_START.x, DONUT_START.y, DONUT_START.z, DONUT_STEPS, RING_RADIUS);
        let newVertices = getVertexRingVectorsAtAngle(DONUT_START.x, DONUT_START.y, DONUT_START.z, DONUT_STEPS, RING_RADIUS, angle);

        newVertices.forEach(coords => {
            // coords.x = coords.x + DONUT_RADIUS*cos(angle)
            coords.y = coords.y + DONUT_RADIUS*cos(angle);
            coords.z = coords.z + DONUT_RADIUS*sin(angle);    
        });  
        
        if (oldVertices == null){
            firstVertices = newVertices;
        } else
        {
            let joinedVertices = zipperJoin(oldVertices, newVertices);
            joinedVertices.forEach(coords => {
                allVertices.push(coords);
            })
        }

        oldVertices = newVertices
    }
    
    let joinedLastVertices = zipperJoin(oldVertices, firstVertices);
    joinedLastVertices.forEach(coords => {
        allVertices.push(coords);
    })

    beginShape(TRIANGLE_STRIP);
    // console.log(allVertices);
    allVertices.forEach(coords => {
        vertex(coords.x, coords.y, coords.z);
    });
    endShape();

}

//doesnt relly work honestly...
function drawSphere(){
    const SPHERE_START = createVector(0,0,0);
    const SPHERE_RINGS = 15;
    const RING_STEPS = 15;
    const SPHERE_RADIUS = 200;

    let allVertices = [];

    let oldVertices;

    for(let i = 0; i < SPHERE_RINGS; i++){
        middleZ = SPHERE_START.z + i * (SPHERE_RADIUS / SPHERE_RINGS);
        let ringRadius = SPHERE_RADIUS*sin(radians(i*(180/SPHERE_RINGS)));
        

        let newVertices = getVertexRingVectors(SPHERE_START.x, SPHERE_START.y, middleZ, RING_STEPS, ringRadius);

        if (oldVertices == null){
            firstVertices = newVertices;            
        } else {
            let joinedVertices = zipperJoin(oldVertices, newVertices);
            joinedVertices.forEach(coords => {
                allVertices.push(coords);    
            });
        }

        oldVertices = newVertices;

        beginShape(TRIANGLE_STRIP);
        // console.log(allVertices);
        allVertices.forEach(coords => {
            vertex(coords.x, coords.y, coords.z);
        });
        endShape();
    }
}

/* alternatingly adds the elements of the inputArrays one by one to the finalArray 
firstInput and second Input must have same length!*/
function zipperJoin(firstInput, secondInput){
    let returnArray = [];
    if (firstInput.length == secondInput.length){
        for (let i = 0; i < firstInput.length; i++){
            returnArray.push(firstInput[i]);
            returnArray.push(secondInput[i]);
        }
    }

    return returnArray;
}