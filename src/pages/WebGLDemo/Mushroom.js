
class Mushroom{
  constructor(){
    this.type = 'mushroom';
  }
  render(){
  //draw tip of big mushroom
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
    for(var angle = 0; angle < 180; angle = angle + 22.5){
      let centerPt =[0, 0];
      let angle1 = angle;
      let angle2 = angle + 22.5;
      let vec1 = [Math.cos(angle1*Math.PI/180)/2, Math.sin(angle1*Math.PI/180)/2];
      let vec2 = [Math.cos(angle2*Math.PI/180)/2, Math.sin(angle2*Math.PI/180)/2];
      let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
      let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];

      drawTriangle([0, 0, pt1[0], pt1[1], pt2[0], pt2[1]]);
    }

  // Draw tip of small mushroom
    gl.uniform4f(u_FragColor, 0.8, 0.0, 1.0, 1.0);
    for(var angle = 0; angle < 180; angle = angle + 22.5){
      let centerPt =[0.5, -0.5];
      let angle1 = angle;
      let angle2 = angle + 22.5;
      let vec1 = [Math.cos(angle1*Math.PI/180)/4, Math.sin(angle1*Math.PI/180)/4];
      let vec2 = [Math.cos(angle2*Math.PI/180)/4, Math.sin(angle2*Math.PI/180)/4];
      let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
      let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
      
      drawTriangle([0.5, -0.5, pt1[0], pt1[1], pt2[0], pt2[1]]);
    }
  // Draw ground  
    gl.uniform4f(u_FragColor, 0.5, 1.0, 0.5, 1.0);
    drawTriangle([-1.0, -1.0, 1.0, -1.0, 1.0, -0.7]);
    drawTriangle([1.0, -0.7, -1.0, -0.7, -1.0, -1.0]);

    gl.uniform4f(u_FragColor, 1.0, 1.0, 0.5, 1.0);
    drawTriangle([0.45, -0.5, 0.55, -0.5, 0.45, -0.7]);
    drawTriangle([0.45, -0.7, 0.55, -0.7, 0.55, -0.5]);

    drawTriangle([-0.1, 0, 0.1, 0, 0.1, -0.7]);
    drawTriangle([0.1, -0.7, -0.1, -0.7, -0.1, 0]);
  }
}