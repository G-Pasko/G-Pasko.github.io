// Class of above values to condense code
class Cube{
  constructor(){
    this.type = 'cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    this.textureNum = -2;
    this.cube32Verts = new Float32Array([
    0,0,0, 1,1,0, 1,0,0, // Front
    0,0,0, 0,1,0, 1,1,0,
    0,0,1, 1,1,1, 1,0,1, // Back
    0,0,1, 0,1,1, 1,1,1,
    0,1,1, 0,0,1, 0,0,0, // Left
    0,1,1, 0,1,0, 0,0,0,
    1,1,1, 1,0,1, 1,0,0, // Right
    1,1,1, 1,1,0, 1,0,0,
    0,1,0, 0,1,1, 1,1,1, // Top
    0,1,0, 1,1,1, 1,1,0,
    0,0,0, 0,0,1, 1,0,1, // Bottom
    0,0,0, 1,0,1, 1,0,0
    ]);
    this.cube32UV = new Float32Array([
    1,0, 0,1, 1,1, //1
    1,0, 0,1, 1,1, //2
    1,0, 0,1, 1,1, //3
    1,0, 0,1, 1,1, //4
    1,0, 0,1, 1,1, //5
    1,0, 0,1, 1,1, //6
    1,0, 0,1, 1,1, //7
    1,0, 0,1, 1,1, //8
    1,0, 0,1, 1,1, //9
    1,0, 0,1, 1,1, //10
    1,0, 0,1, 1,1, //11
    1,0, 0,1, 1,1  //12
    ]); 
  this.cube32Norm = new Float32Array([
    0,0,-1, 0,0,-1, 0,0,-1, //Front
    0,0,-1, 0,0,-1, 0,0,-1,
    0,0,1, 0,0,1, 0,0,1, //Back
    0,0,1, 0,0,1, 0,0,1,
    -1,0,0, -1,0,0, -1,0,0, //Left
    -1,0,0, -1,0,0, -1,0,0, 
    1,0,0, 1,0,0, 1,0,0, //Right
    1,0,0, 1,0,0, 1,0,0, //8
    0,1,0, 0,1,0, 0,1,0, //Top
    0,1,0, 0,1,0, 0,1,0, //10
    0,-1,0, 0,-1,0, 0,-1,0, //Bottom
    0,-1,0, 0,-1,0, 0,-1,0  //12
    ]);  
}

  render(){
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;
    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass in model matrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.uniformMatrix4fv(u_normalMatrix, false, this.normalMatrix.elements);


    // Front the cube
    drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [1,0, 0,1, 1,1]); //1
    drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [1,0, 0,1, 1,1]); //2
    // Draw back of cube
    drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [1,0, 0,1, 1,1]); //3
    drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [1,0, 0,1, 1,1]); //4

    // Draw sides of cube
    drawTriangle3DUV([0,1,1, 0,0,1, 0,0,0], [1,0, 0,1, 1,1]); //5
    drawTriangle3DUV([0,1,1, 0,1,0, 0,0,0], [1,0, 0,1, 1,1]); //6
    drawTriangle3DUV([1,1,1, 1,0,1, 1,0,0], [1,0, 0,1, 1,1]); //7
    drawTriangle3DUV([1,1,1, 1,1,0, 1,0,0], [1,0, 0,1, 1,1]); //8



    gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

    // top of cube
    drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [1,0, 0,1, 1,1]); //9
    drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [1,0, 0,1, 1,1]);  //10

    // Bottom of cube
    drawTriangle3DUV([0,0,0, 0,0,1, 1,0,1], [1,0, 0,1, 1,1]); //11
    drawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [1,0, 0,1, 1,1]); //12
  }

  renderfaster(){ // Doesnt work for textures
    var rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass in model matrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniformMatrix4fv(u_normalMatrix, false, this.normalMatrix.elements);

    if(g_vertexBufferFast == null){
      initTriangle3D();
    }
    gl.bufferData(gl.ARRAY_BUFFER, this.cube32Verts, gl.DYNAMIC_DRAW);

    if(g_uvBufferFast == null){
      initTriangleUV();
    }

    gl.bufferData(gl.ARRAY_BUFFER, this.cube32UV, gl.DYNAMIC_DRAW);

    if(!g_normBufferFast){
      initTriangleNorm();
    }

    gl.bufferData(gl.ARRAY_BUFFER, this.cube32Norm, gl.DYNAMIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, 36);

    g_vertexBufferFast = null;
    g_uvBufferFast = null;
    g_normBufferFast = null;
  }
}
