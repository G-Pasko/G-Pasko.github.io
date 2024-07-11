//Sphere.js
class Sphere{
	constructor(){
		this.type = 'sphere';
		this.color = [1.0, 1.0, 1.0, 1.0];
		this.matrix = new Matrix4();
		this.normMatrix = new Matrix4();
		this.textureNum = -2;
	}
	render(){
		var rgba = this.color;
    	//var size = this.size;
    	gl.uniform1i(u_whichTexture, this.textureNum);

	    // Pass the color of a point to u_FragColor variable
	    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    	// Pass in model matrix
	    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
	    gl.uniformMatrix4fv(u_normalMatrix, false, this.normMatrix.elements);

		if(g_vertexBufferFast == null){
      		initTriangle3D();
      	}
    	gl.bufferData(gl.ARRAY_BUFFER, V_32A, gl.DYNAMIC_DRAW);
	   	
	   	if(g_uvBufferFast == null){
      		initTriangleUV();
   		}
    	gl.bufferData(gl.ARRAY_BUFFER, U_32A, gl.DYNAMIC_DRAW);

	   	if(g_normBufferFast == null){
	   	  initTriangleNorm();
	   	}
	    gl.bufferData(gl.ARRAY_BUFFER, V_32A, gl.DYNAMIC_DRAW);

	   	gl.drawArrays(gl.TRIANGLES, 0, 1200);
	   	g_vertexBufferFast = null;
   		g_uvBufferFast = null;
    	g_normBufferFast = null;
    }
}

var d = Math.PI/10;
var vList = [];
var uList = [];
var nList = [];
var V_32A;
var U_32A;

function setUpSphere(){
	vList = [];
	uList = [];
	nList = [];

	for(var t = 0; t<Math.PI; t+= d){
    	for(var r = 0; r < (2*Math.PI); r+=d){
			var p1 = [Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t)];
	    		
    		var p2 = [Math.sin(t+d)*Math.cos(r), Math.sin(t+d)*Math.sin(r), Math.cos(t+d)];
    		var p3 = [Math.sin(t)*Math.cos(r+d), Math.sin(t)*Math.sin(r+d), Math.cos(t)];
    		var p4 = [Math.sin(t+d)*Math.cos(r+d), Math.sin(t+d)*Math.sin(r+d), Math.cos(t+d)];

    		var uv1 = [t/Math.PI, r/(2*Math.PI)];
    		var uv2 = [(t+d)/Math.PI, r/(2*Math.PI)];
    		var uv3 = [t/Math.PI, (r+d)/(2*Math.PI)];
    		var uv4 = [(t+d)/Math.PI, (r+d)/(2*Math.PI)];

    		gl.uniform4f(u_FragColor, 1, 1 , 1, 1);
    		vList = vList.concat(p1);
    		vList = vList.concat(p2);
    		vList = vList.concat(p4);
    		uList = uList.concat(uv1);
    		uList = uList.concat(uv2);
    		uList = uList.concat(uv4);

    		gl.uniform4f(u_FragColor, 1, 1, 1, 1);
    		vList = vList.concat(p1);
    		vList = vList.concat(p4);
    		vList = vList.concat(p3);
    		uList = uList.concat(uv1);
    		uList = uList.concat(uv4);
    		uList = uList.concat(uv3);
	    }	
	}
	V_32A = new Float32Array(vList);
	U_32A = new Float32Array(uList);
}

