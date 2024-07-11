// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_normalMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = normalize(vec3(u_normalMatrix * vec4(a_Normal, 1)));
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  uniform vec3 u_lightColor;
  uniform bool u_spotLightOn;
  uniform vec3 u_spotLightPos;
  void main() {

    if(u_whichTexture == -4){
      gl_FragColor = vec4((v_Normal + 1.0)/2.0, 1.0);
    }

    else if(u_whichTexture == -3){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }

    else if(u_whichTexture == -2){
      gl_FragColor = u_FragColor;
    }

    else if(u_whichTexture == -1){
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    }

    else if(u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }

    else{
      gl_FragColor = vec4(1, .2, .2, 1);
    }

    // Point light set up
    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);
    vec3 R = reflect(-L, N);
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    // Global Light effects
    float specular = pow(max(dot(E, R), 0.0), 64.0) * 0.8;
    vec3 diffuse = (vec3(1.0, 1.0, 0.9) + u_lightColor)  * vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.2;

    // Spotlight set up
    vec3 spotLightVector = u_spotLightPos - vec3(v_VertPos);
    vec3 L2 = normalize(spotLightVector); // Uvr

    if(u_lightOn){
      if(u_whichTexture == -2){
        gl_FragColor = vec4(specular + diffuse  + ambient, 1.0);
      }
      else{
        gl_FragColor = vec4(diffuse + ambient, 1.0);
      }
    }

    if(u_spotLightOn){
      vec3 U = vec3(0, 1.0, 0);   // U: point along axis of cone
      float nDotL2 = max(dot(U, L2), 0.0);    // 
      if(acos(nDotL2) < .32){
        vec3 diffuse2 = vec3(1.0, 1.0, 0.9) * vec3(gl_FragColor) * nDotL2 * 0.7;
        gl_FragColor = gl_FragColor + vec4(diffuse2  + ambient, 1.0);
      }
    }

  }`

// Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;
let u_lightPos;
let u_spotLightPos;
let u_cameraPos;
let u_normalMatrix;
let u_lightColor;


function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if(a_UV < 0){
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if(a_Normal < 0){
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor) {
    console.log('Failed to get the storage location of u_lightColor');
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_spotLightPos = gl.getUniformLocation(gl.program, 'u_spotLightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_spotLightPos');
    return;
  }

  u_normalMatrix = gl.getUniformLocation(gl.program, 'u_normalMatrix');
  if (!u_normalMatrix) {
    console.log('Failed to get the storage location of u_normalMatrix');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }
  u_spotLightOn = gl.getUniformLocation(gl.program, 'u_spotLightOn');
  if (!u_spotLightOn) {
    console.log('Failed to get the storage location of u_spotLightOn');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix){
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
  
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix){
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if(!u_Sampler0){
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if(!u_Sampler1){
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if(!u_whichTexture){
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related to UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize =5;
let g_selectedType = POINT;
let g_selectedSegments = 20;
let g_globalAngle_h = -45;
let g_globalAngle_v = -15;
let g_headAngle = 0;
let g_legsAngle = 0;
let g_earAngle = 0;
let g_headAnmination = false;
let g_legsAnmination = false;
let g_earAnmination = false;
let g_Normals = false;
let x1 = 0;
let y1 = 0;
let x2 = 0;
let y2 = 0;
let camMove = false;
let g_lightPos = [0, 1, -2];
let g_spotLightPos = [0, 7, 0];
let g_lightOn = true;
let g_spotLightOn = false;
let g_lightColor = [0, 0, 0];

let mousePos = { x: undefined, y: undefined };
let mousePos2 = { x: undefined, y: undefined };

function addActionsForHtmlUI(){
  document.getElementById('headAnimationOnButton').onclick = function() {g_headAnmination = true; }; 
  document.getElementById('headAnimationOffButton').onclick = function() {g_headAnmination = false; }; 
  document.getElementById('legsAnimationOnButton').onclick = function() {g_legsAnmination = true; }; 
  document.getElementById('legsAnimationOffButton').onclick = function() {g_legsAnmination = false; }; 
  document.getElementById('earAnimationOnButton').onclick = function() {g_earAnmination = true; }; 
  document.getElementById('earAnimationOffButton').onclick = function() {g_earAnmination = false; }; 
  document.getElementById('NormalsON').onclick = function() {g_Normals = true; };
  document.getElementById('NormalsOFF').onclick = function() {g_Normals = false; };
  document.getElementById('LightON').onclick = function() {g_lightOn = true; };
  document.getElementById('LightOFF').onclick = function() {g_lightOn = false; };
  document.getElementById('SpotLightON').onclick = function() {g_spotLightOn = true; };
  document.getElementById('SpotLightOFF').onclick = function() {g_spotLightOn = false; };

  // Size slider
  document.getElementById('angleSlide_h').addEventListener('mousemove', function() {g_globalAngle_h = this.value; renderAllShapes();});
  document.getElementById('angleSlide_v').addEventListener('mousemove', function() {g_globalAngle_v = this.value; renderAllShapes();}); 
  document.getElementById('light_x').addEventListener('mousemove', function() {g_lightPos[0] = this.value/100; renderAllShapes();}); 
  document.getElementById('light_y').addEventListener('mousemove', function() {g_lightPos[1] = this.value/100; renderAllShapes();});
  document.getElementById('light_z').addEventListener('mousemove', function() {g_lightPos[2] = this.value/100; renderAllShapes();});
  document.getElementById('light_red').addEventListener('mousemove', function() {g_lightColor[0] = this.value/100;}); 
  document.getElementById('light_green').addEventListener('mousemove', function() {g_lightColor[1] = this.value/100;});
  document.getElementById('light_blue').addEventListener('mousemove', function() {g_lightColor[2] = this.value/100;});
  
  document.addEventListener("mousedown", mousedown);

  document.addEventListener("mouseup", mouseup);
//Also clear the interval when user leaves the window with mouse
  document.addEventListener("mouseout", mouseup);
  

  window.addEventListener('mousemove', function(){
    mousePos2 = { x: event.clientX, y: event.clientY };
    //mousePosText2.textContent = `(${mousePos2.x}, ${mousePos2.y})`;
    x2 = mousePos2.x;
    y2 = mousePos2.y;
    if(mousedownID != -1 && (x2 < 800 && y2 < 400)){
      if(x2>x1){
        //console.log("moving right");
        g_camera.panright(x2-x1);
      }
      else if(x2<x1){
        //console.log("moving left");
        g_camera.panleft(x1-x2);
      }
      x1 = x2;
      if(y2<y1){ //if new y is higher up than old y
        //console.log("moving up");
        g_camera.panUp(y2-y1 / 100);

      }
      else if(y2>y1){
        //console.log("moving down");
        g_camera.panDown(y1-y2 / 100);
      }
      y1 = y2;
      renderAllShapes();
    }
  });
}

var mousedownID = -1;  //Global ID of mouse down interval
function mousedown(event) {
  if(mousedownID==-1)  //Prevent multimple loops!
    mousedownID = setInterval(whilemousedown, 100 /*execute every 100ms*/);
    canvas.getBoundingClientRect();
    x1 = event.clientX;
    y1 = event.clientY;
}

function mouseup(event) {
   if(mousedownID!=-1) {  //Only stop if exists
     clearInterval(mousedownID);
     mousedownID=-1;
   }

}
function whilemousedown() {
  ;;
}



function main() {

  // Set up canvas and gl variables
  setupWebGL();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  addActionsForHtmlUI();

  document.onkeydown = keydown;

  initTextures0();
  initTextures1();
  setUpSphere();
  // Specify the color for clearing <canvas>
  //gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //renderAllShapes();
  requestAnimationFrame(tick);
}


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick(){
  g_seconds=performance.now()/1000.0-g_startTime;
  updateAnimationAngles();

  renderAllShapes();
  requestAnimationFrame(tick);
}


var lastCalledTime;
var fps;

function requestAnimFrame() {
  if(!lastCalledTime) {
     lastCalledTime = Date.now();
     fps = 0;
     return;
  }
  delta = (Date.now() - lastCalledTime)/1000;
  lastCalledTime = Date.now();
  fps = 1/delta;
  // console.log(fps);
}


function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x,y]);
}

function updateAnimationAngles(){
  if(g_headAnmination){
    g_headAngle = (10*Math.sin(g_seconds));
  }
  if(g_legsAnmination){
    g_legsAngle = (20*Math.sin(g_seconds));
  }
  if(g_earAnmination){
    g_earAngle = (Math.abs(45*Math.sin(g_seconds))); 
  }
  g_lightPos[0] = Math.cos(g_seconds);
  g_lightPos[2] = Math.sin(g_seconds);
}


function initTextures0(){
  var image = new Image(); // Create an image object
  image.crossOrigin = "anonymous";
  if(!image){
    console.log('Failed to create image');
    return false;
  }

  image.onload = function(){ sendImageToTEXTURE0(image); };
  // Register the event handler to be called on loading an image
  
  image.src = 'sky.jpg';
  
  return true;
}

function initTextures1(){
  var image1 = new Image(); // Create an image object
  if(!image1){
    console.log('Failed to create image');
    return false;
  }
  
  

  image1.onload = function(){ sendImageToTEXTURE1(image1); };
  // Register the event handler to be called on loading an image
  image1.src = 'ground.jpg';
  
  
  
  return true;
}

function sendImageToTEXTURE0(image){

  var texture = gl.createTexture();
  if(!texture){
    console.log('Failed to create texture');
    return false;
  }
  image.crossorigin="anonymous"
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
 // Enable the texture unit 0
  gl.activeTexture(gl.TEXTURE0);
// Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

 // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
}

function sendImageToTEXTURE1(image){

  var texture1 = gl.createTexture();
  if(!texture1){
    console.log('Failed to create texture');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
 // Enable the texture unit 0
  gl.activeTexture(gl.TEXTURE1);
// Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture1);

 // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);
  console.log('finished loading texture');
}

function sendImageToTEXTURE2(image){

  var texture2 = gl.createTexture();
  if(!texture2){
    console.log('Failed to create texture');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
 // Enable the texture unit 0
  gl.activeTexture(gl.TEXTURE0);
// Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture2);

 // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler2, 2);
  console.log('finished loading texture');
}




var g_camera = new Camera();


function keydown(ev) {
  if(ev.keyCode == 39 || ev.keyCode == 68) { // The right arrow key was pressed
    g_camera.right();
  }
  else if (ev.keyCode == 37 || ev.keyCode == 65) { // The left arrow key was pressed
    g_camera.left();
  }
  else if (ev.keyCode == 83 || ev.keyCode == 40) { // The down arrow key was pressed
    g_camera.back();
  }
  else if (ev.keyCode == 87 || ev.keyCode == 38) { // The down arrow key was pressed
    g_camera.forward();
  }
  else if (ev.keyCode == 81) { // The e key was pressed
    g_camera.panleft();
  }
  else if (ev.keyCode == 69) { // q key was pressed
    g_camera.panright();
  }

  else if (ev.keyCode == 90) { // The z key was pressed
    g_camera.pandown();
  }

  else if (ev.keyCode == 88) { // The x key was pressed
    g_camera.panup();
  }

  else {
   return;
   } // Prevent unnecessary drawing
  renderAllShapes();
}

var g_map = [
  [0, 0, 0, 0, 0, 2, 2, 2, 2, 2],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 1, 2, 2, 2, 2, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1, 1, 1, 1, 1, 'T', 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

function drawMap(){
  var block = new Cube();
  if(g_Normals){block.textureNum = -4;}
  else{block.textureNum = -2;}
  block.color = [.8, .8, .8, 1];
  for(x = 0; x < 10; x++){
    for(y = 0; y < 10; y++){
      block.matrix.setTranslate(x-5, -2.5, y-5);
      if(g_map[x][y] == 'T'){
        // if(!g_Normals){block.textureNum = -2;}
        block.color = [.6, .3, 0, 1];
        for(var i = 0; i < 4; i++){
          block.matrix.translate(0, 1, 0);
          block.renderfaster();
        }
        block.color = [0, .6, 0, 1];
        block.matrix.translate(-1, 1, -1);
        block.matrix.scale(3, 3, 3);

        block.renderfaster();
        block.matrix.scale[1/3, 1/3, 1/3];
      }
      else{
        if(g_Normals){block.textureNum = -4;}
        else{
          block.textureNum = -2;
          block.color = [1, .9, .8, 1];
        }
        for(var i = 0; i < g_map[x][y]; i++){
          block.matrix.translate(0, 1, 0);
          block.renderfaster();
        }
      }
    }
  }
}

function renderAllShapes(){
  var projMat = new Matrix4();
  projMat.setPerspective(80, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]); //(eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle_h, 0, 1, 0);
  globalRotMat = globalRotMat.rotate(g_globalAngle_v, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  //gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat_h.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_spotLightPos, g_spotLightPos[0], g_spotLightPos[1], g_spotLightPos[2]);

  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
  gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

  gl.uniform1i(u_lightOn, g_lightOn);
  gl.uniform1i(u_spotLightOn, g_spotLightOn);

  // Draw light
  var light = new Cube();
  light.color = [2, 2, 0, 1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1,-.1,-.1);
  light.matrix.translate(-.5,-.5,-.5);
  light.renderfaster();

  var spotLight = new Cube();
  spotLight.matrix.translate(g_spotLightPos[0], g_spotLightPos[1], g_spotLightPos[2]);
  spotLight.matrix.scale(-.1,-.1,-.1);
  spotLight.matrix.translate(-.5,10,-.5);
  spotLight.renderfaster();

  //Draw sky
  var sky = new Cube();
  sky.color = [0, .1, 1, 1];
  sky.textureNum = -2;
  if(g_Normals){sky.textureNum = -4;}
  sky.matrix.scale(-15,-15,-15);
  sky.matrix.translate(-.5, -.5, -.5);
  sky.renderfaster();
  // Draw ground
  var floor = new Cube();
  floor.color = [1, 1, .7, 1];
  floor.textureNum = -2;
  floor.matrix.scale(50,5,50);
  floor.matrix.translate(-.5, -1.5, -.5);
  floor.renderfaster();

  // Create walls
  drawMap();
  requestAnimFrame();


  var s1 = new Sphere();
  s1.matrix.translate(-1, 1, -1,);
  if(g_Normals){s1.textureNum = -4;}
  s1.render();


// Draw Lucky
  //draw body cube
  var body = new Cube();
  if(g_Normals){body.textureNum = -4;}
  body.color = [1, .96, .76, 1];
  body.matrix.translate(-.4, -.3, 0);
  body.matrix.scale(.75, .25, .25);
  body.renderfaster();
  //Grab matrix for leg
  var legMat = new Matrix4(body.matrix);
  //Draw back stripe
  body.matrix.scale(1, .1, .3);
  body.color = [1, .66, .2, 1];
  body.matrix.translate(0, 9.3, 1.2);
  body.renderfaster();
  // Draw tail
  body.matrix.translate(1, -1, 0);
  body.matrix.scale(0.12, 3, 1);
  body.renderfaster();

  //Draw Legs
  var Leg = new Cube();
  Leg.color = [1, .96, .76, 1];
  Leg.matrix = new Matrix4(legMat);
  Leg.matrix.translate(.2, .3, -.1, 0);
  Leg.matrix.scale(.1, -.7, .3);
  legMat = new Matrix4(Leg.matrix);
  Leg.matrix.rotate(g_legsAngle, 0, 0, 1);
  if(g_Normals){Leg.textureNum = -4;}
  Leg.normalMatrix.setInverseOf(Leg.matrix).transpose();
  Leg.renderfaster();

  Leg.matrix = new Matrix4(legMat);
  Leg.matrix.translate(.2,0, 2.9);
  Leg.matrix.rotate(-g_legsAngle, 0, 0, 1);
  Leg.normalMatrix.setInverseOf(Leg.matrix).transpose();
  Leg.renderfaster();

  Leg.matrix = new Matrix4(legMat);
  Leg.matrix.translate(7.2, 0, -.1);
  Leg.matrix.rotate(g_legsAngle, 0, 0, 1);
  Leg.normalMatrix.setInverseOf(Leg.matrix).transpose();
  Leg.renderfaster();

  Leg.matrix = new Matrix4(legMat);
  Leg.matrix.translate(7.2, 0, 2.9);
  Leg.matrix.rotate(-g_legsAngle, 0, 0, 1);
  Leg.normalMatrix.setInverseOf(Leg.matrix).transpose();
  Leg.renderfaster();

  //Draw Head
  var head = new Cube();
  head.color = [1, .96, .76, 1];
  head.matrix.rotate(g_headAngle, 0, 0, 1);
  head.matrix.translate(-.55, -.2, 0);
  head.matrix.scale(.25, .25, .25);
  head.normalMatrix.setInverseOf(head.matrix).transpose();
  if(g_Normals){head.textureNum = -4;}
  head.renderfaster();
  var headMat = new Matrix4(head.matrix);
  // Draw stripe
  var stripe = new Cube();
  if(g_Normals){body.textureNum = -4;}
  stripe.color = [1, .66, .2, 1];
  stripe.matrix = headMat;
  stripe.matrix.translate(0, 1, .25);
  stripe.matrix.scale(1.05, .04, .5);
  stripe.renderfaster();
  stripe.matrix.translate(.9, -10, 0);
  stripe.matrix.scale(0.1, 10, 1);
  stripe.renderfaster();

  // Draw snout
  head.color = [.98, .9, .72 ,1];
  head.matrix.translate(-.5, -.1, .15);
  head.matrix.scale(1.2, .6, .7);
  head.normalMatrix.setInverseOf(head.matrix).transpose();
  var headMat = new Matrix4(head.matrix);
  head.renderfaster();

  // Draw Nose
  head.color = [0.36, .25, .2 ,1];
  head.matrix.translate(-.1, .75, .35);
  head.matrix.scale(.3, .3, .3);
  var headMat = new Matrix4(head.matrix);
  head.normalMatrix.setInverseOf(head.matrix).transpose();
  head.renderfaster();

  //Draw Ears
  head.color = [1, .66, .2, 1];
  head.matrix.translate(2.2, 2.5, -2.5);
  var earSave = new Matrix4();
  earSave.set(head.matrix);
  head.matrix.rotate(g_earAngle, 1, 0, 0);
  head.matrix.scale(1.8, -5.5, .8);
  var headMat = new Matrix4(head.matrix);
  head.normalMatrix.setInverseOf(head.matrix).transpose();
  head.renderfaster();
  head.matrix = new Matrix4(earSave);
  head.matrix.translate(0, 0, 5.2);
  head.matrix.rotate(-g_earAngle, 1, 0, 0);
  head.matrix.scale(1.8, -5.5, .8);
  var headMat = new Matrix4(head.matrix);
  head.normalMatrix.setInverseOf(head.matrix).transpose();
  head.renderfaster();
  head.matrix = earSave;
  head.matrix.translate(0, 0, 5.2);
  head.matrix.scale(1.8, -5.5, .8);

  //Draw eyes
  head.color = [.3, .2, .01, 1];
  head.matrix.translate(-.3, .3, -4.6);
  head.matrix.scale(.2, -.2, 1);
  var headMat = new Matrix4(head.matrix);
  head.normalMatrix.setInverseOf(head.matrix).transpose();
  head.renderfaster();
  head.matrix.translate(0, 0, 3);
  var headMat = new Matrix4(head.matrix);
  head.normalMatrix.setInverseOf(head.matrix).transpose();
  head.renderfaster();

  //Draw tongue
  head.color = [1, 0.5, 0.5, 1];
  head.matrix.translate(-4.2, -3.5, -1.9);
  head.matrix.scale(1, 1, 1.5);
  var headMat = new Matrix4(head.matrix);
  head.normalMatrix.setInverseOf(head.matrix).transpose();
  head.renderfaster();

  // Draw halo
  head.color = [1, .9, 0, 1];
  head.matrix.translate(2, 8, 0,); //Center point
  for(var d = 0; d < 360; d = d + 10){
    head.matrix.translate(12 * Math.cos(d), 0, 6 *Math.sin(d));
    var headMat = new Matrix4(head.matrix);
    head.normalMatrix.setInverseOf(head.matrix).transpose();
    head.renderfaster();
  }
}