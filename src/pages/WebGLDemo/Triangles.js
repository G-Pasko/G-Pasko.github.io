// Class of above values to condense code
class Triangle{
  constructor(){
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
  }

  render(){
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    //Pass in size
    gl.uniform1f(u_Size, size);
    // Draw
    //gl.drawArrays(gl.POINTS, 0, 1);
    var d = this.size/200.0;
    drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
  }
}


function drawTriangle(vertices){
	var n = 3; // The number of vertices

  	// Create a buffer object
  	var vertexBuffer = gl.createBuffer();
  	if (!vertexBuffer) {
   		console.log('Failed to create the buffer object');
    	return -1;
  	}

	// Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	// Write date into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  // Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	gl.drawArrays(gl.TRIANGLES, 0, n);
}



function drawTriangle3D(vertices){
  var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUV(vertices, uv){
  var n = 3; // The number of vertices

    // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);
  // Enable the assignment to a_Position vari
  var uvBuffer = gl.createBuffer();
  if(!uvBuffer){
    console.log('Failed to create the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_UV);

  gl.drawArrays(gl.TRIANGLES, 0, n);
  g_vertexBufferFast = null;
}




var g_vertexBufferFast = null;
function initTriangle3D(){
  g_vertexBufferFast = gl.createBuffer();
  if(!g_vertexBufferFast){
    console.log('Failed to create the buffer object');
      return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBufferFast);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);

}

var g_uvBufferFast = null;
function initTriangleUV(){
  g_uvBufferFast = gl.createBuffer();
  if(!g_uvBufferFast){
    console.log('Failed to create the buffer object');
      return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBufferFast);

  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_UV);
}

var g_normBufferFast = null;
function initTriangleNorm(){
  g_normBufferFast = gl.createBuffer();
  if(!g_normBufferFast){
    console.log('Failed to create the buffer object');
      return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, g_normBufferFast);

  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Normal);
}



function drawTriangle3DUVNormal(vertices, uv, normal){
  var n = 3; // The number of vertices

    // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);
  // Enable the assignment to a_Position vari
  var uvBuffer = gl.createBuffer();
  if(!uvBuffer){
    console.log('Failed to create the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_UV);


  var normalBuffer = gl.createBuffer();
  if(!normalBuffer){
    console.log("Failed to create buffer");
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Normal);

  gl.drawArrays(gl.TRIANGLES, 0, n);
  g_vertexBufferFast = null;
  g_uvBufferFast = null;
}

