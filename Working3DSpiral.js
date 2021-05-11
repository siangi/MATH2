/* BM 2021
    dkah
*/

//l is the outer spiral, the spline used
//s is the small shape thet is extruded along the outer spiral

//radius and step to grow or shrink 
var rad_l = 1;
var rad_l_step = 0.2;

var rad_s = 1;
var rad_s_step = 0.2;

/*number of corners of the polygon, 
around 20 are needed to look round */
var n_gon_l = 30;
var n_gon_s = 20;

//increment of the angle for each corner
var angle_step_l = 360 / n_gon_l;
var angle_step_s = 360 / n_gon_s;


//Max Angle the spiral should have, 1 full circle is 360 deg
var max_angle_l = 360;
var max_angle_s = 360;

//height change after each revolution
var elevation_step = 0.1;
let img;

var cam;

function setup() {
  createCanvas(600, 600, WEBGL);
  
  //Make sure we can use degree instead of radians
  angleMode(DEGREES);
  
  //if we want a texture
  img = loadImage("assets/stone.png");
  textureMode(NORMAL);

  //color for mesh and triangles
  strokeWeight(1);
  stroke(200, 200, 20);


  //center of the outer spiral
  center = createVector(0, 0, 0);

  //calculate how many segments need to be drawn
  max_segments_l = floor(max_angle_l / angle_step_l);
  max_segments_s = floor(max_angle_s / angle_step_s);

  createEasyCam();
  document.oncontextmenu = function() {
    return false;
  }
  
  document.onmousedown = function() {
    return false;
  }
  draw();
 //set the FOV (so that the spiral fills the picture) 
  //set the aspect ratio of the camera to the aspect ratio of the canvas
  perspective(20, width / height);
}

/*calculates the points on a circle in the x-y-plane 
and returns a vector */
function circle_x_y(angle, radius) {
  return createVector(
    radius * sin(angle),
    radius * cos(angle),
    0);
}

function draw() {
  background(220, 220, 220);

  /* the code fist calculates all vertices 
  and puts them in to the array vertices, 
  before sorting them into triangles */
  let vertices = [];

  //calculate the vertices by sweeping a small circle 
  for (let i = 0.0; i <= max_segments_l; i++) {
    let angle_l = i * angle_step_l;

    for (let j = 0.0; j <= max_segments_s; j++) {
      angle_s = j * angle_step_s;

      //Calculate tha values of the small circle
      //change radius for a more natural look
      let val_s = circle_x_y(angle_s,
        rad_s + rad_s_step * i);

      //change radius for a more natural look
      let r_l = rad_l + rad_l_step * i;
      //use the x value to change the radius
      let p = circle_x_y(angle_l, val_s.x);

      //add the calculated y-value and the elevation to the height 
      p.z = p.z + val_s.y + (i * elevation_step);

      //shift spral to its center
      p = p.add(center);

      //fill point into array
      vertices.push(p);


    }
  }


  //Make the shape by feeding the right points for a triangle into vertex, there are 2 triangle to make a rectangle for each side

  beginShape(TRIANGLES);
  for (let k = 0; k < vertices.length - 1; k++) {

    let next_round = (k + n_gon_s + 1);
    let next_round_1 = abs((next_round - 1));

    //make sure we don't overshoot the array
    if (next_round > vertices.length - 1 ||
      next_round <= 0 ||
      next_round_1 > vertices.length - 1 ||
      next_round_1 <= 0) {
      break;
    }
    
    //the last 2 random values are the texture coordinates

    vertex(vertices[k].x,
      vertices[k].y,
      vertices[k].z);
    vertex(vertices[k + 1].x,
      vertices[k + 1].y,
      vertices[k + 1].z);

    vertex(vertices[next_round].x,
      vertices[next_round].y,
      vertices[next_round].z);


    vertex(vertices[next_round].x,
      vertices[next_round].y,
      vertices[next_round].z);

    vertex(vertices[next_round_1].x,
      vertices[next_round_1].y,
      vertices[next_round_1].z);

    vertex(vertices[k].x,
      vertices[k].y,
      vertices[k].z);
  }
  endShape();
}